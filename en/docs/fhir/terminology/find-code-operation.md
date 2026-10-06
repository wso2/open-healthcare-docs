---
title: Find Code Operation
sidebar_position: 5
---

# Find Code Operation

`$find-code` is a custom, base-level search operation (not scoped to `ValueSet` or `CodeSystem`) for finding codes by text, across one or all loaded CodeSystems.

## $find-code {#find-code}

Searches concepts by matching a `filter` text value against either the `display` or `definition` property, optionally scoped to a single CodeSystem, with pagination.

### GET Request

```bash
curl 'http://localhost:9090/fhir/r4/$find-code?filter=diabetes'
```

### POST Request

```bash
curl -X POST http://localhost:9090/fhir/r4/$find-code \
  -H "Content-Type: application/fhir+json" \
  -d '{
    "resourceType": "Parameters",
    "parameter": [
      {"name": "filter", "valueString": "diabetes"},
      {"name": "system", "valueUri": "http://hl7.org/fhir/sid/icd-10-cm"},
      {"name": "property", "valueString": "display"}
    ]
  }'
```

### Response

A searchset `Bundle` with one `Coding` per matching concept.

```json
{
    "resourceType": "Bundle",
    "meta": {
        "profile": [
            "http://hl7.org/fhir/StructureDefinition/Bundle"
        ]
    },
    "type": "searchset",
    "total": 20,
    "entry": [
        {
            "resource": {
                "system": "http://hl7.org/fhir/sid/icd-10-cm",
                "code": "E09",
                "display": "Drug or chemical induced diabetes mellitus"
            }
        },
        {
            "resource": {
                "system": "http://hl7.org/fhir/sid/icd-10-cm",
                "code": "E10",
                "display": "Type 1 diabetes mellitus"
            }
        },
        {
            "resource": {
                "system": "http://hl7.org/fhir/sid/icd-10-cm",
                "code": "E11",
                "display": "Type 2 diabetes mellitus"
            }
        },
        ...
        {
            "resource": {
                "system": "http://hl7.org/fhir/sid/icd-10-cm",
                "code": "E10.6",
                "display": "Type 1 diabetes mellitus with other specified complications"
            }
        },
        {
            "resource": {
                "system": "http://hl7.org/fhir/sid/icd-10-cm",
                "code": "E10.8",
                "display": "Type 1 diabetes mellitus with unspecified complications"
            }
        }
    ]
}
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `filter` | string | Text to match against `display` or `definition` -- required |
| `property` | code | Which property to match against: `display` (default) or `definition` |
| `system` | uri | Restrict the search to a single CodeSystem. Omit to search across all loaded CodeSystems |
| `_count` | integer | Maximum number of concepts to return per page |
| `_offset` | integer | Zero-based index of the first concept to return |

## Related Topics

- [Terminology Overview](./overview.md)
- [CodeSystem Operations](./codesystem-operations.md)
- [ValueSet Operations](./valueset-operations.md)
