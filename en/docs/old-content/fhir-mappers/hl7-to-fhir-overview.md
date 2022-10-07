# Overview

HL7 V2 is a widely adopted messaging standard used before FHIR to support clinical data exchange between systems. WSO2 Open Healthcare Server is capable of receiving and sending HL7 messages. 

WSO2 Open Healthcare solution provides a dedicated datamapper called V2-To-FHIR datamapper. V2-To-FHIR datamapper provides capability to convert HL7 v2 messages into FHIR resources. The mappings between the hl7 v2 message elements are referred from the [V2-To-FHIR implementation guide](https://build.fhir.org/ig/HL7/v2-to-fhir/branches/master/index.html) published by HL7.  Therefore this datamapper constructs a FHIR bundle with the resources created from the prebuilt mappings for segments and data types as per the specification.