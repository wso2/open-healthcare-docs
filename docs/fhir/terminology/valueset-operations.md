---
title: "ValueSet Operations"
---

# ValueSet Operations

The terminology service provides operations to expand value sets into their constituent codes, validate codes against value set membership, and manage ValueSet resources.

## $expand {#expand}

Expands a ValueSet into a flat list of codes. This resolves all includes, excludes, and filters to produce the final set of valid codes.

### GET Request

```bash
curl 'http://localhost:9089/fhir/r4/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/observation-status'
```

With filtering:

```bash
curl 'http://localhost:9089/fhir/r4/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/condition-code&filter=diabetes&count=20'
```

### POST Request

```bash
curl -X POST http://localhost:9089/fhir/r4/ValueSet/$expand \
  -H "Content-Type: application/fhir+json" \
  -d '{
    "resourceType": "Parameters",
    "parameter": [
      {"name": "url", "valueUri": "http://hl7.org/fhir/ValueSet/observation-status"}
    ]
  }'
```

### Expand by ID

```bash
curl 'http://localhost:9089/fhir/r4/ValueSet/{id}/$expand'
```

### Response

```json
{
  "resourceType": "ValueSet",
  "expansion": {
    "timestamp": "2024-01-15T10:00:00Z",
    "total": 4,
    "contains": [
      {
        "system": "http://hl7.org/fhir/observation-status",
        "code": "registered",
        "display": "Registered"
      },
      {
        "system": "http://hl7.org/fhir/observation-status",
        "code": "preliminary",
        "display": "Preliminary"
      },
      {
        "system": "http://hl7.org/fhir/observation-status",
        "code": "final",
        "display": "Final"
      },
      {
        "system": "http://hl7.org/fhir/observation-status",
        "code": "amended",
        "display": "Amended"
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
| `count` | integer | Maximum codes to return |

## $validate-code {#validate-code}

Checks whether a specific code is a member of a value set.

### GET Request

```bash
curl 'http://localhost:9089/fhir/r4/ValueSet/$validate-code?url=http://hl7.org/fhir/ValueSet/observation-status&system=http://hl7.org/fhir/observation-status&code=final'
```

### Validate by ID

```bash
curl 'http://localhost:9089/fhir/r4/ValueSet/{id}/$validate-code?system=http://hl7.org/fhir/observation-status&code=final'
```

### POST Request

```bash
curl -X POST http://localhost:9089/fhir/r4/ValueSet/$validate-code \
  -H "Content-Type: application/fhir+json" \
  -d '{
    "resourceType": "Parameters",
    "parameter": [
      {"name": "url", "valueUri": "http://hl7.org/fhir/ValueSet/observation-status"},
      {"name": "system", "valueUri": "http://hl7.org/fhir/observation-status"},
      {"name": "code", "valueCode": "final"}
    ]
  }'
```

### Response

```json
{
  "resourceType": "Parameters",
  "parameter": [
    {"name": "result", "valueBoolean": true},
    {"name": "display", "valueString": "Final"}
  ]
}
```

## Search ValueSets

Retrieve ValueSets matching search criteria.

```bash
curl 'http://localhost:9089/fhir/r4/ValueSet?name=observation-status'
```

Returns a FHIR `Bundle` of matching ValueSet resources.

## Create a ValueSet

Upload a new ValueSet resource.

```bash
curl -X POST http://localhost:9089/fhir/r4/ValueSet \
  -H "Content-Type: application/fhir+json" \
  -d '{
    "resourceType": "ValueSet",
    "url": "http://example.org/ValueSet/custom-status",
    "name": "CustomStatus",
    "status": "active",
    "compose": {
      "include": [
        {
          "system": "http://example.org/CodeSystem/custom",
          "concept": [
            {"code": "active", "display": "Active"},
            {"code": "inactive", "display": "Inactive"}
          ]
        }
      ]
    }
  }'
```

Returns `201 Created` on success.

## Get ValueSet by ID

Retrieve a specific ValueSet by its logical ID.

```bash
curl 'http://localhost:9089/fhir/r4/ValueSet/{id}'
```

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
