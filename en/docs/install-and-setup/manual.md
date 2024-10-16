# Manual Installation Guide

## Setting Up WSO2 API Manager for Healthcare

### Prerequisites
1. Refer to [Product Compatibilities](#product-compatibilities) for Open Healthcare supported base product distributions.
2. Download a Open Healthacare supported base distribution of [WSO2 API Manager](https://wso2.com/api-management/previous-releases/).
3. Download the compatible WSO2 Healthcare Solution APIM Accelerator. (Refer [Product Compatibilities](#product-compatibilities))

### Installation Steps
1. Extract WSO2 APIM product. Let's call it `<WSO2_APIM_HOME>`.
2. Navigate to `<WSO2_APIM_HOME>/bin` directory and execute the update command based on the operating system to bring WSO2 API Manager up to date by running the [Update Tool](https://updates.docs.wso2.com/en/latest/updates/update-tool/). 

At first, you may need to run the relevant update command twice. First time you execute `./wso2update_<os>` updates the Update Client Tool. The subsequent `./wso2update_<os>` updates the product pack.

3. Extract WSO2 OH APIM Accelerator to `<WSO2_APIM_HOME>`. Let's call it `<WSO2_OH_APIM_ACC_HOME>`.
4. Navigate to `<WSO2_OH_APIM_ACC_HOME>` directory.
5. To setup the embedded H2 database of APIM with pre-loaded tables required by WSO2 Healthcare Solution, copy the `database/WSO2AM_DB.mv.db` file to `repository/database` folder in `<WSO2_APIM_HOME>`.

    ### Optional
    If you want create these tables in an existing installation of APIM, refer to the tables defined in the scripts under the `dbscripts` folder in `<WSO2_OH_APIM_ACC_HOME>`. You may have to manually execute the scripts in order to add them to an existing `WSO2AM_DB` database.

6. In the `<WSO2_OH_APIM_ACC_HOME>` directory, execute 
```sh
./bin/merge.sh
``` 
command. This will copy the artifacts to the WSO2 APIM and add the required configurations.

7. Navigate to `<WSO2_APIM_HOME>` directory and execute 
```sh
./bin/api-manager.sh
```
to start the APIM server with WSO2 OH Accelerators.

### Audit Logs
Running `./bin/merge.sh` script creates a audit log folder in the product home. Structure of it looks like below;


```
oh-accelerator
├── backup
│   ├── conf
│   ├── jaggeryapps
│   └── webapps
└── merge_audit.log

```

- `merge_audit.log` will have an audit line per execution of the `merge.sh` script of the accelerator. Each line contains execution date and time, user account and the version of the accelerator. Example log line is below;
```buttonless
Mon May 31 22:01:55 +0530 2021 - john - WSO2 Healthcare Solution API Manager 4.0.0 Accelerator - v3.0.0
```
- `backup` folder contains the files that were originally there in the APIM product before running the accelerator. Please note that only the last state will be there. 

### Product Compatibilities

| Product          | Compatible Open Healthcare Accelarator  |
|---------------------------|-----------------------------------------|
|<center>APIM 4.2.0</center>|<center>[APIM OH Accelerator 4.0.3](https://github.com/wso2-enterprise/open-healthcare-apim/releases/download/v4.0.3/wso2oh-apim-accelerator-4.0.3.zip)</center>                           |
|<center>APIM 3.2.0</center>|<center>[APIM OH Accelerator 1.0.12](https://github.com/wso2-enterprise/open-healthcare-apim/releases/download/v1.0.12/wso2oh-apim-accelerator-1.0.12.zip)</center>                        |                  |


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
