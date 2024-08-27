# FHIR R4 Metadata Service

## Introduction
This service provides implementation of FHIR Metadata API. This implements 
[capabilities](https://www.hl7.org/fhir/http.html#capabilities) interaction, which is used to retrieve capability 
statement describing the server's current operational functionality by FHIR client applications. 

This FHIR server interaction returns Capability Statement ([CapabilityStatement](http://hl7.org/fhir/StructureDefinition/CapabilityStatement) 
FHIR resource) that specifies which resource types and interactions are supported by the FHIR server

!!! note
        Supported FHIR version is 4.0.1.

{!includes/bal-mi-note.md!}

=== "Ballerina"

    ## Setup and run locally

    1. Clone the [source code](https://github.com/wso2/open-healthcare-prebuilt-services/tree/main/conformance/metadata-fhirr4-service) repository to your local machine and navigate to the pre-built service on metadata-fhirr4-service.

    2. Configure the Config.toml with relevant configurations mentioned in [Configurations](#configurations).

        Also, resource details need to be added as described in [Configurations](#resources).

    3. Run the project.

        ```ballerina
        bal run
        ```

    4. Invoke the API.

        Sample request for FHIR Capability Statement:

        ```
        curl 'http://<host>:<port>/fhir/r4/metadata'
        ```

    ## [Optional] Deploy in Choreo

    !!! note

            This can be deployed as a standalone microservice in an on-premise environment or any other cloud solution. Optionally, you can use WSO2's cloud solution, Choreo, to deploy.
            

    WSO2’s [Choreo](https://wso2.com/choreo/) is an internal developer platform that redefines how you create digital experiences. Choreo empowers you to seamlessly design, develop, deploy, and govern your cloud native applications, unlocking innovation while reducing time-to-market. You can deploy the healthcare prebuilt services in Choreo as explained below. 

    ### Prerequisites

    If you are signing in to the Choreo Console for the first time, create an organization as follows:

    1. Go to [Choreo console](https://console.choreo.dev/), and sign in using your preferred method.
    2. Enter a unique [organization](https://wso2.com/choreo/docs/choreo-concepts/organization/#:~:text=An%20organization%20in%20Choreo%20is,when%20signing%20in%20to%20Choreo.) name. For example, Stark Industries.
    3. Read and accept the privacy policy and terms of use.
    4. Click Create.
    This creates the organization and opens the Project Home page of the default project created for you.

    ### Steps to Deploy Metadata Prebuilt Service in Choreo
    1. Create Service Component
        * Fork the pre-built Ballerina services [repository](https://github.com/wso2/open-healthcare-prebuilt-services) to your Github organization.
        * Create a service component pointing to the `metadata-fhirr4-service`. Follow the [official documentation](https://wso2.com/choreo/docs/develop-components/develop-services/develop-a-ballerina-rest-api/#step-1-create-a-service-component) of Choreo to create and configure a service:.
        * Once the component creation is complete, you will see the component overview page.

    2. Configure and Deploy

        * Follow the [official documentation](https://wso2.com/choreo/docs/develop-components/develop-services/develop-a-ballerina-rest-api/#step-2-build-and-deploy) to deploy the Metadata prebuilt service to your organization.

        * FHIR Resource details need to be added as described in [Configurations/Resources](#resources).

        * On deployment, configurables mentioned in [Configurations/Configs](#configurations) needs to be configured in Choreo configurable editor.

    ## Configurations

    ### Configs

    Following configurations need to be added in a `Config.toml` or in the Choreo configurations editor.

    | Configuration                | Description                                                                                        |
    |------------------------------|----------------------------------------------------------------------------------------------------|
    | `version`                    | Business version of the capability statement <br/><br/>  eg: `0.1.7`                               |
    | `name`                       | Name for this capability statement (computer friendly)  <br/><br/> eg: `WSO2OpenHealthcareFHIR`    | 
    | `title`                      | Name for this capability statement (human friendly) <br/><br/> eg: `FHIR Server`                   | 
    | `status`                     | `draft` / `active` / `retired` / `unknown` <br/><br/> eg: `active`                                 | 
    | `experimental`               | For testing purposes, not real usage <br/><br/> eg: `true`                                         | 
    | `date`                       | Date last changed <br/><br/> eg: `26-01-2023`                                                      | 
    | `kind`                       | `instance` / `capability` / `requirements` <br/><br/> eg: `instance`                               | 
    | `fhirVersion`                | FHIR Version the system supports <br/><br/> eg:  `4.0.1`                                           | 
    | `format`                     | formats supported (`json`) <br/><br/> eg: `[json]`                                                 | 
    | `patchFormat`                | Patch formats supported <br/><br/> eg: `[application/json-patch+json]`                             | 
    | `implementationUrl`          | Base URL for the installation <br/><br/> eg: `https://choreoapis/dev/fhir_server/0.1.5`            |
    | `implementationDescription`  | Describes this specific instance <br/><br/> eg: `WSO2 Open Healthcare FHIR`                        |  
    | `interaction`                | The that operations are supported <br/><br/> eg: `[search-system, history-system]`                 | 
    | `cors`                       | CORS Headers availability <br/><br/> eg: `true`                                                    |
    | `discoveryEndpoint`          | The discovery endpoint for the server <br/><br/> eg: `https://api.asgardeo.io/t/<organization_name>/oauth2/token/.well-known/openid-configuration` |
    | `tokenEndpoint`              | OPTIONAL: If not provided a discoveryEndpoint. <br/>OAUTH2 access token url <br/><br/> eg: `https://api.asgardeo.io/t/<organization_name>/oauth2/token`          | 
    | `revocationEndpoint`         | OPTIONAL: If not provided a discoveryEndpoint. <br/>OAUTH2 access revoke url <br/><br/> eg: `https://api.asgardeo.io/t/<organization_name>/oauth2/revoke`        | 
    | `authorizeEndpoint`          | OPTIONAL: If not provided a discoveryEndpoint. <br/>OAUTH2 access authorize url <br/><br/> eg: `https://api.asgardeo.io/t/<organization_name>/oauth2/authorize`  |

    A sample `Config.toml` is consisting above configurations as below.

        ```
        ## server related configurables
        [configFHIRServer]
        version = "1.2.0"
        name = "WSO2OpenHealthcareFHIR"
        title = "FHIR Server"
        status = "active"
        experimental = true
        date = "2022-11-24"
        kind = "instance"
        fhirVersion = "4.0.1"
        format = ["json"]
        patchFormat = ["application/json-patch+json"]
        implementationUrl = "<FHIR_BASE_URL>"
        implementationDescription = "WSO2 Open Healthcare FHIR"

        ## server security related configurables
        [configRest]
        mode = "server"
        resourceFilePath = "resources/fhir_resources.json"
        interaction = ["search-system"]
        [configRest.security]
        cors = false
        discoveryEndpoint = "https://api.asgardeo.io/t/<organization_name>/oauth2/token/.well-known/openid-configuration"
        managementEndpoint = "https://api.asgardeo.io/t/<organization_name>/oauth2/manage"
        ```

    ### Resources

    FHIR resource details need to be added in `/resources/fhir_resources.json`. A sample `fhir_resources.json` consisting of
    `Patient` resource details, is as below.

    ```
    [
        {
            "type": "Patient",
            "versioning": "versioned",
            "conditionalCreate": false,
            "conditionalRead": "not-supported",
            "conditionalUpdate": false,
            "conditionalDelete": "not-supported",
            "referencePolicies": ["resolves"],
            "searchRevIncludes": ["null"],
            "supportedProfiles": ["http://hl7.org/fhir/StructureDefinition/Patient"],
            "interaction": ["create", "delete", "update", "history-type", "search-type", "vread", "read"],
            "stringSearchParams": ["_lastUpdated", "_security", "_tag", "_source", "_profile"],
            "numberSearchParams": ["_id"]
        }
    ]    
    ```

    When deploying on Choreo, Choreo's [File Mount](https://wso2.com/choreo/docs/devops-and-ci-cd/manage-configurations-and-secrets/#apply-a-file-mount-to-your-container) can be used to mount the `fhir_resources.json`. The Mount Path should be provided as,

    ```
    /resources/fhir_resources.json

    ```


    # FHIR R4 SMART Configuration Service

    ## Introduction

    This service provides API implementation of 
    [SMART Configuration API](https://www.hl7.org/fhir/smart-app-launch/#discovery-of-server-capabilities-and-configuration) 
    of a FHIR server.

    SMART defines a discovery document available at `.well-known/smart-configuration` relative to a FHIR Server Base URL, 
    allowing clients to learn the authorization endpoint URLs and features a server supports. This information helps clients to 
    direct authorization requests to the right endpoint, and helps clients construct an authorization request that the server 
    can support.

    ```Supported FHIR version is 4.0.1.```

    ## Setup and run

    1. Clone this repository to your local machine and navigate to the pre-built service on smart-config-fhirr4-service.

    2. Configure the Config.toml with relevant configurations mentioned in [Configurations](#configurations).

    3. Run the project.

        ```ballerina
        bal run
        ```

    4. Invoke the API.

        Sample request for FHIR Capability Statement:

        ```
        curl 'http://<host>:<port>/.well-known/smart-configuration'
        ```


    ## [Optional] Deploy in Choreo

    WSO2’s Choreo (https://wso2.com/choreo/) is an internal developer platform that redefines how you create digital experiences. Choreo empowers you to seamlessly design, develop, deploy, and govern your cloud native applications, unlocking innovation while reducing time-to-market. You can deploy the healthcare prebuilt services in Choreo as explained below. 

    ### Prerequisites

    If you are signing in to the Choreo Console for the first time, create an organization as follows:

    1. Go to https://console.choreo.dev/, and sign in using your preferred method.
    2. Enter a unique organization name. For example, Stark Industries.
    3. Read and accept the privacy policy and terms of use.
    4. Click Create.
    This creates the organization and opens the Project Home page of the default project created for you.

    ### Steps to Deploy SMART Configuration Prebuilt Service in Choreo

    1. Create Service Component
        * Fork the pre-built Ballerina services repository (https://github.com/wso2/open-healthcare-prebuilt-services) to your Github organization.
        * Create a service component pointing to the `smart-config-fhirr4-service`. Follow the official documentation to create and configure a service: https://wso2.com/choreo/docs/develop-components/develop-services/develop-a-ballerina-rest-api/#step-1-create-a-service-component
        * Once the component creation is complete, you will see the component overview page.

    2. Configure and Deploy

        Follow the official documentation to deploy the smart configuration prebuilt service to your organization https://wso2.com/choreo/docs/develop-components/develop-services/develop-a-ballerina-rest-api/#step-2-build-and-deploy.

        On deployment configurables mentioned in [Configurations](#configurations) needs to be configured in Choreo configurable editor.

    ## Configurations

    Following configurations need to be added in a `Config.toml` or in the Choreo configurations editor.
        
    | Name                                    | Description                                                                                                                                                                                                                    |
    |-----------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    |  `DiscoveryEndpoint`                    | RECOMMENDED, URL to a server’s openid configuration <br/><br/> eg: `https://api.asgardeo.io/t/<organization_name>/oauth2/token/.well-known/openid-configuration`|
    | `issuer`                                | CONDITIONAL, String conveying this system’s OpenID Connect Issuer URL. Required if the server’s capabilities include sso-openid-connect; otherwise, omitted. <br/><br/> eg: `https://api.asgardeo.io/t/<organization_name>/oauth2/token`  |       
    | `jwksUri`                              | CONDITIONAL, String conveying this system’s JSON Web Key Set URL. Required if the server’s capabilities include sso-openid-connect; otherwise, optional. <br/><br/> eg: `https://api.asgardeo.io/t/<organization_name>/oauth2/jwks`                                                                      |
    | `authorizationEndpoint`                | REQUIRED, URL to the OAuth2 authorization endpoint. <br/><br/> eg: `https://api.asgardeo.io/t/<organization_name>/oauth2/authorize`                                                                                                                                                                           |
    | `grantTypesSupported`                 | REQUIRED, Array of grant types supported at the token endpoint. The options are “authorization_code” (when SMART App Launch is supported) and “client_credentials” (when SMART Backend Services is supported). <br/><br/> eg: `[authorization_code, client_credentials]`                |
    | `tokenEndpoint`                        | REQUIRED, URL to the OAuth2 token endpoint. <br/><br/> eg: `https://api.asgardeo.io/t/<organization_name>/oauth2/token`                                                                                                                                                                                  |
    | `tokenEndpointAuthMethodsSupported` | OPTIONAL, array of client authentication methods supported by the token endpoint. The options are “client_secret_post”, “client_secret_basic”, and “private_key_jwt”. <br/><br/> eg: `[client_secret_basic, private_key_jwt]`                                                          |
    | `registrationEndpoint`                 | OPTIONAL, If available, URL to the OAuth2 dynamic registration endpoint for this FHIR server. <br/><br/> eg: `https://api.asgardeo.io/t/<organization_name>/oauth2/register`                                                                                                                                 |
    | `scopesSupported`                      | RECOMMENDED, Array of scopes a client may request. See scopes and launch context. The server SHALL support all scopes listed here; additional scopes MAY be supported (so clients should not consider this an exhaustive list). <br/><br/> eg: `[openid, profile, launch, launch/patient, patient/*.rs, user/*.rs, offline_access]`|
    | `responseTypesSupported`              | RECOMMENDED, Array of OAuth2 response_type values that are supported. Implementers can refer to response_types defined in OAuth 2.0 (RFC 6749) and in OIDC Core. <br/><br/> eg: `[code]`                                                               |
    | `managementEndpoint`                   | RECOMMENDED, URL where an end-user can view which applications currently have access to data and can make adjustments to these access rights. <br/><br/> eg: `https://api.asgardeo.io/t/<organization_name>/oauth2/manage`                                                                                   |
    | `introspectionEndpoint `               | RECOMMENDED, URL to a server’s introspection endpoint that can be used to validate a token. <br/><br/> eg: `https://api.asgardeo.io/t/<organization_name>/oauth2/introspect`                                                                                                                                    |
    | `revocationEndpoint `                  | RECOMMENDED, URL to a server’s revoke endpoint that can be used to revoke a token. <br/><br/> eg: `https://api.asgardeo.io/t/<organization_name>/oauth2/revoke`                                                                                                                                             |
    | `capabilities`                          | REQUIRED, Array of strings representing SMART capabilities (e.g., sso-openid-connect or launch-standalone) that the server supports. <br/><br/> eg: `[launch-ehr, permission-patient, permission-v2, client-public, client-confidential-symmetric, context-ehr-patient, sso-openid-connect, launch-standalone, context-standalone-patient, permission-offline]`                                                                                           |
    | `codeChallengeMethodsSupported`      | REQUIRED, Array of PKCE code challenge methods supported. The S256 method SHALL be included in this list, and the plain method SHALL NOT be included in this list. <br/><br/> eg: `[S256]`    

    A sample `Config.toml` is consisting above configurations as below.

    ```
        [configs]
        discoveryEndpoint = "https://api.asgardeo.io/t/bifrost/oauth2/token/.well-known/openid-configuration"

        [configs.smartConfiguration]
        tokenEndpoint = "<TOKEN_ENDPOINT>"
        introspectionEndpoint = "<INTROSPECTION_ENDPOINT>"
        codeChallengeMethodsSupported = ["S256"]
        grantTypesSupported = ["authorization_code"]
        revocationEndpoint = "<REVOCATION_ENDPOINT>"
        tokenEndpointAuthMethodsSupported = ["private_key_jwt", "client_secret_basic"]
        tokenEndpointAuthSigningAlgValuesSupported = ["RS384","ES384"]
        scopesSupported = [
            "openid",
            "fhirUser",
            "launch",
            "launch/patient",
            "patient/*.cruds",
            "user/*.cruds",
            "offline_access",
        ]
        responseTypesSupported = [
            "code",
            "id_token",
            "token",
            "device",
            "id_token token"
        ]
        capabilities = [
            "launch-ehr",
            "launch-standalone",
            "client-public",
            "client-confidential-symmetric",
            "client-confidential-asymmetric",
            "context-passthrough-banner",
            "context-passthrough-style",
            "context-ehr-patient",
            "context-ehr-encounter",
            "context-standalone-patient",
            "context-standalone-encounter",
            "permission-offline",
            "permission-patient",
            "permission-user",
            "permission-v2",
            "authorize-post"
        ]
    ```
