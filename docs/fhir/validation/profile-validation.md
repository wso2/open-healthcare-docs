---
title: "Profile Validation"
---

# Profile Validation

Profile validation ensures that FHIR resources conform to specific profile-constrained resource types defined in Implementation Guides. Rather than validating only against the base FHIR specification, profile validation checks resources against more specific rules, constraints, and extensions required by a particular profile (e.g., US Core Patient, AU Base Patient).

## Overview

FHIR profiles constrain and extend the base resource definitions. The validator checks:

- **Cardinality** -- Required elements are present, max occurrences not exceeded
- **Data types** -- Values conform to expected types and patterns
- **Value domains** -- Coded elements use acceptable values
- **Constraint validation** -- Element constraints such as regex patterns are satisfied
- **Structure** -- Resource is well-formed and properly organized

## Validating Against a Profile

To validate a FHIR resource against a specific profile, pass the profile type as the second argument to the `validate` function. The validator will check the resource against the constraints defined in that profile.

```ballerina
import ballerina/io;
import ballerinax/health.fhir.r4;
import ballerinax/health.fhir.r4.international401;
import ballerinax/health.fhir.r4.validator;

public function main() returns error? {

    json body = {
      "resourceType": "Patient",
      "id": "591841",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2020-01-22T05:30:13.137+00:00",
        "source": "#KO38Q3spgrJoP5fa"
      },
      "identifier": [ {
        "type": {
          "coding": [ {
            "system": "http://hl7.org/fhir/v2/0203",
            "code": "MR"
          } ]
        },
        "value": "18e5fd39-7444-4b30-91d4-57226deb2c78"
      } ],
      "name": [ {
        "family": "Cushing",
        "given": [ "Caleb" ]
      } ],
      "birthDate": "jdlksjldjl"
    };

    r4:FHIRValidationError? validateFHIRResourceJson = validator:validate(body, international401:Patient);

    if validateFHIRResourceJson is r4:FHIRValidationError {
        io:print(validateFHIRResourceJson);
    }
}
```

The `validate` function returns `FHIRValidationError` when validation fails.

## Base Resource Validation vs Profile Validation

| Approach | Usage | Description |
|----------|-------|-------------|
| Base validation | `validator:validate(body)` | Validates against the base FHIR resource model. The resource type is determined from the payload. |
| Profile validation | `validator:validate(body, ProfileType)` | Validates against a specific profile-constrained resource type (e.g., `international401:Patient`). |

Use base validation when you need to check general FHIR compliance. Use profile validation when your resources must conform to a specific Implementation Guide.

## Related Topics

- [Basic Validation](../guides/validation.md)
- [Terminology Validation](./terminology-validation.md)
- [Profiles and Extensions](../guides/profiles-and-extensions.md)
