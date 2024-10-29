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


Follow the guides below to learn how to work with FHIR in WSO2 Healthcare solution:

- [Populating FHIR resources](../../fhir/guides/populating-fhir-resources.md)
- [Parsing and Serializing](../../fhir/guides/parsing-and-serializing.md)
- [Profiling and Extending FHIR](../../fhir/guides/profiles-and-extensions.md)
- [Validating FHIR resources](../../fhir/guides/validation.md)
- [Building FHIR Bundles](../../fhir/guides/building-fhir-bundles.md)
- [Connecting to FHIR servers](../../fhir/guides/fhir-repository-connector.md)
- [Bulk Data Export](../../fhir/guides/bulk-data-export.md)
- [Building your own FHIR Facade](../../fhir/guides/fhir-resource-api-template.md)
