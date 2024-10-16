# Using FHIR Repository Connector

Fast Healthcare Interoperability Resources (FHIR) is an interoperability standard for electronic exchange of healthcare information. The WSO2 FHIR Repository connector can be used to seamlessly integrate with a FHIR repository of your choice.

{!includes/bal-mi-note.md!}

=== "Ballerina"

    The Ballerina FHIR client will allow the users to interact with a FHIR server. The client supports all the standard interactions specified in the FHIR specification.

    The following example demonstrates how to use the FHIR Repository client to interact with a FHIR server.

    ## Step 1: Set Up Ballerina

    Before you begin, ensure you have <a href="https://ballerina.io/downloads/installation-options/" target="_blank">Ballerina</a> installed on your system. Follow the instructions in the [Installation Steps](../../install-and-setup/manual.md#ballerina-installation-steps)  to install Ballerina and set up the development environment.

    ## Step 2: Implement the logic to connect to the FHIR Repository

    1. Create a Ballerina project using the following command. It will create the Ballerina project and the main.bal file can be used to implement the logic.

        ```bash
        $ bal new fhir_repository_client_sample
        ```

    2. Import the required modules to the Ballerina program. In this sample, we are using the FHIR R4 module to interact with the FHIR server. Therefore, we need to import the `ballerinax/health.clients.fhir` package.

        ```ballerina
        import ballerinax/health.clients.fhir;
        import ballerina/io;
        ```
    3. Implement the logic to connect to the FHIR Repository. In this sample, we are connecting to a HAPI Public FHIR server using the FHIR Repository client.

        ```ballerina
        import ballerinax/health.clients.fhir;
        import ballerina/io;

        // Define the FHIR server connection configuration. If your server requires authentication, you can configure it using
        // the `authConfig` field.
        fhir:FHIRConnectorConfig fhirServerConfig = {
            baseURL: "https://hapi.fhir.org/baseR4",
            mimeType: fhir:FHIR_JSON
        };

        // Create a new FHIR connector using the configuration.
        fhir:FHIRConnector fhirConnector = check new (fhirServerConfig);

        public function main4() returns error? {
            // Search for a patient with the name "homer". You can provide additional search parameters as a map.
            // There are other client operations available in the FHIR connector, such as `create`, `update`, `delete`, etc.
            fhir:FHIRResponse|fhir:FHIRError response = fhirConnector->search("Patient", {"name": "homer"});
            if response is fhir:FHIRResponse {
                io:println("response status code: ", response.httpStatusCode);
                io:println("response content: ", response.'resource);
            }
        }        
        ```
    ## Step 3: Run the Ballerina Program

    Run the Ballerina program using the following command:

        ```bash
        $ bal run
        ```     


    ## Operations

    ### Instance Level Interactions

    ??? note "Get FHIR resource by ID"

        This method will allow the user to retrieve fhir resources by specifying the resource ID and type

        | Method name     | getById                                                                                                                                          |
        |:----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
        | Parameters      | *type* - The name of a resource type (e.g. "Patient")                                                                                            |
        |                 | *Id* -The [logical Id](https://www.hl7.org/fhir/resource.html#id) of a resource                                                                  |
        |                 | *returnMimeType* - The [Mime Type](https://www.hl7.org/fhir/http.html#mime-type:~:text=Content%20Types%20and%20encodings) of the return response |
        |                 | *summary* - to specify the subset of the resource content to be [returned](https://www.hl7.org/fhir/search.html#summary:~:text=3.1.1.5.8-,Summary,-The%20client%20can).                                                                  |
        | Returns         | Requested FHIR resource in specified format \| operationOutcome                                                                                  |
        | Server endpoint | [Read](https://www.hl7.org/fhir/http.html#read) operation                                                                                                                                   |

        **sample usage**
        ```ballerina
        fhir:FHIRResponse|fhir:FHIRError response = fhirConnector->getById("Patient", "1");
        ```

    ??? note "Get version specific FHIR resource by ID"

        This method will allow the user to retrieve version specific fhir resources by specifying the resource ID and type.

        | Method name     | getByVersion                                                                                                                                          |
        |:----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
        | Parameters      | *type* - The name of a resource type (e.g. "Patient")                                                                                            |
        |                 | *Id* -The [logical Id](https://www.hl7.org/fhir/resource.html#id) of a resource    
        |                 | *version* - FHIR version specific identifier                                                              |
        |                 | *returnMimeType* - The [Mime Type](https://www.hl7.org/fhir/http.html#mime-type:~:text=Content%20Types%20and%20encodings) of the return response |
        |                 | *summary* - to specify the subset of the resource content to be [returned](https://www.hl7.org/fhir/search.html#summary:~:text=3.1.1.5.8-,Summary,-The%20client%20can).                                                                  |
        | Returns         | Requested version specific FHIR resource in specified format \| operationOutcome                                                                                  |
        | Server endpoint | [vread](https://www.hl7.org/fhir/http.html#vread) operation                                                                                                                                   |

        **sample usage**
        ```ballerina
        fhir:FHIRResponse|fhir:FHIRError response = fhirConnector->getByVersion("Patient", "1", "1");
        ```

    ??? note "Update FHIR resource" 

        This method will allow the user to create a new current version for an existing resource, and if the resource doesn’t exist an initial version of the resource will be created. This method can be used when the  user wants to specify their own id instead of the server assigning the resource Id.

        | Method name     | update                                                                                                                                          |
        |:----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
        | Parameters      | *data* - resource data                                                            |
        |                 | *returnMimeType* - The [Mime Type](https://www.hl7.org/fhir/http.html#mime-type:~:text=Content%20Types%20and%20encodings) of the return response |
        |                 | returnPreference - specifies what the return response should [contain](https://www.hl7.org/fhir/http.html#return:~:text=3.1.0.1.8%20create/update/patch/transaction) default - return full resource?                                                                  |
        | Returns         | Returns the updated resource \| operationOutcome                                                                                  |
        | Server endpoint | [Update](https://www.hl7.org/fhir/http.html#update) operation                                                                                                                                   |

        **sample usage**
        ```ballerina
        fhir:FHIRResponse|fhir:FHIRError byId = fhirConnector->update({"resourceType": "Patient", "id": "example"});
        ```

    ??? note "Patch FHIR resource"

        This method will allow the user to create a new current version for an existing resource by updating part of the resource.For we only support [FHIRPath Patch](https://hl7.org/FHIR/fhirpatch.html), the remaining content types will be supported in the future releases.

        | Method name     | getByVersion                                                                                                                                          |
        |:----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
        | Parameters      | *type* - The name of a resource type (e.g. "Patient")                                                                                            |
        |                 | *Id* -The [logical Id](https://www.hl7.org/fhir/resource.html#id) of a resource    
        |                 | *data* - resource data                                                             |
        |                 | *returnMimeType* - The [Mime Type](https://www.hl7.org/fhir/http.html#mime-type:~:text=Content%20Types%20and%20encodings) of the return response |
        |                 | returnPreference - specifies what the return response should [contain](https://www.hl7.org/fhir/http.html#return:~:text=3.1.0.1.8%20create/update/patch/transaction) default - return full resource?                                                                  |
        | Returns         | Returns the patched resource \| operationOutcome                                                                                  |
        | Server endpoint | [Patch](https://www.hl7.org/fhir/http.html#patch) operation                                                                                                                                   | 

        **sample usage**
        ```ballerina
        fhir:FHIRResponse|fhir:FHIRError byId = fhirConnector->patch("Patient","123", {"resourceType": "Patient", "id": "1", "active": true});
        ```  

    ??? note "Delete FHIR resource"                 

        This method will allow the user to delete an existing resource.

        | Method name     | delete                                                                                                                                          |
        |:----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
        | Parameters      | *type* - The name of a resource type (e.g. "Patient")                                                                                            |
        |                 | *Id* -The [logical Id](https://www.hl7.org/fhir/resource.html#id) of a resource    
        | Returns         | nothing \| operationOutcome                                                                                  |
        | Server endpoint | [Delete](https://www.hl7.org/fhir/http.html#delete) operation                                                                                                                                   | 

        **sample usage**
        ```ballerina
        fhir:FHIRResponse|fhir:FHIRError byId = fhirConnector->delete("Patient","123");
        ```

    ??? note "Retrieve history of a FHIR resource"  

        This method will allow the user to retrieve the change history for a particular resource.

        | Method name     | getByVersion                                                                                                                                          |
        |:----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
        | Parameters      | *type* - The name of a resource type (e.g. "Patient")                                                                                            |
        |                 | *Id* -The [logical Id](https://www.hl7.org/fhir/resource.html#id) of a resource    
        |                 | *Parameters* - history search parameters (i.e count, since, at)                                                            |
        |                 | *returnMimeType* - The [Mime Type](https://www.hl7.org/fhir/http.html#mime-type:~:text=Content%20Types%20and%20encodings) of the return response |
        |                 | uriParameters - additional [params](https://www.hl7.org/fhir/http.html#history:~:text=_format%20parameter%2C%20the-,parameters,-to%20this%20interaction) as a name value map |
        | Returns         | Requesed histories \| operationOutcomee                                                                                  |
        | Server endpoint | [History](https://www.hl7.org/fhir/http.html#history) operation                                                                                                                                   |   

        **sample usage**
        ```ballerina
        fhir:FHIRResponse|fhir:FHIRError byId = fhirConnector->getInstanceHistory("Patient", "123");
        ```


    ### Type Level Interactions

    ??? note "Create FHIR resource"

        This method will allow the user to create a  new for a specified type. Here the user doesn't have control over the resource ID, it will be assigned by the server.

        | Method name     | create                                                                                                                                          |
        |:----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
        | Parameters      | *data* - resource data                                                                                             |
        |                 | *returnMimeType* - The [Mime Type](https://www.hl7.org/fhir/http.html#mime-type:~:text=Content%20Types%20and%20encodings) of the return response |
        |                 | *returnPreference* - specifies what the return response should [contain](https://www.hl7.org/fhir/http.html#return:~:text=3.1.0.1.8%20create/update/patch/transaction) default = minimal |
        | Returns         | Returns the created resource \| operationOutcome                                                                                  |
        | Server endpoint | [Create](https://www.hl7.org/fhir/http.html#create) operation                                                                                                                                   | 

        **sample usage**
        ```ballerina
            fhir:FHIRResponse|fhir:FHIRError byId = fhirConnector->create(
                {
                    "resourceType": "Patient",
                    "name": [{"family": "Simpson", "given": ["Homer"]}]
                }
            );
        ```

    ??? note "Search resources on a given type"

        This method will allow the user to search all resources of a particular type by defining search parameters.

        | Method name     | search                                                                                                                                          |
        |:----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
        | Parameters      | *type* - The name of a resource type (e.g. "Patient")
        |                 | *searchParams* - this will be a map of user defined name value pairs (once search parameter records are implemented the map will be replaced.) |
        |                 | *returnMimeType* - The [Mime Type](https://www.hl7.org/fhir/http.html#mime-type:~:text=Content%20Types%20and%20encodings) of the return response |
        | Returns         | Search response \| operationOutcome                                                                                  |
        | Server endpoint | [Search](https://www.hl7.org/fhir/http.html#search) operation   |

        **sample usage**
        ```ballerina
        fhir:FHIRResponse|fhir:FHIRError byId = fhirConnector->search("Patient", {"id": "123"});
        ```

    ??? note "Retrieve history of a resource type"

        This method will allow the user to retrieve the change history for a particular resource type.

        | Method name     | getHistory                                                                                                                                          |
        |:----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
        | Parameters      | *type* - The name of a resource type (e.g. "Patient")
        |                 | *Parameters* - history search parameters (i.e count, since, at) |
        |                 | *returnMimeType* - The [Mime Type](https://www.hl7.org/fhir/http.html#mime-type:~:text=Content%20Types%20and%20encodings) of the return response |
        | Returns         | Requesed histories \| operationOutcome                                                                                  |
        | Server endpoint | [History](https://www.hl7.org/fhir/http.html#history) operation   |

        **sample usage**
        ```ballerina
        fhir:FHIRResponse|fhir:FHIRError byId = fhirConnector->getHistory("Patient", {"_count": "10"});
        ```

    ### System Level Interactions

    ??? note "Get server capabilities" 

        This method will allow the user to retrieve information about a server's capabilities.

        | Method name     | getConformance                                                                                                                                          |
        |:----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
        | Parameters      | *mode* - what type of information needs to be [returned](https://www.hl7.org/fhir/http.html#capabilities:~:text=value%20of%20the-,mode,-parameter%3A) default -full |
        |                 | *returnMimeType* - The [Mime Type](https://www.hl7.org/fhir/http.html#mime-type:~:text=Content%20Types%20and%20encodings) of the return response |
        |                 | *uriParameters* - additional params as a name value map |
        | Returns         | capability  statement \| operationOutcome                                                                                  |
        | Server endpoint | [capabilities](https://www.hl7.org/fhir/http.html#capabilities) operation   |

        **sample usage**
        ```ballerina
        fhir:FHIRResponse|fhir:FHIRError byId = fhirConnector->getConformance();
        ```


    ??? note "Retrieve history  for all the resources"

        This method will allow the user to retrieve the change history for all resources supported by the system.

        | Method name     | getAllHistory                                                                                                                                          |
        |:----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
        | Parameters      | *Parameters* - history search parameters (i.e count, since, at) |
        |                 | *returnMimeType* - The [Mime Type](https://www.hl7.org/fhir/http.html#mime-type:~:text=Content%20Types%20and%20encodings) of the return response |
        | Returns         | Requesed histories \| operationOutcome                                                                                  |
        | Server endpoint | [History](https://www.hl7.org/fhir/http.html#history) operation   |

        **sample usage**
        ```ballerina
        fhir:FHIRResponse|fhir:FHIRError byId = fhirConnector->getAllHistory({"_count": "10"});
        ``` 

    ??? note "Search resources across all resource types"

        This method will allow the user to search across all resource types by defining search parameters.

        | Method name     | searchAll                                                                                                                                          |
        |:----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
        | Parameters      | searchParams - this will be a map of user defined key value pairs (once search parameter records are implemented the map will be replaced. Here we can only use base [search params](https://www.hl7.org/fhir/resource.html#search)) |
        | Returns         | Search results \| operationOutcome                                                                                  |
        | Server endpoint | [Search](https://www.hl7.org/fhir/http.html#search) operation   |

        **sample usage**
        ```ballerina
        fhir:SearchParameters searchParams = {_lastUpdated: ["gt2021-01-01T00:00:00Z"]};
        fhir:FHIRResponse|fhir:FHIRError byId = fhirConnector->searchAll(searchParams);
        ```

    ??? note "Execute batch operations"

        This operation will allow the user to submit a set of actions to perform on a server in a single request. Single request can consist of all the request [types](https://www.hl7.org/fhir/http.html#transaction:~:text=Multiple%20actions%20on%20multiple%20resources%20of%20the%20same%20or%20different%20types%20may%20be%20submitted%2C%20and%20they%20may%20be%20a%20mix%20of%20other%20interactions%20defined%20on%20this%20page%20(e.g.%20read%2C%20search%2C%20create%2C%20update%2C%20delete%2C%20etc.)%2C%20or%20using%20the%20operations%20framework.).

        | Method name     | batchRequest                                                                                                                                          |
        |:----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
        | Parameters      | *data* -  request data (bundle with type batch) |
        |                 | *returnMimeType* - The [Mime Type](https://www.hl7.org/fhir/http.html#mime-type:~:text=Content%20Types%20and%20encodings) of the return response |
        | Returns         | Batch request results \| operationOutcome                                                                                  |
        | Server endpoint | [Batch](https://www.hl7.org/fhir/http.html#transaction) operation   |

        **sample usage**
        ```ballerina
        fhir:FHIRResponse|fhir:FHIRError byId = fhirConnector->batchRequest({"resourceType": "Bundle", "type": "message", "entry": [{"request": {"method": "GET", "url": "Patient?_lastUpdated=gt2021-01-01T00:00:00Z"}}]});
        ```

    ??? note "Execute transaction operation"

        This operation will allow the user to submit a set of actions to perform on a server in a single request in a transactional manner. Single request can consist of all the request [types](https://www.hl7.org/fhir/http.html#transaction:~:text=Multiple%20actions%20on%20multiple%20resources%20of%20the%20same%20or%20different%20types%20may%20be%20submitted%2C%20and%20they%20may%20be%20a%20mix%20of%20other%20interactions%20defined%20on%20this%20page%20(e.g.%20read%2C%20search%2C%20create%2C%20update%2C%20delete%2C%20etc.)%2C%20or%20using%20the%20operations%20framework.).

        | Method name     | batchRequest                                                                                                                                          |
        |:----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
        | Parameters      | *data* -  request data (bundle with type batch) |
        |                 | *returnMimeType* - The [Mime Type](https://www.hl7.org/fhir/http.html#mime-type:~:text=Content%20Types%20and%20encodings) of the return response |
        | Returns         | Batch request results \| operationOutcome                                                                                  |
        | Server endpoint | [Transaction](https://www.hl7.org/fhir/http.html#transaction) operation   |

        Both batch and transaction will be using the FHIR [bundle](https://www.hl7.org/fhir/bundle.html) resource with the types batch and transaction respectively.
        For delete,  get methods: the request will have the [format](https://www.hl7.org/fhir/bundle-transaction.json.html#:~:text=%7B%0A%20%20%20%20%20%20%22request%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%22method%22%3A%20%22DELETE%22%2C%0A%20%20%20%20%20%20%20%20%22url%22%3A%20%22Patient/234%22%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D), for post,patch, update the request will have the [format](https://www.hl7.org/fhir/bundle-transaction.json.html#:~:text=%7B%0A%20%20%20%20%20%20%22fullUrl%22%3A%20%22urn%3Auuid%3A88f151c0,fhir/ids%7C234234%22%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%2C).

        **sample usage**
        ```ballerina
        fhir:FHIRResponse|fhir:FHIRError byId = fhirConnector->'transaction({"resourceType": "Bundle", "type": "transaction", "entry": [{"request": {"method": "GET", "url": "Patient/1"}}]});
        ```


    !!! note
            * The default Mime type value will be application/fhir+json, and can be changed at operation level.

            * Function parameter summary will be an Enum consisting of a set of types specified in the FHIR specification.

            * Required fields are marked with an asterisk(*).

            * In the initial implementation JSON or XML will be used instead of record representation of the resource types since FHIR model implementation is yet to be completed.

            * In search related operations, in the implementation the search parameters will be a map of key value pairs (ex:{"key" : "value"}). 


=== "Micro Integrator"

    The Micro Integrator FHIR repository connector will allow the users to interact with a FHIR server. The connector supports all the standard interactions specified in the FHIR specification.

    The following example demonstrates how to use the FHIR Repository connector to interact with a FHIR server.

    ## Step 1: Set Up WSO2 Micro Integrator

    Before you begin, download the [WSO2 Micro Integrator](https://wso2.com/integration/micro-integrator/) and install by following the [Installation Steps](../../install-and-setup/manual.md#ballerina-installation-steps).

    ## Step 2: Implement the logic to connect to the FHIR Repository

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
    3. Add fhirrepository connector to the project.
    ![FHIR Repository connector](../../../assets/img/guildes/handling-fhir/fhir-repository-connector.png)    

    4. Implement the logic to connect to the FHIR Repository. In this sample, we are connecting to a HAPI Public FHIR server using the FHIR Repository connector. We are using `init` operation to initialize the connection to the FHIR server and `search` operation to search for a patient with the name "homer".
        ![FHIR Repository connector flow](../../../assets/img/guildes/handling-fhir/fhir-repository-connector-flow-mi.png)

        ```xml
        <?xml version="1.0" encoding="UTF-8"?>
        <api context="/r4" name="PatientAPI" xmlns="http://ws.apache.org/ns/synapse">
            <resource methods="GET" uri-template="/Patient">
                <inSequence>
                    <!-- Initialize the FHIR repository connector -->
                    <fhirrepository.init>
                        <!-- The type of the FHIR Repository. Supported types: Azure and Other -->
                        <repositoryType>Other</repositoryType>
                        <!-- The FHIR service Root URL of the FHIR repository -->
                        <base>https://hapi.fhir.org/baseR4</base>
                        <requireBulk>false</requireBulk>
                    </fhirrepository.init>
                    <!-- Search for a patient with the name "homer" -->
                    <fhirrepository.search>
                        <resourceType>Patient</resourceType>
                        <!-- Search parameters as query string-->
                        <queryParameters>name=homer</queryParameters>
                        <urlRewrite>true</urlRewrite>
                    </fhirrepository.search>
                    <respond />
                </inSequence>
                <faultSequence>
                </faultSequence>
            </resource>
        </api>
        ```
    ## Step 3: Deploy and Test the Integration Project
    
    Deploy the integration project to the MI runtime by following the guide on [Deploying the Integration Project](https://mi.docs.wso2.com/en/latest/develop/deploy-artifacts/) and test the API using a REST client.   


    ## Operations

    This connector is developed to support the Azure FHIR Repository and any other FHIR Repository with either OAuth2.0 based security or no security. All the connector operations are configurable using WSO2 Micro Integration [VS code extension's](https://marketplace.visualstudio.com/items?itemName=WSO2.micro-integrator) no code graphical editor.

    ??? note "Init operation"

        Before performing any FHIR Repository Connector operations, make sure to include the ***<fhirrepository.init\>*** element in your configuration. The ***<fhirrepository.init\>*** element authenticates the user and grants them access to the FHIR Server using OAuth2 authentication. If your FHIR server requires only passing an OAuth2 access token or requires no security, please configure the accessToken property to the proper token value or a dummy value, respectively.

        **Properties**

        * repositoryType : The type of the FHIR Repository. 
            - Azure - for Azure FHIR repository
            - Other - for any other repository
        * baseUrl : The FHIR service Root URL of the FHIR repository.
        * clientId : Client ID of the registered application.
        * clientSecret : Client Secret of the registered application.
        * accessToken (optional) : Access Token can be given directly if clientId and clientSecret is not given.
        * tokenEndpoint : FHIR Server token Endpoint

        If you are integrating with an FHIR repository without any security or only with an access token, at minimum, you need to have the following in your sequence.

        ```
        <fhirrepository.init>
        <repositoryType>Other</repositoryType>
        <base>https://hapi.fhir.org/baseR5</base>
        <accessToken>notneeded</accessToken>
        </fhirrepository.init>
        ```

        If you are integrating with the Azure FHIR repository, your configurations may look like the following;

        ```
        <fhirrepository.init>
        <repositoryType>Azure</repositoryType>
        <base>https://xxxxxxxxx.fhir.azurehealthcareapis.com</base>
        <clientId>xxxxxxxxx</clientId>
        <clientSecret>xxxxxxxxx</clientSecret>
        <tokenEndpoint>https://login.microsoftonline.com/xxxxxxxxx/oauth2/token</tokenEndpoint>
        </fhirrepository.init>
        ```

        !!! note

            Change the repositoryType to something other than Azure from the above configuration, if you are planning to integrate with a FHIR repository that is secured by OAuth2.0 protocol.

        It is necessary to have repositoryType, baseUrl, clientId, clientSecret, and tokenEndpoint or repositoryType, baseUrl, and accessToken in one of the above-mentioned ways.

        **Optional - Additional Information**

        You have to add the following message formatters and messageBuilders into the deployment.toml configuration, if you are planning to use the patch operation.

        **Required message formatters**
        ```
        [[custom_message_formatters]]
        class = "org.apache.synapse.commons.json.JsonStreamFormatter"
        content_type = "application/json-patch+json"
        ```

        **Required messageBuilders**
        ```
        [[custom_message_builders]]
        class = "org.apache.synapse.commons.json.JsonStreamBuilder"
        content_type = "application/json-patch+json"
        ```

        Now, you have successfully created a connection to the FHIR repository. Proceed to the next section to understand other connector operations. 

    ??? note "Connect Operation"

        This operation allows you to expose the FHIR API of the FHIR repository as it is. This operation is ideal for exposing the FHIR repository as it is via the WSO2 server. This mimics a proxy behaviour.

        **Properties**

        * resourceType (Optional) : The type of the resource (Eg: Patient)
        * urlRewrite (Optional) :  Boolean value whether you want to rewrite FHIR server URL of the FHIR repository to the one you have configured in the WSO2 Micro Integrator’s  deployment.toml ***[healthcare.fhir].base_url***

        ```
        <?xml version="1.0" encoding="UTF-8"?>
        <api context="/fhir/r4" name="FHIRRepositoryConnectorAPI" xmlns="http://ws.apache.org/ns/synapse">
            <resource faultSequence="FhirRepositoryFaultSequence" methods="DELETE POST PUT PATCH GET">
                <inSequence>
                    <fhirrepository.init/>
                    <fhirrepository.connect>
                        <urlRewrite>true</urlRewrite>
                    </fhirrepository.connect>
                    <respond/>
                </inSequence>
                <outSequence/>
            </resource>
        </api>
        ```

        This operation is ideal for exposing the FHIR repository as it is via the WSO2 server. This mimics a proxy behaviour. 

        !!! note
            You must use the correct HTTP method, headers and the full endpoint URL to perform the connect operation.

        * GET

        Following is a sample REST request to retrieve a patient using the patient name.

        ``` curl -v -X GET http://localhost:8290/fhir/r4/Patient?name=John ```

        * POST

        Following is a sample REST request to create a new patient resource.

        ``` curl -v -X POST http://localhost:8290/fhir/r4/Patient -H "Content-Type: application/json" -d @data.json ```

        * PUT

        Following is a sample REST request to update an existing patient resource using its ID.

        ``` curl -v -X PUT -H "Content-Type: application/json" -d @data.json http://localhost:8290/fhir/r4/Patient/0e906902-a4b6-4bd7-83cf-0bd6a5968baa ```

        * DELETE

        Following is a sample REST request to delete a patient resource.

        ``` curl -v -X DELETE http://localhost:8290/fhir/r4/Patient/b3aa84ff-2958-4525-8cb1-82512f6bb145 ```

        * PATCH

        Following is a sample REST request to update an existing resource by posting a set of changes to it.

        ``` curl -v -X PATCH http://localhost:8290/fhir/r4/Patient/94f24813-9fe7-4191-a9dc-733909a6d591 -H "Content-Type: application/json-patch+json" -d @patch.json ```

        !!! note
            Azure FHIR Server currently supports JSON patches only.

        !!! note
            You have to use the Content-Type as “application/json-patch+json”

        Sample json request body (patch.json)

        ```
        [{ 
        "op": "replace", 
        "path": "/birthDate", 
        "value": "1999-09-16" 
        }]
        ```

        If you want to use individual operations and have more control over the FHIR API you expose through the WSO2 server, you can use the respective individual operations as specified below.


    ??? note "Batch Operation" 
        **Properties**

        * urlRewrite (Optional) :  Boolean value whether you want to rewrite FHIR server URL of the FHIR repository to the one you have configured in the WSO2 Micro Integrator’s  deployment.toml ***[healthcare.fhir].base_url***

        ```
        <?xml version="1.0" encoding="UTF-8"?>
        <api context="/fhir/r4" name="FHIRRepositoryConnectorAPI" xmlns="http://ws.apache.org/ns/synapse">
            <resource faultSequence="FhirRepositoryFaultSequence" methods="POST">
                <inSequence>
                    <fhirrepository.init/>
                    <fhirrepository.batch>
                        <urlRewrite>true</urlRewrite>
                    </fhirrepository.batch>
                    <respond/>
                </inSequence>
                <outSequence/>
            </resource>
        </api>
        ```

        This operation allows you to post a new FHIR bundle to the FHIR  repository in order to create multiple FHIR resources.

        Example:

        ``` curl -v -X POST http://localhost:8290/fhir/r4 -d @bundle.json -H "Content-type: application/fhir+json" ```

        **Sample payload(bundle.json)**

        ??? Request
            ```
            {
            "resourceType": "Bundle",
            "type": "batch",
            "entry": [
                {
                "fullUrl": "urn:uuid:5586f623-1391-40e9-a8cc-ed32cf5b607d",
                "resource": {
                    "resourceType": "Patient",
                    "id": "5586f623-1391-40e9-a8cc-ed32cf5b607d",
                    "text": {
                    "status": "generated",
                    "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">Generated by <a href=\"https://github.com/synthetichealth/synthea\">Synthea</a>.Version identifier: v2.4.0-404-ge7ce2295\n .   Person seed: 8190460250141936893  Population seed: 0</div>"
                    },
                    "extension": [
                    {
                        "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race",
                        "extension": [
                        {
                            "url": "ombCategory",
                            "valueCoding": {
                            "system": "urn:oid:2.16.840.1.113883.6.238",
                            "code": "2106-3",
                            "display": "White"
                            }
                        },
                        {
                            "url": "text",
                            "valueString": "White"
                        }
                        ]
                    },
                    {
                        "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity",
                        "extension": [
                        {
                            "url": "ombCategory",
                            "valueCoding": {
                            "system": "urn:oid:2.16.840.1.113883.6.238",
                            "code": "2186-5",
                            "display": "Not Hispanic or Latino"
                            }
                        },
                        {
                            "url": "text",
                            "valueString": "Not Hispanic or Latino"
                        }
                        ]
                    },
                    {
                        "url": "http://hl7.org/fhir/StructureDefinition/patient-mothersMaidenName",
                        "valueString": "Beulah33 Batz141"
                    },
                    {
                        "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex",
                        "valueCode": "M"
                    },
                    {
                        "url": "http://hl7.org/fhir/StructureDefinition/patient-birthPlace",
                        "valueAddress": {
                        "city": "Orange",
                        "state": "Massachusetts",
                        "country": "US"
                        }
                    },
                    {
                        "url": "http://synthetichealth.github.io/synthea/disability-adjusted-life-years",
                        "valueDecimal": 0.0
                    },
                    {
                        "url": "http://synthetichealth.github.io/synthea/quality-adjusted-life-years",
                        "valueDecimal": 0.0
                    }
                    ],
                    "name": [
                    {
                        "use": "official",
                        "family": "Chri",
                        "given": [
                        "Jewella"
                        ]
                    }
                    ],
                    "telecom": [
                    {
                        "system": "phone",
                        "value": "555-430-2020",
                        "use": "home"
                    }
                    ],
                    "gender": "male",
                    "birthDate": "2019-01-15",
                    "address": [
                    {
                        "extension": [
                        {
                            "url": "http://hl7.org/fhir/StructureDefinition/geolocation",
                            "extension": [
                            {
                                "url": "latitude",
                                "valueDecimal": 42.492116386479395
                            },
                            {
                                "url": "longitude",
                                "valueDecimal": -70.9878307878303
                            }
                            ]
                        }
                        ],
                        "line": [
                        "1099 Franecki Rue Unit 60"
                        ],
                        "city": "Melrose",
                        "state": "Massachusetts",
                        "postalCode": "02176",
                        "country": "US"
                    }
                    ],
                    "maritalStatus": {
                    "coding": [
                        {
                        "system": "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
                        "code": "S",
                        "display": "Never Married"
                        }
                    ],
                    "text": "Never Married"
                    },
                    "multipleBirthBoolean": false,
                    "communication": [
                    {
                        "language": {
                        "coding": [
                            {
                            "system": "urn:ietf:bcp:47",
                            "code": "en-US",
                            "display": "English"
                            }
                        ],
                        "text": "English"
                        }
                    }
                    ]
                },
                "request": {
                    "method": "POST",
                    "url": "Patient"
                }
                }
            ]
            }
            ```

    ??? note "Create Operation"

        **Properties**

        * resourceType : The type of the resource (Eg: Patient)
        * urlRewrite (Optional) :  Boolean value whether you want to rewrite FHIR server URL of the FHIR repository to the one you have configured in the WSO2 Micro Integrator’s  deployment.toml ***[healthcare.fhir].base_url***

        ```
        <?xml version="1.0" encoding="UTF-8"?>
        <api context="/fhir/r4" name="FHIRRepositoryConnectorAPI" xmlns="http://ws.apache.org/ns/synapse">
            <resource faultSequence="FhirRepositoryFaultSequence" methods="POST" uri-template="/{resource}">
                <inSequence>
                    <fhirrepository.init/>
                    <fhirrepository.create>
                    <resourceType>{$ctx:uri.var.resource}</resourceType>
                    <urlRewrite>true</urlRewrite>
                    </fhirrepository.create>
                    <respond/>
                </inSequence>
                <outSequence/>
            </resource>
        </api>
        ```

        Following is a sample REST request to create a new resource.

        ``` curl -v -X POST http://localhost:8290/fhir/r4/Patient -H "Content-type: application/fhir+json" -d @data.json ```

    ??? note "Delete Operation"
        **Properties**

        * resourceType : The type of the resource (Eg: Patient)
        * id : The logical ID of the resource (Eg: 8e76bd23-e065-4921-b90d-6116d3a0dbe2)
        * urlRewrite (Optional) :  Boolean value whether you want to rewrite FHIR server URL of the FHIR repository to the one you have configured in the WSO2 Micro Integrator’s  deployment.toml ***[healthcare.fhir].base_url*** 

        ```
        <?xml version="1.0" encoding="UTF-8"?>
        <api context="/fhir/r4" name="FHIRRepositoryConnectorAPI" xmlns="http://ws.apache.org/ns/synapse">
            <resource faultSequence="FhirRepositoryFaultSequence" methods="DELETE" uri-template="/{resource}/{id}">
                <inSequence>
                    <fhirrepository.init/>
                    <fhirrepository.delete>
                    <resourceType>{$ctx:uri.var.resource}</resourceType>
                    <id>{$ctx:uri.var.id}</id>
                    </fhirrepository.delete>
                    <respond/>
                </inSequence>
                <outSequence/>
            </resource>
        </api>
        ```

        Following is a sample REST request to delete a resource.

        ``` curl -v -X DELETE http://localhost:8290/fhir/r4/Patient/8e76bd23-e065-4921-b90d-6116d3a0dbe2 ```

    ??? note "Get Capability Statement Operation"
        **Properties**

        * urlRewrite (Optional) :  Boolean value whether you want to rewrite FHIR server URL of the FHIR repository to the one you have configured in the WSO2 Micro Integrator’s  deployment.toml ***[healthcare.fhir].base_url***

        ```
        <?xml version="1.0" encoding="UTF-8"?>
        <api context="/fhir/r4" name="FHIRRepositoryConnectorAPI" xmlns="http://ws.apache.org/ns/synapse">
            <resource faultSequence="FhirRepositoryFaultSequence" methods="GET">
                <inSequence>
                    <fhirrepository.init/>
                    <fhirrepository.getCapabilityStatement>
                        <urlRewrite>true</urlRewrite>
                    </fhirrepository.getCapabilityStatement>
                    <respond/>
                </inSequence>
                <outSequence/>
            </resource>
        </api>
        ```

        Following is a sample REST request to get the capability statement.

        ``` curl -v -X GET http://localhost:8290/fhir/r4 ```

    ??? note "Patch Operation"

        **Properties**

        * resourceType : The type of the resource (Eg: Patient)
        * id : The logical ID of the resource (Eg: 61db4f41-2a28-4647-914c-72f3558bcaaf)
        * urlRewrite (Optional) :  Boolean value whether you want to rewrite FHIR server URL of the FHIR repository to the one you have configured in the WSO2 Micro Integrator’s  deployment.toml ***[healthcare.fhir].base_url***

        ```
        <?xml version="1.0" encoding="UTF-8"?>
        <api context="/fhir/r4" name="FHIRRepositoryConnectorAPI" xmlns="http://ws.apache.org/ns/synapse">
            <resource faultSequence="FhirRepositoryFaultSequence" methods="PATCH" uri-template="/{resource}/{id}">
                <inSequence>
                    <fhirrepository.init/>
                    <fhirrepository.patch>
                    <resourceType>{$ctx:uri.var.resource}</resourceType>
                    <id>{$ctx:uri.var.id}</id>
                    <urlRewrite>true</urlRewrite>
                    </fhirrepository.patch>
                    <respond/>
                </inSequence>
                <outSequence/>
            </resource>
        </api>
        ```

        Following is a sample REST request to get the capability statement.

        ``` curl -v -X PATCH http://localhost:8290/fhir/r4/Patient/5fdd5542-721e-4704-882d-912279af6b3a -H "Content-type: application/fhir+json" -d @patch.json ```

    ??? note "Read By ID Operation"

        **Properties**

        * resourceType : The type of the resource (Eg: Patient)
        * id : The logical ID of the resource (Eg: 61db4f41-2a28-4647-914c-72f3558bcaaf)
        * urlRewrite (Optional) :  Boolean value whether you want to rewrite FHIR server URL of the FHIR repository to the one you have configured in the WSO2 Micro Integrator’s  deployment.toml ***[healthcare.fhir].base_url*** 

        ```
        <?xml version="1.0" encoding="UTF-8"?>
        <api context="/fhir/r4" name="FHIRRepositoryConnectorAPI" xmlns="http://ws.apache.org/ns/synapse">
            <resource faultSequence="FhirRepositoryFaultSequence" methods="GET" uri-template="/{resource}/{id}">
                <inSequence>
                    <fhirrepository.init/>
                    <fhirrepository.readById>
                    <resourceType>{$ctx:uri.var.resource}</resourceType>
                    <id>{$ctx:uri.var.id}</id>
                    <urlRewrite>true</urlRewrite>
                    </fhirrepository.readById>
                    <respond/>
                </inSequence>
                <outSequence/>
            </resource>
        </api>
        ```

        Following is a sample REST request to retrieve a resource using its id.

        ``` curl -v -X GET http://localhost:8290/fhir/r4/Patient/5fdd5542-721e-4704-882d-912279af6b3a```

    ??? note "Search Operation"
        **Properties**

        * resourceType : The type of the resource (Eg: Patient)
        * queryParameters (Optional) : The string of parameter/s. (Eg: name=John, name=Peter&age=12)
        * urlRewrite (Optional) :  Boolean value whether you want to rewrite FHIR server URL of the FHIR repository to the one you have configured in the WSO2 Micro Integrator’s  deployment.toml ***[healthcare.fhir].base_url***

        ```
        <?xml version="1.0" encoding="UTF-8"?>
        <api context="/fhir/r4" name="FHIRRepositoryConnectorAPI" xmlns="http://ws.apache.org/ns/synapse">
            <resource faultSequence="FhirRepositoryFaultSequence" methods="GET">
                <inSequence>
                    <fhirrepository.init/>
                    <fhirrepository.search>
                        <resourceType>Patient</resourceType>
                        <queryParameters>name=Nisini</queryParameters>
                        <urlRewrite>true</urlRewrite>
                    </fhirrepository.search>
                    <respond/>
                </inSequence>
                <outSequence/>
            </resource>
        </api>
        ```

        Following is a sample REST request to retrieve a resource using its search query parameters.

        ``` curl -v -X GET http://localhost:8290/fhir/r4 ```

    ??? note "Update Operation"
        **Properties**

        * resourceType : The type of the resource (Eg: Patient)
        * id : The logical ID of the resource (Eg: 61db4f41-2a28-4647-914c-72f3558bcaaf)
        * urlRewrite (Optional) : Boolean value whether you want to rewrite FHIR server URL of the FHIR repository to the one you have configured in the WSO2 Micro Integrator’s  deployment.toml ***[healthcare.fhir].base_url***

        ```
        <?xml version="1.0" encoding="UTF-8"?>
        <api context="/fhir/r4" name="FHIRRepositoryConnectorAPI" xmlns="http://ws.apache.org/ns/synapse">
            <resource faultSequence="FhirRepositoryFaultSequence" methods="PUT">
                <inSequence>
                    <fhirrepository.init/>
                    <fhirrepository.update>
                        <resourceType>Patient</resourceType>
                        <id>5fdd5542-721e-4704-882d-912279af6b3a</id>
                        <urlRewrite>true</urlRewrite>
                    </fhirrepository.update>
                    <respond/>
                </inSequence>
                <outSequence/>
            </resource>
        </api>
        ```

        Following is a sample REST request to update a resource using its ID. 

        curl -v -X PUT -H "Content-type: application/fhir+json" -d @data.json http://localhost:8290/fhir/r4

    ??? note "Version Read Operation"
        **Properties**

        * resourceType : The type of the resource (Eg: Patient)
        * id : The logical ID of the resource (Eg: 61db4f41-2a28-4647-914c-72f3558bcaaf)
        * versionId : The version ID of the resource
        * urlRewrite (Optional) :  Boolean value whether you want to rewrite FHIR server URL of the FHIR repository to the one you have configured in the WSO2 Micro Integrator’s  deployment.toml ***[healthcare.fhir].base_url***

        ```
        <?xml version="1.0" encoding="UTF-8"?>
        <api context="/fhir/r4" name="FHIRRepositoryConnectorAPI" xmlns="http://ws.apache.org/ns/synapse">
            <resource faultSequence="FhirRepositoryFaultSequence" methods="DELETE POST PUT PATCH GET">
                <inSequence>
                    <fhirrepository.init/>
                    <fhirrepository.vread>
                        <resourceType>Patient</resourceType>
                        <id>5fdd5542-721e-4704-882d-912279af6b3a</id>
                        <versionId>1</versionId>
                        <urlRewrite>true</urlRewrite>
                    </fhirrepository.vread>
                    <respond/>
                </inSequence>
                <outSequence/>
            </resource>
        </api>
        ```

        Following is a sample REST request to read the state of a specific version of the resource. 

        ``` curl -v -X GET http://localhost:8290/fhir/r4 ```

    ## Error Handling in the FHIR Repository Connector

    If there is an error occurring in the connector, it will throw a synapse exception, and it will trigger the fault sequence which is inside the integration project.

    **Fault sequence**

    The integration studio project contains a fault sequence to create the operation outcome and serialize the operation.

    ```
    <?xml version="1.0" encoding="UTF-8"?>
    <sequence name="FhirRepositoryFaultSequence" trace="disable" xmlns="http://ws.apache.org/ns/synapse">
        <log level="custom">
            <property expression="$ctx:_OH_PROP_FHIR_ERROR_DETAIL_CODE" name="_OH_PROP_FHIR_ERROR_DETAIL_CODE"/>
            <property expression="$ctx:_OH_PROP_FHIR_ERROR_DETAIL_DISPLAY" name="_OH_PROP_FHIR_ERROR_DETAIL_DISPLAY"/>
        </log>
        <fhirOperationOutcome.create>
            <objectId>FAULT_RESPONSE_OBJ</objectId>
            <issue.severity>{$ctx:_OH_PROP_FHIR_ERROR_SEVERITY_}</issue.severity>
            <issue.details.coding.system>{$ctx:_OH_PROP_FHIR_ERROR_DETAIL_SYSTEM_}</issue.details.coding.system>
            <issue.details.coding.code>{$ctx:_OH_PROP_FHIR_ERROR_DETAIL_CODE_}</issue.details.coding.code>
            <issue.details.coding.display>{$ctx:_OH_PROP_FHIR_ERROR_DETAIL_DISPLAY_}</issue.details.coding.display>
            <issue.diagnostics>{$ctx:_OH_PROP_FHIR_ERROR_DIAGNOSTICS_}</issue.diagnostics>
            <issue.code>{$ctx:_OH_PROP_FHIR_ERROR_CODE_}</issue.code>
        </fhirOperationOutcome.create>
        <fhirBase.serialize>
            <objectId>FAULT_RESPONSE_OBJ</objectId>
        </fhirBase.serialize>
        <respond/>
    </sequence>
    ```

    !!! note
        The fault sequence must be defined when creating a new API resource in the integration project

    **Error properties**

    The following error properties will be populated according to the error that occurs in the connector.

    * _OH_PROP_FHIR_ERROR_SEVERITY
    * _OH_PROP_FHIR_ERROR_CODE
    * _OH_PROP_FHIR_ERROR_DETAIL_CODE
    * _OH_PROP_FHIR_ERROR_DETAIL_SYSTEM
    * _OH_PROP_FHIR_ERROR_DETAIL_DISPLAY
    * _OH_PROP_FHIR_ERROR_DIAGNOSTICS

    ***_OH_PROP_FHIR_ERROR_SEVERITY***

    * This indicates whether the issue indicates a variation from successful processing.
    * Following values can be assigned as OH_PROP_FHIR_ERROR_SEVERITY.


    |Code       |Display    |Definition  |
    |:----------|:----------|:-----------|
    |fatal      |Fatal      |The issue caused the action to fail and no further checking could be performed|
    |error      |Error      |The issue is sufficiently important to cause the action to fail|
    |warning    |Warning    |The issue is not important enough to cause the action to fail but may cause it to be performed suboptimally or in a way that is not as desired|
    |information|Information|The issue has no relation to the degree of success of the action|

    ***_OH_PROP_FHIR_ERROR_CODE***

    * This describes the type of the issue. The system that creates an OperationOutcome SHALL choose the most applicable code from the IssueType value set, and may additional provide its own code for the error in the details element.
    * Following values can get as OH_PROP_FHIR_ERROR_CODE.


    |Code   |Display        |Definition  |
    |:------|:--------------|:-----------|
    |invalid|Invalid Content|Content invalid against the specification or a profile|
    |login  |Login Required |The client needs to initiate an authentication process|

    ***_OH_PROP_FHIR_ERROR_DETAIL_CODE***

    * This is a symbol in syntax defined by the system. The symbol may be a predefined code or an expression in a syntax defined by the coding system.
    * Eg: If the Code is 'invalid' you will get the OH_PROP_FHIR_ERROR_DETAIL_CODE as 'Invalid Content'

    ***_OH_PROP_FHIR_ERROR_DETAIL_SYSTEM***

    * This is the identification of the code system that defines the meaning of the symbol in the code.
    * Eg: https://healthcare.wso2.org/CodeSystem/operation-outcome will be the value of this property.

    ***_OH_PROP_FHIR_ERROR_DETAIL_DISPLAY***

    * This is a representation of the meaning of the code in the system, following the rules of the system.
    * Ex : If the resource ID is missing in the integration project it will give 'Invalid resource Id' as the value of this property.

    ***_OH_PROP_FHIR_ERROR_DIAGNOSTICS***

    * This is additional diagnostic information about the issue.
    * Ex : If the resource ID is missing in the integration project it will give 'Operation was not attempted because the resource Id is not presented' as the value of this property.

