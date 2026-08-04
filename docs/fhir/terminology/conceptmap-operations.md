---
title: "ConceptMap Operations"
---

# ConceptMap Operations

ConceptMap resources define mappings between codes in different code systems -- essential for data integration across systems that use different terminologies.

The pre-built [terminology service](./overview.md) currently focuses on ValueSet and CodeSystem operations. ConceptMap operations (`$translate`, `$closure`) are FHIR-standard reference/examples for future implementation — not currently supported by the terminology service.

## ConceptMap in FHIR

A ConceptMap defines relationships between codes in a source code system and codes in a target code system. Common use cases include:

| Source | Target | Use Case |
|--------|--------|----------|
| ICD-9-CM | ICD-10-CM | Legacy system migration |
| HL7v2 tables | FHIR code systems | HL7v2 to FHIR transformation |
| Local codes | SNOMED CT | Standardization |
| SNOMED CT | ICD-10 | Billing and reporting |

## $translate

The `$translate` operation translates a code from one system to another using a ConceptMap.

*FHIR-standard reference/example for future implementation — not currently supported by the terminology service.*

### Request

```bash
GET /fhir/r4/ConceptMap/$translate?url=http://example.org/ConceptMap/icd9-to-icd10&system=http://hl7.org/fhir/sid/icd-9-cm&code=250.00&targetsystem=http://hl7.org/fhir/sid/icd-10-cm
```

### Response

```json
{
  "resourceType": "Parameters",
  "parameter": [
    {"name": "result", "valueBoolean": true},
    {
      "name": "match",
      "part": [
        {"name": "equivalence", "valueCode": "equivalent"},
        {
          "name": "concept",
          "valueCoding": {
            "system": "http://hl7.org/fhir/sid/icd-10-cm",
            "code": "E11.9",
            "display": "Type 2 diabetes mellitus without complications"
          }
        }
      ]
    }
  ]
}
```

### Match Equivalence Types

| Equivalence | Meaning |
|-------------|---------|
| `equivalent` | Exact semantic match |
| `wider` | Target is broader in meaning |
| `narrower` | Target is narrower in meaning |
| `inexact` | Approximate match |
| `unmatched` | No match found |

## Creating ConceptMaps

You can define custom ConceptMap resources for your mappings:

```json
{
  "resourceType": "ConceptMap",
  "url": "http://example.org/ConceptMap/local-to-loinc",
  "status": "active",
  "sourceUri": "http://example.org/CodeSystem/local-lab-codes",
  "targetUri": "http://loinc.org",
  "group": [
    {
      "source": "http://example.org/CodeSystem/local-lab-codes",
      "target": "http://loinc.org",
      "element": [
        {
          "code": "GLU",
          "display": "Glucose",
          "target": [
            {
              "code": "2345-7",
              "display": "Glucose [Mass/volume] in Serum or Plasma",
              "equivalence": "equivalent"
            }
          ]
        }
      ]
    }
  ]
}
```

## Related Topics

- [Terminology Overview](./overview.md)
- [CodeSystem Operations](./codesystem-operations.md)
- [ValueSet Operations](./valueset-operations.md)
- [Data Transformation](../../data-transformation/guides/hl7v2-fhir.md)
