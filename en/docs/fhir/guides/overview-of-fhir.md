# Working with FHIR

## Overview
HL7 FHIR (Fast Healthcare Interoperability Resources) is a standard for exchanging healthcare information electronically. Developed by Health Level Seven International (HL7), FHIR is designed to enable easy, fast, and flexible sharing of healthcare data across different systems, ensuring that patient information is accessible, accurate, and up-to-date.

The key features of the FHIR specification are:

1. **Modular Structure**: It uses a modular approach with "resources" as basic units of information which represent common healthcare entities like patients, medications, appointments, and lab results. These resources can be combined and extended to meet specific needs.
2. **Interoperability**: FHIR is designed to facilitate interoperability between different healthcare systems. It supports both simple data exchange (like patient demographics) and complex workflows (like care coordination).
3. **API-based**: It's designed to work with modern web technologies, using RESTful APIs for data exchange. Which means data can be easily retrieved and updated over the web using HTTP requests.
4. **Flexibility and Extensibility**: FHIR allows for customization to meet specific requirements while maintaining a core set of common elements.
5. **Support for Multiple Formats**: FHIR supports data representation in JSON, XML, and RDF formats, making it compatible with various systems and easier to work with in different programming environments.
6. **Security**: FHIR incorporates standard security protocols, including OAuth2 and SMART on FHIR, to ensure that patient data is securely accessed and shared.

WSO2 Healthcare provides a comprehensive set of features/tools to support the FHIR-based digital transformation and compliance needs of any payer, provider, or related business.

{!includes/bal-mi-note.md!}


## FHIR with Ballerina

With Ballerina's native support for healthcare standards, it enables rapid health tech application development. We offer a comprehensive set of **pre-built services**, **project templates**, and **resource and utility packages**, all of which are *100% open source*. FHIR developers can easily download and utilize these packages to streamline the development of FHIR integrations in Ballerina, ensuring efficient and effective implementation.


## FHIR with Micro Integrator

For FHIR integrations following the ESB pattern, WSO2 Micro Integrator (MI) provides optimal FHIR integration capabilities through its available connectors and data mapping templates. Developers can enhance their integration projects by leveraging WSO2 MI’s extensive capabilities, including **EHR/EMR connectors**, the **FHIR repository connector**, and the **V2toFHIR connector**. These tools enable seamless data exchange and transformation, ensuring robust and efficient FHIR integrations.



Follow the guides below to learn how to work with FHIR in WSO2 Healthcare solution:

- [Populating FHIR resources](../../fhir/guides/populating-fhir-resources.md)
- [Parsing and Serializing](../../fhir/guides/parsing-and-serializing.md)
- [Profiling and Extending FHIR](../../fhir/guides/profiles-and-extensions.md)
- [Validating FHIR resources](../../fhir/guides/validation.md)
- [Building FHIR Bundles](../../fhir/guides/building-fhir-bundles.md)
- [Connecting to FHIR servers](../../fhir/guides/fhir-repository-connector.md)
- [Bulk Data Export](../../fhir/guides/bulk-data-export.md)
- [Building your own FHIR Facade](../../fhir/guides/fhir-resource-api-template.md)
