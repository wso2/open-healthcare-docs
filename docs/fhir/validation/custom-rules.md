---
title: "Custom Validation Rules"
---

# Custom Validation Rules

Beyond standard FHIR profile validation, organizations often need to enforce site-specific policies on FHIR resources. You can implement custom validation logic in Ballerina by combining the built-in FHIR validator with your own business rules.

## Approach

The FHIR validator package validates resources against base FHIR models and profile-constrained types. For additional organizational rules, you can write Ballerina functions that inspect the parsed resource and return errors when constraints are violated.

A typical pattern is:

1. Validate the resource against the FHIR specification using `validator:validate()`.
2. Parse the resource into a typed Ballerina record.
3. Apply custom business rules to the parsed record.
4. Aggregate any validation errors from both steps.

```ballerina
import ballerina/io;
import ballerinax/health.fhir.r4;
import ballerinax/health.fhir.r4.international401;
import ballerinax/health.fhir.r4.validator;

public function main() returns error? {

    json body = {
        "resourceType": "Patient",
        "id": "591841",
        "name": [ {
            "family": "Cushing",
            "given": [ "Caleb" ]
        } ]
    };

    // Step 1: Validate against the FHIR profile
    r4:FHIRValidationError? fhirValidation = validator:validate(body, international401:Patient);

    if fhirValidation is r4:FHIRValidationError {
        io:println("FHIR validation failed: ", fhirValidation.message());
    }

    // Step 2: Apply custom business rules
    international401:Patient patient = check body.cloneWithType();
    string[] customErrors = checkBusinessRules(patient);

    foreach string err in customErrors {
        io:println("Custom rule violation: ", err);
    }
}

function checkBusinessRules(international401:Patient patient) returns string[] {
    string[] errors = [];

    // Example: require at least one identifier
    if patient.identifier is () || (<r4:Identifier[]>patient.identifier).length() == 0 {
        errors.push("Patient must have at least one identifier");
    }

    return errors;
}
```

## Common Custom Rule Categories

| Category | Examples |
|----------|----------|
| **Identifier requirements** | MRN must be present, NPI format validation |
| **Temporal constraints** | Dates in valid ranges, encounters not in the future |
| **Referential integrity** | Referenced resources must exist |
| **Business logic** | Medication dosage within safe ranges |
| **Data quality** | Completeness checks, preferred coding systems |

## Related Topics

- [Basic Validation](../guides/validation.md)
- [Profile Validation](./profile-validation.md)
- [Terminology Validation](./terminology-validation.md)
