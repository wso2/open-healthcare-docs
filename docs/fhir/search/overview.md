---
title: "Search Overview"
---

# FHIR Search

After you generate a FHIR facade with the [Ballerina Health CLI Tool](../guides/fhir-resource-api-template.md), implement search in each resource service's type-level `GET` handler. The framework parses incoming query strings into a [`FHIRContext`](https://central.ballerina.io/ballerinax/health.fhir.r4/6.3.2#FHIRContext) so your business logic can read normalized search parameters and return a `Bundle` of type `searchset`.

## How FHIR search works

FHIR search is a standardized way to query resources by type using query parameters. A client issues an HTTP `GET` against a resource endpoint (for example, `/fhir/r4/Patient?family=Smith&gender=male`). The server evaluates the parameters, queries backing data sources, and returns matching resources in a search `Bundle`.

### Basic request patterns

```bash
# Search by resource type
GET /fhir/r4/Patient

# Search with parameters
GET /fhir/r4/Patient?family=Smith&gender=male

# Search across resource types (when supported)
GET /fhir/r4?_type=Patient,Observation&_lastUpdated=gt2024-01-01
```

### Search response

Searches return a `Bundle` of type `searchset`:

```json
{
  "resourceType": "Bundle",
  "type": "searchset",
  "total": 42,
  "link": [
    {"relation": "self", "url": "/fhir/r4/Patient?family=Smith&_count=10"},
    {"relation": "next", "url": "/fhir/r4/Patient?family=Smith&_count=10&_offset=10"}
  ],
  "entry": [
    {
      "fullUrl": "https://fhir.example.com/fhir/r4/Patient/123",
      "resource": {"resourceType": "Patient", "id": "123"},
      "search": {"mode": "match"}
    }
  ]
}
```

### Common control parameters

| Parameter | Description |
|-----------|-------------|
| `_count` | Maximum number of results per page |
| `_offset` | Starting index for pagination |
| `_sort` | Sort order (prefix `-` for descending) |
| `_elements` | Specific elements to include in results |
| `_summary` | Return summary view (`true`, `text`, `data`, `count`) |
| `_total` | Whether to include total count (`none`, `estimate`, `accurate`) |
| `_id` | Resource logical ID |
| `_lastUpdated` | When the resource was last modified |

### Search parameter types

| Type | Example |
|------|---------|
| String | `name=Smith` |
| Token | `identifier=http://example.org/mrn\|12345` |
| Date | `birthdate=ge1990-01-01` |
| Reference | `subject=Patient/123` |
| Quantity | `value-quantity=gt5.0\|\|mg` |
| URI | `url=http://example.org` |
| Number | `length=gt10` |
| Composite | `code-value-quantity=http://loinc.org\|8480-6$gt100` |

For chained search, `_has`, `_include`, and other advanced FHIR search features, see [Advanced Search](./advanced-search.md).

## Implement search in your FHIR facade

The Health Tool generates a Ballerina service per resource (for example, `service /fhir/r4/Patient on new fhirr4:Listener(config = patientApiConfig)`). Each service includes a type-level search endpoint that you must implement:

```ballerina
// Search for resources based on a set of criteria.
isolated resource function get .(r4:FHIRContext fhirContext) returns r4:FHIRError|error|r4:Bundle {
    map<r4:RequestSearchParameter[] & readonly> requestSearchParameters = fhirContext.getRequestSearchParameters();
    return executePatientSearch(requestSearchParameters, fhirContext);
}
```

By default, generated templates return `Not implemented` for search. Replace that stub with logic that reads search criteria from `FHIRContext`, queries your systems of record, and returns a FHIR `Bundle`.

### Read search parameters from FHIRContext

