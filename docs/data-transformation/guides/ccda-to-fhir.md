---
title: "Mapping C-CDA to FHIR"
---

## Introduction
The ccda-to-fhir transformation library is designed to convert clinical documents structured in the Consolidated Clinical Document Architecture (C-CDA) format into FHIR format. This library provides utilities to map and transform C-CDA elements, such as patient information, medical history, and treatment records, into corresponding FHIR resources, ensuring seamless integration and utilization of healthcare data across modern healthcare systems. The transformation process adheres to established standards, promoting interoperability and data consistency within healthcare applications.

This library provides a streamlined and efficient way for developers to convert CCD-A documents into the FHIR R4 format, enabling seamless integration with FHIR-based healthcare systems.

## Mapping C-CDA to FHIR
The body of a C-CDA document contains the clinical content, which is organized into structured sections. Each section corresponds to different types of clinical information, such as Patient information, Immunizations, Medications, Allergies, Problems, Procedures. Each section in the body is represented as an XML element with a specific structure, typically including a title, code (for standardized representation), and entries. Entries are sub-elements that provide detailed information, such as specific medications or results.

### Ballerina

#### Create the integration

1. Open WSO2 Integrator.
2. Select **Create** in the **Create New Integration** card.
3. Set **Integration Name** to `CCDAToFHIR`.
4. Set **Project Name** to `ccda-to-fhir`.
5. Select **Create Integration**.
6. Select **Add Artifact** and select **Automation**.

    ![Add Artifact](/assets/img/common/add-artifact.png)

#### Add the logic

  1. We are now going to transform the following C-CDA message.
  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <ClinicalDocument xmlns="urn:hl7-org:v3" xmlns:voc="urn:hl7-org:v3/voc">
<realmCode code="US"/>
<typeId root="2.16.840.1.113883.1.3" extension="POCD_HD000040"/>
<templateId root="2.16.840.1.113883.10.20.22.1.1"/>
<id root="2.16.840.1.113883.19.5.99999.1" extension="123456789"/>
<code code="18842-5" codeSystem="2.16.840.1.113883.6.1" codeSystemName="LOINC" displayName="Discharge summary"/>
<title>Continuity of Care Document</title>
<effectiveTime value="2023-05-21T08:00:00"/>
<confidentialityCode code="N" codeSystem="2.16.840.1.113883.5.25" displayName="Normal"/>
<languageCode code="en-US"/>
<recordTarget>
  <patientRole>
    <id extension="123-45-6789" root="2.16.840.1.113883.4.1"/>
    <addr use="HP">
      <streetAddressLine>123 Main Street</streetAddressLine>
      <city>Anytown</city>
      <state>NY</state>
      <postalCode>12345</postalCode>
    </addr>
    <patient>
      <name use="L">
        <given>John</given>
        <family>Doe</family>
        <prefix>Mr</prefix>
        <suffix>PhD</suffix>
      </name>
      <administrativeGenderCode code="UN" displayName="Other"/>
      <birthTime>20230531</birthTime>
    </patient>
  </patientRole>
