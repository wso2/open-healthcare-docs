# Manual Installation Guide

## Install WSO2 OH API Manager

### Prerequisites
1. Refer to [Product Compatibilities](#product-compatibilities) for Open Healthcare supported base product distributions.
2. Download a Open Healthacare supported base distribution of [WSO2 API Manager](https://wso2.com/api-management/previous-releases/).
3. Download the compatible WSO2 Open Healthcare APIM Accelerator. (Refer [Product Compatibilities](#product-compatibilities))

### Installation Steps
1. Extract WSO2 APIM product. Let's call it `<WSO2_APIM_HOME>`.
2. Navigate to `<WSO2_APIM_HOME>/bin` directory and execute the update command based on the operating system to bring WSO2 API Manager up to date by running the Update Tool. 

    - On Linux
        ```sh
        ./wso2update_linux
        ```
        
    - On Mac
        ```sh
        ./wso2update_darwin
        ```

    ### Optional: To Update to an exact version

    - On Linux
        ```sh
        ./wso2update_linux --level x.y.z
        ```
            
    - On Mac
        ```sh
        ./wso2update_darwin –level x.y.z
        ```
At first, you may need to run the relevant update command twice. First time you execute `./wso2update_<os>` updates the Update Client Tool. The subsequent `./wso2update_<os>` updates the product pack.

3. Extract WSO2 OH APIM Accelerator to `<WSO2_APIM_HOME>`. Let's call it `<WSO2_OH_APIM_ACC_HOME>`.
4. Navigate to `<WSO2_OH_APIM_ACC_HOME>` directory.
5. To setup the embedded H2 database of APIM with pre-loaded tables required by WSO2 Open Healthcare, copy the `database/WSO2AM_DB.mv.db` file to `repository/database` folder in `<WSO2_APIM_HOME>`.

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
Mon May 31 22:01:55 +0530 2021 - john - WSO2 Open Healthcare API Manager 4.0.0 Accelerator - v3.0.0
```
- `backup` folder contains the files that were originally there in the APIM product before running the accelerator. Please note that only the last state will be there. 

## Install WSO2 OH Micro Integrator

### Prerequisites
1. Refer to [Product Compatibilities](#product-compatibilities) for Open Healthcare supported base product distributions.
2. Download a Open Healthacare supported base distribution of [WSO2 Micro Integrator](https://wso2.com/api-management/previous-releases/).
3. Download the compatible WSO2 Open Healthcare MI Accelerator. (Refer [Product Compatibilities](#product-compatibilities))

### Installation Steps
1. Extract WSO2 MI product. Let's call it `<WSO2_MI_HOME>`.
2. Navigate to `<WSO2_MI_HOME>/bin` directory and execute the update command based on the operating system to bring WSO2 Micro Integrator up to date by running the Update Tool. 

    - On Linux
        ```sh
        ./wso2update_linux
        ```
        
    - On Mac
        ```sh
        ./wso2update_darwin
        ```

    ### Optional: To Update to an exact version

    - On Linux
        ```sh
        ./wso2update_linux --level x.y.z
        ```
            
    - On Mac
        ```sh
        ./wso2update_darwin –level x.y.z
        ```
At first, you may need to run the relevant update command twice. First time you execute `./wso2update_<os>` updates the Update Client Tool. The subsequent `./wso2update_<os>` updates the product pack.

3. Extract WSO2 OH MI Accelerator to `<WSO2_MI_HOME>`. Let's call it `<WSO2_OH_MI_ACC_HOME>`.
4. Navigate to `<WSO2_OH_MI_ACC_HOME>` directory and execute 
```sh
./bin/merge.sh
``` 
command. This will copy the artifacts to the WSO2 MI and add the required configurations.
5. Navigate to `<WSO2_MI_HOME>` directory and execute 
```sh
./bin/micro-integrator.sh
```
to start the MI server with WSO2 OH Accelerators.

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
Mon May 31 22:01:55 +0530 2021 - john - WSO2 Open Healthcare Micro Integrator 1.2.0 Accelerator - v1.0.2
```
- `backup` folder contains the files that were originally there in the MI product before running the accelerator. Please note that only the last state will be there.  

## Product Compatibilities

| Product          | Compatible Open Healthcare Accelarator  |
|---------------------------|-----------------------------------------|
|<center>APIM 4.0.0</center>|<center>[APIM OH Accelerator 3.0.0](https://github.com/wso2-enterprise/open-healthcare-apim/releases/download/v3.0.0/wso2oh-apim-accelerator-3.0.0.zip)</center>                           |
|<center>APIM 3.2.0</center>|<center>[APIM OH Accelerator 1.0.12](https://github.com/wso2-enterprise/open-healthcare-apim/releases/download/v1.0.12/wso2oh-apim-accelerator-1.0.12.zip)</center>                          |
|<center>APIM 3.0.0</center>|<center>[APIM OH Accelerator 0.5](https://github.com/wso2-enterprise/open-healthcare-apim/releases/download/v0.5.0/wso2oh-apim-accelerator-0.5.0.zip)</center>                           |
|<center>MI 4.0.0</center>  |<center>[MI OH Accelerator 3.0.0](https://github.com/wso2-enterprise/open-healthcare-integration/releases/download/v3.0.0-alpha/wso2oh-mi-accelerator-3.0.0-alpha.zip)</center>                       |
