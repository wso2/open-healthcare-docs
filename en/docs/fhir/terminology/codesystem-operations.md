---
title: CodeSystem Operations
sidebar_position: 2
---

# CodeSystem Operations

The terminology service provides operations to look up codes, validate codes, test subsumption relationships, and manage CodeSystem resources.

## $lookup {#lookup}

Retrieves detailed information about a code, including its display name, definition, designations (translations), and properties.

For CodeSystems that store concept hierarchy, the response also includes one `parent` property per direct is-a parent (a concept can have more than one -- e.g. SNOMED CT) and one `child` property per direct child, plus `abstract` and `inactive` flags derived from concept properties. For SNOMED CT, `$lookup` additionally returns non-is-a clinical attribute relationships (e.g. Finding site, Associated morphology) as `property` entries, resolved from the imported Relationship data.

### GET Request

```bash
curl 'http://localhost:9090/fhir/r4/CodeSystem/$lookup?system=http://loinc.org&code=100011-6'
```

### POST Request

```bash
curl -X POST http://localhost:9090/fhir/r4/CodeSystem/$lookup \
  -H "Content-Type: application/fhir+json" \
  -d '
  {
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "coding",
      "valueCoding": {
        "system": "http://loinc.org",
        "code": "100012-4"
        }
      }
    ]
  }
```

### Response

```json
{
    "resourceType": "Parameters",
    "parameter": [
        {
            "name": "abstract",
            "valueBoolean": false
        },
        {
            "valueCode": "100012-4",
            "name": "code"
        },
        {
            "name": "designation",
            "part": [
                {
                    "valueCode": "en-US",
                    "name": "language"
                },
                {
                    "name": "use",
                    "valueCoding": {
                        "system": "http://loinc.org",
                        "code": "LONG_COMMON_NAME"
                    }
                },
                {
                    "name": "value",
                    "valueString": "Participates in decisions affecting the patient's plan of care"
                }
            ]
        },
        {
            "name": "display",
            "valueString": "Participates in decisions affecting the patient's plan of care"
        },
        {
            "name": "name",
            "valueString": "LOINC"
        },
        ...
        {
            "name": "system",
            "valueUri": "http://loinc.org"
        },
        {
            "name": "version",
            "valueString": "2.82"
        }
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

## $validate-code {#validate-code}

Checks whether a specific code is valid for a CodeSystem, optionally verifying its display value.

### GET Request

```bash
curl 'http://localhost:9090/fhir/r4/CodeSystem/$validate-code?url=http://hl7.org/fhir/sid/icd-10-cm&code=E11.1'
```

### Validate with version

```bash
curl 'http://localhost:9090/fhir/r4/CodeSystem/$validate-code?url=http://snomed.info/sct&version=http://snomed.info/sct/900000000000207008/version/20260401&code=44029006&display=Left%20lung'
```

### POST Request

Accepts a `coding`, `codeableConcept`, or `code` (combined with `url`), checked against either a `url` referencing an already-persisted CodeSystem or an inline `codeSystem` resource in the request body -- including one that was never separately uploaded.

```bash
curl -X POST http://localhost:9090/fhir/r4/CodeSystem/$validate-code \
  -H "Content-Type: application/fhir+json" \
  -d '{
        "resourceType": "Parameters",
        "parameter": [
          { "name": "url", "valueUri": "http://snomed.info/sct" },
          { "name": "code", "valueCode": "181216001" },
          { "name": "display", "valueString": "Entire lung (body structure)" }
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
            "name": "system",
            "valueUri": "http://snomed.info/sct"
        },
        {
            "valueCode": "181216001",
            "name": "code"
        },
        {
            "name": "version",
            "valueString": "http://snomed.info/sct/900000000000207008/version/20260401"
        },
        {
            "name": "display",
            "valueString": "Entire lung"
        }
    ]
}
```

If a supplied `display` doesn't match the concept's display or any of its designations (synonyms count as a match), the response instead returns `result: false` with a `message` explaining the mismatch.

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | uri | Canonical URL of the CodeSystem to validate against |
| `code` | code | The code to validate |
| `coding` | Coding | Alternative to `code` + `url` |
| `codeableConcept` | CodeableConcept | Alternative carrying one or more codings |
| `codeSystem` | CodeSystem | Inline CodeSystem to validate against, instead of `url` |
| `version` | string | Specific version of the code system |
| `display` | string | Expected display value to verify against the matched concept |

## $subsumes {#subsumes}

Determines hierarchical relationships between two codes (is-a relationships). This is particularly useful for code systems with hierarchical structure, such as SNOMED CT and ICD-10-CM.

### GET Request

```bash
curl 'http://localhost:9090/fhir/r4/CodeSystem/$subsumes?system=http://snomed.info/sct&codeA=138875005&codeB=73211009'
```

### POST Request

```bash
curl -X POST http://localhost:9090/fhir/r4/CodeSystem/$subsumes \
  -H "Content-Type: application/fhir+json" \
  -d '{
        "resourceType": "Parameters",
        "parameter": [
          {
            "name": "system",
            "valueUri": "http://snomed.info/sct"
          },
          {
            "name": "codingA",
            "valueCoding": {
            "system": "http://snomed.info/sct",
            "code": "138875005"
          }
          },
          {
            "name": "codingB",
            "valueCoding": {
            "system": "http://snomed.info/sct",
            "code": "73211009"
          }
        }
      ]
    }'
```

### Response

```json
{
    "resourceType": "Parameters",
    "parameter": [
        {
            "valueCode": "subsumes",
            "name": "outcome"
        }
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
curl 'http://localhost:9090/fhir/r4/CodeSystem?url=http://loinc.org'
```

Returns a FHIR `Bundle` of matching CodeSystem resources.

## Create a CodeSystem

Upload a new CodeSystem resource.

```bash
curl -X POST http://localhost:9090/fhir/r4/CodeSystem \
  -H "Content-Type: application/fhir+json" \
  -d '{
        "resourceType": "CodeSystem",
        "id": "demo-manual-codesystem",
        "url": "http://example.org/fhir/CodeSystem/demo-manual-codesystem",
        "version": "1.0.0",
        "name": "DemoManualCodeSystem",
        "title": "Demo CodeSystem created via plain POST",
        "status": "active",
        "content": "complete",
        "caseSensitive": true,
        "concept": [
          { "code": "A", "display": "Concept A" },
          { "code": "B", "display": "Concept B" }
        ]
      }'
```

Returns `201 Created` on success.

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

LOINC, SNOMED CT, and ICD-10-CM can be loaded into the service directly from their standard release formats -- see [Upload Operations](./upload-operations.md).

## Related Topics

- [Terminology Overview](./overview.md)
- [ValueSet Operations](./valueset-operations.md)
- [ConceptMap Operations](./conceptmap-operations.md)
- [Upload Operations](./upload-operations.md)
