# Parsing and Serializing

For any FHIR server implementation, parsing and serializing are fundamental processes that enable seamless interaction with FHIR resources. Parsing involves converting incoming data, often in various formats, into structured FHIR resources that can be easily managed and processed within the system. Conversely, serializing transforms these FHIR resources into standardized wire formats, such as JSON or XML, for transmission or storage. Effective parsing and serializing ensure that data flows smoothly between systems while maintaining compliance with FHIR standards, facilitating interoperability and consistent data exchange across healthcare applications.

{!includes/bal-mi-note.md!}



=== "Ballerina"

Since Ballerina is designed specifically to address integration use cases, records defined in Ballerina can be easily converted to JSON wire format, with similar support for XML. This makes the serialization of populated FHIR resources straightforward and efficient. 

```
import ballerinax/health.fhir.r4.internationa401;


public function main() returns json|error {
    internationa401:Patient patient = {
        meta: {
            lastUpdated: time:utcToString(time:utcNow()),
            profile: [internationa401:PROFILE_BASE_PATIENT]
        },
        active: true,
        name: [{
            family: "Doe",
            given: ["Jhon"],
            use: internationa401:official,
            prefix: ["Mr"]
        }],
        address: [{
            line: ["652 S. Lantern Dr."],
            city: "New York",
            country: "United States",
            postalCode: "10022",
            'type: internationa401:physical,
            use: internationa401:home
        }]
    };

    return patient.toJSON();
}
```

???+ note
    To achieve full FHIR server capabilities, you can leverage the Ballerina **FHIR R4 service**, which provides a comprehensive suite of features including *header validation*, *search parameter resolution*, and various other essential FHIR server functionalities. This service simplifies the implementation of a complete FHIR server, ensuring that all necessary components are in place to handle FHIR requests efficiently and in compliance with the standard.

<br>On the other hand, parsing incoming data and creating FHIR resources can be seamlessly accomplished using the Ballerina FHIR parser. An example scenario demonstrating this process is illustrated below.

```
import ballerina/log;
import ballerinax/health.fhir.r4.parser;
import ballerinax/health.fhir.r4.international401;

public function main() {
    json payload = {
        "resourceType": "Patient",
        "id": "1",
        "meta": {
            "profile": [
                "http://hl7.org/fhir/StructureDefinition/Patient"
            ]
        },
        "active":true,
        "name":[
            {
                "use":"official",
                "family":"Chalmers",
                "given":[
                    "Peter",
                    "James"
                ]
            }
        ],
        "gender":"male",
        "birthDate":"1974-12-25",
        "managingOrganization":{
            "reference":"Organization/1"
        }
    };
    do {
        international401:Patient patientModel = <international401:Patient> check parser:parse(payload);
        log:printInfo(string `Patient name : ${patientModel.name.toString()}`);
    } on fail error parseError {
    	log:printError(string `Error occurred while parsing : ${parseError.message()}`, parseError);
    }
}
```

???+ note
    `parse` function returns anydata type when success, and it needs to be cast to the relevant FHIR Resource type.




=== "Micro Integrator"

Parsing incoming requests into FHIR resources can be efficiently handled using the DataMapper feature. If the integration involves only a single FHIR resource within a request flow, serialization can be performed directly without requiring any additional connector operations. However, if the message flow involves multiple FHIR resources or composite resources, such as FHIR bundles, the FHIR Base connector must be added to the project to manage bundle-related operations appropriately. This approach ensures proper handling and serialization of complex FHIR data structures within the integration.

![FHIR Serializing](../../../assets/img/guildes/handling-fhir/fhir-serializing.png)

JSON files used in this sample can be found in; <br>
    1. <a href="../../../assets/attachments/learn/fhir-mapping-templates/input-patient.json" download>Input Data</a><br>
    2.  <a href="../../../assets/attachments/learn/fhir-mapping-templates/fhir-patient.json" download>Output data</a><br>

!!! info
    For an in-depth understanding of FHIR bundles and their related capabilities, please refer to the detailed explanation available [here](../guides/building-fhir-bundles.md). This resource provides comprehensive insights into the structure, types, and use cases of FHIR bundles, as well as the specific features and functions available for handling them in your projects.
