# Profiles and Extensions

FHIR profiles and extensions are one of the key components in a FHIR server implementation, allowing for the customization and refinement of standard FHIR resources to meet specific use cases and regulatory requirements. FHIR profiles enable organizations to define constraints and extensions on standard resources, ensuring that data conforms to particular business or clinical needs. 
<br>Extensions provide the flexibility to add new elements or modify existing ones without deviating from the core FHIR specification. Together, profiles and extensions facilitate the creation of a robust, adaptable FHIR server that can accommodate a wide range of healthcare scenarios while maintaining interoperability with other systems.

{!includes/bal-mi-note.md!}

=== "Ballerina"

    Ballerina FHIR packages are designed to effectively handle FHIR profiles and extensions. By leveraging the language  features, developers can define profiled FHIR resources with precision, ensuring that custom constraints and extensions are accurately represented. 

    ## Step 1: Set Up Ballerina

    Before you begin, ensure you have <a href="https://ballerina.io/downloads/installation-options/" target="_blank">Ballerina</a> installed on your system. Follow the instructions in the [Installation Steps](../../install-and-setup/manual.md#ballerina-installation-steps)  to install Ballerina and set up the development environment.

    ## Step 2: Implement the flow to populate a FHIR resource with an extension.

    1. Create a new Ballerina project using the following command. It will create the Ballerina project and the `main.bal` file can be used to implement the logic.

        ```bash
        $ bal new fhir_profile_extension_sample
        ```

    2. Import the required modules to the Ballerina program. In this sample, we are using the package for US Core FHIR IG and base FHIR package. Therefore, we need to import the `ballerinax/health.fhir.r4.uscore501` and `ballerinax/health.fhir.r4` packages.

        ```ballerina
        import ballerina/io;
        import ballerinax/health.fhir.r4;
        import ballerinax/health.fhir.r4.uscore501;
        ```
    3. Implement the logic to populate a FHIR resource with a profile and extension. In this sample, we are populating a US core FHIR Patient resource with known US core extension and a custom extension.

        ``` ballerina
        import ballerina/io;
        import ballerinax/health.fhir.r4;
        import ballerinax/health.fhir.r4.uscore501;

        public function main() returns error? {
            uscore501:USCorePatientProfile patient = {
                resourceType: "Patient",
                id: "pat1",
                active: true,
                identifier: [],
                gender: "male",
                name: []
            };
            uscore501:UsCoreBirthsex birthsex = {
                valueCode: "M",
                url: "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex"
            };
            // Initialize the extension array with the birthsex extension
            patient.extension = [birthsex];
            // Add a custom defined extension to the patient. You can use the dedicated extension type for your requirements
            // (i.e: StringExtension, BooleanExtension). 
            r4:StringExtension customSSNExt = {
                url: "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ssn",
                valueString: "111-222-1221"
            };
            (<r4:Extension[]>patient.extension).push(customSSNExt);
            io:println(patient);
        }
        ```
    ## Step 3: Run the Ballerina Program

    Run the Ballerina program using the following command:

        ```bash
        $ bal run
        ```

    !!! info
        The Ballerina CLI is designed to accommodate domain-specific tools, one of which is the Ballerina [Health tool](https://ballerina.io/learn/health-tool/). This specialized tool enables the generation of a Ballerina FHIR package, which includes Ballerina record representations of FHIR resources and project templates tailored for any custom set of FHIR structure definitions. These definitions can encompass FHIR profiles, extended FHIR resources, and more. The generated Ballerina FHIR packages can be pushed to Ballrina Central and then imported into your Ballerina project, providing access to the FHIR resources and extensions defined in the package.

=== "Micro Integrator"

    FHIR Extensions and profiles are supported out-of-the-box in Micro integrator. Adding extensions into FHIR resources can be achieved using the FHIR Base module. This module provides a set of operations to handle FHIR payloads. The `createExtension` operation can be used to add an extension to a FHIR resource created in the integration flow.

    The following example demonstrates how to populate HL7 FHIR resources using the WSO2 Micro Integrator.

    ## Step 1: Set Up WSO2 Micro Integrator

    Before you begin, download the [WSO2 Micro Integrator](https://wso2.com/integration/micro-integrator/) and install by following the [Installation Steps](../../install-and-setup/manual.md#ballerina-installation-steps).

    ## Step 2: Implement the flow to add an extension to a FHIR resource

    1. Create a MI project using the MI VSCode plugin by following the guide on [Creating a New Integration Project](https://mi.docs.wso2.com/en/latest/develop/create-integration-project/).

    2. Create a [REST API](https://mi.docs.wso2.com/en/latest/develop/creating-artifacts/creating-an-api/).

            ```xml
        <?xml version="1.0" encoding="UTF-8"?>
        <api context="/r4" name="PatientAPI" xmlns="http://ws.apache.org/ns/synapse">
            <resource methods="GET" uri-template="/Patient">
                <inSequence>
                </inSequence>
                <faultSequence>
                </faultSequence>
            </resource>
        </api>
        ```
    3. Add fhirbase connector to the project. 
    ![FHIRBase connector](../../../assets/img/guildes/handling-fhir/fhir-base-connector.png)

    4. Implement the logic to add an extension to a FHIR resource. The `createExtension` operation can be used to add an extension to a FHIR resource. 

        ![Create Extension](../../../assets/img/guildes/handling-fhir/fhir-create-extension-op-mi.png)

        ```xml
        <?xml version="1.0" encoding="UTF-8"?>
        <api context="/r4" name="PatientAPI" xmlns="http://ws.apache.org/ns/synapse">
            <resource methods="GET" uri-template="/Patient">
                <inSequence>
                    <!-- Create a sample Patient resource payload-->
                    <payloadFactory media-type="json" template-type="default">
                        <format>{ resourceType: "Patient", id: "pat1", active: true }</format>
                        <args>
                        </args>
                    </payloadFactory>
                    <!-- Parse the payload to a FHIR resource -->
                    <fhirbase.parse />
                    <!-- Add an extension to the FHIR resource -->
                    <fhirbase.createExtension>
                        <url>http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex</url>
                        <!-- Value[x] for the extension -->
                        <valueCode>M</valueCode>
                        <!-- FHIRPath to add the extension. This will attach to the Patient FHIR resource created -->
                        <FHIRPath>Patient.extension</FHIRPath>
                    </fhirbase.createExtension>
                    <fhirbase.createExtension>
                        <url>http://hl7.org/fhir/us/core/StructureDefinition/us-core-ssn</url>
                        <valueString>111-222-1221</valueString>
                        <FHIRPath>Patient.extension</FHIRPath>
                    </fhirbase.createExtension>
                    <fhirbase.serialize />
                    <respond />
                </inSequence>
                <faultSequence>
                </faultSequence>
            </resource>
        </api>
        ```   
    ## Step 3: Deploy and Test the Integration Project
    
    Deploy the integration project to the MI runtime by following the guide on [Deploying the Integration Project](https://mi.docs.wso2.com/en/latest/develop/deploy-artifacts/) and test the API using a REST client.

    You will see the FHIR resource with the added extensions in the response payload when you invoke the API.

    ```json
    {
        "resourceType": "Patient",
        "id": "pat1",
        "extension": [
            {
                "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex",
                "valueCode": "M"
            },
            {
                "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ssn",
                "valueString": "111-222-1221"
            }
        ],
        "active": true
    }
    ```