# Implement a HL7 Server Listener

This guide explains how to implement a HL7 server listener using the WSO2 Healthcare solution. The HL7 server listener listens for HL7 messages on a specified port and processes the messages. The HL7 server listener is a key component in the healthcare integration process, as it allows you to receive HL7 messages from external systems and process them according to your requirements.

{!includes/bal-mi-note.md!}

=== "Ballerina"

    The following example demonstrates how to implement a HL7 server listener using Ballerina. The example defines a HL7 server listener that listens for HL7 messages on a specified port and processes the messages.

    ### Step 1: Set Up Ballerina

    Before you begin, ensure you have <a href="https://ballerina.io/downloads/installation-options/" target="_blank">Ballerina</a> installed on your system.

    ### Step 2: Implement the HL7 server listener

    1. Create a Ballerina project using the following command. It will create the Ballerina project and the main.bal file can be used to implement the logic.
    
        ```bash
        $ bal new hl7_server_listener_sample
        ```

    2. Import the required modules to the Ballerina program and implement the logic to create a HL7 server listener. In this sample, we are using the HL7v2.3 version. Therefore, we need to import the `ballerinax/health.hl7v23` package. If you are using a different version of HL7, you can import the relevant [package](https://central.ballerina.io/search?q=hl7&page=1&m=packages). Then the HL7 server listener is created and started to listen for HL7 messages on the specified port.

        ```ballerina
        import ballerina/io;
        import ballerina/tcp;
        import ballerinax/health.hl7v2;
        import ballerinax/health.hl7v23;

        service on new tcp:Listener(3000) {
            remote function onConnect(tcp:Caller caller) returns tcp:ConnectionService {
                io:println("Client connected to HL7 server: ", caller.remotePort.toString());
                return new HL7ServiceConnectionService();
            }
        }

        service class HL7ServiceConnectionService {
            *tcp:ConnectionService;

            remote function onBytes(tcp:Caller caller, readonly & byte[] data) returns tcp:Error? {
                string|error fromBytes = string:fromBytes(data);
                if fromBytes is string {
                    io:println("Received HL7 Message: ", fromBytes);
                }

                // Note: When you know the message type you can directly get it parsed.
                hl7v23:ADT_A01|error parsedMsg = hl7v2:parse(data).ensureType(hl7v23:ADT_A01);
                if parsedMsg is error {
                    return error(string `Error occurred while parsing the received message: ${parsedMsg.message()}`, 
                    parsedMsg);
                }
                io:println(string `Parsed HL7 message: ${parsedMsg.toJsonString()}`);
            }

            remote function onError(tcp:Error err) {
                io:println(string `An error occurred while receiving HL7 message: ${err.message()}. Stack trace: `, 
                err.stackTrace());
            }

            remote function onClose() {
                io:println("Client left");
            }
        }
        ```

    3. Run the Ballerina program using the following command.

        ```bash
        $ bal run
        ```
    
=== "Micro Integrator"

    The following example demonstrates how to implement a HL7 server listener using the WSO2 Micro Integrator. The example defines a HL7 server listener that listens for HL7 messages on a specified port and processes the messages.

    ### Step 1: Set Up WSO2 Micro Integrator

    Before you begin, download the [WSO2 Micro Integrator](https://wso2.com/integration/micro-integrator/) and install by following the [installation guide](https://mi.docs.wso2.com/en/latest/install-and-setup/install/installing-mi/).

    ### Step 2: Configure the HL7 transport

    Follow the steps in the following guide to configure the HL7 transport in the WSO2 Micro Integrator: [Configuring the HL7 transport](https://mi.docs.wso2.com/en/latest/install-and-setup/setup/transport-configurations/configuring-transports/#configuring-the-hl7-transport).

    ### Step 3: Implement the HL7 server listener

    1. Create a [new integration project](https://mi.docs.wso2.com/en/latest/develop/create-integration-project/) in the WSO2 Micro Integrator VSCode extension.

    2. Create a new sequence for a HL7 listener proxy in the integration project and add the following configuration to parse the HL7 message. You can write business logic to extract the required fields from the HL7 message using standard xpath expressions.

        ```xml
        <proxy xmlns="http://ws.apache.org/ns/synapse" name="hl7testproxy" transports="https,http,hl7" statistics="disable" trace="disable" startOnLoad="true">
            <target>
            <inSequence>
                <!-- logs the parsed HL7 message, parsed HL7 message is represented in XML format in the wire -->
                <log category="INFO" level="full" />
            </inSequence>
            </target>
            <!-- HL7 proxy listener port and HL7 messages can be sent from TCP clients-->
            <parameter name="transport.hl7.Port">9292</parameter>
        </proxy>
        ```

    3. Save the sequence and [deploy the integration project](https://mi.docs.wso2.com/en/latest/develop/deploy-artifacts/) to the Micro Integrator runtime.

    4. Send an HL7 message to the HL7 listener proxy using a HL7 client. The HL7 message will be parsed and logged in the Micro Integrator console.