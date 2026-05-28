---
title: Developing Custom Operations
sidebar_position: 5
---

# Developing Custom Operations

WSO2 Open Healthcare allows you to define and implement custom FHIR operations tailored to your organization's needs. Standard operation methods are generated from IG definitions by the Health Tool; register only operations outside the IG as custom operations in `api_config.bal`.

## Defining a Custom Operation

### Step 1: Implement the Operation

```ballerina
import ballerinax/health.fhir.r4;
import ballerinax/health.fhir.r4.fhirr4;
import ballerinax/health.fhir.r4.international401;

service /fhir/r4/Patient on new fhirr4:Listener(config = patientApiConfig) {
    isolated resource function post [string id]/\$summary(
            r4:FHIRContext fhirContext,
            international401:Parameters parameters
    ) returns r4:Bundle|r4:OperationOutcome|error {
        _ = fhirContext;
        string format = check extractFormat(parameters);
        
        // Retrieve patient data
        r4:Patient patient = check repository.read("Patient", id);
        
        // Gather related resources
        r4:Condition[] conditions = check getActiveConditions(id);
        r4:MedicationRequest[] medications = check getActiveMedications(id);
        r4:AllergyIntolerance[] allergies = check getAllergies(id);
        
        // Build summary bundle
        r4:Bundle summary = buildSummaryBundle(
            patient, conditions, medications, allergies
        );
        
        return summary;
    }
}
```

### Step 2: Register the custom operation

Register the custom operation in your generated API configuration (`api_config.bal`) so it is exposed by the facade and included in capability metadata:

```ballerina
final r4:ResourceAPIConfig patientApiConfig = {
    resourceType: "Patient",
    profiles: [
        "http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient"
    ],
    searchParameters: [
        // ... generated search parameters
    ],
    operations: [
        // ... operations generated from the IG
        {
            name: "summary",
            active: true,
            parameters: [
                {
                    name: "format",
                    active: true,
                    min: 0
                },
                {
                    name: "include",
                    active: true,
                    min: 0
                }
            ]
        }
    ]
};
```

## Testing Operations

```ballerina
import ballerina/test;
import ballerina/http;

@test:Config {}
function testPatientSummary() returns error? {
    http:Client client = check new ("http://localhost:9090/fhir/r4");
    
    http:Response response = check client->post("/Patient/123/$summary", {
        "resourceType": "Parameters",
        "parameter": [{"name": "format", "valueCode": "fhir"}]
    });
    
    test:assertEquals(response.statusCode, 200);
    json body = check response.getJsonPayload();
    test:assertEquals(body.resourceType, "Bundle");
}
```

## Related Topics

- [FHIR Operations Overview](./overview.md)
- [Architecture](../../architecture/overview.md)
