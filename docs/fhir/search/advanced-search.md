---
title: "Advanced Search"
---

# Advanced Search

Advanced FHIR search features let clients express complex queries: chaining across references, reverse chaining with `_has`, including related resources, and sorting or filtering results. This page describes how those requests appear to clients. In your generated FHIR facade, the framework decodes these parameters into [`FHIRContext`](https://central.ballerina.io/ballerinax/health.fhir.r4/6.3.2#FHIRContext); your type-level `GET` handler must interpret them when building business logic.

See [Search Overview](./overview.md) for how to read parameters with `getRequestSearchParameters()` and typed accessors.

## Chained search

Search based on properties of referenced resources without knowing their IDs:

```bash
# Observations where the patient's name is "Smith"
GET /fhir/r4/Observation?patient.name=Smith

# Encounters at a specific organization
GET /fhir/r4/Encounter?serviceProvider.name=General%20Hospital
```

When a reference can point to multiple types, clients can specify the type:

```bash
GET /fhir/r4/Observation?subject:Patient.name=Smith
```

**Implementation note:** Chained parameter names (for example, `patient.name`) appear in `FHIRContext.getRequestSearchParameters()`. Your facade must resolve references and apply filters across related resources, or delegate to a backend that supports chained queries natively.

## Reverse chaining (`_has`)

Find resources based on other resources that reference them:

```bash
# Patients who have an Observation with a specific code
GET /fhir/r4/Patient?_has:Observation:patient:code=http://loinc.org|85354-9

# Patients with an active MedicationRequest
GET /fhir/r4/Patient?_has:MedicationRequest:patient:status=active
```

Format: `_has:[ResourceType]:[searchParam]:[targetParam]=value`

## Including related resources

### `_include`

Return referenced resources alongside search results:

```bash
GET /fhir/r4/Observation?code=85354-9&_include=Observation:patient
```

### `_revinclude`

Include resources that reference the search results:

```bash
GET /fhir/r4/Patient?name=Smith&_revinclude=Observation:patient
```

### Iterative includes

```bash
GET /fhir/r4/MedicationRequest?patient=123&_include=MedicationRequest:medication&_include:iterate=Medication:manufacturer
```

**Implementation note:** `_include` and `_revinclude` are control parameters. Read them from `FHIRContext` (often via `getRequestSearchParameter("_include")`) and expand the response `Bundle` with additional entries after your primary search completes.

## Sorting and result shaping

```bash
# Sort by date descending
GET /fhir/r4/Observation?patient=123&_sort=-date

# Multiple sort criteria
GET /fhir/r4/Patient?_sort=family,-birthdate

# Limit returned elements
GET /fhir/r4/Patient?_elements=id,name,birthDate

# Summary modes
GET /fhir/r4/Patient?_summary=true
GET /fhir/r4/Patient?_summary=count
```

Use `fhirContext.getPaginationContext()` for `_count` and paging, and inspect `_sort`, `_summary`, and `_elements` from the request search parameter map when shaping the response.

## Compartment search

Search within a patient compartment:

```bash
GET /fhir/r4/Patient/123/Observation
GET /fhir/r4/Patient/123/Condition?clinical-status=active
```

Compartment routes are exposed as separate resource paths in the generated service. Implement the corresponding `GET` handler and scope queries to the compartment patient id from `FHIRContext.getRawPath()` or path parameters.

## Batch search

Clients can submit multiple searches in one batch `Bundle`. Each entry is an independent `GET` request your facade processes through the same search handlers.

## Implementing advanced search in your facade

1. **Use** search parameters already generated in `api_config.bal` for your IG. Register additional entries only for custom parameters outside the IG. See [Search Parameters](./search-parameters.md).
2. **Read** decoded parameters from `FHIRContext` in the resource `GET` handler.
3. **Translate** parameters into queries against your FHIR repository, EMR connector, or custom data layer.
4. **Assemble** a `Bundle` with `type: searchset`, honoring `_include`, `_sort`, and pagination when your deployment supports them.

Not every deployment must support every advanced feature on day one. Implement only the behaviors your CapabilityStatement advertises.

## Related topics

- [Search Overview](./overview.md)
- [Search Parameters](./search-parameters.md)
- [Developing FHIR APIs](../guides/fhir-resource-api-template.md)
