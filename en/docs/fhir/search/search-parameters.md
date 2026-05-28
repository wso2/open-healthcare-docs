---
title: Search Parameters
sidebar_position: 2
---

# Search Parameters

Resource-specific search parameters define what clients can filter on for each FHIR resource type. When you generate a facade with the [Ballerina Health CLI Tool](../guides/fhir-resource-api-template.md), the Health Tool **automatically** creates `searchParameters` entries in `api_config.bal` for every search parameter defined in the target Implementation Guide (IG). You implement search behavior in each resource's type-level `GET` handler using [`FHIRContext`](https://central.ballerina.io/ballerinax/health.fhir.r4/6.3.2#FHIRContext).

Manual registration in `api_config.bal` is required **only** for custom search parameters that are outside the IG.

## Generated search parameters in api_config

The Health Tool generates `api_config.bal` with a `ResourceAPIConfig` per resource. Each config includes a `searchParameters` array derived from the IG you selected (for example, US Core, AU Base, or FHIR base resources). You do not need to add standard or profile-specific parameters yourself.

The [CMS0057-F reference implementation](https://github.com/wso2-enterprise/reference-implementation-cms0057f) shows generated search parameters for a US Core Patient facade:

```ballerina
final r4:ResourceAPIConfig patientApiConfig = {
    resourceType: "Patient",
    profiles: [
        "http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient"
    ],
    searchParameters: [
        {
            name: "family",
            active: true,
            information: {
                description: "A portion of the family name of the patient",
                builtin: false,
                documentation: "http://hl7.org/fhir/us/core/SearchParameter/us-core-patient-family"
            }
        },
        {
            name: "gender-identity",
            active: true,
            information: {
                description: "Returns patients with a gender-identity extension matching the specified code.",
                builtin: false,
                documentation: "http://hl7.org/fhir/us/core/SearchParameter/us-core-patient-gender-identity"
            }
        }
        // ... additional parameters such as identifier, birthdate, ethnicity, race
    ],
    operations: [
        // FHIR $operations (export, member-match, summary, etc.) — see Custom Operations
    ]
};
```

Each entry describes one searchable parameter:

| Field | Purpose |
|-------|---------|
| `name` | Query parameter name clients use (for example, `family`, `gender-identity`) |
| `active` | Whether the parameter is enabled on this server |
| `information.description` | Human-readable description for CapabilityStatement generation |
| `information.builtin` | `false` for IG- or organization-defined parameters |
| `information.documentation` | Canonical SearchParameter URL when applicable |

The generated `service.bal` binds each resource listener to its config:

```ballerina
service /fhir/r4/Patient on new fhirr4:Listener(config = patientApiConfig) {
    // resource handlers...
}
```

Parameters listed in `searchParameters` (and marked `active: true`) are accepted and decoded into `FHIRContext` for that resource. Profile-specific parameters such as US Core `ethnicity`, `race`, and `gender-identity` are included automatically when you generate from that IG.

:::note
`api_config.bal` also defines an `operations` array for FHIR `$` operations (for example, `$export`, `$member-match`). Those are not search parameters and are also generated from the IG where applicable. Implement matching resource functions for any operations you enable — see [Custom Operations](../operations/custom-operations.md).
:::

## Implement search in your facade

Implement the type-level `GET` handler in your generated service. Read `map<r4:RequestSearchParameter[] & readonly>` from `fhirContext.getRequestSearchParameters()` and process each entry in your business logic:

```ballerina
isolated resource function get .(r4:FHIRContext fhirContext) returns r4:FHIRError|error|r4:Bundle {
    map<r4:RequestSearchParameter[] & readonly> requestSearchParameters = fhirContext.getRequestSearchParameters();

    foreach string paramName in requestSearchParameters.keys() {
        r4:RequestSearchParameter[] & readonly values = requestSearchParameters[paramName] ?: [];
        foreach r4:RequestSearchParameter param in values {
            // Apply param.name, param.value, and modifiers to your repository query
            _ = param;
        }
    }

    return check buildSearchBundle([]);
}
```

For parameters that need type-specific handling, combine the map with typed accessors on `FHIRContext`:

```ballerina
map<r4:RequestSearchParameter[] & readonly> requestSearchParameters = fhirContext.getRequestSearchParameters();
r4:StringSearchParameter[]|r4:FHIRTypeError? family = fhirContext.getStringSearchParameter("family");
r4:TokenSearchParameter[]|r4:FHIRTypeError? identifier = fhirContext.getTokenSearchParameter("identifier");
r4:DateSearchParameter[]|r4:FHIRTypeError? birthdate = fhirContext.getDateSearchParameter("birthdate");

// Map requestSearchParameters and typed values to your repository query, then return a searchset Bundle
```

## Register custom search parameters (outside the IG)

Register parameters manually only when they are **not** part of your IG and therefore not generated by the Health Tool—for example, an organization-specific MRN search parameter.

1. **Add a SearchParameter definition** (FHIR conformance resource) describing name, type, base resource, and expression.
2. **Add an entry** to the resource's `searchParameters` array in `api_config.bal`:

```ballerina
{
    name: "mrn",
    active: true,
    information: {
        description: "Search patients by medical record number",
        builtin: false,
        documentation: "http://example.org/SearchParameter/patient-mrn"
    }
}
```

3. **Implement handling** in the resource `GET` handler by reading `mrn` from `FHIRContext`:

```ballerina
r4:TokenSearchParameter[]|r4:FHIRTypeError? mrn = fhirContext.getTokenSearchParameter("mrn");
```

Clients can then query:

```bash
GET /fhir/r4/Patient?mrn=12345
```

## Common resource parameters (reference)

These are standard FHIR search parameters clients commonly use. When generated from an IG, matching entries already appear in `api_config.bal`; implement the search logic for the parameters your deployment supports.

### Patient

| Parameter | Type | Example |
|-----------|------|---------|
| `identifier` | token | `?identifier=http://example.org/mrn|12345` |
| `family` | string | `?family=Smith` |
| `given` | string | `?given=John` |
| `birthdate` | date | `?birthdate=ge1990-01-01` |
| `gender` | token | `?gender=male` |

### Observation

| Parameter | Type | Example |
|-----------|------|---------|
| `patient` | reference | `?patient=Patient/123` |
| `code` | token | `?code=http://loinc.org\|85354-9` |
| `category` | token | `?category=laboratory` |
| `date` | date | `?date=ge2024-01-01` |
| `status` | token | `?status=final` |

## Search modifiers

Modifiers change how a parameter is matched. The framework decodes modifiers into `RequestSearchParameter` so your handler can branch on them:

| Modifier | Effect | Example |
|----------|--------|---------|
| `:exact` | Case-sensitive exact match | `family:exact=Smith` |
| `:contains` | Substring match | `name:contains=mit` |
| `:missing` | Element absent | `phone:missing=true` |
| `:not` | Negation | `status:not=final` |
| `:above` / `:below` | Hierarchy match | `code:below=http://snomed.info/sct|73211009` |

## Related topics

- [Search Overview](./overview.md) — FHIR search concepts and `FHIRContext` usage
- [Advanced Search](./advanced-search.md) — Chained and reverse-chained queries
- [Developing FHIR APIs](../guides/fhir-resource-api-template.md) — Generate facade templates
- [Custom Operations](../operations/custom-operations.md) — Register and implement `$` operations in `api_config.bal`
