# Parsing and Serializing HL7 Messages

This guide explains how to parse and serialize HL7 messages using the WSO2 Healthcare solution. The WSO2 Healthcare solution provides a set of built-in capabilities to parse and serialize HL7 messages using a user-friendly graphical tooling. The tooling allows you to parse HL7 messages and extract message fields using visual data mapping features.

{!includes/bal-mi-note.md!}

=== "Ballerina"

    ## Parse HL7 messages

    The following example demonstrates how to parse an HL7v2 ADT_A01 message using Ballerina. The example defines a custom patient record and a data mapping function to extract the patient record from an ADT_A01 message.

    ### Step 1: Set Up Ballerina 

    Before you begin, ensure you have [Ballerina](https://ballerina.io/downloads/installation-options/) installed on your system.

    ### Step 2: Implement the flow to parse HL7 messages

    1. Create a Ballerina project using the following command. It will create the Ballerina project and the main.bal file can be used to implement the logic.
    
        ```bash
        $ bal new hl7_message_parse_sample
        ```

    2. Import the required modules and implement the Ballerina program. In this sample, we are using ADT_A01 message from HL7v2.3 version. Therefore, we need to import `ballerinax/health.hl7v23` package. If you are using a different version of HL7, you can import the relevant [package](https://central.ballerina.io/search?q=hl7&page=1&m=packages). You need to use parse function from `ballerinax/health.hl7v2` package to parse the HL7 message.
    
        ```ballerina
        import ballerina/io;
        import ballerinax/health.hl7v2 as hl7;
        import ballerinax/health.hl7v23 as hl7v23;

        // The following example is a simple serialized HL v2.3 ADT A01 message.
        final string msg = "MSH|^~\\&|ADT1|GOOD HEALTH HOSPITAL|GHH LAB, INC.|GOOD HEALTH HOSPITAL|" +
        "198808181126|SECURITY|ADT^A01^ADT_A01|MSG00001|P|2.3||\rEVN|A01|200708181123||" +
        "\rPID|1||PATID1234^5^M11^ADT1^MR^GOOD HEALTH HOSPITAL~123456789^^^USSSA^SS||" +
        "BATMAN^ADAM^A^III||19610615|M||C|2222 HOME STREET^^GREENSBORO^NC^27401-1020|GL|" +
        "(555) 555-2004|(555)555-2004||S||PATID12345001^2^M10^ADT1^AN^A|444333333|987654^NC|" +
        "\rNK1|1|NUCLEAR^NELDA^W|SPO^SPOUSE||||NK^NEXT OF KIN$\rPV1|1|I|2000^2012^01||||" +
        "004777^ATTEND^AARON^A|||SUR||||ADM|A0|";

        public function main() returns error? {
            // This message, ADT^A01 is an HL7 data type consisting of several components, so we
            // will cast it as such. The ADT_A01 class extends from Message, providing specialized
            // accessors for ADT^A01's segments.
            //  
            // Ballerina HL7 provides several versions of the ADT_A01 record type, each in a
            // different package (note the import statement above) corresponding to the HL7
            // version for the message.
            hl7v23:ADT_A01 adtMsg = check hl7:parse(msg).ensureType(hl7v23:ADT_A01);
            // Access the fields of the ADT_A01 message.
            hl7v23:XPN[] patientName = adtMsg.pid.pid5;
            io:println("Family Name: ", patientName[0].xpn1);
        }
        ```

    ### Step 3: Run the Ballerina Program

    Run the Ballerina program using the following command:

        ```bash
        $ bal run
        ```

    ## Serialize HL7 messages

    The following example demonstrates how to serialize(encode) an HL7v2 ADT_A01 message using Ballerina. The example defines a custom patient record and a data mapping function to convert the patient record to an ADT_A01 message. 

    ### Step 1: Implement the flow to serialize HL7 messages

    1. Create a Ballerina project using the following command. It will create the Ballerina project and the main.bal file can be used to implement the logic.
    
        ```bash
        $ bal new hl7_message_serialize_sample
        ```
    2. Import the required modules and implement the Ballerina program. In this sample we will be populating ADT_A01 message from HL7v2.3 version and serialize it to the wire format.
    
        ```ballerina
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
                    msh9: {cm_msg1: "QRY", cm_msg2: "A19"},
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
            // Serialize the ADT_A01 message to a byte array using the encode function. you can use the encoded message to
            // send over the wire to a HL7 server.
            byte[] encodedQRYA19 = check hl7v2:encode(hl7v23:VERSION, qry_a19);
            // Print the encoded string
            io:println(string `Encoded string:  ${check string:fromBytes(encodedQRYA19)}`);
        }
        ```
    ### Step 3: Run the Ballerina Program

    Run the Ballerina program using the following command:
    
    ```bash
    $ bal run
    ```    
    
=== "Micro Integrator"

    ## Parse HL7 messages

    The following example demonstrates how to parse an HL7v2 ADT_A01 message using the WSO2 Micro Integrator. The example defines how to listen to a HL7 messages from a TCP client and parse using HL7 transport.

    ### Step 1: Set Up WSO2 Micro Integrator

    Before you begin, download the [WSO2 Micro Integrator](https://wso2.com/integration/micro-integrator/) and install by following the [installation guide](https://mi.docs.wso2.com/en/latest/install-and-setup/install/installing-mi/).

    ### Step 2: Configure the HL7 transport

    Follow the steps in the following guide to configure the HL7 transport in the WSO2 Micro Integrator: [Configuring the HL7 transport](https://mi.docs.wso2.com/en/latest/install-and-setup/setup/transport-configurations/configuring-transports/#configuring-the-hl7-transport).

    ### Step 3: Implement the flow to parse HL7 messages

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


    ## Serialize HL7 messages

    The following example demonstrates how to serialize an HL7v2 QRY_A19 message using the WSO2 Micro Integrator. The example defines how to serialize an HL7 message and send it to a HL7 TCP server.

    ### Step 1: Set Up WSO2 Micro Integrator

    Before you begin, download the [WSO2 Micro Integrator](https://wso2.com/integration/micro-integrator/) and install by following the [installation guide](https://mi.docs.wso2.com/en/latest/install-and-setup/install/installing-mi/).

    ### Step 2: Configure the HL7 transport

    Follow the steps in the following guide to configure the HL7 transport in the WSO2 Micro Integrator: [Configuring the HL7 transport](https://mi.docs.wso2.com/en/latest/install-and-setup/setup/transport-configurations/configuring-transports/#configuring-the-hl7-transport).

    ### Step 3: Implement the flow to serialize HL7 messages

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