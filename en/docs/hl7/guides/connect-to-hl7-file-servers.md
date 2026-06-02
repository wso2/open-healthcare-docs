---
sidebar_position: 1
title: "Connect to HL7 File servers"
description: This guide explains how to connect to HL7 file servers using the WSO2 Open Healthcare.
---


# Connect to HL7 File servers

This guide explains how to connect to HL7 file servers using the WSO2 Open Healthcare. The WSO2 Open Healthcare provides built-in capabilities to read HL7 messages from files and process them. 



### Ballerina

The following example demonstrates how to connect to an HL7 file server using Ballerina FTP client and consume HL7 files. 

### Step 1: Create the integration


1. Open WSO2 Integrator.
2. Select **Create** in the **Create New Integration** card.
3. Set **Integration Name** to `HL7FileClient`.
4. Set **Project Name** to `hl7-file-client`.
5. Select **Create Integration**.
6. Select **Add Artifact** and select **Automation**.

    ![Add Artifact](/assets/img/common/add-artifact.png)

### Step 2: Implement the flow to connect to the HL7 file server

1. Import the required modules to the Ballerina program and implement the logic to connect to the HL7 file server. In this sample, we are using the HL7v2.3 version. Therefore, we need to import the `ballerinax/health.hl7v23` package. If you are using a different version of HL7, you can import the relevant [package](https://central.ballerina.io/search?q=hl7&page=1&m=packages). Then ADT_A01 message is read from the file Ballerina FTP client and parsed to HL7 message.

    ```ballerina
    import ballerinax/health.hl7v2;
    import ballerinax/health.hl7v23;
    import ballerina/io;

    public function main() returns error? {
        // Define the FTP client configuration.
        ftp:ClientConfiguration ftpConfig = {
            protocol: ftp:FTP,
            host: "<The FTP host>",
            port: <The FTP port>,
            auth: {
                credentials: {
                    username: "<The FTP username>",
                    password: "<The FTP passowrd>"
                }
            }
        };

        // Create the FTP client.
        ftp:Client ftpClient = check new(ftpConfig);

        stream<byte[], io:Error?>|Error str = ftpClient -> get("<The HL7 message file path>");
        if (str is stream<byte[], io:Error?>) {
            record {|byte[] value;|}|io:Error? arr1 = str.next();
            if (arr1 is record {|byte[] value;|}) {
                hl7v23:ADT_A01 adtMsg = check hl7:parse(arr1.value).ensureType(hl7v23:ADT_A01);
                // Access the fields of the ADT_A01 message.
                hl7v23:XPN[] patientName = adtMsg.pid.pid5;
                io:println("Family Name: ", patientName[0].xpn1);
            }
            io:Error? closeResult = str.close();
        }
    }
    ```

2. Select **Run** and test.

    ![Run integration](/assets/img/common/run-ballerina-program.png)

3. Check the terminal output. The program reads the ADT_A01 HL7 message from the file and prints the family name of the patient.
