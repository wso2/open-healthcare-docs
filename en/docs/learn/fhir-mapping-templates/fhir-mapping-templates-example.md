# Example

## Coverting XML payload to C4BB Patient Example using FHIR Read Mapping Templates 

This example will guide you to convert an XML Payload to [CRBB-Patient profile.](http://hl7.org/fhir/us/carin-bb/STU1.1/StructureDefinition-C4BB-Patient.html)

## What you will build

1. You will have an XML payload as below. 
```
<?xml version="1.0" encoding="UTF-8"?>
<patientCollection>
   <patient>
      <id>285137</id>
      <ethnicity__pc>Unknown</ethnicity__pc>
      <gender__pc>FEMALe</gender__pc>
      <lastname>OVERKAMP</lastname>
      <personbirthdate>1987-11-03+05:30</personbirthdate>
      <firstname>JUSTIN</firstname>
      <phone>(062) 8377233</phone>
      <language__c>English</language__c>
      <billingcountrycode>US</billingcountrycode>
      <personmailingpostalcode>344532</personmailingpostalcode>
      <personmailingstate>NY</personmailingstate>
      <personmailingcity>New York</personmailingcity>
      <personmailingstreet>1150 476 Co Rd</personmailingstreet>
   </patient>
</patientCollection>
```

2. This will be converted to an FHIR payload using FHIR Mappings. The final FHIR Payload (CRBB Patient ) will be as below.  
```
{
    "resourceType": "Bundle",
    "meta": {
        "lastUpdated": "2022-05-24T23:42:32.221+00:00"
    },
    "type": "searchset",
    "total": 1,
    "entry": [
        {
            "resource": {
                "resourceType": "Patient",
                "id": "285137",
                "meta": {
                    "profile": [
                        "http://hl7.org/fhir/us/carin-bb/StructureDefinition/C4BB-Patient"
                    ]
                },
                "extension": [
                    {
                        "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity",
                        "extension": [
                            {
                                "url": "text",
                                "valueString": "Unknown"
                            }
                        ]
                    },
                    {
                        "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex",
                        "valueString": "F"
                    }
                ],
                "identifier": [
                    {
                        "type": {
                            "coding": [
                                {
                                    "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                                    "code": "MB",
                                    "display": "Member Number"
                                }
                            ]
                        },
                        "value": "285137"
                    }
                ],
                "name": [
                    {
                        "family": "OVERKAMP",
                        "given": [
                            "JUSTIN"
                        ]
                    }
                ],
                "telecom": [
                    {
                        "system": "phone",
                        "value": "(062) 8377233"
                    }
                ],
                "gender": "female",
                "birthDate": "1987-11-03",
                "address": [
                    {
                        "type": "physical",
                        "line": [
                            "1150 476 Co Rd"
                        ],
                        "city": "New York",
                        "state": "NY",
                        "postalCode": "344532",
                        "country": "US"
                    }
                ],
                "communication": [
                    {
                        "language": {
                            "coding": [
                                {
                                    "system": "urn:ietf:bcp:47",
                                    "code": "en"
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ]
}
```

## Setting up the environment

### Import Projects

The user will be provided two project zip files, which are projectsGenerationTool_sampleclient_api.zip file and projectsGenerationTool_sampleclient_integration.zip file. These need to be imported to [WSO2 Integration Studio](https://wso2.com/integration/integration-studio/)

1. Unzip the two projects.
2. Please follow the steps to import the projects to the Integration Studio. [Import-Projects](https://apim.docs.wso2.com/en/latest/integrate/develop/importing-projects/)

### Prerequsites
1. Create the endpoint. Right click on the sampleclient_integration project, and select, 'New' -> 'Endpoint'. The [XML payload](https://run.mocky.io/v3/7d2f454d-14d3-4480-bff7-8da0e818e2da) is already available. 
2. Create the following endpoint. Make sure to create the endpoint name as 'uri.var.endpoint'. We do this as we need to call the endpoint as a query parameter. 
```
<?xml version="1.0" encoding="UTF-8"?>
<endpoint name="uri.var.endpoint" xmlns="http://ws.apache.org/ns/synapse">
    <http method="get" uri-template="{uri.var.endpoint}">
        <suspendOnFailure>
            <initialDuration>-1</initialDuration>
            <progressionFactor>1.0</progressionFactor>
        </suspendOnFailure>
        <markForSuspension>
            <retriesBeforeSuspension>0</retriesBeforeSuspension>
        </markForSuspension>
    </http>
</endpoint>

```

### Step 1:Implement source system connection logic for the relevant FHIR API

This can be found under the templates section of the synapse-configs of the source integration project which ends with
sourceConnect_template suffix.

In this example, it is **sampleclient_C4BB_C4BBPatient_search_sourceConnect_template.xml**

In this step we can provide the endpoint we created in Prerequsites using a call mediator.
![implementing source system connection logic]({{base_path}}/assets/img/learn/fhir-mapping-templates/source-system-connection.png)

The source will be as below.

```
<?xml version="1.0" encoding="UTF-8"?>
<template name="sampleclient_C4BB_C4BBPatient_search_sourceConnect_template" xmlns="http://ws.apache.org/ns/synapse">
    <parameter defaultValue="" isMandatory="false" name="id"/>
    <sequence>
        <property expression="get-property('query.param.endpoint')" name="uri.var.endpoint" scope="default" type="STRING"/>
        <call>
            <endpoint key="uri.var.endpoint"/>
        </call>
    </sequence>
</template>
```

### Step 2: Implement the FHIR Mappings

After having the source payload from backend sources, then you can implement the FHIR mappings. Go to the Source
integration project and open the **registry resources** project. There are three types of templates which are in yaml format.

- Resource Mapping templates
- Key Value Mapping template file (keymappings.yaml)
- Conditions mapping template file (conditions.yaml)

**Resource templates**

Developer only needs to fill the relevant source value from the source payload using relevant Xpath or a JsonPath. In this
example **c4bb-patient.yaml** file.

We need to provide the following Xpaths according to the example.

1. Path to source payload root element
```
   sourcePayloadRoot :
        read: //patientCollection/patient
        write:
```
2. Relative path to source payload child data elements
```
   - source :
        read : //id
        write : 
```
Part of crbb-patient.yml file is as below. Like wise you can fill the mappings. 

```
resourceType : Patient
profile : http://hl7.org/fhir/us/carin-bb/StructureDefinition/C4BB-Patient
sourcePayloadRoot :
   read: //patientCollection/patient
   write:
elements:
  - source :
        read : //id
        write : 
    fhir :
       attribute : Patient.id
       dataType: id
```

![crbb-patient.yaml file]({{base_path}}/assets/img/learn/fhir-mapping-templates/crbb-patient-yaml-file.png)

**Key Value Mapping Template**

The Key Value Mapping template file is used to resolve the source system values with the FHIR specific values for
resource fields. For example in the FHIR Patient resource, the gender field should only have standard values defined
by the FHIR specification which are ‘male’ for Male, ‘female’ for Female. In source systems, these kinds of data may
have a different representation. In such cases we can use the Key Value Mapping template to map the source system
representation to the standard FHIR representation.

In this example, in the given XML payload, you can see that the gender is represented as FEMALe, which is not a value that FHIR system accepts. 
```
<gender__pc>FEMALe</gender__pc>
```
Therefore, we need a mapping for this. Open 'keymappings.yaml'file and do the mapping as below. 
```
- name: administrative-gender
  elements:
  - male: []
  - female: ["FEMALe"]
  - other: []
  - unknown: []
```

### Step 3: Export Composite application and deploy in the Micro Integrator.

After completing the above steps, you can export the deployable composite applications for the two projects.
Following artifacts need to be deployed in the WSO2 openhealthcare integration server in order to make FHIR mapper templates to work.

- FHIR Integration API carbon app -> repository/deployment/server/carbonapps
- FHIR Source Integration carbon ap -> repository/deployment/server/carbonapps

[Exporting Integration Logic as a CApp](https://apim.docs.wso2.com/en/latest/integrate/develop/exporting-artifacts/)

## Testing

Apply wso2oh-mi-accelerator-3.0.0 in wso2 micro integrator. (A doc should be written in base-scenarios)

We can use Curl or Postman to try the API. The testing steps are provided for curl. Steps for Postman should be
straightforward and can be derived from the curl requests.

Invoke the endpoint and you will be able to see the response in the step2 in 'What you'll build' section. 

```
curl --location --request GET 'http://localhost:8290/r4/Patient/?_profile=http://hl7.org/fhir/us/carin-bb/StructureDefinition/C4BB-Patient&endpoint=https://run.mocky.io/v3/7d2f454d-14d3-4480-bff7-8da0e818e2da'
```
