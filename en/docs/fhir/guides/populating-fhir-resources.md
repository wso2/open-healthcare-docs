# Populating FHIR resources

In a FHIR facade implementation, populating FHIR resources is a critical step that involves mapping and transforming data from existing healthcare systems into standardized FHIR resources. This process ensures that the data is consistent, accurate, and accessible in a FHIR-compliant format, allowing for seamless interoperability between different healthcare applications.

{!includes/bal-mi-note.md!}

=== "Ballerina"

    Populating a FHIR resource in Ballerina is as straightforward as creating a simple record object. Developers need only import the appropriate FHIR package from Ballerina Central and then create a FHIR resource record as demonstrated below.
    ## Step 1: Set Up Ballerina

    Before you begin, ensure you have <a href="https://ballerina.io/downloads/installation-options/" target="_blank">Ballerina</a> installed on your system. Follow the instructions in the [Installation Steps](../../install-and-setup/manual.md#ballerina-installation-steps)  to install Ballerina and set up the development environment.

    ## Step 2: Implement the flow to populate a FHIR resource

    1. Create ballerina project using the following command. It will create the ballerina project and the main.bal file can be used to implement the logic.
    
        ```bash
        $ bal new fhir_resource_populate_sample
        ```
    2. Import the required modules to the Ballerina program. In this sample we are using FHIR Patient resource from international base FHIR IG . Therefore, we need to import `ballerinax/health.fhir.r4.internationa401` package. If you are using a different IG of FHIR, you can import the relevant package from the [central](https://central.ballerina.io/search?q=fhir&page=1&m=packages) or generated from the bal [health tool](https://ballerina.io/learn/health-tool/#package-generation).
    
        ```ballerina
        import ballerinax/health.fhir.r4.internationa401;
        import ballerina/io;
        ```    
    3. Create a custom patient record type to represent the patient data. In this sample, the patient record contains the patient's first name, last name, address, and phone number.

        ```ballerina
        // A custom patient record.
        type Patient record {
            string firstName;
            string lastName;
            string address;
            string phoneNumber;
        };
        ```
    4. Define a data mapping function to convert the patient record to a FHIR Patient resource. The function takes the custom patient record as input and returns an FHIR Patient resource. You can use the visual data mapper in ballerina to map the patient record fields to the FHIR Patient resource fields. You can follow the documentation on <a href="https://ballerina.io/learn/vs-code-extension/implement-the-code/data-mapper/#open-the-data-mapper" target="_blank">Visual Data Mapping</a> to learn more about visual data mapping in Ballerina.

        ```ballerina
        // Data mapping function to convert a patient record to an FHIR Patient resource.
        function patientToFHIR(Patient patient) returns international401:Patient => {
            meta: {
                lastUpdated: time:utcToString(time:utcNow()),
                profile: [international401:PROFILE_BASE_PATIENT]
            },
            active: true,
            name: [
                {
                    family: patient.lastName,
                    given: [patient.firstName],
                    use: international401:CODE_MODE_OFFICIAL,
                    prefix: ["Mr"]
                }
            ],
            address: [
                {
                    line: [patient.address],
                    city: "New York",
                    country: "United States",
                    postalCode: "10022"
                }
            ],
            telecom: [
                {
                    value: patient.phoneNumber,
                    use: "mobile"
                }
            ]
        };
        ``` 
        ![Ballerina visual data mapping](../../../assets/img/guildes/handling-fhir/fhir-data-mapping-bal.png)

    5. Serialize the FHIR resource to a string using the `toString()` function.

        The complete code sample will look as follows:

        ```ballerina
        import ballerina/io;
        import ballerina/time;
        import ballerinax/health.fhir.r4.international401;

        // A custom patient record.
        type Patient record {
            string firstName;
            string lastName;
            string address;
            string phoneNumber;
        };

        public function main() returns error? {
            // Sample patient data
            Patient patient = {firstName: "John", lastName: "Doe", address: "123 Main St", phoneNumber: "555-555-5555"};
            international401:Patient patientResource = patientToFHIR(patient);
            io:println(patientResource.toString());
        }

        // Data mapping function to convert a patient record to an FHIR Patient resource.
        function patientToFHIR(Patient patient) returns international401:Patient => {
            meta: {
                lastUpdated: time:utcToString(time:utcNow()),
                profile: [international401:PROFILE_BASE_PATIENT]
            },
            active: true,
            name: [
                {
                    family: patient.lastName,
                    given: [patient.firstName],
                    use: international401:CODE_MODE_OFFICIAL,
                    prefix: ["Mr"]
                }
            ],
            address: [
                {
                    line: [patient.address],
                    city: "New York",
                    country: "United States",
                    postalCode: "10022"
                }
            ],
            telecom: [
                {
                    value: patient.phoneNumber,
                    use: "mobile"
                }
            ]
        };
        ```

    ## Step 3: Run the Ballerina Program

    Run the Ballerina program using the following command:

        ```bash
        $ bal run
        ```

    In Ballerina, you can access built-in records [link to central] that support FHIR. These predefined records allow you to easily populate FHIR resources. With cardinality constraints and data validation rules embedded in the record definitions, the IDE provides guidance to ensure the complete and accurate population of FHIR resources. Additionally, records are available for commonly used implementation guides, incorporating specific extensions and constraints relevant to those areas.


=== "Micro Integrator"

    For integrations running on WSO2 Micro Integrator (MI), FHIR resources can be created using the DataMapper feature available in the VSCode Micro Integrator extension. This feature allows you to map fields from the source schema to the target FHIR schema effortlessly. Schemas can be loaded into the extension by referencing sample JSON files provided [here](../../assets/schemas/fhir) that correspond to each schema of FHIR resources.

    The following example demonstrates how to populate HL7 FHIR resources using the WSO2 Micro Integrator.

    ## Step 1: Set Up WSO2 Micro Integrator

    Before you begin, download the [WSO2 Micro Integrator](https://wso2.com/integration/micro-integrator/) and install by following the [Installation Steps](../../install-and-setup/manual.md#ballerina-installation-steps).

    ## Step 2: Implement the flow to populate a FHIR resource

    1. Create a MI project using the MI VSCode plugin by following the guide on [Creating a New Integration Project](https://mi.docs.wso2.com/en/latest/develop/create-integration-project/).

    2. Create a [REST API](https://mi.docs.wso2.com/en/latest/develop/creating-artifacts/creating-an-api/) to receive a custom patient data and populate a FHIR Patient resource.

        ```xml
        <?xml version="1.0" encoding="UTF-8"?>
        <api context="/patient" name="PatientAPI" xmlns="http://ws.apache.org/ns/synapse">
            <resource methods="POST" uri-template="/v1">
                <inSequence>
                    <property name="OriginalPayload" scope="default" type="STRING"
                        expression="json-eval($.)" />
                    <log category="INFO" level="full">
                        <property name="originalPayload" expression="$ctx:OriginalPayload" />
                    </log>
                </inSequence>
                <faultSequence>
                </faultSequence>
            </resource>
        </api>
        ```
    3. Use [DataMapper](https://mi.docs.wso2.com/en/latest/develop/data-mapper/) mediator to map the custom patient data to a FHIR Patient resource. Use the JSON schemas provided <a href="../../../assets/schemas/fhir/patient.json" download="patient.json">here</a> to load the FHIR Patient schema as the output into the DataMapper.

        ![DataMapper](../../../assets/img/guildes/handling-fhir/fhir-data-mapping-mi.png)

    4. Log the output of the DataMapper to view the populated FHIR Patient resource and use respond mediator to send the response to the client. Following is the complete API configuration:

        ![Completed flow](../../../assets/img/guildes/handling-fhir/fhir-populating-flow-mi.png)
        
        ```xml
        <?xml version="1.0" encoding="UTF-8"?>
        <api context="/patient" name="PatientAPI" xmlns="http://ws.apache.org/ns/synapse">
            <resource methods="POST" uri-template="/v1">
                <inSequence>
                    <property name="OriginalPayload" scope="default" type="STRING"
                        expression="json-eval($.)" />
                    <datamapper config="gov:/datamapper/PatientMapper/PatientMapper.dmc"
                        inputSchema="gov:/datamapper/PatientMapper/PatientMapper_inputSchema.json"
                        inputType="JSON"
                        outputSchema="gov:/datamapper/PatientMapper/PatientMapper_outputSchema.json"
                        outputType="JSON" />
                    <log category="INFO" level="full">
                        <property name="originalPayload" expression="$ctx:OriginalPayload" />
                    </log>    
                    <respond/>
                </inSequence>
                <faultSequence>
                </faultSequence>
            </resource>
        </api>
        ```

    ## Step 3: Deploy and Test the Integration Project

    Deploy the integration project to the MI runtime by following the guide on [Deploying the Integration Project](https://mi.docs.wso2.com/en/latest/develop/deploy-artifacts/) and test the API using a REST client.    

    !!! note        

        The populated FHIR resource can be accessed and modified within the message flow, and further FHIR-related actions, such as adding the resource to a FHIR bundle or serializing it into FHIR-specified wire formats like `fhir+json` or `fhir+xml`, can be accomplished using the [FHIR Base](https://store.wso2.com/connector/mediation-fhirbase-module) module available in the WSO2 Connector Store.

