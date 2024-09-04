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
    As a Prerequsite [Setup Micro Integrator](../../install-and-setup/setup-mi-server.md)

    1. Open VSCode, type CMD+Shift+P and type MI:Create New Project. 
    2. To create an API, click on the API button, for URI Template provide '/getPatient/{patientId}' and select 'GET' as the resource. 
    3. Download epic-connector zip from [WSO2 Connector Store](https://store.wso2.com/connector/esb-connector-epic)
    4. Go to Project Explorer and navigate to src->main-> wso2mi-> resources-> connectors. Add the downloaded connector zip file here. 
    5. Go to Micro Integrator view and click on 'Add API'. For 'context' provide '/epic'
    6. Then you will be navigated to the Resource view. Click on the + button to add a connector operation. 
    7. Select 'Connector' and search for 'Epic', and select the 'Epic Connector'. 
    8. Click on the 'init' operation. Provide values for 'Base URL', 'Client ID', 'Token URL' and 'Private Key' feilds and click on the Submit button. 
    9. Then click on 'ReadbyId' operation. Provide values for 'Type' and 'ID'. We are going to get the PatientId as a path parameter. 
        ```
        Type: Patient
        ID: {$ctx:uri.var.patientId}
        ```
    10. Next add a Respond mediator. 
    11. The complete source looks as below. 
        ```
        <?xml version="1.0" encoding="UTF-8"?>
        <api context="/epic" name="epic" xmlns="http://ws.apache.org/ns/synapse">
            <resource methods="GET" uri-template="/getPatient/{patientId}">
                <inSequence>
                    <epicFhirR4.init>
                        <base>https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4</base>
                        <clientId>[CLIENT-ID]</clientId>
                        <tokenEndpoint>https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token</tokenEndpoint>
                        <privateKey>[PRIVATE-KEY-VALUE]</privateKey>
                        <enableUrlRewrite>False</enableUrlRewrite>
                    </epicFhirR4.init>
                    <epicFhirR4.readById>
                        <type>Patient</type>
                        <id>{$ctx:uri.var.patientId}</id>
                    </epicFhirR4.readById>
                    <respond/>
                </inSequence>
                <faultSequence>
                </faultSequence>
            </resource>
        </api>
        ```
    12. Click on 'Build and Run' button in the top left corner. The Micro Integrator server should start running. 
    13. Clik on 'Try it' and provide the value for the Patient ID. 
    
        eg: Patient ID: e63wRTbPfr1p8UW81d8Seiw3

    14. You should be able to get a successful FHIR Patient payload. 
