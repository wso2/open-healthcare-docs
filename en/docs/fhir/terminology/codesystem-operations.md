---
title: CodeSystem Operations
sidebar_position: 2
---

# CodeSystem Operations

The terminology service provides operations to look up codes, test subsumption relationships, and manage CodeSystem resources.

## $lookup {#lookup}

Retrieves detailed information about a code, including its display name, definition, designations (translations), and properties.

### GET Request

```bash
curl 'http://localhost:9089/fhir/r4/CodeSystem/$lookup?system=http://loinc.org&code=85354-9'
```

### Lookup by ID

```bash
curl 'http://localhost:9089/fhir/r4/CodeSystem/{id}/$lookup?code=85354-9'
```

### POST Request

```bash
curl -X POST http://localhost:9089/fhir/r4/CodeSystem/$lookup \
  -H "Content-Type: application/fhir+json" \
  -d '{
    "resourceType": "Parameters",
    "parameter": [
      {"name": "system", "valueUri": "http://loinc.org"},
      {"name": "code", "valueCode": "85354-9"}
    ]
  }'
```

### Response

```json
{
  "resourceType": "Parameters",
  "parameter": [
    {"name": "name", "valueString": "LOINC"},
    {"name": "display", "valueString": "Blood pressure panel with all children optional"},
    {"name": "property", "part": [
      {"name": "code", "valueCode": "COMPONENT"},
      {"name": "value", "valueString": "Blood pressure panel"}
    ]},
    {"name": "property", "part": [
      {"name": "code", "valueCode": "STATUS"},
      {"name": "value", "valueString": "ACTIVE"}
    ]}
  ]
}
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `system` | uri | The code system URL |
| `code` | code | The code to look up |
| `version` | string | Specific version of the code system |
| `coding` | Coding | Alternative to system+code |
| `property` | code | Specific properties to return |

## $subsumes {#subsumes}

Determines hierarchical relationships between two codes (is-a relationships). This is particularly useful for code systems with hierarchical structure such as SNOMED CT.

### GET Request

```bash
curl 'http://localhost:9089/fhir/r4/CodeSystem/$subsumes?system=http://snomed.info/sct&codeA=235856003&codeB=386661006'
```

### POST Request

```bash
curl -X POST http://localhost:9089/fhir/r4/CodeSystem/$subsumes \
  -H "Content-Type: application/fhir+json" \
  -d '{
    "resourceType": "Parameters",
    "parameter": [
      {"name": "system", "valueUri": "http://snomed.info/sct"},
      {"name": "codeA", "valueCode": "235856003"},
      {"name": "codeB", "valueCode": "386661006"}
    ]
  }'
```

### Response

```json
{
  "resourceType": "Parameters",
  "parameter": [
    {"name": "outcome", "valueCode": "subsumes"}
  ]
}
```

### Possible Outcomes

| Outcome | Meaning |
|---------|---------|
| `equivalent` | Codes represent the same concept |
| `subsumes` | Code A subsumes (is broader than) Code B |
| `subsumed-by` | Code A is subsumed by (is narrower than) Code B |
| `not-subsumed` | No hierarchical relationship |

## Search CodeSystems

Retrieve CodeSystems matching search criteria.

```bash
curl 'http://localhost:9089/fhir/r4/CodeSystem?name=loinc'
```

Returns a FHIR `Bundle` of matching CodeSystem resources.

## Create a CodeSystem

Upload a new CodeSystem resource.

```bash
curl -X POST http://localhost:9089/fhir/r4/CodeSystem \
  -H "Content-Type: application/fhir+json" \
  -d '{
    "resourceType": "CodeSystem",
    "url": "http://example.org/CodeSystem/custom",
    "name": "CustomCodeSystem",
    "status": "active",
    "content": "complete",
    "concept": [
      {"code": "active", "display": "Active", "definition": "The record is active"},
      {"code": "inactive", "display": "Inactive", "definition": "The record is inactive"}
    ]
  }'
```

Returns `201 Created` on success.

## Get CodeSystem by ID

Retrieve a specific CodeSystem by its logical ID.

```bash
curl 'http://localhost:9089/fhir/r4/CodeSystem/{id}'
```

## Standard Code Systems

Common code systems used in FHIR:

| Code System | URI | Use |
|-------------|-----|-----|
| LOINC | `http://loinc.org` | Lab observations, clinical measurements |
| SNOMED CT | `http://snomed.info/sct` | Clinical findings, procedures |
| ICD-10-CM | `http://hl7.org/fhir/sid/icd-10-cm` | Diagnoses |
| RxNorm | `http://www.nlm.nih.gov/research/umls/rxnorm` | Medications |
| CPT | `http://www.ama-assn.org/go/cpt` | Procedures |
| UCUM | `http://unitsofmeasure.org` | Units of measure |

## Related Topics

- [Terminology Overview](./overview.md)
- [ValueSet Operations](./valueset-operations.md)
