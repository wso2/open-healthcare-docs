# Example of FHIR Write Mapping Templates

## Converting a FHIR Payload to an XML Payload
This example demonstrate how we can convert a FHIR Payload to an XML Payload using FHIR Write Mapping Templates. 

## What you will build
1. You will be having a FHIR Payload as below. 
```
{
    "resourceType": "Patient",
    "id": "285137",
    "meta": {
        "lastUpdated":"2022-04-23",
        "profile": 
            [
                "http://hl7.org/fhir/us/carin-bb/StructureDefinition/C4BB-Patient"
            ]
        },
    "name": [
                    {
                        "family": "OVERKAMP",
                        "given": [
                            "JUSTIN"
                        ]
                    }
                ]
}
```
2. This will be converted to the below XML Payload. In this example we will be looking how can we create an XML payload with namespaces. 
```
<payload xmlns="http://ws.apache.org/ns/synapse" xmlns:ns1="https://smarthealth.org">
    <patientPayload>
        <ns1:Patient>
            <id>285137</id>
            <updatedTime>2022-04-23</updatedTime>
            <lastname>OVERKAMP</lastname>
            <firstname>JUSTIN</firstname>
        </ns1:Patient>
    </patientPayload>
</payload>
```

## Setting up the environment

### Import Projects

The user will be provided two project zip files, which are projectsGenerationTool_sampleclient_api.zip file and projectsGenerationTool_sampleclient_integration.zip file. These need to be imported to [WSO2 Integration Studio](https://wso2.com/integration/integration-studio/)

1. Unzip the two projects.
2. Please follow the steps to import the projects to the Integration Studio. [Import-Projects](https://apim.docs.wso2.com/en/latest/integrate/develop/importing-projects/)

### Step 1:Implement source system connection logic for the relevant FHIR API
In sampleclient_Patient_write_sourceConnect_template.xml, we need to do the following implementation. 

```
<?xml version="1.0" encoding="UTF-8"?>
<template name="sampleclient_Patient_write_sourceConnect_template" xmlns="http://ws.apache.org/ns/synapse">
    <sequence>
        <payloadFactory media-type="xml">
            <format>
                <payload xmlns:ns1="https://smarthealth.org">$1</payload>
            </format>
            <args>
                <arg evaluator="xml" expression="$ctx:patientPayload"/>
            </args>
        </payloadFactory>
        <respond/>
    </sequence>
</template>
```

### Step 2: Implement the FHIR Mappings
We can implement the FHIR mapping as below to generate the XML payload. We can define the namespaces under the 'namespaces' tag. 

```
resourceType : Patient
profile : http://hl7.org/fhir/us/carin-bb/StructureDefinition/C4BB-Patient
sourcePayloadRoot :
   read: //patientCollection/patient
   write:
namespaces:
ns1: https://smarthealth.org
elements:
  - source :
        read : 
        write : $ctx:patientPayload//ns1:Patient/id
    fhir :
       attribute : Patient.id
       dataType: id
  - source :
        read :
        write : $ctx:patientPayload//ns1:Patient/updatedTime
    fhir :
       attribute : Patient.meta.lastUpdated
       dataType: instant
       meta :
         root: Patient.meta
         rootType: Meta
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
curl --location --request POST 'http://localhost:8290/r4/Patient' \
--header 'Content-Type: application/json' \
--data-raw '{
    "resourceType": "Patient",
    "id": "285137",
    "meta": {
        "lastUpdated":"2022-04-23",
        "profile": 
            [
                "http://hl7.org/fhir/us/carin-bb/StructureDefinition/C4BB-Patient"
            ]
        },
    "name": [
                    {
                        "family": "OVERKAMP",
                        "given": [
                            "JUSTIN"
                        ]
                    }
                ]
}'
```

## Implement the FHIR Mappings to create a JSON payload

To create a JSON payload, we can implement the FHIR mapping as below. 

```
elements:
  - source :
    read: 
    write: $ctx:patientPayload$.Patient.id
  fhir:
    attribute: Patient.id
    dataType: id
  - source :
    read:
    write: $ctx:patientPayload$.Patient.updatedTime
  fhir:
    attribute: Patient.meta.lastUpdated
    dataType: instant
    meta:
      root: Patient.meta
      rootType: Meta
```
The sampleclient_Patient_write_sourceConnect_template.xml should be implemented as below. 

```
<?xml version="1.0" encoding="UTF-8"?>
<template name="sampleclient_Patient_write_sourceConnect_template" xmlns="http://ws.apache.org/ns/synapse">
    <sequence>
        <log>
            <property expression="$ctx:patientPayload" name="patientPayloadLog"/>
        </log>
        <payloadFactory media-type="json">
            <format>{$1}</format>
            <args>
                <arg evaluator="json" expression="$ctx:patientPayload"/>
            </args>
        </payloadFactory>
        <respond/>
    </sequence>
</template>
```

It will create the JSON payload as below. 
```
{
    {
        "Patient": [
            {
                "updatedTime": "2022-04-23",
                "firstname": "JUSTIN",
                "id": "285137",
                "lastname": "OVERKAMP"
            }
        ]
    }
}
```