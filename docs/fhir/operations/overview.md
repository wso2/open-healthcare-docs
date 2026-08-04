---
title: "Operations Overview"
---

# FHIR Operations

FHIR operations extend the standard RESTful API with custom behaviors defined by the `$` prefix. In Open Healthcare, after generating a FHIR facade with the [Ballerina Health CLI Tool](../guides/fhir-resource-api-template.md), operation methods are scaffolded from the Implementation Guide (IG) operation definitions.

For generated standard operations and custom operations alike, developers must implement the business logic in the generated facade methods.

## Standard and Custom Operations

WSO2 Open Healthcare supports standard FHIR-defined operations and organization-specific custom operations.

### Standard operations from IG definitions

When you generate the facade template, the Health Tool reads IG operation definitions and generates operation method stubs and related API config entries (for example, in the `operations` section of `api_config.bal`).

Common standard operations include:

| Operation | Level | Description |
|-----------|-------|-------------|
| `$everything` | Instance | Retrieve all data for a patient |
| `$export` | System/Type | Bulk data export (async) |
| `$validate` | Type/Instance | Validate a resource |
| `$meta` | System/Type/Instance | Access resource metadata |
| `$convert` | System | Convert between FHIR versions |
| `$document` | Instance | Generate a document bundle |
| `$expand` | Type | Expand a ValueSet |
| `$lookup` | Type | Look up a code |
| `$translate` | Type | Translate between code systems |

## How Operations Work

Operations are invoked via POST (with parameters in the body) or GET (with parameters in the URL):

```bash
# Instance-level operation
POST /fhir/r4/Patient/123/$everything

# Type-level operation
POST /fhir/r4/Patient/$export

# System-level operation
POST /fhir/r4/$export
```

### Operation Parameters

Operations accept input via a `Parameters` resource:

```json
{
  "resourceType": "Parameters",
  "parameter": [
    {"name": "start", "valueDate": "2024-01-01"},
    {"name": "_type", "valueString": "Observation,Condition"}
  ]
}
```

### Custom operations outside the IG

If an operation is not part of your IG, add it manually to `api_config.bal` and implement its facade method.

For custom operations, you should define a corresponding `OperationDefinition` and register it in your API configuration.

## Implementing Operation Business Logic

Implement business logic in every generated operation handler (standard or custom):

```ballerina
import ballerinax/health.fhir.r4;
import ballerinax/health.fhir.r4.fhirr4;
import ballerinax/health.fhir.r4.international401;
import ballerina/http;

service /fhir/r4/Patient on new fhirr4:Listener(config = patientApiConfig) {
    // Standard operation method generated from IG definitions
    isolated resource function post \$export(
            r4:FHIRContext fhirContext,
            international401:Parameters parameters) returns r4:FHIRError|http:Response|error {
        // Implement $export business logic
        _ = fhirContext;
        _ = parameters;
        return check handlePatientExport();
    }

    // Custom operation method (outside the IG) added by developer
    isolated resource function post [string id]/\$risk\-assessment(
            r4:FHIRContext fhirContext,
            international401:Parameters parameters) returns r4:OperationOutcome|error {
        // Implement custom operation business logic
        _ = fhirContext;
        _ = parameters;
        return check calculateRiskAssessment(id);
    }
}
```

### Registering custom operations

For custom operations outside the IG, register a FHIR `OperationDefinition`:

```json
{
  "resourceType": "OperationDefinition",
  "url": "http://example.org/OperationDefinition/risk-assessment",
  "name": "RiskAssessment",
  "status": "active",
  "kind": "operation",
  "code": "risk-assessment",
  "resource": ["Patient"],
  "system": false,
  "type": false,
  "instance": true,
  "parameter": [
    {
      "name": "condition",
      "use": "in",
      "min": 1,
      "max": "1",
      "type": "CodeableConcept",
      "documentation": "The condition to assess risk for"
    },
    {
      "name": "assessment",
      "use": "out",
      "min": 1,
      "max": "1",
      "type": "RiskAssessment",
      "documentation": "The computed risk assessment"
    }
  ]
}
```

## Related Topics

- [Custom Operation Development](./custom-operations.md)
