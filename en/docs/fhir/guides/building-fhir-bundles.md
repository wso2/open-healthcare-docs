# Building FHIR Bundles

FHIR Bundles are used to bundle multiple resources into a single request. This guide explains how to build FHIR Bundles in WSO2 Healthcare solution. The WSO2 Healthcare solution provides a set of built-in capabilities to construct FHIR Bundles.

{!includes/bal-mi-note.md!}

=== "Ballerina"

    The following example demonstrates how to build a FHIR Bundle using Ballerina.

    ## Step 1: Set Up Ballerina

    Before you begin, ensure you have <a href="https://ballerina.io/downloads/installation-options/" target="_blank">Ballerina</a> installed on your system. Follow the instructions in the [Installation Steps](../../install-and-setup/manual.md#ballerina-installation-steps)  to install Ballerina and set up the development environment.

    ## Step 2: Implement the logic to build the FHIR Bundle

    1. Create a Ballerina project using the following command. It will create the Ballerina project and the main.bal file can be used to implement the logic.
    
        ```bash
        $ bal new fhir_bundle_sample
        ```
    2. Import the required modules to the Ballerina program. In this sample, we are using the FHIR R4 module to build the FHIR Bundle. Therefore, we need to import the `ballerinax/health.fhir.r4` package.
    
        ```ballerina
        import ballerinax/health.fhir.r4.international401;
        import ballerinax/health.fhir.r4;
        import ballerina/io;
        ```    
    3. Implement the logic to initialize FHIR bundle and add FHIR resources to the bundle. In this sample, we are building a FHIR Bundle with a Patient and Observation resources.
    
        ```ballerina
        import ballerinax/health.fhir.r4.international401;
        import ballerinax/health.fhir.r4;
        import ballerina/io;

        public function main2() returns error? {
            // Initialize a bundle with desired type
            r4:Bundle bundle = { resourceType: "Bundle", 'type: "searchset"};
            r4:BundleEntry[] entries = []; 
            // Sample patient data
            international401:Patient patient = { resourceType: "Patient", id: "pat1", active: true };
            entries.push({ 'resource: patient });
            // Sample observation data
            international401:Observation observation = { resourceType: "Observation", id: "obx1", status: "final" ,code: { coding: [{ system: "http://loinc.org", code: "8480-6", display: "Systolic blood pressure"}]}};
            entries.push({ 'resource: observation });
            // Add the entries to the bundle
            bundle.entry = entries;
            io:println(bundle.toString());
        }            
        ```
    ## Step 3: Run the Ballerina Program

    Run the Ballerina program using the following command:

        ```bash
        $ bal run
        ```        

=== "Micro Integrator" 

    The following example demonstrates how to build a FHIR Bundle using the WSO2 Micro Integrator.

    ## Step 1: Set Up WSO2 Micro Integrator

    Before you begin, download the [WSO2 Micro Integrator](https://wso2.com/integration/micro-integrator/) and install by following the [Installation Steps](../../install-and-setup/manual.md#ballerina-installation-steps).

    ## Step 2: Implement the logic to build the FHIR Bundle

    1. Create a MI project using the MI VSCode plugin by following the guide on [Creating a New Integration Project](https://mi.docs.wso2.com/en/latest/develop/create-integration-project/). 

    2. Create a [REST API](https://mi.docs.wso2.com/en/latest/develop/creating-artifacts/creating-an-api/).

    3. Add fhirbase connector to the project.
    ![FHIRBase connector](../../../assets/img/guildes/handling-fhir/fhir-base-connector.png)

    4. Implement the logic to build the FHIR Bundle. The `createBundle` operation can be used to create a FHIR Bundle  and `addBundleEntry` operation can be used to add FHIR resources to the Bundle. 

        ![Completed flow](../../../assets/img/guildes/handling-fhir/fhir-bundle-flow-mi.png)

        ```xml
        <?xml version="1.0" encoding="UTF-8"?>
        <api context="/r4" name="PatientAPI" xmlns="http://ws.apache.org/ns/synapse">
            <resource methods="GET" uri-template="/Patient">
                <inSequence>
                    <fhirbase.createBundle>
                        <type>searchset</type>
                    </fhirbase.createBundle>
                    <payloadFactory media-type="json" template-type="default">
                        <format>{ resourceType: "Patient", id: "pat1", active:
                            true }</format>
                        <args>
                        </args>
                    </payloadFactory>
                    <fhirbase.parse />
                    <!-- Add the parsed resource to the bundle -->
                    <fhirbase.addBundleEntry />
                    <!-- Serialize the bundle -->
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