[`FHIRContext`](https://central.ballerina.io/ballerinax/health.fhir.r4/6.3.2#FHIRContext) carries parsed FHIR request metadata through your facade, including decoded search parameters.

| Method | Purpose |
|--------|---------|
| `getRequestSearchParameters()` | All search parameters as `map<RequestSearchParameter[]>` keyed by parameter name |
| `getRequestSearchParameter(string name)` | Values for a single parameter name |
| `getStringSearchParameter(string name)` | String-typed parameters (for example, `family`, `name`) |
| `getTokenSearchParameter(string name)` | Token-typed parameters (for example, `identifier`, `gender`) |
| `getDateSearchParameter(string name)` | Date-typed parameters (for example, `birthdate`) |
| `getReferenceSearchParameter(string name)` | Reference-typed parameters (for example, `patient`, `subject`) |
| `getQuantitySearchParameter(string name)` | Quantity-typed parameters |
| `getCompositeSearchParameter(string name)` | Composite parameters |
| `getPaginationContext()` | Parsed `_count`, page, and related pagination values |

Each `RequestSearchParameter` includes the parameter `name`, resolved `value`, and modifier or comparator information when the client supplied them.

### Build business logic from search parameters

Read `map<r4:RequestSearchParameter[] & readonly>` from `FHIRContext` and process each parameter in your search logic. Each key is a search parameter name; the value is an array of `RequestSearchParameter` records (supporting repeated parameters and modifiers).

```ballerina
import ballerinax/health.fhir.r4;

isolated resource function get .(r4:FHIRContext fhirContext) returns r4:FHIRError|error|r4:Bundle {
    map<r4:RequestSearchParameter[] & readonly> requestSearchParameters = fhirContext.getRequestSearchParameters();
    return executePatientSearch(requestSearchParameters, fhirContext);
}

isolated function executePatientSearch(
        map<r4:RequestSearchParameter[] & readonly> requestSearchParameters,
        r4:FHIRContext fhirContext) returns r4:FHIRError|error|r4:Bundle {
    foreach string paramName in requestSearchParameters.keys() {
        r4:RequestSearchParameter[] & readonly values = requestSearchParameters[paramName] ?: [];
        foreach r4:RequestSearchParameter param in values {
            // Use param.name, param.value, and modifier/comparator fields in your query logic
            _ = param;
        }
    }

    r4:PaginationContext? pagination = fhirContext.getPaginationContext();
    // Query your data source, apply pagination, and return a searchset Bundle
    _ = pagination;
    return check buildSearchBundle([]);
}
```

Match resources against criteria using the parameter map:

```ballerina
isolated function matchesSearchCriteria(Consent consent, map<r4:RequestSearchParameter[] & readonly> requestSearchParameters) returns boolean {
    if requestSearchParameters.hasKey("status") {
        r4:RequestSearchParameter[] & readonly status = requestSearchParameters.get("status");
        if consent.status.toString() != status[0].value {
            return false;
        }
    }
    if requestSearchParameters.hasKey("patient") {
        r4:RequestSearchParameter[] & readonly patient = requestSearchParameters.get("patient");
        if consent.patient?.reference != patient[0].value {
            return false;
        }
    }
    return true;
}
```

For parameters that need type-specific handling, you can combine the map with typed accessors on `FHIRContext`:

```ballerina
r4:StringSearchParameter[]|r4:FHIRTypeError? family = fhirContext.getStringSearchParameter("family");
r4:TokenSearchParameter[]|r4:FHIRTypeError? gender = fhirContext.getTokenSearchParameter("gender");
```

### Handle pagination

When clients send `_count` or paging links, read pagination from `FHIRContext` alongside `requestSearchParameters`:

```ballerina
isolated function executePatientSearch(
        map<r4:RequestSearchParameter[] & readonly> requestSearchParameters,
        r4:FHIRContext fhirContext) returns r4:FHIRError|error|r4:Bundle {
    r4:PaginationContext? pagination = fhirContext.getPaginationContext();
    int pageSize = pagination?.pageSize ?: 10;
    int page = pagination?.page ?: 1;

    // Apply requestSearchParameters and pagination when querying your data source
    _ = requestSearchParameters;
    return check buildSearchBundle([]);
}
```

### Connect the facade to api_config

Search parameters from your IG are declared automatically in `api_config.bal` when you generate the facade. The listener uses that configuration to validate incoming queries and populate `FHIRContext` before your `GET` handler runs. See [Search Parameters](./search-parameters.md) for generated parameters and how to add custom parameters outside the IG.

## Related topics

- [Search Parameters](./search-parameters.md) — Generated IG parameters and custom search parameter registration
- [Advanced Search](./advanced-search.md) — Chaining, `_has`, `_include`, and other advanced query patterns
- [Developing FHIR APIs](../guides/fhir-resource-api-template.md) — Generate facade templates with the Health Tool
- [Custom Operations](../operations/overview.md) — Implement `$` operations declared in `api_config.bal`
