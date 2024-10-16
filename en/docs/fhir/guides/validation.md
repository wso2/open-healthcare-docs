# Validation

 FHIR validation involves checking FHIR resources against defined profiles, extensions, and structure definitions to ensure that the data is accurate, consistent, and compliant with the expected formats and standards. It is a crucial process in ensuring that healthcare data adheres to the FHIR standard's rules and constraints. FHIR validation helps to identify errors, enforce data integrity, and maintain interoperability across different healthcare systems.

{!includes/bal-mi-note.md!}

=== "Ballerina"

    Validating a FHIR resource(s) in Ballerina is supported with the FHIR package. Following example demonstrates how to validate a FHIR Patient resource using Ballerina.

    ## Step 1: Set Up Ballerina

    Before you begin, ensure you have <a href="https://ballerina.io/downloads/installation-options/" target="_blank">Ballerina</a> installed on your system. Follow the instructions in the [Installation Steps](../../install-and-setup/manual.md#ballerina-installation-steps)  to install Ballerina and set up the development environment.

    ## Step 2: Implement the flow to populate a FHIR resource

    1. Create a new Ballerina project using the following command. It will create the Ballerina project and the `main.bal` file can be used to implement the logic.

        ```bash
        $ bal new fhir_validation_sample
        ```
    2. Import the required modules to the Ballerina program.

        ```ballerina
        import ballerina/io;
        import ballerinax/health.fhir.r4;
        import ballerinax/health.fhir.r4.validator;
        ``` 
    3. Implement the logic to validate the FHIR resources. In this sample, we are validating a sample FHIR json to FHIR Patient resource. We are using the `validate()` function to validate the FHIR resource. This sample demonstrates how to validate a FHIR Patient resource with an invalid birth date.

        ```ballerina
        import ballerina/io;
        import ballerinax/health.fhir.r4;
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

            r4:FHIRValidationError? validateFHIRResourceJson = validator:validate(body);

            if validateFHIRResourceJson is r4:FHIRValidationError {
                io:print(validateFHIRResourceJson);
            }
        }
        ```

    ## Step 3: Run the Ballerina Program

    Run the Ballerina program using the following command:

        ```bash
        $ bal run
        ```        

=== "Micro Integrator"

    Validating a FHIR resource(s) in WSO2 Micro Integrator is supported with the FHIR Base connector. Following example demonstrates how to validate a FHIR Patient resource using WSO2 Micro Integrator.

    ## Step 1: Set Up WSO2 Micro Integrator

    Before you begin, download the [WSO2 Micro Integrator](https://wso2.com/integration/micro-integrator/) and install by following the [Installation Steps](../../install-and-setup/manual.md#ballerina-installation-steps).

    ## Step 2: Implement the flow to validate a FHIR resource

    1. Create a MI project using the MI VSCode plugin by following the guide on [Creating a New Integration Project](https://mi.docs.wso2.com/en/latest/develop/create-integration-project/). 

    2. Create a [REST API](https://mi.docs.wso2.com/en/latest/develop/creating-artifacts/creating-an-api/) to receive a FHIR patient payload.

    3. Add fhirbase connector to the project.
    ![FHIRBase connector](../../../assets/img/guildes/handling-fhir/fhir-base-connector.png)

    4. Implement the logic to validate the FHIR resource. The `validate` operation can be used to validate a FHIR resource from a JSON payload. This operation will trigger fault sequence if the validation fails with the error message details. You can use the properties mentioned [here](https://mi.docs.wso2.com/en/4.2.0/learn/examples/sequence-examples/using-fault-sequences/#using-fault-sequences) to evaluate the validation result.

        ![Completed flow](../../../assets/img/guildes/handling-fhir/fhir-validation-flow-mi.png)
        
        ```xml
        <?xml version="1.0" encoding="UTF-8"?>
        <api context="/r4" name="PatientAPI" xmlns="http://ws.apache.org/ns/synapse">
            <resource methods="POST" uri-template="/Patient">
                <inSequence>
                    <log level="full"/>
                    <fhirbase.validate />
                </inSequence>
                <faultSequence>
                </faultSequence>
            </resource>
        </api>
        ```    

    ## Step 3: Deploy and Test the Integration Project
    
    Deploy the integration project to the MI runtime by following the guide on [Deploying the Integration Project](https://mi.docs.wso2.com/en/latest/develop/deploy-artifacts/) and test the API using a REST client.

    Use the following payload to test the API:

    ```json
    {
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
    }
    ```        