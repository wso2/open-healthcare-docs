# Profiles and Extensions

FHIR profiles and extensions are one of the key components in a FHIR server implementation, allowing for the customization and refinement of standard FHIR resources to meet specific use cases and regulatory requirements. FHIR profiles enable organizations to define constraints and extensions on standard resources, ensuring that data conforms to particular business or clinical needs. 
<br>Extensions provide the flexibility to add new elements or modify existing ones without deviating from the core FHIR specification. Together, profiles and extensions facilitate the creation of a robust, adaptable FHIR server that can accommodate a wide range of healthcare scenarios while maintaining interoperability with other systems.

{!includes/bal-mi-note.md!}

=== "Ballerina"

    Ballerina FHIR packages are designed to effectively handle FHIR profiles and extensions. By leveraging the language's type inclusion features and closed records, developers can define profiled FHIR resources with precision, ensuring that custom constraints and extensions are accurately represented. Additionally, Ballerina supports complex extensions within its records, allowing for the seamless integration of advanced FHIR customizations. This structured approach ensures that even the most tailored FHIR resources are fully supported within the Ballerina ecosystem.

    ```
    import ballerina/log;
    import ballerinax/health.fhir.r4.uscore501;
    import ballerinax/health.fhir.r4.parser;

    public function main() {
        json patientPayload = {
            "resourceType": "Patient",
            "id": "example-patient",
            "text": {
                "status": "generated",
                "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">John Doe</div>"
            },
            "identifier": [
                {
                    "system": "http://example.com/patient-ids",
                    "value": "12345"
                }
            ],
            "extension": [
                {
                    "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race",
                    "valueCodeableConcept": {
                        "coding": [
                            {
                                "system": "http://hl7.org/fhir/v3/Race",
                                "code": "2106-3",
                                "display": "White"
                            }
                        ]
                    }
                }
            ],
            "name": [
                {
                    "use": "official",
                    "family": "Doe",
                    "given": [
                        "John"
                    ]
                }
            ],
            "gender": "male",
            "birthDate": "2000-01-01"
        };

        do {
            anydata parsedResult = check parser:parse(patientPayload, uscore501:USCorePatientProfile);
            uscore501:USCorePatientProfile patientModel = check parsedResult.ensureType();
            log:printInfo(string `Patient name : ${patientModel.name[0].toString()}`);
        } on fail error parseError {
            log:printError(string `Error occurred while parsing : ${parseError.message()}`, parseError);
        }
    }
    ```

    !!! info
        The Ballerina CLI is designed to accommodate domain-specific tools, one of which is the Ballerina Health tool. This specialized tool enables the generation of a Ballerina FHIR package, which includes Ballerina record representations of FHIR resources and project templates tailored for any custom set of FHIR structure definitions. These definitions can encompass FHIR profiles, extended FHIR resources, and more. The tool is user-friendly, with detailed help text available to guide users through its features and usage, ensuring a smooth and efficient development process.

=== "Micro Integrator"

    Profiles and extensions are fully supported within the MI VSCode DataMapper. To utilize these features, simply provide the correct JSON schema or a JSON sample that includes the desired profiles and extensions. Once loaded, the DataMapper's canvas will reflect these fields, allowing you to map values to them accordingly. This ensures that your FHIR resources are populated with the necessary customizations, facilitating accurate and compliant data integration.

    ![Mapping with profile](../../../assets/img/guildes/handling-fhir/mapping-with-profile.png)