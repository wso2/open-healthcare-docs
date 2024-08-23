## Introduction
Custom data transformations in HL7v2 are essential for addressing the diverse and complex needs of healthcare data exchange. By implementing custom mappings and transformation logic, healthcare providers and system integrators can ensure accurate, consistent, and compliant data exchange across systems, improving interoperability, data quality, and overall patient care.


Let's look at the use case of transforming the given HL7v2 message into a FHIR Observation resource using custom mapping.
The provided HL7v2 message is as follows:
```
MSH|^~\&|SendingApp|SendingFacility|ReceivingApp|ReceivingFacility|20240823085233||ADT^A01|123456|P|2.5
PID|1|1234|5678||Doe^John||19800101|M|||123 Main St^^Anytown^CA^12345||555-1234
ZXY|12345|Test Value|final
```

This message consists of three segments:

- MSH (Message Header): Contains metadata about the message.
- PID (Patient Identification): Contains patient information.
- ZXY (Custom Segment): Contains custom data that we want to map to a FHIR Observation resource.

We are going to transform the ZXY segment from this HL7v2 message into a FHIR Observation resource using custom mapping logic.

## Process Overview
1. OpenAPI to Ballerina Code Generation

    The Ballerina OpenAPI tool is used to generate the initial service and type definitions based on the custom-service-openapi.yaml file. This YAML file defines the API endpoints and the data structures expected by the service. It generates the following files. 

    - Type Definitions: types.bal
    - Service Implementation: custom-service-openapi-service.bal

2. Custom Data Transformation:

The service listens for incoming POST requests containing HL7v2 messages. Upon receiving a message, the service extracts a specific custom segment (ZXY) and maps these segments to a FHIR Observation resource. The transformed data is then returned as a JSON response.

Let's look into the the detailed implementation of this. Let's assume the [custom-service-openapi.yaml](../references/custom-service-openapi.yaml) is inside the resources folder. 

1. Genarate the files using openapi files as below. 
```
bal openapi -i resources/custom-service-openapi.yaml --mode service -o <OUTPUT-FOLDER>
```
2. They types.bal file is auto generated to the specified folder and it does not need any changes to be done. 
3. Update the custom-service-openapi-service.bal file as below. 
```
import ballerina/http;
import ballerina/regex;
import ballerina/log;

listener http:Listener ep0 = new (8080, config = {host: "localhost"});

service / on ep0 {
    # Transform custom HL7v2 segment to FHIR Observation
    #
    # + payload - HL7v2 message wrapped in JSON
    # + return - FHIR Observation Resource 
        resource function post transform(@http:Payload Transform_body payload) returns OkFHIRObservation|error {
        FHIRObservation fhirObservation = {
            resourceType: "Observation",
            status: "",
            code: {},
            valueString: ""
        };

        if payload.hl7v2Message is string {
            fhirObservation = check transformHL7v2ToFHIR(<string>payload.hl7v2Message);
        }

        // Return the FHIR Observation wrapped in OkFHIRObservation
        return {
            body: fhirObservation
        };
    }
}

function transformHL7v2ToFHIR(string hl7v2Message) returns FHIRObservation|error {
    log:printInfo("Received HL7v2 message: " + hl7v2Message);

    // Split the HL7v2 message into segments based on the segment delimiter \r
    string[] segments = regex:split(hl7v2Message, "\r");

    // Log the segments to see how they are split
    log:printInfo("HL7v2 segments after split: ");
    foreach var seg in segments {
        log:printInfo("Segment: '" + seg + "'");
    }

    // Find the ZXY segment using direct string comparison
    string zxySegment = "";
    foreach var segment in segments {
        if segment.startsWith("ZXY|") {
            zxySegment = segment;
            break;
        }
    }

    // Check if ZXY segment was found
    if zxySegment == "" {
        log:printError("ZXY segment not found in HL7v2 message", error("ZXY segment not found"));
        return error("ZXY segment not found");
    }

    // Split the ZXY segment into fields based on the field delimiter |
    string[] zxyFields = regex:split(zxySegment, "\\|");

    // Check if fields are correctly extracted
    log:printInfo("Extracted ZXY fields: " + zxyFields.toString());
    if zxyFields.length() < 4 {
        log:printError("ZXY segment fields not properly extracted", error("Insufficient fields in ZXY segment"));
        return error("Insufficient fields in ZXY segment");
    }

    // Extract the relevant fields from the ZXY segment
    string code = zxyFields.length() > 1 ? zxyFields[1] : "";
    string valueString = zxyFields.length() > 2 ? zxyFields[2] : "";
    string status = zxyFields.length() > 3 ? zxyFields[3] : "";

    // Map to FHIR Observation resource
    FHIRObservation observation = {
        resourceType: "Observation",
        status: status,
        code: {
            coding: [{
                system: "http://loinc.org",
                code: code,
                display: "Custom Observation Code"
            }]
        },
        valueString: valueString
    };

    return observation;
}
```

3. Start the Ballerina service
```
bal run
```

4. Invoke the API as below. 
```
curl --location 'http://localhost:8080/transform' \
--header 'Content-Type: application/json' \
--data '{"hl7v2Message": "MSH|^~\\&|SendingApp|SendingFacility|ReceivingApp|ReceivingFacility|20240823085233||ADT^A01|123456|P|2.5\rPID|1|1234|5678||Doe^John||19800101|M|||123 Main St^^Anytown^CA^12345||555-1234\rZXY|12345|Test Value|final"}'
```

5. It will provide you the following response. 
```
{
    "resourceType": "Observation",
    "status": "final",
    "code": {
        "coding": [
            {
                "system": "http://loinc.org",
                "code": "12345",
                "display": "Custom Observation Code"
            }
        ]
    },
    "valueString": "Test Value"
}
```
