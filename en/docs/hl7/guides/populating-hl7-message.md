# Populating HL7 Messages

This guide explains how to populate HL7 messages using the WSO2 Healthcare solution. The WSO2 Healthcare solution provides a set of built-in capabilities to construct HL7 messages using a user-friendly graphical tooling. The tooling allows you to create HL7 messages by selecting the message type or feeding the message schema and populating the message fields using visual data mapping features.

{!includes/bal-mi-note.md!}

=== "Ballerina"

    The following example demonstrates how to populate an HL7v2 ADT_A01 message using Ballerina. The example defines a custom patient record and a data mapping function to convert the patient record to an ADT_A01 message.

    ## Step 1: Set Up Ballerina

    Before you begin, ensure you have <a href="https://ballerina.io/downloads/installation-options/" target="_blank">Ballerina</a> installed on your system.

    ## Step 2: Implement the flow to populate the HL7 message

    1. Create ballerina project using the following command. It will create the ballerina project and the main.bal file can be used to implement the logic.
    
        ```bash
        $ bal new hl7_message_populate_sample
        ```
    2. Import the required modules to the Ballerina program. In this sample we are using ADT_A01 message from HL7v2.3 version. Therefore, we need to import `ballerinax/health.hl7v23` package. If you are using a different version of HL7, you can import the relevant [package](https://central.ballerina.io/search?q=hl7&page=1&m=packages).
    
        ```ballerina
        import ballerinax/health.hl7v2;
        import ballerinax/health.hl7v23;
        import ballerina/io;
        ```    
    3. Create a custom patient record type to represent the patient data. In this sample, the patient record contains the patient's first name, last name, address, and phone number.

        ```ballerina
        // A custom patient record.
        type Patient record {
            string firstName;
            string lastName;
            string address;
            string phoneNumber;
        };
        ```
    4. Define a data mapping function to convert the patient record to an ADT_A01 message. The function takes the patient record as input and returns an ADT_A01 message. You can use the visual data mapper in ballerina to map the patient record fields to the ADT_A01 message fields. You can follow the documentation on <a href="https://ballerina.io/learn/vs-code-extension/implement-the-code/data-mapper/#open-the-data-mapper" target="_blank">Visual Data Mapping</a> to learn more about visual data mapping in Ballerina.

        ```ballerina
        // Data mapping function to convert a patient record to an ADT_A01 message.
        function patientToAdtA01(Patient patient) returns hl7v23:ADT_A01 => {
            msh: {
                msh3: {hd1: "ADT1"},
                msh4: {hd1: "MCM"},
                msh5: {hd1: "LABADT"},
                msh6: {hd1: "MCM"},
                msh8: "SECURITY",
                msh9: {cm_msg1: "ADT", cm_msg2: "A01"},
                msh10: "MSG00001",
                msh11: {pt1: "P"},
                msh12: "2.3"
            },
            pid: {
                pid5: [{xpn1: patient.lastName, xpn2: patient.firstName}],
                pid11: [{xad1: patient.address}],
                pid13: [{xtn1: patient.phoneNumber}]
            },
            pv1: {},
            evn: {}
        };
        ```
    
    ![Ballerina visual data mapping](../../../assets/img/guildes/handling-hl7/hl7-data-mapping-bal.png) 
    5. Serialize the ADT_A01 message to a string using the `hl7:encode` function.

    The complete code sample will look as follows:

    ```ballerina
    import ballerinax/health.hl7v2;
    import ballerinax/health.hl7v23;
    import ballerina/io;

    // A custom patient record.
    type Patient record {
        string firstName;
        string lastName;
        string address;
        string phoneNumber;
    };

    public function main() returns error? {
        // Sample patient data
        Patient patient = {firstName: "John", lastName: "Doe", address: "123 Main St", phoneNumber: "555-555-5555"};
        hl7v23:ADT_A01 adtMsg2 = patientToAdtA01(patient);
        // Serialize the ADT_A01 message to a string.
        string adtMsgStr = check string:fromBytes(check hl7:encode("2.3", adtMsg2));
        io:println(adtMsgStr);
    }

    // Data mapping function to convert a patient record to an ADT_A01 message.
    function patientToAdtA01(Patient patient) returns hl7v23:ADT_A01 => {
        msh: {
            msh3: {hd1: "ADT1"},
            msh4: {hd1: "MCM"},
            msh5: {hd1: "LABADT"},
            msh6: {hd1: "MCM"},
            msh8: "SECURITY",
            msh9: {cm_msg1: "ADT", cm_msg2: "A01"},
            msh10: "MSG00001",
            msh11: {pt1: "P"},
            msh12: "2.3"
        },
        pid: {
            pid5: [{xpn1: patient.lastName, xpn2: patient.firstName}],
            pid11: [{xad1: patient.address}],
            pid13: [{xtn1: patient.phoneNumber}]
        },
        pv1: {},
        evn: {}
    };
    ```

    ## Step 3: Run the Ballerina Program

    Run the Ballerina program using the following command:

        ```bash
        $ bal run
        ```
