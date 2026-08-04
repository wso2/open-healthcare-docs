---
title: "Building FHIR Bundles"
---

# Building FHIR Bundles

FHIR Bundles are used to bundle multiple resources into a single request. This guide explains how to build FHIR Bundles in WSO2 Open Healthcare. The WSO2 Open Healthcare provides a set of built-in capabilities to construct FHIR Bundles.

The following example demonstrates how to build a FHIR Bundle using Ballerina.

## Step 1: Create the integration

1. Open WSO2 Integrator.
2. Select **Create** in the **Create New Integration** card.
3. Set **Integration Name** to `FHIRBundleSample`.
4. Set **Project Name** to `fhir-bundle-sample`.
5. Select **Create Integration**.
6. Select **Add Artifact** and select **Automation**.

    ![Add Artifact](/assets/img/common/add-artifact.png)

## Step 2: Implement the logic to build the FHIR Bundle

1. Import the required modules to the Ballerina program. In this sample, we are using the FHIR R4 module to build the FHIR Bundle. Therefore, we need to import the `ballerinax/health.fhir.r4` package.

    ```ballerina
    import ballerinax/health.fhir.r4.international401;
    import ballerinax/health.fhir.r4;
    import ballerina/io;
    ```
2. Implement the logic to initialize FHIR bundle and add FHIR resources to the bundle. In this sample, we are building a FHIR Bundle with a Patient and Observation resources.

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
## Step 3: Run and test

1. Select **Run**.

    ![Run integration](/assets/img/common/run-ballerina-program.png)

2. Check the terminal output to confirm the expected result.
