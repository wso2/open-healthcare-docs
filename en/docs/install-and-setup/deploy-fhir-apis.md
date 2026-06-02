---
sidebar_position: 6
title: "Deploy FHIR APIs"
description: This guide provides step-by-step instructions to deploy FHIR APIs in WSO2 API Manager, enabling healthcare organizations to securely expose and manage their FHIR-based services.
---

# Deploy FHIR APIs

This guide walks through the steps to generate an OpenAPI specification from a FHIR Implementation Guide using the Ballerina Health Tool, and then deploy it as a managed API in WSO2 API Manager using the FHIR Repository as the backend.

## Prerequisites

1. Install and setup [WSO2 Open Healthcare](./manual.md).
2. Install [Ballerina](./manual.md#ballerina-installation-steps) (Swan Lake or later).
3. A FHIR Implementation Guide (IG) to generate the API.

## Step 1 - Generate OpenAPI Specification from a FHIR Implementation Guide

The [Ballerina Health Tool](https://ballerina.io/learn/health-tool/#fhir-template-generation) can generate an OpenAPI specification and a Ballerina project template directly from a FHIR Implementation Guide.

1. Pull the Ballerina Health Tool:

    ```bash
    bal tool pull health
    ```

2. Run the FHIR template generation command, pointing to your Implementation Guide package:

    ```bash
    bal health gen fhir -m template --org-name [ORG_NAME] [IG_PACKAGE_NAME]
    ```

    Replace the placeholders with:
    - `[ORG_NAME]`: Your Ballerina organization name (e.g., `healthcare`)
    - `[IG_PACKAGE_NAME]`: The Ballerina package name of the FHIR IG (e.g., `ballerinax/health.fhir.r4.uscore501`)

    Example:

    ```bash
    bal health gen fhir -m template --org-name healthcare ballerinax/health.fhir.r4.uscore501
    ```

3. The tool generates a Ballerina project with:
    - An OpenAPI specification (OAS) file for each FHIR resource in the IG.
    - A Ballerina service template with boilerplate FHIR resource handlers.

4. Locate the generated OAS file(s) in the output directory. These will be used to create the API in WSO2 API Manager.

:::tip
For standard FHIR R4 APIs without a custom IG, you can skip this step and directly download a pre-built OAS file from the [FHIR API Definitions](./fhir-artifacts) page.
:::

## Step 2 - Create and Deploy the API in WSO2 API Manager

1. Log in to the WSO2 APIM Publisher Portal at `https://localhost:9443/publisher`.

    ![WSO2 Publisher Portal](../assets/img/guildes/exposing-an-api/oh-publisher-portal.png)

2. Click **Create API** and select **Import Open API**.

3. Upload the OAS file generated in Step 1 and click **Next**.

4. Fill in the API details:
    - **Name**: e.g., `USCorePatientAPI`
    - **Context**: e.g., `/fhir/r4`
    - **Version**: e.g., `1.0.0`
    - **Endpoint URL**: The URL of the running Ballerina FHIR service (e.g., `http://localhost:9090/r4`)

5. Click **Create** to create the API.

6. In the API overview, go to **Deployments** and click **Deploy**:
    - Select the target **Gateway** (e.g., Default).
    - Click **Deploy**.

7. Go to **Lifecycle** and click **Publish** to make the API available in the Developer Portal.

:::note
Ensure the WSO2 APIM gateway can reach the Ballerina FHIR service endpoint. If running locally, use `host.docker.internal` instead of `localhost` when APIM runs in Docker.
:::

## Step 3 - Verify the Deployment

1. Navigate to the Developer Portal at `https://localhost:9443/devportal`.

    ![WSO2 Developer Portal](../assets/img/guildes/exposing-an-api/oh-developer-portal.png)

2. Find the published FHIR API and confirm it appears in the portal.
3. Invoke the well-known endpoint to verify the FHIR gateway is responding:

    ```bash
    curl https://localhost:8243/r4/.well-known/smart-configuration
    ```

4. Test a FHIR resource endpoint:

    ```bash
    curl https://localhost:8243/r4/metadata
    ```

    A valid FHIR CapabilityStatement response confirms the API is deployed and the FHIR backend is reachable.

## See Also

- [Manual Installation Guide](./manual.md)
- [Expose FHIR APIs](../fhir/guides/expose-fhir-apis.md)
- [SMART on FHIR — Deploy On Premise](../secure-health-apis/guides/configure-smart-on-fhir.md)
- [Ballerina Health Tool](https://ballerina.io/learn/health-tool/#fhir-template-generation)
