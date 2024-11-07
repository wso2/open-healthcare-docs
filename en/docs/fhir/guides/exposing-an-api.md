## Overview

WSO2 Healthcare Solution is a platform designed with API-driven interoperability, seamless and secure health data exchange capabilities.

API gateway created with Industry standards, provide readily available API Management capabilities inclusive of a broad spectrum of features that can be leveraged to spin up a fully functional FHIR server in a short period of time.

With WSO2 Healthcare Solution you can easily,

- Develop a fully standardized FHIR server with pre-built FHIR API definitions.
    - 100+ OAS definition files are available in WSO2 FHIR API Hub.
    - Readily available across different Implementation guides.
    - Rapid development tools to support any Implementation.
- Expose existing FHIR APIs in a dedicated API marketplace (Developer Portal).
- Build a custom integration flows to transform legacy data formats into FHIR resources, and expose them as FHIR APIs.
- Allow third-party developers to consume FHIR APIs through the Developer Portal.
- Using APIM as the API management layer to manage the FHIR API and to expose it to consumers.

WSO2 Healthcare Solution consists of an API Management component that has been developed using WSO2 API Manager as the base product and installing Healthcare related modules using the Healthcare APIM accelerator distribution.

This section discusses the basic steps and the key concepts of FHIR APIs in the WSO2 Healthcare Solution.

## Prerequisites

- Install and configure WSO2 Healthcare Solution. (Refer: Quick start guide (QSG))
- Deployed Integration APIs. (Refer: Setting up Integration)
    - Note: This has to be an active endpoint which responds to a FHIR payload. Not necessary to be deployed with WSO2 Healthcare Solution.

## Expose the integration as a FHIR API

WSO2 Healthcare Solution allows you to expose an existing FHIR integration service as a managed FHIR REST API.

If you have already built your FHIR integration service, you can follow the steps given below to expose it as a managed API in a standard FHIR server.

1. Download the relevant API definition(OAS) from the WSO2 FHIR API Hub.
   
    <img src="../../../assets/img/guildes/exposing-an-api/download-api.png" width="700">
    <img src="../../../assets/img/guildes/exposing-an-api/oh-publisher-portal.png" width="700">

1. Log in to WSO2 OH publisher portal and select [REST API](https://apim.docs.wso2.com/en/latest/design/create-api/create-rest-api/create-a-rest-api-from-an-openapi-definition/](https://apim.docs.wso2.com/en/latest/design/create-api/create-rest-api/create-a-rest-api-from-an-openapi-definition/))
2. Create an API by clicking **Import Open API** and uploading the OAS file (both JSON and YAML formats are supported.)
3. Verify the basic information and enter the endpoint URL for the existing FHIR Integration API.
4. Click the **Create** button and configure the API.
    1. Select business plan so that API subscribers can subscribe.
    2. Configure a target gateway and [deploy an API](https://apim.docs.wso2.com/en/latest/deploy-and-publish/deploy-on-gateway/deploy-api/deploy-an-api/])
    3. Publish the API so that App developers can subscribe and consume the API from the Developer Portal.

## Explore the FHIR API

1. Sign in to Healthcare Developer Portal.
   <img src="../../../assets/img/guildes/exposing-an-api/oh-developer-portal.png" width="700">



1. Navigate to Applications tab and to create an application, click on **Add New Application** button
    1. An application is a logical representation of a physical application such as a mobile app, web app, device, etc. An API subscription is created, authenticated, and managed through an application. Find out more about applications by clicking [here](https://apim.docs.wso2.com/en/4.1.0/consume/manage-application/create-application]).
       
        <img src="../../../assets/img/guildes/exposing-an-api/add-new-application.png" width="700">

1. Subscribe to the respective API/s by clicking the **Subscriptions** Menu
   <img src="../../../assets/img/guildes/exposing-an-api/subscription.png" width="700">

1. Generate application keys by navigating to the **Production Keys** menu
   <img src="../../../assets/img/guildes/exposing-an-api/product-key.png" width="700">

1. Click on the **Tryout** menu and add the generated token to Invoke the API
   <img src="../../../assets/img/guildes/exposing-an-api/tryout.png" width="700">
    
    <img src="../../../assets/img/guildes/exposing-an-api/get.png" width="700"><br>
Refer [RESTful FHIR](https://docs.google.com/document/d/1aX9FBCzs36Z3rBe1ImhG83J2w1PjwFviAf1dIdE9zTs/edit#heading=h.o3o4782vln88) documentation for more details.