---
title: ConceptMap Operations
sidebar_position: 4
---

# ConceptMap Operations

ConceptMap resources define mappings between codes in different code systems -- essential for data integration across systems that use different terminologies.

## ConceptMap in FHIR

A ConceptMap defines relationships between codes in a source code system and codes in a target code system. Common use cases include:

| Source | Target | Use Case |
|--------|--------|----------|
| ICD-9-CM | ICD-10-CM | Legacy system migration |
| HL7v2 tables | FHIR code systems | HL7v2 to FHIR transformation |
| Local codes | SNOMED CT | Standardization |
| SNOMED CT | ICD-10 | Billing and reporting |

## $translate {#translate}

The `$translate` operation translates a code from a source ValueSet (or CodeSystem) to a target, by matching it against the `group`s of a persisted ConceptMap.

`source` is required. The code to translate can be given either as a `coding`/`codeableConcept` parameter, or as separate `system` + `code` (+ optional `version`) parameters. `target` and `targetsystem` are treated as aliases of each other.

The non-standard `sourceSystem` / `sourceCode` / `targetSystem` aliases are also accepted as a convenience (filling in `system`/`code`/`target` when those aren't otherwise supplied), for compatibility with test suites that use that naming.

### GET Request

```bash
curl 'http://localhost:9090/fhir/r4/ConceptMap/$translate?source=http://hl7.org/fhir/sid/icd-10-cm&target=http://snomed.info/sct&system=http://hl7.org/fhir/sid/icd-10-cm&code=E11.9'
```

### POST Request

```bash
curl -X POST http://localhost:9090/fhir/r4/ConceptMap/$translate \
  -H "Content-Type: application/fhir+json" \
  -d '{
        "resourceType": "Parameters",
        "parameter": [
          { "name": "source", "valueUri": "http://snomed.info/sct?fhir_vs" },
          { "name": "target", "valueUri": "http://hl7.org/fhir/sid/icd-10-us" },
          { "name": "system", "valueUri": "http://snomed.info/sct" },
          { "name": "code", "valueCode": "263204007" }
        ]
      }'
```

### Response

```json
{
    "resourceType": "Parameters",
    "parameter": [
        {
            "name": "match",
            "part": [
                {
                    "valueCode": "equivalent",
                    "name": "equivalent"
                },
                {
                    "name": "concept",
                    "valueCoding": {
                        "system": "http://snomed.info/sct",
                        "code": "44054006",
                        "display": "Type 2 diabetes mellitus",
                        "userSelected": false
                    }
                },
                {
                    "name": "source",
                    "valueUri": "http://example.org/fhir/ConceptMap/icd10-to-snomed-diabetes-example"
                }
            ]
        },
        {
            "name": "result",
            "valueBoolean": true
        }
    ]
}
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `source` | uri | Source ValueSet (or CodeSystem) canonical URL -- required |
| `target` / `targetsystem` | uri | Target ValueSet (or CodeSystem) canonical URL -- aliases of each other |
| `system` | uri | CodeSystem of the code being translated, when not using `coding`/`codeableConcept` |
| `code` | code | The code being translated, when not using `coding`/`codeableConcept` |
| `version` | string | Version of `system`, when using `system` + `code` |
| `coding` | Coding | The code being translated, as a `Coding` |
| `codeableConcept` | CodeableConcept | The code being translated, as a `CodeableConcept` |

### Match Equivalence Types

| Equivalence | Meaning |
|-------------|---------|
| `equivalent` | Exact semantic match |
| `wider` | Target is broader in meaning |
| `narrower` | Target is narrower in meaning |
| `inexact` | Approximate match |
| `unmatched` | No match found |

## $closure {#closure}

The `$closure` operation ([HL7 spec](https://hl7.org/fhir/R4/conceptmap-operation-closure.html)) maintains a client-named, incrementally-growing subsumption table. It's a base-level operation -- called as `POST /fhir/r4/$closure`, not scoped under `/ConceptMap` -- but is documented here because it returns a `ConceptMap`.

Each call adds the given `concept`s to the named table and returns only the subsumption pairs not yet reported for that name: both a new concept's own ancestors (backed by the same closure table `$subsumes` and `$lookup` use), and any case where the new concept turns out to be an ancestor of a concept added in an earlier call. Concepts that can't be resolved against a known CodeSystem are returned as `unmatched` rather than failing the whole call.

### Request

```bash
curl -X POST 'http://localhost:9090/fhir/r4/$closure' \
  -H "Content-Type: application/fhir+json" \
  -d '{
        "resourceType": "Parameters",
        "parameter": [
          { "name": "name", "valueString": "icd10-diabetes-closure-demo" },
          { "name": "concept", "valueCoding": { "system": "http://hl7.org/fhir/sid/icd-10-cm", "code": "E11.9" } },
          { "name": "concept", "valueCoding": { "system": "http://hl7.org/fhir/sid/icd-10-cm", "code": "E10.9" } }
        ]
      }'
```

### Response

```json
{
    "resourceType": "ConceptMap",
    "id": "72eb62df-98f3-46d0-8bb1-b188884ae7f3",
    "group": [
        {
            "source": "http://hl7.org/fhir/sid/icd-10-cm",
            "element": [
                {
                    "code": "E11.9",
                    "display": "Type 2 diabetes mellitus without complications",
                    "target": [
                        {
                            "equivalence": "subsumes",
                            "code": "E11",
                            "display": "Type 2 diabetes mellitus"
                        }
                    ]
                },
                {
                    "code": "E11.9",
                    "display": "Type 2 diabetes mellitus without complications",
                    "target": [
                        {
                            "equivalence": "subsumes",
                            "code": "Section-E08-E13",
                            "display": "Diabetes mellitus (E08-E13)"
                        }
                    ]
                },
                {
                    "code": "E11.9",
                    "display": "Type 2 diabetes mellitus without complications",
                    "target": [
                        {
                            "equivalence": "subsumes",
                            "code": "Chapter-4",
                            "display": "Endocrine, nutritional and metabolic diseases (E00-E89)"
                        }
                    ]
                },
                {
                    "code": "E10.9",
                    "display": "Type 1 diabetes mellitus without complications",
                    "target": [
                        {
                            "equivalence": "subsumes",
                            "code": "E10",
                            "display": "Type 1 diabetes mellitus"
                        }
                    ]
                },
                {
                    "code": "E10.9",
                    "display": "Type 1 diabetes mellitus without complications",
                    "target": [
                        {
                            "equivalence": "subsumes",
                            "code": "Section-E08-E13",
                            "display": "Diabetes mellitus (E08-E13)"
                        }
                    ]
                },
                {
                    "code": "E10.9",
                    "display": "Type 1 diabetes mellitus without complications",
                    "target": [
                        {
                            "equivalence": "subsumes",
                            "code": "Chapter-4",
                            "display": "Endocrine, nutritional and metabolic diseases (E00-E89)"
                        }
                    ]
                }
            ],
            "target": "http://hl7.org/fhir/sid/icd-10-cm"
        }
    ],
    "version": "3",
    "status": "active"
}
```

The response `version` identifies this call's result. Pass it back as a `version` parameter on a later `$closure` call for the same `name` to resync everything reported since that version, in addition to whatever the new call discovers.

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | string | Identifies the closure table -- required |
| `concept` | Coding | Zero or more concepts to add to the table |
| `version` | string | A previously-returned version, to resync everything reported since |

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
- [Find Code Operation](./find-code-operation.md)
- [Data Transformation](../../data-transformation/guides/hl7v2-fhir.md)
