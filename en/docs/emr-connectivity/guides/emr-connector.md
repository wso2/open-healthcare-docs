## Overview
The FHIR Client Connector is designed to connect with  FHIR servers and repositories. 

## Connecting with Epic EMR 
In this example we will look into the steps how can we use the Client Connector to connect with the Epic EMR system. 

### Prerequisites
1. First we need to create Backend OAuth 2.0 App. To use the client_credentials OAuth 2.0 grant type to authorize the backend application's access to patient information we need 'Client ID' and the 'Public key'. Let's create a Public Private Key Pair using OpenSSL. 

    Creating the private key
    ```
    openssl genrsa -out <path_to_key>/privatekey.pem 2048
    ```

    Creating the public key
    ```
    openssl req -new -x509 -key <path_to_key>/privatekey.pem -out <path_to_key>/publickey509.pem -subj '/CN=myapp'
    ```

2. Login to [EPIC FHIR](https://fhir.epic.com/) with your credentials. 
3. Navigate to 'Build Apps' tab to create an application. 
4. Provide the details to create the application. 
    - Application Name: myapp
    - Application Audience: Backend Systems
    - Incoming APIs: Patient.Read(R4)
    - Production JWK Set URL: fhir.epic.com
    - Upload your created public key in step 1. 

You can further refer to the Epic Documentation on creating an [OAuth 2.0 App](https://fhir.epic.com/Documentation?docId=epiconfhirrequestprocess). 

{!includes/bal-mi-note.md!}

=== "Ballerina"
    1. Create a new ballerina project. 
    ```
    bal new epicapp
    ```

    2. In the main.bal file provide the following code. Make sure to provide clientId and path to the private key file you obtained in the Prerequisites step. 
    ```
    import ballerina/http;
    import ballerinax/health.base.auth;
    import ballerinax/health.clients.fhir;

    configurable string base = "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4";
    configurable string tokenUrl = "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token";
    configurable string clientId = "<CLIENT-ID>";
    configurable string keyFile = "resources/privatekey.pem";

    // Create PKJWTAuth configuration
    auth:PKJWTAuthConfig ehrSystemAuthConfig = {
        keyFile: keyFile,
        clientId: clientId,
        tokenEndpoint: tokenUrl
    };

    fhir:FHIRConnectorConfig epicConfig = {
        baseURL: base,
        authConfig: ehrSystemAuthConfig
    };

    final fhir:FHIRConnector fhirConnectorObj = check new (epicConfig);

    service http:Service / on new http:Listener(9090) {

        // Get resource by ID
        isolated resource function get fhir/r4/[string resType]/[string id]() returns http:Response {

            fhir:FHIRResponse|fhir:FHIRError fhirResponse = fhirConnectorObj->getById(resType, id);
            return fhir:handleResponse(fhirResponse);
        }

    }
    ```
    3. Run the Ballerina service. 
    ```
    bal run
    ```

    4. Test the serive using the following curl command. 
    ```
    curl --location 'http://localhost:9090/fhir/r4/Patient/e63wRTbPfr1p8UW81d8Seiw3'
    ```

=== "Micro Integrator"

