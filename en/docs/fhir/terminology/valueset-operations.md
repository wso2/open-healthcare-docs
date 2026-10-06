---
title: ValueSet Operations
sidebar_position: 3
---

# ValueSet Operations

The terminology service provides operations to expand value sets into their constituent codes, validate codes against value set membership, and manage ValueSet resources.

## $expand {#expand}

Expands a ValueSet into a flat list of codes. This resolves all includes, excludes, and filters to produce the final set of valid codes.

`ValueSet.compose.include.filter` supports `is-a` / `descendent-of`, `=`, and `regex` operators. Multiple filters on the same `include` are combined with AND (each narrows the same member set further), while multiple `include` entries are combined with OR.

### GET Request

```bash
curl 'http://localhost:9090/fhir/r4/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/observation-status'
```

With filtering:

```bash
curl 'http://localhost:9090/fhir/r4/ValueSet/snomed-diabetes-example/$expand?filter=type'
```

### POST Request

```bash
curl -X POST http://localhost:9090/fhir/r4/ValueSet/$expand \
  -H "Content-Type: application/fhir+json" \
  -d '{
        "resourceType": "Parameters",
        "parameter": [
          {"name": "url", "valueUri": "http://example.org/fhir/ValueSet/snomed-diabetes-example"}
        ]
      }'
```

### Expand by ID

```bash
curl 'http://localhost:9090/fhir/r4/ValueSet/snomed-diabetes-example/$expand'
```

### Response

```json
{
    "resourceType": "ValueSet",
    "meta": {
        "profile": [
            "http://hl7.org/fhir/StructureDefinition/ValueSet"
        ]
    },
    "title": "SNOMED diabetes example",
    "id": "snomed-diabetes-example",
    "version": "1.0.0",
    "url": "http://example.org/fhir/ValueSet/snomed-diabetes-example",
    "compose": {
        "include": [
            {
                "system": "http://snomed.info/sct",
                "concept": [
                    {
                        "code": "73211009"
                    },
                    {
                        "code": "44054006"
                    }
                ]
            }
        ]
    },
    "name": "SnomedDiabetesExample",
    "status": "active",
    "expansion": {
        "contains": [
            {
                "code": "44054006",
                "display": "Diabetes mellitus type II",
                "system": "http://snomed.info/sct"
            },
            {
                "code": "73211009",
                "display": "Diabetes mellitus",
                "system": "http://snomed.info/sct"
            }
        ],
        "total": 2,
        "offset": 0,
        "timestamp": "2026-10-05T11:21:47.964149200Z",
        "identifier": "urn:uuid:f62f87d8-9304-4bb1-8768-6f90ef46b847",
        "parameter": [
            {
                "name": "used-codesystem",
                "valueUri": "http://snomed.info/sct|http://snomed.info/sct/900000000000207008/version/20260401"
            }
        ]
    }
}
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | uri | Canonical URL of the ValueSet |
| `filter` | string | Text filter on display names |
| `offset` | integer | Pagination start index |
| `count` | integer | Maximum codes to return (default 20, maximum 300 -- returns `413` if exceeded) |
| `activeOnly` | boolean | When `true`, drops inactive concepts from the expansion and recomputes `expansion.total` |

## $validate-code {#validate-code}

Checks whether a specific code is a member of a value set. Accepts either a `url` referencing an already-persisted ValueSet, or an inline `valueSet` resource in the request body -- including one that was never separately uploaded.

### GET Request

```bash
curl 'http://localhost:9090/fhir/r4/ValueSet/snomed-diabetes-example/$validate-code?system=http://snomed.info/sct&code=73211009'
```

### Validate by ID

```bash
curl 'http://localhost:9090/fhir/r4/ValueSet/snomed-diabetes-example/$validate-code?code=44054006'
```

### POST Request

```bash
curl -X POST http://localhost:9090/fhir/r4/ValueSet/$validate-code \
  -H "Content-Type: application/fhir+json" \
  -d '{
        "resourceType": "Parameters",
        "parameter": [
          { "name": "valueSet", "resource": {
              "resourceType": "ValueSet",
              "url": "http://example.org/fhir/ValueSet/icd10-diabetes-example",
              "status": "active"
          }},
          { "name": "coding", "valueCoding": { "system": "http://hl7.org/fhir/sid/icd-10-cm", "code": "E11.9" } }
        ]
      }'
```

### Response

```json
{
    "resourceType": "Parameters",
    "parameter": [
        {
            "name": "result",
            "valueBoolean": true
        },
        {
            "valueCode": "E11.9",
            "name": "code"
        },
        {
            "name": "display",
            "valueString": "Type 2 diabetes mellitus without complications"
        }
    ]
}
```

## Search ValueSets

Retrieve ValueSets matching search criteria.

```bash
curl 'http://localhost:9090/fhir/r4/ValueSet?url=http://example.org/fhir/ValueSet/snomed-diabetes-example'
```

Returns a FHIR `Bundle` of matching ValueSet resources.

## Create a ValueSet

Upload a new ValueSet resource.

```bash
curl -X POST http://localhost:9090/fhir/r4/ValueSet \
  -H "Content-Type: application/fhir+json" \
  -d '{
        "resourceType": "ValueSet",
        "id": "icd10-diabetes-example",
        "url": "http://example.org/fhir/ValueSet/icd10-diabetes-example",
        "version": "1.0.0",
        "name": "Icd10DiabetesExample",
        "title": "ICD-10-CM diabetes example",
        "status": "active",
        "compose": {
          "include": [
            {
              "system": "http://hl7.org/fhir/sid/icd-10-cm",
              "concept": [
                { "code": "E11.9" },
                { "code": "E10.9" },
                { "code": "E11.65" },
                { "code": "E11.21" },
                { "code": "E08.9" }
              ]
            }
          ]
        }
      }'
```

Returns `201 Created` on success.

## Common Value Sets

Frequently used value sets in FHIR R4:

| ValueSet | URL | Description |
|----------|-----|-------------|
| Observation Status | `http://hl7.org/fhir/ValueSet/observation-status` | Status of an observation |
| Condition Clinical Status | `http://hl7.org/fhir/ValueSet/condition-clinical` | Active, recurrence, etc. |
| Encounter Status | `http://hl7.org/fhir/ValueSet/encounter-status` | Planned, in-progress, finished |
| Medication Request Status | `http://hl7.org/fhir/ValueSet/medicationrequest-status` | Active, completed, cancelled |
| Administrative Gender | `http://hl7.org/fhir/ValueSet/administrative-gender` | Male, female, other, unknown |

## Related Topics

- [Terminology Overview](./overview.md)
- [CodeSystem Operations](./codesystem-operations.md)
- [ConceptMap Operations](./conceptmap-operations.md)
