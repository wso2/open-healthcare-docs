
Go through the following steps to setup the Micro Integrator server for VSCode. 

1. Install WSO2 Micro Integrator Extension in VSCode. Install [Micro Integrator Server runtime](https://mi.docs.wso2.com/en/latest/install-and-setup/install/installing-mi/) and [Setup Tooling](https://mi.docs.wso2.com/en/latest/develop/mi-for-vscode/install-wso2-mi-for-vscode/#install-micro-integrator-for-vs-code) for VSCode. 

2. Download the Micro Integrator 4.3.0 distribution as a ZIP file from [here](https://github.com/wso2/micro-integrator/releases/download/v4.3.0/wso2mi-4.3.0.zip) and   extract the zip file. 
3. Go to wso2mi-4.3.0/conf/deployment.toml file. 
4. Add the following configurations. 
    ```
    [[custom_message_formatters]]
    class = "org.apache.synapse.commons.json.JsonStreamFormatter"
    content_type = "application/json+fhir"

    [[custom_message_builders]]
    class = "org.apache.synapse.commons.json.JsonStreamBuilder"
    content_type = "application/json+fhir"

    [[custom_message_formatters]]
    class = "org.apache.synapse.commons.json.JsonStreamFormatter"
    content_type = "application/fhir+json"

    [[custom_message_builders]]
    class = "org.apache.synapse.commons.json.JsonStreamBuilder"
    content_type = "application/fhir+json"

    [[custom_message_formatters]]
    class = "org.apache.axis2.transport.http.ApplicationXMLFormatter"
    content_type = "application/xml+fhir"

    [[custom_message_builders]]
    class = "org.apache.axis2.builder.ApplicationXMLBuilder"
    content_type = "application/xml+fhir"

    [[custom_message_formatters]]
    class = "org.apache.axis2.transport.http.ApplicationXMLFormatter"
    content_type = "application/fhir+xml"

    [[custom_message_builders]]
    class = "org.apache.axis2.builder.ApplicationXMLBuilder"
    content_type = "application/fhir+xml"
    ```