</recordTarget>


  ```
  To understand what each field contains in the above message, you can refer to the C-CDA [spec](https://hl7.org/fhir/us/ccda/2023May/CF-index.html) for the mappings.

  2. To convert the above C-CDA message/document to FHIR resource format, add the following code to the main.bal file.
  ```ballerina
  import ballerina/io;
  import ballerinax/health.fhir.r4;
  import ballerinax/health.fhir.r4utils.ccdatofhir;

  xml ccdaMsg = xml `<?xml version="1.0" encoding="UTF-8"?>
  <ClinicalDocument xmlns="urn:hl7-org:v3" xmlns:voc="urn:hl7-org:v3/voc">
<realmCode code="US"/>
<typeId root="2.16.840.1.113883.1.3" extension="POCD_HD000040"/>
<templateId root="2.16.840.1.113883.10.20.22.1.1"/>
<id root="2.16.840.1.113883.19.5.99999.1" extension="123456789"/>
<code code="18842-5" codeSystem="2.16.840.1.113883.6.1" codeSystemName="LOINC" displayName="Discharge summary"/>
<title>Continuity of Care Document</title>
<effectiveTime value="2023-05-21T08:00:00"/>
<confidentialityCode code="N" codeSystem="2.16.840.1.113883.5.25" displayName="Normal"/>
<languageCode code="en-US"/>
<recordTarget>
  <patientRole>
    <id extension="123-45-6789" root="2.16.840.1.113883.4.1"/>
    <addr use="HP">
      <streetAddressLine>123 Main Street</streetAddressLine>
      <city>Anytown</city>
      <state>NY</state>
      <postalCode>12345</postalCode>
    </addr>
    <patient>
      <name use="L">
        <given>John</given>
        <family>Doe</family>
        <prefix>Mr</prefix>
        <suffix>PhD</suffix>
      </name>
      <administrativeGenderCode code="UN" displayName="Other"/>
      <birthTime>20230531</birthTime>
    </patient>
  </patientRole>
</recordTarget>

  `;

  function convertCcdaToFhir() returns json|error{
  r4:Bundle|r4:FHIRError ccdatofhirResult = ccdatofhir:ccdaToFhir(ccdaMsg);
  io:println("Transformed FHIR message: ", (check ccdatofhirResult).toString());
  }

  public function main() returns error?{
      _= check convertCcdaToFhir();
  }
  ```

  3. Select **Run** and test.

      ![Run integration](/assets/img/common/run-ballerina-program.png)

      Check the terminal output. You will get the following FHIR bundle as the response.
  ```json
  {
  "resourceType": "Bundle",
  "meta": {
      "profile": [
          "http://hl7.org/fhir/StructureDefinition/Bundle"
      ]
  },
  "type": "searchset",
  "entry": [
      {
          "resource": {
              "resourceType": "Patient",
              "gender": "other",
              "telecom": [],
              "identifier": [
                  {
                      "system": "http://hl7.org/fhir/sid/us-ssn",
                      "value": "123-45-6789"
                  }
              ],
              "address": [
                  {
                      "use": "home",
                      "line": [
                          "123 Main Street"
                      ],
                      "city": "Anytown",
                      "state": "NY",
                      "postalCode": "12345"
                  }
              ],
              "managingOrganization": {
                  "display": ""
              },
              "name": [
                  {
                      "family": "Doe",
                      "given": [
                          "John"
                      ],
                      "prefix": [
                          "Mr"
                      ],
                      "suffix": [
                          "PhD"
                      ]
                  }
              ]
          }
      }
  ]
  }
  ```

## Using Pre-built Services

This service can be used to transform C-CDA messages into FHIR resources.

1. You can clone the [open-healthcare-prebuilt-services](https://github.com/wso2/open-healthcare-prebuilt-services/tree/main/transformation/ccda-to-fhirr4-service) repository and start the ccda-to-fhirr4-service. Select **Run**.

    ![Run integration](/assets/img/common/run-ballerina-program.png)

2. Invoke the API as below.
```
curl --location 'http://localhost:9090/transform' \
--header 'Content-Type: application/xml' \
--data '<?xml version="1.0" encoding="UTF-8"?>
<ClinicalDocument xmlns="urn:hl7-org:v3" xmlns:voc="urn:hl7-org:v3/voc">
  <realmCode code="US"/>
  <typeId root="2.16.840.1.113883.1.3" extension="POCD_HD000040"/>
  <templateId root="2.16.840.1.113883.10.20.22.1.1"/>
  <id root="2.16.840.1.113883.19.5.99999.1" extension="123456789"/>
  <code code="18842-5" codeSystem="2.16.840.1.113883.6.1" codeSystemName="LOINC" displayName="Discharge summary"/>
  <title>Continuity of Care Document</title>
  <effectiveTime value="2023-05-21T08:00:00"/>
  <confidentialityCode code="N" codeSystem="2.16.840.1.113883.5.25" displayName="Normal"/>
  <languageCode code="en-US"/>
  <recordTarget>
<patientRole>
  <id extension="123-45-6789" root="2.16.840.1.113883.4.1"/>
  <addr use="HP">
    <streetAddressLine>123 Main Street</streetAddressLine>
    <city>Anytown</city>
    <state>NY</state>
    <postalCode>12345</postalCode>
  </addr>
  <patient>
    <name use="L">
      <given>John</given>
      <family>Doe</family>
      <prefix>Mr</prefix>
      <suffix>PhD</suffix>
    </name>
    <administrativeGenderCode code="UN" displayName="Other"/>
    <birthTime>20230531</birthTime>
  </patient>
</patientRole>
  </recordTarget>

'
```

3. You should be able to get the same above response.
