# Connect to HL7 TCP servers

This guide explains how to connect to HL7 TCP servers using the WSO2 Healthcare solution. The WSO2 Healthcare solution provides built-in capabilities to connect to HL7 TCP servers and send HL7 messages over the TCP. The TCP transport is commonly used to exchange HL7 messages between healthcare systems, such as hospital information systems (HIS), laboratory information systems (LIS), and electronic health record (EHR) systems.

{!includes/bal-mi-note.md!}

=== "Ballerina"

    The following example demonstrates how to connect to an HL7 TCP server using Ballerina HL7 client. 

    ## Step 1: Set Up Ballerina

    Before you begin, ensure you have <a href="https://ballerina.io/downloads/installation-options/" target="_blank">Ballerina</a> installed on your system.
    
    ## Step 2: Implement the flow to connect to the HL7 TCP server

    1. Create a Ballerina project using the following command. It will create the Ballerina project and the main.bal file can be used to implement the logic.
    
        ```bash
        $ bal new hl7_tcp_client_sample
        ```

    2. Import the required modules to the Ballerina program and implement the logic to connect to the HL7 TCP server. In this sample, we are using the HL7v2.3 version. Therefore, we need to import the `ballerinax/health.hl7v23` package. If you are using a different version of HL7, you can import the relevant [package](https://central.ballerina.io/search?q=hl7&page=1&m=packages). Then QRY_A19 message is constructed and sent to the target HL7 server using Ballerina HL7 client. 

        ``` ballerina
        import ballerinax/health.hl7v2;
        import ballerinax/health.hl7v23;
        import ballerina/io;

        public function main() returns error? {

            hl7v23:QRY_A19 qry_a19 = {
                msh: {
                    msh3: {hd1: "ADT1"},
                    msh4: {hd1: "MCM"},
                    msh5: {hd1: "LABADT"},
                    msh6: {hd1: "MCM"},
                    msh8: "SECURITY",
                    msh9: {cm_msg1: "QRY"},
                    msh10: "MSG00001",
                    msh11: {pt1: "P"},
                    msh12: "2.3"
                },
                qrd: {
                    qrd1: {ts1: "20220828104856+0000"},
                    qrd2: "R",
                    qrd3: "I",
                    qrd4: "QueryID01",
                    qrd7: {cq1: "5"},
                    qrd8: [{xcn1: "1", xcn2: "ADAM", xcn3: "EVERMAN"}],
                    qrd9: [{ce1: "VXI"}],
                    qrd10: [{ce1: "SIIS"}]    
                }
            };

            hl7v2:HL7Client hl7client = check new("localhost", 59519);
            hl7v2:Message msg = check hl7client.sendMessage(qry_a19);
            io:println(string `Response : ${msg.toJsonString()}`);
        }
        ```

    3. Run the Ballerina program using the following command.

        ```bash
        $ bal run
        ```

    The Ballerina program connects to the HL7 TCP server and sends the QRY_A19 message. The response message received from the server should be printed to the console.

=== "Micro Integrator"

    The following example demonstrates how to connect to an HL7 TCP server using the WSO2 Micro Integrator.

    ### Step 1: Set Up WSO2 Micro Integrator

    Before you begin, download the [WSO2 Micro Integrator](https://wso2.com/integration/micro-integrator/) and install by following the [installation guide](https://mi.docs.wso2.com/en/latest/install-and-setup/install/installing-mi/).

    ### Step 2: Configure the HL7 transport

    Follow the steps in the following guide to configure the HL7 transport in the WSO2 Micro Integrator: [Configuring the HL7 transport](https://mi.docs.wso2.com/en/latest/install-and-setup/setup/transport-configurations/configuring-transports/#configuring-the-hl7-transport).

    ### Step 3: Implement the flow to construct HL7 messages and send to target HL7 server

    1. Create a [new integration project](https://mi.docs.wso2.com/en/latest/develop/create-integration-project/) in the WSO2 Micro Integrator VSCode extension.

    2. Create a new sequence for a HL7 sender proxy in the integration project and add the following configuration to serialize the HL7 message. You can write business logic to construct the HL7 message in XML format and send it to a HL7 server.

        ```xml
        <proxy xmlns="http://ws.apache.org/ns/synapse" name="hl7senderproxy" transports="https,http,hl7" statistics="disable" trace="disable" startOnLoad="true">
                <target>
                <inSequence>
                    <!-- Implement the logic to construct the HL7 message in XML format and send with the correct content type. You can use payload factory mediator to construct the HL7 message -->
                    <payloadFactory media-type="xml">
                        <format>
                            <hl7:message xmlns:hl7="http://wso2.org/hl7">
                                <QRY_A19 xmlns="urn:hl7-org:v2xml">
                                    <MSH>
                                        <MSH.1>|</MSH.1>
                                        <MSH.2>^~\&amp;</MSH.2>
                                        <MSH.3>
                                            <HD.2>WSO2MI</HD.2>
                                        </MSH.3>
                                        <MSH.4>
                                            <HD.2>Integration</HD.2>
                                        </MSH.4>
                                        <MSH.5>
                                            <HD.2>HL7Server</HD.2>
                                        </MSH.5>
                                        <MSH.6>
                                            <HD.2>Integration</HD.2>
                                        </MSH.6>
                                        <MSH.7>
                                            <TS.1>$1</TS.1>
                                        </MSH.7>
                                        <MSH.9>
                                            <CM_MSG.1>QRY</CM_MSG.1>
                                            <CM_MSG.2>A19</CM_MSG.2>
                                        </MSH.9>
                                        <MSH.10>101</MSH.10>
                                        <MSH.11>
                                            <PT.1>T</PT.1>
                                        </MSH.11>
                                        <MSH.12>2.3</MSH.12>
                                    </MSH>
                                    <QRD>
                                        <QRD.1>
                                            <TS.1>$2</TS.1>
                                        </QRD.1>
                                        <QRD.2>R</QRD.2>
                                        <QRD.3>I</QRD.3>
                                        <QRD.4>Q1004</QRD.4>
                                        <QRD.7>
                                            <CQ.1>1</CQ.1>
                                            <CQ.2>
                                                <CE.1>RD</CE.1>
                                            </CQ.2>
                                        </QRD.7>
                                        <QRD.8>
                                            <XCN.1>$3</XCN.1>
                                        </QRD.8>
                                        <QRD.9>
                                            <CE.1>DEM</CE.1>
                                        </QRD.9>
                                    </QRD>
                                    <QRF/>
                                </QRY_A19>
                            </hl7:message>
                        </format>
                        <args>
                            <arg evaluator="xml" expression="get-property('SYSTEM_DATE', 'yyyyMMddHHmmss')"/>
                            <arg evaluator="xml" expression="get-property('SYSTEM_DATE', 'yyyyMMddHHmmss')"/>
                            <arg evaluator="xml" value="1234"/>
                        </args>
                    </payloadFactory>
                    <!-- Set the content type of the message to application/edi-hl7. This will convert the HL7 XML to MLLP format -->
                    <property name="messageType" scope="axis2" type="STRING" value="application/edi-hl7"/>
                        <call>
                            <endpoint>
                                <!-- HL7 server endpoint to send the HL7 message -->
                                <address uri="hl7://localhost:6023">
                                </address>
                            </endpoint>
                        </call>
                </inSequence>
                </target>
                <!-- HL7 proxy listener port and HL7 messages can be listened to TCP servers-->
                <parameter name="transport.hl7.Port">9292</parameter>
        </proxy>
        ```
    3. Save the sequence and [deploy the integration project](https://mi.docs.wso2.com/en/latest/develop/deploy-artifacts/) to the Micro Integrator runtime.

    4. Send an HL7 message to the HL7 sender proxy using a HL7 client. The constructed HL7 message will be serialized and sent to the target HL7 server.
    