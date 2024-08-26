# Populating FHIR resources

In a FHIR facade implementation, populating FHIR resources is a critical step that involves mapping and transforming data from existing healthcare systems into standardized FHIR resources. This process ensures that the data is consistent, accurate, and accessible in a FHIR-compliant format, allowing for seamless interoperability between different healthcare applications.

{!includes/bal-mi-note.md!}

=== "Ballerina"

Populating a FHIR resource in Ballerina is as straightforward as creating a simple record object. Developers need only import the appropriate FHIR package from Ballerina Central and then create a FHIR resource record as demonstrated below.
```
import ballerinax/health.fhir.r4.internationa401;


function createSamplePatient() returns internationa401:Patient {
    internationa401:Patient patient = {
        meta: {
            lastUpdated: time:utcToString(time:utcNow()),
            profile: [internationa401:PROFILE_BASE_PATIENT]
        },
        active: true,
        name: [{
            family: "Doe",
            given: ["Jhon"],
            use: internationa401:official,
            prefix: ["Mr"]
        }],
        address: [{
            line: ["652 S. Lantern Dr."],
            city: "New York",
            country: "United States",
            postalCode: "10022",
            'type: internationa401:physical,
            use: internationa401:home
        }]
    };
    return patient;
} 
```
In Ballerina, you can access built-in records [link to central] that support FHIR. These predefined records allow you to easily populate FHIR resources. With cardinality constraints and data validation rules embedded in the record definitions, the IDE provides guidance to ensure the complete and accurate population of FHIR resources. Additionally, records are available for commonly used implementation guides, incorporating specific extensions and constraints relevant to those areas.




=== "Micro Integrator"

For integrations running on WSO2 Micro Integrator (MI), FHIR resources can be created using the DataMapper feature available in the VSCode Micro Integrator extension. This feature allows you to map fields from the source schema to the target FHIR schema effortlessly. Schemas can be loaded into the extension by referencing sample JSON files that correspond to each schema, ensuring accurate and efficient mapping for FHIR resource creation.

![FHIR DataMapping](../../../assets/img/guildes/handling-fhir/fhir-datamapper.png)

The populated FHIR resource can be accessed and modified within the message flow, and further FHIR-related actions, such as adding the resource to a FHIR bundle or serializing it into FHIR-specified wire formats like `fhir+json` or `fhir+xml`, can be accomplished using the FHIR Base connector available in the WSO2 Connector Store.

