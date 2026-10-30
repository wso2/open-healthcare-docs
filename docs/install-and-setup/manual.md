---
title: "Manual Installation Guide"
---

# Manual Installation Guide

## Prerequisites

Download a supported base distribution of each product:

- [WSO2 API Manager](https://wso2.com/api-platform/api-manager/) 4.6.0, 4.3.0, or 4.2.0
- [WSO2 Identity Server](https://wso2.com/identity-platform/identity-server/) 7.3.0

You download the matching WSO2 Open Healthcare accelerator for each product in [Setting up Accelerators](#setting-up-accelerators).

## Getting Started
1. Extract the base products.
2. This document uses the following placeholders to refer to the following products:

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

```bash
$ ./update_tool_setup.sh
$ ./wso2update_darwin
```

```bash
$ ./update_tool_setup.sh
$ ./wso2update_linux
```

```bash
$ ./update_tool_setup.ps1
$ ./wso2update_windows.exe
```



For more information, see the [WSO2 Updates documentation](https://updates.docs.wso2.com/en/latest/updates/overview/).

## Setting up Accelerators

This section guides you to set up and prepare your server to run WSO2 Open Healthcare Accelerator.

### Setting Up WSO2 API Manager for Healthcare

1. Download the APIM accelerator that matches your WSO2 API Manager version and extract it:

    | APIM version | Accelerator download |
    |---|---|
    | APIM 4.6.0 | [wso2-hcam-accelerator-2.1.0.zip](https://github.com/wso2/healthcare-accelerator/releases/download/v2.1.0/wso2-hcam-accelerator-2.1.0.zip) |
    | APIM 4.3.0 | [wso2-hcam-accelerator-2.0.0.zip](https://github.com/wso2/healthcare-accelerator/releases/download/v2.0.0/wso2-hcam-accelerator-2.0.0.zip) |
    | APIM 4.2.0 | [wso2-hcam-accelerator-1.0.0.zip](https://github.com/wso2/healthcare-accelerator/releases/download/v1.0.0/wso2-hcam-accelerator-1.0.0.zip) |

2. Copy the extracted accelerator folder to `<WSO2_APIM_HOME>`. This guide calls it `<WSO2_OH_APIM_ACC_HOME>`.
3. Optional: enable or disable features in `<WSO2_OH_APIM_ACC_HOME>/conf/config.toml`. See [Accelerator configuration options](#accelerator-configuration-options).
4. Run the merge script from `<WSO2_OH_APIM_ACC_HOME>/bin`:

    ```bash
    ./merge.sh
    ```

### Setting Up WSO2 Identity Server for Healthcare

1. Download the IS accelerator for WSO2 Identity Server 7.3.0, [wso2-hcis-accelerator-2.1.0.zip](https://github.com/wso2/healthcare-accelerator/releases/download/v2.1.0/wso2-hcis-accelerator-2.1.0.zip), and extract it.
2. Copy the extracted accelerator folder to `<WSO2_IS_HOME>`. This guide calls it `<WSO2_OH_IS_ACC_HOME>`.
3. Optional: enable or disable features in `<WSO2_OH_IS_ACC_HOME>/conf/config.toml`. See [Accelerator configuration options](#accelerator-configuration-options).
4. Run the merge script from `<WSO2_OH_IS_ACC_HOME>/bin`:

    ```bash
    ./merge.sh
    ```

`merge.sh` backs up the product files it replaces, so you can tell what changed or restore them. See the details below.

<details>
<summary>What merge.sh changes</summary>

The first run creates an `hc-accelerator` folder in the product home, with a `backup` folder and a `merge_audit.log` file.

- `backup` holds the original product files from **before the first run**. Later runs keep this backup and don't overwrite it, so it always reflects the unmodified product. It contains:
    - **API Manager:** `conf/deployment.toml`, `conf/claim-config.xml`, and the `accountrecoveryendpoint` and `authenticationendpoint` web apps under `webapps`.
    - **Identity Server:** `conf/deployment.toml`. If the consent portal's `config.js` exists from an earlier deployment, it's also saved and restored after the merge.
- `merge_audit.log` gets one line per run, with the date and time, the user, and the accelerator version. For example:

    ```
    Mon May 31 22:01:55 +0530 2021 - john - WSO2 Open Healthcare API Manager 1.0.0 Accelerator - v1.0.0
    ```

</details>

### Accelerator configuration options

Set these options in the accelerator's `conf/config.toml` before you run `merge.sh`:

| Option | Default | Applies to | Description |
|---|---|---|---|
| `enable_fhir_metadata_endpoint` | `true` | API Manager | Auto-generate the FHIR capability statement |
| `enable_well_known_endpoint` | `true` | API Manager | Expose the well-known endpoint for OAuth 2.0 discovery |
| `enable_smart_on_fhir` | `true` | API Manager, Identity Server | Enable SMART on FHIR features |
| `enable_developer_workflow` | `false` | API Manager | Require approval for developer sign-up and app creation |
| `enable_healthcare_theme` | `true` | API Manager | Apply the healthcare theme |

## Setting Up Integration Layer for Healthcare

<a id="wso2-integrator-installation-steps"></a>

The integration layer runs on [WSO2 Integrator](https://wso2.com/products/downloads/?product=wso2integrator), a low-code environment for building healthcare integrations, APIs, and AI agents. It includes the Ballerina runtime, so you don't need to install Ballerina separately.

1. Go to the [WSO2 Integrator download page](https://wso2.com/products/downloads/?product=wso2integrator). The **Integration Platform** tab opens with **WSO2 Integrator** selected.
2. Select the package for your operating system: **macOS (Apple Silicon, DMG)**, **macOS (x64, DMG)**, **Windows (MSI)**, **Linux (DEB)**, or **Linux (RPM)**. Then enter your business email and download the installer.

    ![Select the WSO2 Integrator package on the download page](/assets/img/install-and-setup/wso2-integrator-download.png)

3. Install WSO2 Integrator:




    Open the downloaded `.dmg` file and drag **WSO2 Integrator** to the **Applications** folder.




    Run the downloaded `.msi` file and follow the installer.




    Install the downloaded package with your package manager. For example:

    ```bash
    # Debian or Ubuntu
    sudo apt install ./<downloaded-file>.deb

    # RHEL, Fedora, or other RPM-based distributions
    sudo dnf install ./<downloaded-file>.rpm
    ```




4. Open WSO2 Integrator. On the welcome screen, click **Sign in with WSO2 Integration Platform** to use WSO2 Integrator Copilot and deploy to WSO2 Cloud, or click **Skip for now**.

    The start page opens. From here you can create a new integration project, open an existing one, or explore pre-built integrations and samples.

    ![WSO2 Integrator start page](/assets/img/install-and-setup/wso2-integrator-start.png)

To build your first healthcare integration with WSO2 Integrator, follow the [Quick start guide](../get-started/open-healthcare-quickstart.md). The quick start uses WSO2 Integrator Copilot, so sign in with WSO2 Integration Platform first. If you skipped sign-in, use the account icon on the start page to sign in.

## Start servers

1. Run the following command in <WSO2_IS_HOME>/bin:
    ```bash
    ./wso2server.sh
    ```
2. Run the following command in <WSO2_APIM_HOME>/bin:

    ```bash
    ./api-manager.sh
    ```

## Configure IS as Key Manager

This section provides step-by-step instructions to configure WSO2 Identity Server 7.x as a Key Manager for WSO2 API Manager, enabling secure API access and management.

1. Sign in to the Admin Portal of API Manager at https://localhost:9443/admin.
2. Go to **Key Managers** on the left main menu.
![add-key-manager.png](../assets/img/get-started/add-key-manager.png)
3. Configure [WSO2 IS 7.x as a keymanager](https://apim.docs.wso2.com/en/latest/api-security/key-management/third-party-key-managers/configure-wso2is7-connector/). Enable role creation in WSO2 Identity Server 7.

   Use the following placeholders in the endpoints below:

   | Placeholder | Description |
   |---|---|
   | `<WSO2_IS_HOST>` | Hostname of the WSO2 Identity Server used as the Key Manager (for local setups, typically `localhost`). Port `9453` is the Identity Server HTTPS port when API Manager uses `9443` (for example, Admin Portal at `https://localhost:9443/admin` and IS Console at `https://localhost:9453/console`). |
   | `<IAM_SERVICE_EXTENSION_BASE>` | Hostname where the `iam-service-extension` Ballerina service is running (for local setups, typically `localhost`). |
   | `` | Listen port of the `iam-service-extension` service (default `9093`). |

You can configure well-known URL (`https://<WSO2_IS_HOST>:9453/oauth2/token/.well-known/openid-configuration`) and import Key manager endpoints.

Recent WSO2 Identity Server updates disable basic authentication for the management APIs by default, which API Manager uses to register applications (DCR) in the key manager. If application key generation fails with `Basic authentication is not allowed for this tenant`, add the following to `<WSO2_IS_HOME>/repository/conf/deployment.toml` and restart the Identity Server.

```toml
[compatibility_setting.basic_auth.disable_basic_auth]
default_value = false
target_value = false
```

Use the introspection endpoint in the iam-service-extension service to enable healthcare specific introspection response. `https://<IAM_SERVICE_EXTENSION_BASE>:/introspect`.

4. Go to the list of Key Managers and select **Resident Key Manager**.
5. Disable the Resident Key Manager.
