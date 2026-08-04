---
title: "Terminology Service Overview"
---

# Terminology Service

The WSO2 Healthcare Accelerator includes a pre-built FHIR R4 Terminology Service that provides RESTful APIs for managing and querying FHIR ValueSets and CodeSystems. It is designed to be compatible with the [HL7 FHIR Terminology Service specification](https://hl7.org/fhir/terminology-service.html) and supports key terminology operations such as expansion, validation, lookup, and subsumption.

## Features

- **ValueSet Operations** -- Expand, validate codes, search, create, and retrieve ValueSets.
- **CodeSystem Operations** -- Lookup, subsumption testing, search, create, and retrieve CodeSystems.
- **Batch Validation** -- Validate multiple ValueSets in a single request.
- **Upload** -- Upload terminology resources (CodeSystems and ValueSets) in bulk.
- **Find Code** -- Search for codes across CodeSystems and ValueSets.
- **FHIR CapabilityStatement** -- Exposes service metadata for FHIR clients.

## Supported Terminology Types

The service supports loading and querying the following standard terminology systems:

| Terminology | Type |
|-------------|------|
| SNOMED CT | Clinical findings, procedures |
| LOINC | Lab observations, clinical measurements |
| ICD-10 | Diagnoses |
| RxNorm | Medications |
| FHIR | Built-in FHIR code systems and value sets |

## API Endpoints

All endpoints are served under `/fhir/r4`:

| Operation | Endpoint | Description |
|-----------|----------|-------------|
| [`$expand`](./valueset-operations.md#expand) | `GET/POST /ValueSet/$expand` | Expand a ValueSet |
| [`$validate-code`](./valueset-operations.md#validate-code) | `GET/POST /ValueSet/$validate-code` | Validate a code against a ValueSet |
| [`$lookup`](./codesystem-operations.md#lookup) | `GET/POST /CodeSystem/$lookup` | Look up a code in a CodeSystem |
| [`$subsumes`](./codesystem-operations.md#subsumes) | `GET/POST /CodeSystem/$subsumes` | Test subsumption relationships |
| Search ValueSets | `GET /ValueSet` | Search ValueSets |
| Search CodeSystems | `GET /CodeSystem` | Search CodeSystems |
| Get by ID | `GET /ValueSet/{id}`, `GET /CodeSystem/{id}` | Retrieve by ID |
| Create | `POST /ValueSet`, `POST /CodeSystem` | Create new resources |
| Batch Validate | `POST /` | Batch validate ValueSets |
| Upload | `POST /$upload` | Upload terminology resources in bulk |
| Find Code | `GET/POST /$find-code` | Search for codes |
| Metadata | `GET /metadata` | FHIR CapabilityStatement |

## Setting Up the Terminology Service

### Prerequisites

Clone the [WSO2 Healthcare Accelerator](https://github.com/wso2/open-healthcare-choreo-accelerators) repository and navigate to the terminology service:

```bash
git clone https://github.com/wso2/open-healthcare-choreo-accelerators.git
cd open-healthcare-choreo-accelerators/miscellaneous/terminology-service
```

### Database Configuration

The terminology service requires a database backend. Two database types are supported:

#### H2 (Embedded)

Suitable for development and testing. Configure in `Config.toml`:

```toml
[wso2.terminology_service]
db_type = "h2"

[wso2.terminology_service.store_h2]
url = "jdbc:h2:./resources/database/terminologyDB"
user = "sa"
password = ""
```

#### PostgreSQL

Recommended for production. Configure in `Config.toml`:

```toml
[wso2.terminology_service]
db_type = "postgresql"

[wso2.terminology_service.store_pg]
host = "localhost"
database = "terminology"
user = "dbuser"
password = "dbpassword"
port = 5432
```

### Running the Service

Start the terminology service:

```bash
bal run
```

The service starts on port `9089` by default and is available at `http://localhost:9089/fhir/r4`.

### Verifying the Service

Check the service metadata:

```bash
curl http://localhost:9089/fhir/r4/metadata
```

## Quick Start

### Validate a Code

```bash
curl 'http://localhost:9089/fhir/r4/ValueSet/$validate-code?url=http://hl7.org/fhir/ValueSet/observation-status&code=final&system=http://hl7.org/fhir/observation-status'
```

Response:

```json
{
  "resourceType": "Parameters",
  "parameter": [
    {"name": "result", "valueBoolean": true},
    {"name": "display", "valueString": "Final"}
  ]
}
```

### Expand a ValueSet

```bash
curl 'http://localhost:9089/fhir/r4/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/observation-status'
```

### Look Up a Code

```bash
curl 'http://localhost:9089/fhir/r4/CodeSystem/$lookup?system=http://loinc.org&code=85354-9'
```

## Integrating with Terminology Validation

The pre-built terminology service can be used as the backend for [terminology validation](../validation/terminology-validation.md) in your integrations. Point your `Config.toml` terminology configuration to the running service:

```toml
[ballerinax.health.fhir.r4.parser.terminologyConfig]
isTerminologyValidationEnabled = true
terminologyServiceApi = "http://localhost:9089/fhir/r4"
```

## Related Topics

- [CodeSystem Operations](./codesystem-operations.md)
- [ValueSet Operations](./valueset-operations.md)
- [Terminology Validation](../validation/terminology-validation.md)
