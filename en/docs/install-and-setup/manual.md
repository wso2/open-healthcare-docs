# Manual Installation Guide

## Setting Up WSO2 API Manager for Healthcare

### Prerequisites
1. Download supported base distribution of [WSO2 API Manager](https://wso2.com/api-management/previous-releases/) and [WSO2 Healthcare APIM Accelerator](https://github.com/wso2/healthcare-accelerator/releases). Refer to the [Product Compatibilities](#product-compatibilities).

### Installation Steps
1. Extract WSO2 APIM product. Let's call it `<WSO2_APIM_HOME>`.
2. Navigate to `<WSO2_APIM_HOME>/bin` directory and execute the update command based on the operating system to bring WSO2 API Manager up to date by running the [Update Tool](https://updates.docs.wso2.com/en/latest/updates/update-tool/). 
3. Extract WSO2 Healthcare APIM Accelerator to `<WSO2_APIM_HOME>`. Let's call it `<WSO2_HC_APIM_ACC_HOME>`.
4. [Optional] Check the accelerator configurations in <WSO2_HC_APIM_ACC_HOME>/conf/config.toml file to enable or disable features.
    
    ???+ note
        Accelerator configs looks like below;

        | Setting Description                                         | Configuration Option                 | Default Value |
        |-------------------------------------------------------------|--------------------------------------|---------------|
        | Enable or disable auto-generation of the FHIR capability statement | `enable_fhir_metadata_endpoint`      | `true`        |
        | Enable or disable the well-known endpoint for OAuth 2.0 discovery  | `enable_well_known_endpoint`         | `true`        |
        | Enable or disable the SMART on FHIR features               | `enable_smart_on_fhir`               | `true`        |
        | Enable or disable developer sign-up and app creation approval | `enable_developer_workflow`         | `false`        |
        | Enable or disable the healthcare theme                     | `enable_healthcare_theme`            | `true`        |

5. Navigate to `<WSO2_HC_APIM_ACC_HOME>` directory and execute following command. This will copy the artifacts to the WSO2 APIM and add the required configurations.
```sh
./merge.sh
``` 

6. Navigate to `<WSO2_APIM_HOME>` directory and execute following command to start the APIM server with WSO2 OH Accelerators.
```sh
./bin/api-manager.sh
```

???+ note
    Running `./bin/merge.sh` script creates a audit log folder in the product home. Structure of it looks like below;

    ```
    hc-accelerator
    ├── backup
    │   ├── conf
    │   ├── jaggeryapps
    │   └── webapps
    └── merge_audit.log

    ```

    - `merge_audit.log` will have an audit line per execution of the `merge.sh` script of the accelerator. Each line contains execution date and time, user account and the version of the accelerator. Example log line is below;
    ```buttonless
    Mon May 31 22:01:55 +0530 2021 - john - WSO2 Healthcare API Manager 1.0.0 Accelerator - v1.0.0
    ```
    - `backup` folder contains the files that were originally there in the APIM product before running the accelerator. Please note that only the last state will be there. 

### Product Compatibilities

| Product          | Compatible Healthcare Accelarator  |
|---------------------------|-----------------------------------------|
|<center>APIM 4.2.0</center>|<center>[APIM HC Accelerator 1.0.0](https://github.com/wso2/healthcare-accelerator/releases/tag/v1.0.0)</center>                           |


## Setting Up Integration Layer for Healthcare

{!includes/bal-mi-note.md!}

=== "Ballerina"
    <a id="ballerina-installation-steps"></a>
    ### Installation Steps

    Go through the following steps to setup the Ballerina. 

    1. Follow the instructions in the <a href="https://ballerina.io/downloads/installation-options/" target="_blank">Ballerina Installation Options</a> to install Ballerina runtime.

    2. Setup the Ballerina VSCode extension by following the instructions in the <a href="https://ballerina.io/learn/get-started/#set-up-the-editor/" target="_blank">Ballerina VSCode Extension</a> guide.

=== "Micro Integrator"
    <a id="mi-installation-steps"></a>
    ###  Installation Steps

    Go through the following steps to setup the Micro Integrator server. 

    1. Install [WSO2 Micro Integrator Server runtime](https://mi.docs.wso2.com/en/latest/install-and-setup/install/installing-mi/).  

    2. Install [WSO2 Micro Integrator Extension](https://mi.docs.wso2.com/en/latest/develop/mi-for-vscode/install-wso2-mi-for-vscode/#install-micro-integrator-for-vs-code) in VSCode. 

    3. In the downloaded WSO2 Micro Integrator pack, the following configurations need to be done. Go to [WSO2-MI-HOME]/conf/deployment.toml file. 
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
