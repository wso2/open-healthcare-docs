## Introduction
The hl7v2 to fhirr4 library is designed to facilitate the conversion of healthcare data from HL7v2 standard to the FHIR R4 standard. In the healthcare industry, interoperability and data exchange between different systems are critical for ensuring accurate and efficient patient care. This library provides developers with a straightforward way to transform HL7v2 messages into FHIR R4 resources, enabling seamless integration with modern healthcare systems that utilize the FHIR standard.

## Mapping ADT_A01 Message to FHIR r4
In hl7v2, there are Messages, Segments and Data types that we can map to FHIR. In this example let's see how we can map ADT_A01.PID segment to FHIR Patient. 

{!includes/bal-mi-note.md!}

=== "Ballerina"

    1. To create a new ballerina project, execute the following command.
    ```
    bal new v2toFHIR
    ```
    2. Now our Ballerina project has been created. We are now going to transform the following hl7v2.3 message. Currently, hl7v2 versions are available from v2.1 to v2.8.
    ```
    MSH|^~\&|AccMgr|1|||20050110045504||ADT^A01|599102|P|2.3
    EVN|A01|20050110045502
    PID||1234311|||Doe^John^Leo^^Mr^PhD^M^P||1989-04-29|F|||1234 MAIN ST^APT 204^HOUSTON^TX^77001^USA^O|||0775530752||D
    ```
    To understand what each field contains in the above message, you can refer to the hl7 [spec](https://hl7.org/fhir/uv/v2mappings/2024Jan/mappings.html) for the mappings.

    3. To convert the above hl7v2.3 message to FHIR resource format, add the following code to the main.bal file.
    ```
    import ballerina/io;
    import ballerinax/health.hl7v2.utils.v2tofhirr4;

    string hl7Msg = "MSH|^~\\&|AccMgr|1|||20050110045504||ADT^A01|599102|P|2.3||\r" + 
    "EVN|A01|20050110045502||\r" + 
    "PID||1234311|||Doe^John^Leo^^Mr^PhD^M^P||1989-04-29|F|||1234 MAIN ST^APT 204^HOUSTON^TX^77001^USA^O|||0775530752||D";

    function convertHl7tov2() returns json|error{
        json|error v2tofhirResult = v2tofhirr4:v2ToFhir(hl7Msg);
        io:println("Transformed FHIR message: ", (check v2tofhirResult).toString());
    }

    public function main() returns error?{
            _= check convertHl7tov2();
    }
    ```

    4. Run the Ballerina code using `bal run` command. You will get the following FHIR bundle as the response.
    ```
    {
        "resourceType": "Bundle",
        "meta": {
            "profile": [
                "http://hl7.org/fhir/StructureDefinition/Bundle"
            ]
        },
        "type": "transaction",
        "entry": [
            {
                "resource": {
                    "resourceType": "MessageHeader",
                    "eventUri": "",
                    "destination": [
                        {
                            "endpoint": ""
                        }
                    ],
                    "source": {
                        "endpoint": "",
                        "name": "AccMgr"
                    },
                    "eventCoding": {
                        "system": "A01",
                        "code": "ADT"
                    }
                }
            },
            {
                "resource": {
                    "resourceType": "Provenance",
                    "agent": [],
                    "activity": {
                        "coding": [
                            {
                                "display": "EVN"
                            }
                        ]
                    },
                    "recorded": "20050110045502",
                    "target": []
                }
            },
            {
                "resource": {
                    "resourceType": "Patient",
                    "gender": "female",
                    "telecom": [
                        {
                            "system": "phone",
                            "use": "home"
                        },
                        {
                            "system": "phone",
                            "use": "home"
                        }
                    ],
                    "address": [
                        {
                            "extension": [
                                {
                                    "url": "http://hl7.org/fhir/StructureDefinition/contactpoint-country",
                                    "valueString": "O"
                                }
                            ],
                            "use": "work",
                            "line": [
                                "1234 MAIN ST",
                                "APT 204"
                            ],
                            "city": "HOUSTON",
                            "state": "TX",
                            "postalCode": "77001",
                            "country": "USA"
                        }
                    ],
                    "birthDate": "1989-04-29",
                    "name": [
                        {
                            "use": "maiden",
                            "family": "Doe",
                            "given": [
                                "John",
                                "Leo"
                            ],
                            "prefix": [
                                "Mr"
                            ],
                            "suffix": [
                                "PhD"
                            ]
                        }
                    ],
                    "maritalStatus": {
                        "coding": [
                            {
                                "code": "D"
                            }
                        ]
                    }
                }
            },
            {
                "resource": {
                    "resourceType": "Encounter",
                    "class": {},
                    "status": "in-progress"
                }
            }
        ]
    }
    ```

## Using Pre-built Services
1. You can clone the [open-healthcare-prebuilt-services](https://github.com/wso2/open-healthcare-prebuilt-services/tree/main/transformation/v2-to-fhirr4-service) repository and start the v2-to-fhirr4-service. 
```
bal run
```

2. Invoke the API as below. 
```
curl --location 'http://localhost:9090/transform' \
--header 'Content-Type: text/plain' \
--data 'MSH|^~\&|AccMgr|1|||20050110045504||ADT^A01|599102|P|2.3
EVN|A01|20050110045502
PID||1234311|||Doe^John^Leo^^Mr^PhD^M^P||1989-04-29|F|||1234 MAIN ST^APT 204^HOUSTON^TX^77001^USA^O|||0775530752||D'
```

3. You should be able to get the same above response. 


## Customization of v2 Segments 
The v2 segments can be customized to FHIR transformation logic by implementing a service with custom mappings.

In this example, we demonstrate the transformation of an HL7v2 message into a FHIR Patient resource using custom mapping tailored to specific needs. The provided HL7v2 message is as follows:

```
MSH|^~\&|SendingApp|SendingFacility|ReceivingApp|ReceivingFacility|20240823085233||ADT^A01|123456|P|2.5
PID|1|1234|5678||Doe^John||19800101|M|||123 Main St^^Anytown^CA^12345||555-1234
```

This message consists of two primary segments:

- MSH (Message Header): Contains metadata about the message.
- PID (Patient Identification): Contains crucial patient information, such as patient identifiers, name, date of birth, gender, and contact details.

### Customizing the PID Segment

The focus of this transformation is the PID segment, which contains patient-specific data. Our customization involves extracting key elements from the PID segment in the HL7v2 message, including:

- Patient ID: This is mapped to the identifier field in the FHIR Patient resource, ensuring that the patient’s unique identifier in the system is preserved.
- Patient Name: The name, split into family (last name) and given (first name) components, is mapped to the name field in the FHIR Patient resource.
- Gender: The administrative gender is mapped to the gender field in the FHIR Patient resource, converting HL7v2 gender codes to the appropriate FHIR values.
- Date of Birth: The patient's date of birth is mapped to the birthDate field, ensuring it follows the FHIR date format (YYYY-MM-DD).
- Address: The patient's address, including street, city, state, and postal code, is mapped to the address field in the FHIR Patient resource.
- Telecom (Contact Information): The patient's home phone number is mapped to the telecom field, indicating it as a home contact point.

The transformation process involves parsing the HL7v2 PID segment, extracting the relevant data, and mapping it into the corresponding FHIR Patient structure as defined in the OpenAPI specification. This ensures that the HL7v2 data is accurately represented in a standardized FHIR format, which is essential for interoperability in healthcare systems.

### Process Overview
1. OpenAPI to Ballerina Code Generation

    The Ballerina OpenAPI tool is used to generate the initial service and type definitions based on the custom-service-openapi.yaml file. This YAML file defines the API endpoints and the data structures expected by the service. It generates the following files. 

    - Type Definitions: types.bal
    - Service Implementation: custom-service-openapi-service.bal

2. Custom Data Transformation

The service processes incoming POST requests containing HL7v2 messages. When a message is received, the service specifically extracts the PID segment, which contains key patient information such as identifiers, name, gender, birth date, address, and contact details.

Let's look into the the detailed implementation of this. Let's assume the [custom-service-openapi.yaml](../references/custom-service-openapi.yaml) is inside the resources folder. 

1. Genarate the files using openapi files as below. 
```
bal openapi -i resources/custom-service-openapi.yaml --mode service -o <OUTPUT-FOLDER>
```
2. They types.bal file is auto generated to the specified folder and it does not need any changes to be done. 
3. Update the custom-service-openapi-service.bal file as below. 
```
// AUTO-GENERATED FILE.
// This file is auto-generated by the Ballerina OpenAPI tool.
import ballerina/http;
import ballerina/regex;

listener http:Listener ep0 = new (9091, config = {host: "localhost"});

service /v2tofhir on ep0 {
    resource function post transform(@http:Payload Segment_pid_body payload) returns OkFHIRPatient|error {
        FHIRPatient fhirPatient = {
            resourceType: "Patient",
            identifier: [],
            name: [],
            gender: "",
            birthDate: "",
            address: [],
            telecom: []
        };

        if payload.hl7v2Message is string {
            fhirPatient = check transformHL7v2ToFHIR(<string>payload.hl7v2Message);
        }

        // Return the FHIR Patient wrapped in OkFHIRPatient
        return {
            body: fhirPatient
        };
    }
}

function transformHL7v2ToFHIR(string hl7v2Message) returns FHIRPatient|error {
    // Split the HL7v2 message into segments using the carriage return (\r) as the delimiter
    string[] segments = regex:split(hl7v2Message, "\r");
    string pidSegment = "";

    // Find the PID segment
    foreach var segment in segments {
        if segment.startsWith("PID|") {
            pidSegment = segment;
            break;
        }
    }

    if pidSegment == "" {
        return error("PID segment not found");
    }

    // Split the PID segment into fields using the pipe (|) delimiter
    string[] pidFields = regex:split(pidSegment, "\\|");
    string[] nameParts = regex:split(pidFields[5], "\\^");

    // Map the PID fields to the FHIR Patient resource using the types from `types.bal`
    FHIRPatient patient = {
        resourceType: "Patient",
        identifier: [
            {
                system: "http://hospital.org/patient-id",
                value: pidFields[2]
            }
        ],
        name: [
            {
                family: nameParts.length() > 0 ? nameParts[0] : "",
                given: nameParts.length() > 1 ? [nameParts[1]] : []
            }
        ],
        gender: pidFields[8],
        birthDate: pidFields[7],
        address: [
            {
                line: [pidFields.length() > 11 ? regex:split(pidFields[11], "\\^")[0] : ""],
                city: pidFields.length() > 11 ? regex:split(pidFields[11], "\\^")[2] : "",
                state: pidFields.length() > 11 ? regex:split(pidFields[11], "\\^")[3] : "",
                postalCode: pidFields.length() > 11 ? regex:split(pidFields[11], "\\^")[4] : ""
            }
        ],
        telecom: [
            {
                system: "phone",
                value: pidFields.length() > 13 ? pidFields[13] : "",
                use: "home"
            }
        ]
    };

    return patient;
}

```

3. Start the Ballerina service
```
bal run
```

4. Invoke the API as below. 
```
curl --location 'http://localhost:9091/v2tofhir/transform' \
--header 'Content-Type: application/json' \
--data '{
  "hl7v2Message": "PID|1|123456|7891011||Doe^John^A||19800101|M|||123 Main St^^Anytown^CA^12345||555-1234|555-5678|||S|MR|123456789"
}'
```

5. It will provide you the following response. 
```
{
    "resourceType": "Patient",
    "identifier": [
        {
            "system": "http://hospital.org/patient-id",
            "value": "123456"
        }
    ],
    "name": [
        {
            "family": "Doe",
            "given": [
                "John"
            ]
        }
    ],
    "gender": "M",
    "birthDate": "19800101",
    "address": [
        {
            "line": [
                "123 Main St"
            ],
            "city": "Anytown",
            "state": "CA",
            "postalCode": "12345"
        }
    ],
    "telecom": [
        {
            "system": "phone",
            "value": "555-1234",
            "use": "home"
        }
    ]
}
```
