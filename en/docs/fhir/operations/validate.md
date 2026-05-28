---
title: $validate Operation
sidebar_position: 4
---

# $validate Operation

The `$validate` operation checks whether a resource conforms to its base definition, applicable profiles, and business rules without persisting it.

## Usage

### Validate a Resource (Type-level)

```bash
POST /fhir/r4/Patient/$validate
Content-Type: application/fhir+json

{
  "resourceType": "Patient",
  "name": [{"family": "Smith", "given": ["John"]}],
  "birthDate": "1990-01-15",
  "gender": "male"
}
```

### Validate Against a Specific Profile

```bash
POST /fhir/r4/Patient/$validate?profile=http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient
Content-Type: application/fhir+json

{
  "resourceType": "Patient",
  "name": [{"family": "Smith", "given": ["John"]}],
  "identifier": [{"system": "http://example.org/mrn", "value": "12345"}],
  "gender": "male"
}
```

### Validate Using Parameters Resource

```bash
POST /fhir/r4/Patient/$validate
Content-Type: application/fhir+json

{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "resource",
      "resource": {
        "resourceType": "Patient",
        "name": [{"family": "Smith"}]
      }
    },
    {
      "name": "profile",
      "valueUri": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient"
    },
    {
      "name": "mode",
      "valueCode": "create"
    }
  ]
}
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `resource` | Resource | The resource to validate |
| `profile` | uri | Profile to validate against |
| `mode` | code | `create`, `update`, or `delete` |

## Response

Returns an `OperationOutcome` with validation results:

### Valid Resource

```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "information",
      "code": "informational",
      "details": {"text": "Validation successful"}
    }
  ]
}
```

### Invalid Resource

```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "required",
      "details": {"text": "Patient.identifier: minimum required"},
      "expression": ["Patient.identifier"]
    },
    {
      "severity": "error",
      "code": "value",
      "details": {"text": "Patient.gender: value 'xyz' is not in the required value set"},
      "expression": ["Patient.gender"]
    },
    {
      "severity": "warning",
      "code": "business-rule",
      "details": {"text": "Patient.telecom: contact information recommended"},
      "expression": ["Patient.telecom"]
    }
  ]
}
```

## Validation Modes

| Mode | Behavior |
|------|----------|
| `create` | Validates as if creating a new resource (no id required) |
| `update` | Validates as if updating (id must be present) |
| `delete` | Validates referential integrity before deletion |

## Implementation

```ballerina
import ballerina/http;
import ballerinax/health.fhir.r4;
import ballerinax/health.fhir.r4.validator;

resource function post Patient/\$validate(
    http:Request request,
    string? profile = ()
) returns r4:OperationOutcome|error {
    
    json payload = check request.getJsonPayload();
    r4:Patient patient = check payload.cloneWithType();
    
    r4:FHIRValidationError[] errors = check validator:validate(
        patient,
        profile = profile
    );
    
    return toOperationOutcome(errors);
}
```

## Use Cases

- **Pre-submission validation**: Check resources before sending to a repository
- **Import validation**: Verify data quality during bulk import
- **Development testing**: Test resource construction against profiles
- **Conformance checking**: Verify IG compliance during certification

## Related Topics

- [Profile Validation](../validation/profile-validation.md)
- [Custom Validation Rules](../validation/custom-rules.md)
- [FHIR Operations Overview](./overview.md)
