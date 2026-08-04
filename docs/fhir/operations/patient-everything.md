---
title: "Patient $everything"
---

# Patient $everything Operation

The `$everything` operation returns all resources associated with a patient, providing a comprehensive view of a patient's health record.

## Usage

```bash
GET /fhir/r4/Patient/123/$everything
```

With parameters:

```bash
GET /fhir/r4/Patient/123/$everything?start=2024-01-01&end=2024-12-31&_type=Observation,Condition,MedicationRequest
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `start` | date | Only include resources updated after this date |
| `end` | date | Only include resources updated before this date |
| `_since` | instant | Only include resources modified since this instant |
| `_type` | string | Comma-separated list of resource types to include |
| `_count` | integer | Maximum resources per page |

## Response

Returns a searchset `Bundle` containing all related resources:

```json
{
  "resourceType": "Bundle",
  "type": "searchset",
  "total": 45,
  "entry": [
    {
      "resource": {
        "resourceType": "Patient",
        "id": "123",
        "name": [{"family": "Smith", "given": ["John"]}]
      }
    },
    {
      "resource": {
        "resourceType": "Condition",
        "id": "456",
        "subject": {"reference": "Patient/123"},
        "code": {"coding": [{"system": "http://snomed.info/sct", "code": "44054006", "display": "Diabetes"}]}
      }
    },
    {
      "resource": {
        "resourceType": "Observation",
        "id": "789",
        "subject": {"reference": "Patient/123"},
        "code": {"coding": [{"system": "http://loinc.org", "code": "4548-4", "display": "HbA1c"}]}
      }
    }
  ]
}
```

## Included Resource Types

By default, `$everything` includes:

- Patient (the subject)
- AllergyIntolerance
- CarePlan
- Condition
- Device
- DiagnosticReport
- DocumentReference
- Encounter
- Immunization
- MedicationRequest
- MedicationStatement
- Observation
- Procedure

## Implementation

```ballerina
import ballerinax/health.fhir.r4;
import ballerina/http;

resource function get Patient/[string id]/\$everything(
    string? 'start = (),
    string? end = (),
    string? _type = ()
) returns r4:Bundle|r4:OperationOutcome|error {

    string[] types = _type != () ? re`,`.split(_type) : defaultTypes;

    r4:BundleEntry[] entries = [];

    foreach string resourceType in types {
        r4:Resource[] resources = check repository.search(
            resourceType,
            {"patient": id, "_lastUpdated": buildDateFilter('start, end)}
        );
        foreach var res in resources {
            entries.push({resource: res});
        }
    }

    return {
        resourceType: "Bundle",
        'type: "searchset",
        total: entries.length(),
        entry: entries
    };
}
```

## Performance Considerations

- **Pagination**: Use `_count` to limit page size for patients with large records
- **Type filtering**: Specify `_type` to avoid fetching unnecessary resource types
- **Date filtering**: Use `start`/`end` to limit the time range
- **Caching**: Consider caching for frequently accessed patient summaries

## Related Topics

- [Bulk Data Export](./bulk-export.md)
- [FHIR Operations Overview](./overview.md)
