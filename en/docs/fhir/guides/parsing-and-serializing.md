# Parsing and Serializing

For any FHIR server implementation, parsing and serializing are fundamental processes that enable seamless interaction with FHIR resources. Parsing involves converting incoming data, often in various formats, into structured FHIR resources that can be easily managed and processed within the integration flow.

{!includes/bal-mi-note.md!}

=== "Ballerina"

    Since Ballerina is designed specifically to address integration use cases, records defined in Ballerina can be easily converted to JSON wire format, with similar support for XML. This makes the parsing and serialization of FHIR resources straightforward and efficient. 

    ## Step 1: Set Up Ballerina

    Before you begin, ensure you have <a href="https://ballerina.io/downloads/installation-options/" target="_blank">Ballerina</a> installed on your system. Follow the instructions in the [Installation Steps](../../install-and-setup/manual.md#ballerina-installation-steps)  to install Ballerina and set up the development environment.

    ## Step 2: Implement the flow to parse a FHIR resource

    1. Create a new Ballerina project using the following command. It will create the Ballerina project and the `main.bal` file can be used to implement the logic.

        ```bash
        $ bal new fhir_parsing_sample
        ```
    2. Import the required modules to the Ballerina program. In this sample we are using FHIR Patient resource from international base FHIR IG . Therefore, we need to import `ballerinax/health.fhir.r4.internationa401` package. If you are using a different IG of FHIR, you can import the relevant package from the [central](https://central.ballerina.io/search?q=fhir&page=1&m=packages) or generated from the bal [health tool](https://ballerina.io/learn/health-tool/#package-generation).
    
        ```ballerina
        import ballerina/io;
        import ballerinax/health.fhir.r4;
        import ballerinax/health.fhir.r4.international401;
        import ballerinax/health.fhir.r4.parser;
        ```   
    3. Implement the logic to parse the FHIR resource. In this sample, we are parsing a sample FHIR json to FHIR Patient resource. 

        ```ballerina
        public function main() returns error? {
            // The following example is a simple serialized Patient resource to parse
            json input = {
                "resourceType": "Patient",
                "name": [
                    {
                        "family": "Simpson"
                    }
                ]
            };

            // Parse it - you can pass the input (as a string or a json) and the
            // type of the resource you want to parse.
            international401:Patient patient = check parser:parse(input).ensureType();

            // Access the parsed data
            r4:HumanName[]? names = patient.name;
            if names is () || names.length() == 0 {
                return error("Failed to parse the names");
            }
            io:println("Family Name: ", names[0]);
        }
        ```  
        Completed sample will look like below. 

        ```ballerina
        import ballerina/io;
        import ballerinax/health.fhir.r4 as fhir;
        import ballerinax/health.fhir.r4.international401;
        import ballerinax/health.fhir.r4.parser as fhirParser;

        public function main() returns error? {
            // The following example is a simple serialized Patient resource to parse
            json input = {
                "resourceType": "Patient",
                "name": [
                    {
                        "family": "Simpson"
                    }
                ]
            };

            // Parse it - you can pass the input (as a string or a json) and the
            // type of the resource you want to parse.
            international401:Patient patient = check fhirParser:parse(input).ensureType();

            // Access the parsed data
            fhir:HumanName[]? names = patient.name;
            if names is () || names.length() == 0 {
                return error("Failed to parse the names");
            }
            io:println("Family Name: ", names[0]);
        }
        ```
    ## Step 3: Run the Ballerina Program

    Run the Ballerina program using the following command:

        ```bash
        $ bal run
        ```


    ???+ note
        To achieve full FHIR server capabilities, you can leverage the Ballerina **FHIR R4 service**, which provides a comprehensive suite of features including *header validation*, *search parameter resolution*, and various other essential FHIR server functionalities. This service simplifies the implementation of a complete FHIR server, ensuring that all necessary components are in place to handle FHIR requests efficiently and in compliance with the standard.

=== "Micro Integrator"

    Parsing incoming requests into FHIR resources can be achieved using the FHIR Base module in WSO2 MI. This module provides a set of operations to handle FHIR payloads. The `parse` operation can be used to parse a FHIR resource from a JSON payload.

    The following example demonstrates how to parse HL7 FHIR resources and serializing using the WSO2 Micro Integrator.

    ## Step 1: Set Up WSO2 Micro Integrator

    Before you begin, download the [WSO2 Micro Integrator](https://wso2.com/integration/micro-integrator/) and install by following the [Installation Steps](../../install-and-setup/manual.md#ballerina-installation-steps).

    ## Step 2: Implement the flow to parse a FHIR resource

    1. Create a MI project using the MI VSCode plugin by following the guide on [Creating a New Integration Project](https://mi.docs.wso2.com/en/latest/develop/create-integration-project/). 

    2. Create a [REST API](https://mi.docs.wso2.com/en/latest/develop/creating-artifacts/creating-an-api/) to receive a FHIR patient payload.   

        ```xml
        <?xml version="1.0" encoding="UTF-8"?>
        <api context="/r4" name="PatientAPI" xmlns="http://ws.apache.org/ns/synapse">
            <resource methods="POST" uri-template="/Patient">
                <inSequence>
                    <log level="full"/>
                </inSequence>
                <faultSequence>
                </faultSequence>
            </resource>
        </api>
        ```
    3. Add fhirbase connector to the project.
    ![FHIRBase connector](../../../assets/img/guildes/handling-fhir/fhir-base-connector.png)

    4. Implement the logic to parse the FHIR resource. The `parse` operation can be used to parse a FHIR resource from a JSON payload.  

        ```xml
        <?xml version="1.0" encoding="UTF-8"?>
        <api context="/r4" name="PatientAPI" xmlns="http://ws.apache.org/ns/synapse">
            <resource methods="POST" uri-template="/Patient">
                <inSequence>
                    <log level="full"/>
                    <fhirbase.parse />
                </inSequence>
                <faultSequence>
                </faultSequence>
            </resource>
        </api>
        ```
    5. Additional logic to modify the parsed FHIR resource can be added to the sequence. In this example, additional identifier is added using the createIdentifier operation to the parsed FHIR resource. Then the resource is serialized back to JSON using the `serialize` operation.

        ![Completed flow](../../../assets/img/guildes/handling-fhir/fhir-parsing-flow-mi.png)
        
        ```xml
        <?xml version="1.0" encoding="UTF-8"?>
        <api context="/r4" name="PatientAPI" xmlns="http://ws.apache.org/ns/synapse">
            <resource methods="POST" uri-template="/Patient">
                <inSequence>
                    <log level="full"/>
                    <fhirbase.parse />
                    <fhirbase.createIdentifier>
                        <value>patient123</value>
                        <FHIRPath>Patient.identifier</FHIRPath>
                    </fhirbase.createIdentifier>
                    <fhirbase.serialize />
                    <respond/>
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
        "name": [
            {
                "family": "Simpson"
            }
        ]
    }
    ```

