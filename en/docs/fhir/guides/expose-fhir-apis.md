# Expose FHIR APIs

## Overview

WSO2 Open Healthcare is a platform designed with API-driven interoperability, seamless and secure health data exchange capabilities.

Industry standard API gateway with readily available API Management capabilities provides a vast set of features that can be leveraged to spin up a fully functioning FHIR server in a short period of time.

With WSO2 Open Healthcare, you can easily,

- Develop a fully standardized FHIR server with pre-built FHIR API definitions.
    - 100+ OAS definition files are available in WSO2 FHIR API Hub.
    - Readily available across different Implementation Guides.
    - Rapid development tools to support any Implementation guide.
- Expose existing FHIR APIs in a dedicated API marketplace (aka Developer Portal).
- Build custom integration flows to transform legacy data formats into FHIR resources and expose them as FHIR APIs.
- Allow 3rd party developers to consume FHIR APIs through the Developer Portal.

WSO2 Open Healthcare solution consists of an API Management component which has been developed using WSO2 API Manager as the base product and installing Healthcare related modules via the Open Healthcare APIM accelerator distribution.

This section discusses the basic steps and the key concepts of FHIR APIs in the WSO2 Open Healthcare.

## Prerequisites

- Install and setup WSO2 Open Healthcare solution. [link to QSG]
- Deployed Integration API/s.
    - To see the response payloads


## Expose the integration as a FHIR API

WSO2 Open Healthcare allows you to expose an existing FHIR integration service as a managed FHIR REST API.

If you have already built your FHIR integration service, you can follow the steps given below to expose it as a managed API in a standard FHIR server.

1. Download the relevant API definition(OAS) from the WSO2 FHIR API Hub.
2. Log in to WSO2 OH Publisher portal and select REST API
3. Create an API by clicking Import Open API and uploading the OAS file(both JSON and YAML format are supported.)
4. Verify the basic information and enter the endpoint URL for the existing FHIR Integration API.
5. Click the Create button and configure the API.
    1. Select business plan so that API subscribers can subscribe to.
    2. Configure a target gateway and deploy the API
    3. Publish the API so that App developers can subscribe and consume the API from the Developer Portal.

## Explore the FHIR API

WSO2 Open Healthcare offers you a generalized FHIR server setup so that you can interact with FHIR client applications. Server implementation is carried through while referring to the FHIR Http developer guide and hence incorporates all the mandatory capabilities for the product.

Please note that there are areas that WSO2 Open Healthcare does not support at the moment. A summary of supported FHIR RESTful features can be found [here](#summary-of-supported-fhir-restful-capabilities).

Once the required FHIR resources have been exposed as FHIR APIs, the server is ready to go as a standard FHIR server. That is, all the subordinate components are getting updated and deployed accordingly.

To learn more about RESTful FHIR, refer the [official FHIR documentation](https://www.hl7.org/fhir/http.html).

- Interactions
    - Instance level - All the instance level interactions are pre templeted in the API definitions of the WSO2 FHIR API Hub. Relevant backend integration logic has to be implemented by the developer. (A project skeleton with boilerplate code will be provided to speed up the deployment.)
    - Type level - Type level interactions are also handled in a similar manner as in Instance level interactions.
    - System level - Only Capabilities interaction is available as a default feature.
- Capability statement
    - This document describes the server's meta information so that the stakeholders can query and decide whether the server supports expected operation/interaction. This includes all the implemented FHIR resource APIs, search parameters of each FHIR resource, supported interactions and expected payload structures etc.
    - WSO2 Open Healthcare comes with a pre-deployed, open to public endpoint that serves the server's Capability Statement which gets updated real time with the changes being made within the server.
    - Users can execute a query as follows to retrieve the server's Capability Statement.

        `GET [gateway_base_url]/metadata`

- SMART endpoints
    - WSO2 Open Healthcare also adheres to the SMART on FHIR guidelines where the 3rd party entities can authenticate with the server and exchange data.
    - As per the specification, a JSON document will be returned upon querying the well-known/smart-configuration endpoint. This contains all the necessary information related to SMART on FHIR specification including OAuth endpoint details and other OAuth related information.
    - This is also available as a default feature which will be served in the following URL.

        `GET [gateway_base_url]/.well-known/smart-configuration`

### Summary of Supported FHIR RESTful Capabilities

| **Feature** | **Supported? (yes/no/partially)** | **Description** |
| --- | --- | --- |
| read | yes | Supports query parameters as well |
| vread | yes | Appropriate Integration logic has to be implemented by the Integration developer. (Since versioning strategy might different from one system to a another) |
| update | yes | Appropriate Integration logic has to be implemented by the Integration developer. |
| patch | yes | Appropriate Integration logic has to be implemented by the Integration developer. |
| delete | yes | |
| create | yes | |
| search | yes | All the relevant search parameters of a particular FHIR resource will be populated in the provided API definition. |
| capabilities | yes | This interaction will be shipped as a default feature. This is available in the product and can be used without any configurations. |
| batch/transaction | yes | The support for batch operation is currently coupled with WSO2 OH FHIR Repository feature. \<link\> |
| history | yes | Appropriate Integration logic has to be implemented by the Integration developer. |
| Transaction integrity | no | Support for transaction integrity can be implemented by integration developers in the integration layer but currently the server conformance is not capable of capturing that. |
| paging | yes | Appropriate Integration logic has to be implemented by the Integration developer. A guided skeleton will be provided. |
| Support for HEAD | no | Currently not implemented. Will respond with 405 "method not allowed" |
| Custom Headers | yes | WSO2 OH does not use any custom headers for internal purposes |
| Conditional create/update/delete | no | Since the FHIR R4B has not finalized the behavior of conditional interactions, WSO2 OH does not implement the feature. |