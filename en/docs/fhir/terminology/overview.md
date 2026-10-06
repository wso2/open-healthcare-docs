---
title: Terminology Service Overview
sidebar_position: 1
---

# Terminology Service

The WSO2 Healthcare Accelerator includes a pre-built FHIR R4 Terminology Service that provides RESTful APIs for managing and querying FHIR ValueSets, CodeSystems, and ConceptMaps. It is designed to be compatible with the [HL7 FHIR Terminology Service specification](https://hl7.org/fhir/terminology-service.html) and supports key terminology operations such as expansion, validation, lookup, subsumption, translation, and closure.

## Features

- **ValueSet Operations** -- Expand, validate codes, search, create, and retrieve ValueSets.
- **CodeSystem Operations** -- Lookup, validate codes, test subsumption, search, create, and retrieve CodeSystems.
- **ConceptMap Operations** -- Translate codes between code systems, search, create, and retrieve ConceptMaps.
- **Closure Table** -- Maintain a client-named, incrementally-growing subsumption closure table via `$closure`.
- **Batch Validation** -- Validate multiple ValueSets in a single request.
- **Upload** -- Upload terminology content from FHIR resource bundles, or native LOINC, SNOMED CT, and ICD-10-CM release archives in bulk.
- **Find Code** -- Search for codes across CodeSystems by display or definition text.
- **FHIR CapabilityStatement** -- Exposes service metadata for FHIR clients.

## Supported Terminology Types

The service supports loading and querying the following standard terminology systems:

| Terminology | Type |
|-------------|------|
| SNOMED CT | Clinical findings, procedures |
| LOINC | Lab observations, clinical measurements |
| ICD-10-CM | Diagnoses |
| FHIR | Built-in FHIR code systems and value sets |

## API Endpoints

All endpoints are served under `/fhir/r4`:

| Operation | Endpoint | Description |
|-----------|----------|-------------|
| [`$expand`](./valueset-operations.md#expand) | `GET/POST /ValueSet/$expand` | Expand a ValueSet |
| [`$validate-code`](./valueset-operations.md#validate-code) | `GET/POST /ValueSet/$validate-code` | Validate a code against a ValueSet |
| [`$lookup`](./codesystem-operations.md#lookup) | `GET/POST /CodeSystem/$lookup` | Look up a code in a CodeSystem |
| [`$validate-code`](./codesystem-operations.md#validate-code) | `GET/POST /CodeSystem/$validate-code` | Validate a code against a CodeSystem |
| [`$subsumes`](./codesystem-operations.md#subsumes) | `GET/POST /CodeSystem/$subsumes` | Test subsumption relationships |
| [`$translate`](./conceptmap-operations.md#translate) | `GET/POST /ConceptMap/$translate` | Translate a code using a ConceptMap |
| [`$closure`](./conceptmap-operations.md#closure) | `POST /$closure` | Maintain an incremental subsumption closure table |
| Search ValueSets | `GET /ValueSet` | Search ValueSets |
| Search CodeSystems | `GET /CodeSystem` | Search CodeSystems |
| Search ConceptMaps | `GET /ConceptMap` | Search ConceptMaps |
| Get by ID | `GET /ValueSet/{id}`, `GET /CodeSystem/{id}`, `GET /ConceptMap/{id}` | Retrieve by ID |
| Create | `POST /ValueSet`, `POST /CodeSystem`, `POST /ConceptMap` | Create new resources |
| Batch Validate | `POST /` | Batch validate ValueSets |
| [`$upload`](./upload-operations.md#upload) | `POST /%24upload` | Upload terminology resources in bulk |
| [`$find-code`](./find-code-operation.md#find-code) | `GET/POST /$find-code` | Search for codes across CodeSystems |
| `$versions` | `GET/POST /$versions` | Report supported FHIR versions |
| Metadata | `GET /metadata` | FHIR CapabilityStatement |

## Setting Up the Terminology Service

### Prerequisites

Clone the [WSO2 Healthcare Accelerator](https://github.com/wso2/open-healthcare-choreo-accelerators) repository and navigate to the terminology service:

```bash
git clone https://github.com/wso2/open-healthcare-choreo-accelerators.git
cd open-healthcare-choreo-accelerators/terminology/terminology-service
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

The service starts on port `9090` by default and is available at `http://localhost:9090/fhir/r4`.

### Verifying the Service

Check the service metadata:

```bash
curl http://localhost:9090/fhir/r4/metadata
```

## Quick Start

### Validate a Code

```bash
curl 'http://localhost:9090/fhir/r4/ValueSet/snomed-diabetes-example/$validate-code?system=http://snomed.info/sct&code=73211009'
```

Response:

```json
{
    "resourceType": "Parameters",
    "parameter": [
        {
            "name": "result",
            "valueBoolean": true
        },
        {
            "valueCode": "73211009",
            "name": "code"
        },
        {
            "name": "display",
            "valueString": "Diabetes mellitus"
        }
    ]
}
```

### Expand a ValueSet

```bash
curl 'http://localhost:9090/fhir/r4/ValueSet/$expand?url=http://example.org/fhir/ValueSet/snomed-diabetes-example'
```

### Look Up a Code

```bash
curl 'http://localhost:9090/fhir/r4/CodeSystem/$lookup?system=http://loinc.org&code=100011-6'
```

### Translate a Code

```bash
curl 'http://localhost:9090/fhir/r4/ConceptMap/$translate?source=http://snomed.info/sct&target=http://loinc.org&system=http://snomed.info/sct&code=271649006'
```

## Integrating with Terminology Validation

The pre-built terminology service can be used as the backend for [terminology validation](../validation/terminology-validation.md) in your integrations. Point your `Config.toml` terminology configuration to the running service:

```toml
[ballerinax.health.fhir.r4.parser.terminologyConfig]
isTerminologyValidationEnabled = true
terminologyServiceApi = "http://localhost:9090/fhir/r4"
```

## Related Topics

- [CodeSystem Operations](./codesystem-operations.md)
- [ValueSet Operations](./valueset-operations.md)
- [ConceptMap Operations](./conceptmap-operations.md)
- [Find Code Operation](./find-code-operation.md)
- [Upload Operations](./upload-operations.md)
- [Terminology Validation](../validation/terminology-validation.md)
