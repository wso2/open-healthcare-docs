# Connect to HL7 File servers

This guide explains how to connect to HL7 file servers using the WSO2 Healthcare solution. The WSO2 Healthcare solution provides built-in capabilities to read HL7 messages from files and process them. 

{!includes/bal-mi-note.md!}

=== "Ballerina"

    The following example demonstrates how to connect to an HL7 file server using Ballerina FTP client and consume HL7 files. 

    ### Step 1: Set Up Ballerina

    Before you begin, ensure you have <a href="https://ballerina.io/downloads/installation-options/" target="_blank">Ballerina</a> installed on your system.
    
    ### Step 2: Implement the flow to connect to the HL7 file server

    1. Create a Ballerina project using the following command. It will create the Ballerina project and the main.bal file can be used to implement the logic.
    
        ```bash
        $ bal new hl7_file_client_sample
        ```
    
    2. Import the required modules to the Ballerina program and implement the logic to connect to the HL7 file server. In this sample, we are using the HL7v2.3 version. Therefore, we need to import the `ballerinax/health.hl7v23` package. If you are using a different version of HL7, you can import the relevant [package](https://central.ballerina.io/search?q=hl7&page=1&m=packages). Then ADT_A01 message is read from the file Ballerina FTP client and parsed to HL7 message.

        ``` ballerina
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

    3. Run the Ballerina program using the following command.

        ```bash
        $ bal run
        ```

    4. The program reads the ADT_A01 HL7 message from the file and prints the family name of the patient.

=== "Micro Integrator"

    The following example demonstrates how to connect to an HL7 file server using the WSO2 Micro Integrator and consume HL7 files. 

    ### Step 1: Set Up WSO2 Micro Integrator

    Before you begin, download the [WSO2 Micro Integrator](https://wso2.com/integration/micro-integrator/) and install by following the [installation guide](https://mi.docs.wso2.com/en/latest/install-and-setup/install/installing-mi/).

    ### Step 2: Configure the HL7 transport

    Follow the steps in the following guide to configure the HL7 transport in the WSO2 Micro Integrator: [Configuring the HL7 transport](https://mi.docs.wso2.com/en/latest/install-and-setup/setup/transport-configurations/configuring-transports/#configuring-the-hl7-transport).

    ### Step 3: Implement the flow to connect to the HL7 file server

    1. Create a [new integration project](https://mi.docs.wso2.com/en/latest/develop/create-integration-project/) in the WSO2 Micro Integrator VSCode extension.

    2. Create a new sequence for a HL7 file proxy in the integration project and add the following configuration to consume HL7 files from a directory and parse the HL7 messages into XML format. You can write business logic to use the parsed HL7 XML message.

        ```xml
            <?xml version="1.0" encoding="UTF-8"?>
            <proxy xmlns="http://ws.apache.org/ns/synapse" name="Hl7FileProxy" transports="vfs">
            <target>
                <inSequence>
                    <property name="OUT_ONLY" value="true" scope="default" type="STRING"/>
                    <property name="transport.vfs.ReplyFileName" expression="get-property('transport','FILE_NAME')" scope="transport" type="STRING"/>
                    <!-- logs the parsed HL7 message, parsed HL7 message is represented in XML format in the wire -->
                    <log level="full"/>
                    <call>
                        <address uri="vfs:file:///home/user/test/out"/>
                    </call>
                </inSequence>
            </target>
            <parameter name="transport.PollInterval">5</parameter>
            <parameter name="transport.vfs.FileURI">file:///home/user/test/in</parameter>
            <parameter name="transport.vfs.FileNamePattern">.*\.hl7</parameter>
            <parameter name="transport.vfs.ContentType">application/edi-hl7;charset="iso-8859-15"</parameter>
            <parameter name="transport.hl7.ValidateMessage">false</parameter>
            </proxy>
        ```    
    3. Save the sequence and [deploy the integration project](https://mi.docs.wso2.com/en/latest/develop/deploy-artifacts/) to the Micro Integrator runtime.    

    4. The Micro Integrator listens to the directory `/home/user/test/in` for HL7 files with the extension `.hl7`. When a file is added to the directory, the Micro Integrator reads the file, parses the HL7 message, and logs the parsed HL7 message in XML format.