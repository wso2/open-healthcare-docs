
Go through the following steps to setup the Micro Integrator server for VSCode. 

1. Install [Micro Integrator Server runtime](https://mi.docs.wso2.com/en/latest/install-and-setup/install/installing-mi/)  

2. Install [WSO2 Micro Integrator Extension](https://mi.docs.wso2.com/en/latest/develop/mi-for-vscode/install-wso2-mi-for-vscode/#install-micro-integrator-for-vs-code) in VSCode. 

3. In the downloaded wso2mi pack, the following configurations need to be done. Go to [WSO2-MI-HOME]/conf/deployment.toml file. 
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
