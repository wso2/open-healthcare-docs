---
sidebar_position: 4
title: "Manual Installation Guide"
description: Provide your wso2 credentials and update the tool.
pagination_next: install-and-setup/configure-km
---
import Tabs from '@theme/Tabs';             
import TabItem from '@theme/TabItem';

# Manual Installation Guide

## Prerequisites
1. Download supported base distribution of [WSO2 API Manager](https://wso2.com/api-platform/api-manager/), [WSO2 Identity Server](https://wso2.com/identity-platform/identity-server/) and [WSO2 Open Healthcare Accelerator](https://github.com/wso2/healthcare-accelerator/releases). Refer to the [Product Compatibilities](#product-compatibilities).

## Product Compatibilities

|                                   WSO2 Healthcare Accelerator                                   | Compatible Base Product |
|:-----------------------------------------------------------------------------------------------:|:-----------------------:|
| [APIM HC Accelerator 1.0.0](https://github.com/wso2/healthcare-accelerator/releases/tag/v1.0.0) |       APIM 4.2.0        | 
| [APIM HC Accelerator 2.0.0](https://github.com/wso2/healthcare-accelerator/releases/tag/v2.0.0) |       APIM 4.3.0        | 
| [APIM HC Accelerator 2.1.0](https://github.com/wso2/healthcare-accelerator/releases/tag/v2.1.0) |       APIM 4.6.0        | 
|  [IS HC Accelerator 2.1.0](https://github.com/wso2/healthcare-accelerator/releases/tag/v2.1.0)   |        IS 7.3.0         | 


## Getting Started
1. Extract the base products.
2. Extract the downloaded WSO2 Open Healthcare Accelerator zip files.
3. This document uses the following placeholders to refer to the following products:

| Product                                          | 	Placeholder               |
|--------------------------------------------------|----------------------------|
| WSO2 Identity Server	                            | `<WSO2_IS_HOME>`           |
| WSO2 API Manager	                                | `<WSO2_APIM_HOME>`         |
| WSO2 Open Healthcare Identity Server Accelerator | 	`<WSO2_OH_IS_ACC_HOME>`   |
| WSO2 Open Healthcare API Manager Accelerator     | 	`<WSO2_OH_APIM_ACC_HOME>` |


## Getting WSO2 Updates
The WSO2 Update tool delivers hotfixes and updates seamlessly on top of products as WSO2 Updates. They include improvements that are released by WSO2. You need to update the base products and accelerators using the relevant script.

1. Go to <PRODUCT_HOME>/bin and run the WSO2 Update tool:

- Repeat this step for the WSO2 Identity Server and API Manager products.

<Tabs>
<TabItem value="mac" label="MacOS" default>

```bash
$ ./update_tool_setup.sh
$ ./wso2update_darwin
```

</TabItem>
<TabItem value="linux" label="Linux">

```bash
$ ./update_tool_setup.sh
$ ./wso2update_linux
```

</TabItem>
<TabItem value="windows" label="Windows">

```bash
$ ./update_tool_setup.ps1
$ ./wso2update_windows.exe
```

</TabItem>
</Tabs>                                     

For more information, see the [WSO2 Updates documentation](https://updates.docs.wso2.com/en/latest/updates/overview/).

## Setting up Accelerators

This section guides you to set up and prepare your server to run WSO2 Open Healthcare Accelerator.

### Setting Up WSO2 API Manager for Healthcare

1. Install WSO2 Open Healthcare AM Accelerator
   - Copy the extracted WSO2 OH APIM Accelerator to `<WSO2_APIM_HOME>`. Let's call it `<WSO2_OH_APIM_ACC_HOME>`.
   - [Optional] Check the accelerator configurations in <WSO2_OH_APIM_ACC_HOME>/conf/config.toml file to enable or disable features. 

   2. Run the merge script in <WSO2_OH_APIM_ACC_HOME>/bin:

       ```bash
        ./merge.sh
       ```

### Setting Up WSO2 Identity Server for Healthcare

1. Install WSO2 Open Healthcare IS Accelerator
    - Copy the extracted WSO2 OH IS Accelerator to `<WSO2_IS_HOME>`. Let's call it `<WSO2_OH_IS_ACC_HOME>`.
    - [Optional] Check the accelerator configurations in <WSO2_OH_IS_ACC_HOME>/conf/config.toml file to enable or disable features.

   2. Run the merge script in <WSO2_OH_IS_ACC_HOME>/bin:

       ```sh
        ./merge.sh
       ```

:::note
Accelerator configs looks like below;
    
| Setting Description                                         | Configuration Option                 | Default Value |
|-------------------------------------------------------------|--------------------------------------|---------------|
| Enable or disable auto-generation of the FHIR capability statement | `enable_fhir_metadata_endpoint`      | `true`        |
| Enable or disable the well-known endpoint for OAuth 2.0 discovery  | `enable_well_known_endpoint`         | `true`        |
| Enable or disable the SMART on FHIR features               | `enable_smart_on_fhir`               | `true`        |
| Enable or disable developer sign-up and app creation approval | `enable_developer_workflow`         | `false`        |
| Enable or disable the healthcare theme                     | `enable_healthcare_theme`            | `true`        |

:::

:::note
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
Mon May 31 22:01:55 +0530 2021 - john - WSO2 Open Healthcare API Manager 1.0.0 Accelerator - v1.0.0
```
- `backup` folder contains the files that were originally there in the APIM product before running the accelerator. Please note that only the last state will be there. 

:::

## Setting Up Integration Layer for Healthcare

:::note
These guides use [Ballerina](https://ballerina.io/), a language designed for integration and network services, to build healthcare integrations as microservices.
:::


### Ballerina

<a id="ballerina-installation-steps"></a>

### Installation Steps

Go through the following steps to setup the Ballerina. 

1. Follow the instructions in the <a href="https://ballerina.io/downloads/installation-options/" target="_blank">Ballerina Installation Options</a> to install Ballerina runtime.

2. Setup the Ballerina VSCode extension by following the instructions in the <a href="https://ballerina.io/learn/get-started/#set-up-the-editor/" target="_blank">Ballerina VSCode Extension</a> guide.

## Exchanging the certificates

In order to enable secure communication, we need to install the certificates of each component in others. This will facilitate a Secure Socket Layer (SSL). Follow the steps below to implement this:

:::note
Here Server A can be either IS, APIM or any other product.
:::

1. Generate a key against the keystore of a particular server. For example, server A with an alias and common name that is equal to the hostname.

    ```sh
    keytool -genkey -alias <keystore_alias> -keyalg RSA -keysize 2048 -validity 3650 -keystore <keystore_path> -storepass <keystore_password> -keypass <key password> -noprompt
    ```
2. Export the public certificate of the newly generated key pair.

    ```sh
    keytool -export -alias <cert_alias> -file <certificate_path> -keystore <keystore path>
    ```

3. Import the public cert of Server A to the client truststores of all the servers including Server A.

    ```sh
    keytool -import -trustcacerts -alias <cert_alias> -file <certificate_path> -keystore <truststore_path> -storepass <keystore_password> -noprompt
    ```

4. Repeat above steps for all the servers.

## Start servers

1. Run the following command in <WSO2_IS_HOME>/bin:
    ```bash
    ./wso2server.sh
    ```
2. Run the following command in <WSO2_APIM_HOME>/bin:

    ```bash
    ./api-manager.sh
    ```