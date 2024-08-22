## Introduction
The hl7v2 to fhirr4 library is a Ballerina module designed to facilitate the conversion of healthcare data from the HL7 version 2 (HL7v2) standard to the FHIR R4 standard. In the healthcare industry, interoperability and data exchange between different systems are critical for ensuring accurate and efficient patient care. This library provides developers with a straightforward way to transform HL7v2 messages into FHIR R4 resources, enabling seamless integration with modern healthcare systems that utilize the FHIR standard.

## Mapping ADT_A01 Message to FHIR r4
In hl7v2, there are Messages, Segments and Data types that we can map to FHIR. In this example let's see how we can map ADT_A01.PID segment to FHIR Patient. 

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



