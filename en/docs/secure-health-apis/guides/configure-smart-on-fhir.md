---
sidebar_position: 2
title: "Configure and deploy"
description: In this example, we will walk through the steps to configure a SMART App Launch flow for a patient user, demonstrating how to retrieve the Patient ID using the SMART on FHIR flow using the Healthcare Accelerator.
---
import Tabs from '@theme/Tabs';             
import TabItem from '@theme/TabItem';

# Configuring SMART on FHIR for Standalone Launch

This integration leverages WSO2 IS as the OAuth 2.0 / OpenID Connect authorization server and WSO2 APIM as the FHIR API gateway.

In this guide, we will walk through the steps to configure the SMART on FHIR flow using the Healthcare Accelerator.

## Prerequisites
1. WSO2 Identity Server 7.3.0 with [WSO2 Updates](../../install-and-setup/manual.md#getting-wso2-updates) applied up to update level 12 or later. The Consent Management API v2 (`/api/identity/consent-mgt/v2.0`) is available from IS 7.3.0 update level 12 onwards, and the consent management feature of WSO2 IS is used to capture and manage patient consents. 
2. Install and setup the [WSO2 API Manager for Healthcare](../../install-and-setup/manual.md#setting-up-wso2-api-manager-for-healthcare) and [WSO2 Identity for Healthcare](../../install-and-setup/manual.md#setting-up-wso2-identity-server-for-healthcare).
3. Setup [IS as Third Party Key Manager](../../install-and-setup/manual.md#configure-is-as-key-manager) for APIM.
4. Running FHIR server.
5. Published FHIR APIs in WSO2 APIM.

## Step 1 - Setting Up
### 1. Create management application.

   This application will be used to get an access token to access the management
   APIs, including the Consent Management API of WSO2 IS, by the supporting Ballerina services.
    
- Log in to the IS Admin Console(https://localhost:9453/console).
- Create an application of type M2M.
  ![IS_app_type.png](../../assets/img/learn/smart-on-fhir/IS_app_type.png)
- Go to the 'Protocols' section of the application and copy the 'Client ID' and 'Client secret' values. 
 ![IS_protocols.png](../../assets/img/learn/smart-on-fhir/IS_protocols.png)
These values will be used in the Ballerina services to securely access the management APIs.
- Go to the 'API Authorization' section of the application and authorize the following API resources with the listed scopes.

  | API resource                          | Scopes                                                                                                                             |
  |---------------------------------------|------------------------------------------------------------------------------------------------------------------------------------|
  | Consent Management V2 Purposes API    | `internal_consent_mgt_purpose_view`                                                                                                |
  | Consent Management V2 Elements API    | `internal_consent_mgt_element_view`                                                                                                |
  | Consent Management V2 Consents API    | `internal_consent_mgt_consent_create`, `internal_consent_mgt_consent_view`, `internal_consent_mgt_consent_update`                  |
  | SCIM2 Users API                       | `internal_user_mgt_view`, `internal_user_mgt_list`                                                                                 |

  Select the tenant (`/api/identity/consent-mgt/v2.0/...` and `/scim2/Users`) variant of each API resource, not the organization (`/o/...`) variant. To create the consent purpose in [step 6](#6-enable-consent-management-in-wso2-is), also authorize `internal_consent_mgt_purpose_create` and `internal_consent_mgt_element_create`.

  :::note
  The same management application is used to access both the consent management APIs and the other WSO2 IS management APIs. No separate application is required for consent management.
  :::
   
### 2. Setup and Deploy Pre built Ballerina services

Service extensions required for the SMART on FHIR flow are available in the [WSO2 Healthcare Accelerator](https://github.com/wso2/healthcare-accelerator/tree/main/extensions/services) GitHub repository.
- Clone the repository and navigate to the `extensions/services` directory.
  - consent-app-bff is the backend service for the consent app which will be used to capture the patient consent during the SMART on FHIR flow.

    <details>
    <summary>Click here to see more about consent-app-bff service</summary>
    <div>
    
    **consent-app-bff** is the backend for the consent app frontend which is a React application that provides the user 
    interface to capture patient consents during the SMART on FHIR flow. Consent app bff exposes APIs to capture and 
    manage patient consents and also serves the consent app frontend.
    
    Configure the `Config.toml` file of the service extension.
  
    | Key                                   | Description                                                                                                                                                                                                        | Example Value                            |
    |---------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------|
    | `hostname`                            | Hostname of the service                                                                                                                                                                                            | `localhost`                              |
    | `port`                                | Port on which the service will run                                                                                                                                                                                 | `9092`                                   |
    | `corsAllowedOrigin`                   | Allowed origin for CORS configuration to allow the consent app frontend to call the APIs exposed by this service.                                                                                                  | `http://localhost:3000`                  |
    | `idpBaseUrl`                          | Base URL of the Identity Server instance. This will be used to call the management APIs, including the consent management APIs, to manage consents.                                                                                                        | `https://localhost:9453`                 |
    | `idpTokenEndpoint`                    | Token endpoint of the Identity Server instance. This will be used to obtain access tokens to call the management APIs.                                                                                             | `https://localhost:9453/oauth2/token`    |
    | `consentContextApiTrustStorePath`     | Path to the truststore file containing the certificates required to establish SSL connection with the Identity Server when calling the management APIs.                                                            | ``                                       |
    | `consentContextApiTrustStorePassword` | Truststore password. This will be used to establish SSL connection with the Identity Server when calling the management APIs.                                                                                      | ``                                       |
    | `clientId`                            | Client ID of the management application created in the previous step. This will be used to obtain access tokens to call the management APIs.                                                                       | ``                                       |
    | `clientSecret`                        | Client secret of the management application created in the previous step. This will be used to obtain access tokens to call the management APIs.                                                                   | ``                                       |
    | `ehrContextResolveUrl`                | EHR launch context endpoint URL. This will be used to resolve the patient ID from the EHR launch context if `launch` scopes present in the token request.                                                          | `https://ehr.example.com/launch-context` |
    | `consentFlow`                         | Type of the consent flow to be used. Supported values are `scope` and `purpose`. For SMART on FHIR use `scope` as the value                                                                                        | `scope`                                  |
    | `serviceId`                           | Service identifier recorded on every consent created in WSO2 IS (the `serviceId` field of the consent). Also used to find the user's existing consents.                                                              | `smart-on-fhir`                          |
    | `consentApiBasePath`                  | Base path of the WSO2 IS Consent Management API relative to `idpBaseUrl`. For a tenant, use `/t/<tenant-domain>/api/identity/consent-mgt/v2.0`.                                                                       | `/api/identity/consent-mgt/v2.0`         |
    | `alwaysAllowedScopes`                 | List of scopes that bypass consent checks in the consent app. This will be used to allow certain scopes without requiring explicit patient consent during the SMART on FHIR flow.                                  | `["openid", "internal_user_mgt_list"]`   |
    | `singleConsentPerUser`                | Whether to allow only a single active consent per user. If set to true, when a new consent is created for a user, any existing active consents for that user will be revoked.                                      | `true`                                   |
    | `showConsentElements`                  | Whether to show the consent elements in the consent app frontend. If set to true, the scopes and purposes will be shown in the consent app frontend to allow users to make informed decisions when giving consent. | `false`                                  |
    | `scopeConsent.purposeName`             | Name of the consent purpose in WSO2 IS under which scope consents are recorded when creating a consent.  | `SMART Scope Authorization`              |

      </div>
      </details>

  - iam-service-extensions contains the service extensions for the Identity Server.

    <details>
    <summary>Click here to see more about iam-service-extensions service</summary>
    <div>

    **iam-service-extension** is a Ballerina service that contains the following extensions to enhance the token issuance and introspection flows in IS to support SMART on FHIR use cases.

    - **Pre-issue access token extension**(`/pre-issue-access-token`) — Invoked before issuing an access token. Adds healthcare specific claims such as `patient` and `consent_id` to the access token based on the user and the context of the request.
    - **Pre-issue ID token extension**(`/pre-issue-id-token`) — Invoked before issuing an ID token. Adds the `fhirUser` claim to the ID token based on the user and the context of the request.
    - **Introspection extension**(`/introspect`) — Invoked during token introspection. Adds healthcare specific information to the introspection response based on the token and the context of the request.

    </div>
    
    <div>
    
    Configure the `Config.toml` file of the service extension.
  
    | Key                     | Description                                                                                                                                               | Example Value                            |
    |-------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------|
    | `hostname`              | Hostname of the service                                                                                                                                   | `localhost`                              |
    | `port`                  | Port on which the service will run                                                                                                                        | `9093`                                   |
    | `ehrContextResolveUrl`  | EHR launch context endpoint URL. This will be used to resolve the patient ID from the EHR launch context if `launch` scopes present in the token request. | `https://ehr.example.com/launch-context` |
    | `consentApiPath`        | Path of the WSO2 IS Consent Management API relative to `isBaseUrl`.                                                                                       | `/api/identity/consent-mgt/v2.0`         |
    | `consentServiceId`      | Must match `serviceId` of the consent-app-bff service. Used to find the user's consent during the token request.                                         | `smart-on-fhir`                          |
    | `isBaseUrl`             | Base URL of the IS instance. This will be used for SCIM lookup and token introspection.                                                                   | `https://localhost:9453`                 |
    | `scimApiPath`           | Path to the SCIM API. Defaults to `/scim2/Users` if not provided.                                                                                         | `https://localhost:9453/scim2/Users`     |
    | `scimClientId`          | OAuth2 client ID of the management application, used to call the SCIM API and the consent management API. It must be authorized for `internal_user_mgt_view` and `internal_consent_mgt_consent_view`.                                         | ``                                       |
    | `scimClientSecret`      | OAuth2 client secret for SCIM API authentication.                                                                                                         | ``                                       |
    | `scimTokenEndpoint`     | Token endpoint to obtain the SCIM API access token.                                                                                                       | `https://localhost:9453/oauth2/token`    |
    | `scimPatientGroupName`  | Name of the user group used to identify patient users in the SCIM lookup.                                                                                 | `patient`                                |
    | `fhirUserAttributeName` | Name of the SCIM custom attribute that holds the FHIR user reference.                                                                                     | `fhirUser`                               |
    | `patientAttributeName`  | Name of the SCIM custom attribute that holds the patient resource reference.                                                                              | `patient`                                |
    | `alwaysAllowedScopes`   | List of scopes that bypass consent checks in the pre-issue access token extension.                                                                        | `["openid", "internal_user_mgt_list"]`   |
    | `trustStorePath`        | Path to the truststore file containing the certificates required to establish SSL connection with other components.                                       | ``                                       |
    | `trustStorePassword`    | Truststore password                                                                                                                                       | ``                                       |
    
    </div>
    </details>

- Go to each service directory and build the service.
    ```bash
    bal build
    ```
- Create a `Config.toml` file and add the required configurations. You can refer to the sample `Config.toml.example` files available inside each of the service.
  - Start the services using the following command. 

    <Tabs>
    <TabItem value="ballerina" label="Ballerina" default>
    
    ```bash
    bal run
    ```
    
    </TabItem>
    <TabItem value="java" label="Java">
    
    ```bash
    java -jar target/bin/<service-jar-file>.jar
    ```
    
    </TabItem>
    </Tabs>

    :::note
    You can use the client credentials of the management application created in the previous step to configure the services to access the management APIs securely.
    :::

### 3. Configure Pre-Issue Extensions

- Log in to the IS Console (https://localhost:9453/console).
- Navigate to the Actions section from the left menu.
![IS_actions.png](../../assets/img/learn/smart-on-fhir/IS_actions.png)
- Setup `Pre Issue Access Token` and `Pre Issue ID Token` actions with the iam-service-extensions Ballerina service path.
    ```text
    Pre Issue Access Token - https://<pre-issue-extension-base-path>:<PORT>/pre-issue-access-token
    Pre Issue ID Token - https://<pre-issue-extension-base-path>:<PORT>/pre-issue-id-token
    ```
  
### 4. Create user attributes.
  - Log in to the IS Admin Console (https://localhost:9453/console).
  - Go to `User Attributes & Stores -> Attributes` and create new user attributes.
    - patient 
    - practitioner 
    - fhirUser 
    
    ![IS_attributes.png](../../assets/img/learn/smart-on-fhir/IS_attributes.png)
    ![IS_add_attribute.png](../../assets/img/learn/smart-on-fhir/IS_add_attribute.png)
    ![IS_attribute-configuraions.png](../../assets/img/learn/smart-on-fhir/IS_attribute-configuraions.png)
  - In the `fhirUser` attribute, mark **Required** for Administrator Console and End-User Profile under Attribute Configurations.
    
### 5. Create user groups
  - Go to `User Management -> Groups` and create new groups.
    - `patient` - assigned to all patient users.
    - `practitioner` - assigned to all clinical staff users.

  - Add appropriate roles to the groups.
    
  ![IS_user_groups.png](../../assets/img/learn/smart-on-fhir/IS_user_groups.png)
  :::note
  The exact group names used here must be configured in the `Config.toml` of the `pre-issue-access-token-service-extension` (see `scimPatientGroupName` key).
  :::
    
### 6. Enable consent management in WSO2 IS.
  Consent management is a built-in feature of WSO2 Identity Server (Consent Management API v2 is available from IS 7.3.0 update level 12 onwards) and it is used to capture and manage patient consents during the SMART on FHIR flow. No separate consent management system needs to be deployed. The Ballerina services access the consent management APIs of WSO2 IS using the management application created in [Step 1](#1-create-management-application).

  1. Enable the Consent Management API v2 by adding the following to `<WSO2_IS_HOME>/repository/conf/deployment.toml` and restarting the Identity Server.

      ```toml
      [consent_mgt]
      enable_v2_api = true
      ```

      :::note
      If your Identity Server database already existed before updating the product (for example, the default H2 databases), apply the consent migration script `<WSO2_IS_HOME>/dbscripts/migrations/consent/<db-type>-migration.txt` to the identity database. Otherwise the consent APIs return `500` errors.
      :::

  2. Create the consent purpose that wraps the SMART scopes. The consent app records every approved SMART consent against this purpose, and the service fails to start if the purpose configured in `scopeConsent.purposeName` does not exist. Get a token with the management application and create an element and a purpose.

      ```bash
      TOKEN=$(curl -sk -u <CLIENT_ID>:<CLIENT_SECRET> https://localhost:9453/oauth2/token \
        -d 'grant_type=client_credentials&scope=internal_consent_mgt_element_create internal_consent_mgt_purpose_create' | jq -r .access_token)

      ELEMENT_ID=$(curl -sk https://localhost:9453/api/identity/consent-mgt/v2.0/elements \
        -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
        -d '{"name": "SMART Scopes", "displayName": "SMART on FHIR scopes", "description": "Access to patient data requested by a SMART on FHIR app"}' | jq -r .id)

      curl -sk https://localhost:9453/api/identity/consent-mgt/v2.0/purposes \
        -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
        -d "{\"name\": \"SMART Scope Authorization\", \"description\": \"Authorization of SMART on FHIR scopes\", \"type\": \"SMART\", \"version\": \"v1\", \"elements\": [{\"id\": \"$ELEMENT_ID\", \"mandatory\": true}]}"
      ```

      The approved SMART scopes themselves are stored as a property of each consent, so a single element is enough.

## Step 2 - Create users and assign roles
1. Go to `User Management -> Users` and create users for testing the SMART on FHIR flow. (e.g., username: `johndoe`).
2. Assign the user to the `patient` group created in the previous step.
3. Create another user (e.g., username: `drsmith`) and assign that user to the `practitioner` group.

## Step 3 - Application Registration and Key Generation
1. Navigate to Developer Portal in your web browser: `https://localhost:9443/devportal/`
2. Sign up by clicking the 'Sign In' button. You will be redirected to the Authentication Portal.
3. Click on 'Create Account' link, provide a username and click on 'Proceed to Self Register'. 
4. Fill in the details and create the account. 
5. Log into Devportal with the credentials of the above user and follow steps 2-4 to [create a new application](https://apim.docs.wso2.com/en/4.2.0/design/api-security/oauth2/grant-types/authorization-code-grant/#try-authorization-code-grant).
6. Enable Refresh Token and Code Grant Types.
7. Enable PKCE.
8. Note down the Consumer key and Consumer Secret. 
![key-generation.png](../../assets/img/learn/smart-on-fhir/key-generation.png)

## Step 4 - Subscribe to the FHIR APIs

1. Navigate to the Subscriptions tab of the Developer Portal.
2. Subscribe to the FHIR APIs that you have published in WSO2 APIM using the application you created in the previous step.

## Step 5 - Get the endpoints
1. Invoke the well-known configuration to get the details about auth endpoint and token endpoint. 
`https://localhost:8243/r4/.well-known/smart-configuration`

2. You will get a JSON response as below. 
    ```json
    {
        "response_types_supported": [
            "code",
            "id_token",
            "token",
            "device",
            "id_token token"
        ],
        "capabilities": [
            "launch-standalone",
            "client-public",
            "client-confidential-symmetric",
            "context-standalone-patient",
            "sso-openid-connect",
            "permission-patient",
            "permission-offline"
        ],
        "code_challenge_methods_supported": "S256",
        "grant_types_supported": [
            "authorization_code",
            "client_credentials"
        ],
        "jwks_uri": "https://localhost:9453/oauth2/jwks",
        "revocation_endpoint": "https://localhost:9453/oauth2/revoke",
        "token_endpoint_auth_methods_supported": [
            "client_secret_basic",
            "client_secret_post"
        ],
        "scopes_supported": [
            "openid",
            "launch/patient",
            "patient/*.cruds",
            "user/*.cruds"
        ],
        "issuer": "https://localhost:9453/oauth2/token",
        "authorization_endpoint": "https://localhost:9453/oauth2/authorize",
        "token_endpoint": "https://localhost:9453/oauth2/token"
    }
    ```

## Step 6 - Execute Authorization Code Grant Flow and Retrieve the Patient ID
1. Execute the following request in the URL. 
    
   ```bash
    https://localhost:9443/oauth2/authorize?response_type=code&client_id=[CLIENT_ID]&scope=fhirUser launch/patient offline_access openid patient/DiagnosticReport.s patient/Patient.r&redirect_uri=[REDIRECT_URL]&code_challenge=[CODE_CHALLENGE]&code_challenge_method=S256
    ```

    Replace the `REDIRECT_URL`, `CLIENT_ID` with the values received from Step 3. `CODE_CHALLENGE` is the base64 URL encoded value of the SHA256 hash of a random string (code_verifier) that you generate. You can use online tools to generate the code_challenge and code_verifier values.
    
2. Once redirected to the Authentication Portal sign in with the practitioner or the patient user you created at step 2. 

    ![authenticate.png](../../assets/img/learn/smart-on-fhir/authenticate.png)
3. Select the permissions and the consent period and click on 'Authorize' button.

    ![consent.png](../../assets/img/learn/smart-on-fhir/consent.png)
4. If you logged in with the practitioner user, you will be asked to select a patient for the session. Select the patient and click on 'Proceed' button.

    ![patient-picker.png](../../assets/img/learn/smart-on-fhir/patient-picker.png)
5. Copy the 'code' value from the URL once user is redirected to the configured redirect URL after successful authentication.
6. Execute the following curl command. 
    ```bash
    curl --location --request POST 'https://localhost:9453/oauth2/token?grant_type=authorization_code&code=[CODE_VALUE]&redirect_uri=[REDIRECT_URL]&code_verifier=[CODE_VERIFIER]' \
    --header 'Content-Type: application/x-www-form-urlencoded' \
    --header 'Authorization: Basic <base64>(CONSUMER_KEY:CONSUMER_SECRET)'
    ```
7. You will get the access_token along with the id_token. 
8. Decoded access token looks similar to below.

    ```json
    {
      "sub": "2afba262-dc62-41d6-ad05-30a30c3d6e35",
      "aut": "APPLICATION_USER",
      "iss": "https://host.docker.internal:9453/oauth2/token",
      "client_id": "kp3os6qrkdK1fpFN1tuW4hgRsKwa",
      "aud": "kp3os6qrkdK1fpFN1tuW4hgRsKwa",
      "nbf": 1779172841,
      "azp": "kp3os6qrkdK1fpFN1tuW4hgRsKwa",
      "patient": "102",
      "org_id": "10084a8d-113f-4211-a0d5-efe36b082211",
      "scope": "fhirUser launch/patient offline_access openid patient/DiagnosticReport.s patient/Patient.r",
      "exp": 1779176441,
      "org_name": "Super",
      "iat": 1779172841,
      "jti": "3a5a97a0-563f-40c4-b115-596d43a675d8",
      "consent_id": "b11a7510-73dd-4d29-9834-5903e4cc1b47",
      "org_handle": "carbon.super"
    }
    ```

    :::note
    `consent_id` and `patient` claims are added to the token.

    The consent is shared between the authorization and token requests as follows. When the user approves the consent in the consent app, consent-app-bff creates the consent in WSO2 IS for the user and `serviceId`, and stores the OAuth `client_id` of the app and the approved scopes as consent properties. When the access token is requested, the pre-issue access token extension finds the user's active consent with the user ID and the `client_id` of the token request, adds its ID as the `consent_id` claim, and removes any requested scope that the user did not approve. Because the consent is matched by user and client, keep `singleConsentPerUser` set to `true` in consent-app-bff so that a user has only one active consent per service.
    :::

9. The decoded id token looks similar to below. 

    ```json
    {
      "isk": "e55c51e29b4aa647d8f4d2cc36dd74a017c1b2a4e129152d37eb4efcbc7e5064",
      "at_hash": "9jAg6VhwF7O05KDtmv6o0A",
      "sub": "2afba262-dc62-41d6-ad05-30a30c3d6e35",
      "amr": [
        "BasicAuthenticator"
      ],
      "iss": "https://host.docker.internal:9453/oauth2/token",
      "nonce": "nonce",
      "fhirUser": "Practitioner/232421413",
      "sid": "472df030-be44-49ca-9ddb-a5a54699ffbd",
      "c_hash": "3POJLb9ayH2pNNvFaRWfTg",
      "aud": "kp3os6qrkdK1fpFN1tuW4hgRsKwa",
      "nbf": 1779172842,
      "azp": "kp3os6qrkdK1fpFN1tuW4hgRsKwa",
      "org_id": "10084a8d-113f-4211-a0d5-efe36b082211",
      "org_name": "Super",
      "exp": 1779176442,
      "iat": 1779172842,
      "jti": "6425e15f-bfde-4360-9201-f86e51a8939b",
      "org_handle": "carbon.super"
    }
    ```

    :::note
    `fhirUser` claim is added to the id token.
    :::

## Step 7 - Call FHIR API

Use the `access_token` obtained in Step 6 to call the FHIR APIs published in WSO2 APIM.

1. Include the access token in the `Authorization` header of your API request:

    ```bash
    curl --location 'https://localhost:8243/r4/Patient/[PATIENT_ID]' \
    --header 'Authorization: Bearer [ACCESS_TOKEN]'
    ```

2. Example requests:

    ```bash
    # Retrieve patient demographics
    curl --location 'https://localhost:8243/r4/Patient/102' \
    --header 'Authorization: Bearer [ACCESS_TOKEN]'

    # Retrieve diagnostic reports for a patient
    curl --location 'https://localhost:8243/r4/DiagnosticReport?patient=102' \
    --header 'Authorization: Bearer [ACCESS_TOKEN]'
    ```

:::note
The `patient` claim in the access token (e.g., `"patient": "102"`) contains the Patient ID scoped to the session. Use this value to construct patient-specific FHIR queries.
:::

## See Also

- [Overview - SMART on FHIR](./smart-on-fhir-overview.md)
- [SMART App Launch — HL7 specification](https://hl7.org/fhir/smart-app-launch/)