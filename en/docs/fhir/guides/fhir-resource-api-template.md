# Overview

This section will cover the approaches to implement and deploy the different FHIR resources and profiles as service.

{!includes/bal-mi-note.md!}

=== "Ballerina"

In this implementation pattern, each and every FHIR resource and profiles will be represented as individual services(micro services). For each resources there will be a Ballerina project will be genereated. To implement FHIR APIs that supports FHIR profiles, it's essential to have endpoints that client apps can use to interact with your FHIR resources (creating, reading, updating, deleting, and searching). 

To streamline the setup of these APIs, we can use the [Ballerina Health CLI Tool](https://ballerina.io/learn/health-tool/) to generate the necessary API templates for a FHIR Facade. FHIR API developers can then write the business logic in the generated templates. The Health Tool is versatile and can be used to generate templates for various FHIR specifications such as base resources, USCore, AUBase etc.

Here's an example of how to utilize the Health Tool to generate USCore API templates

1. Start by cloning the example artifacts of particular FHIR profile and extracting them to a preferred location. This includes the ig-uscore/definitions directory, which includes the definition files of the FHIR specification. 
    * For instance you can find all the latest version of US Core profiles [here](https://www.hl7.org/fhir/us/core/downloads.html#downloadable-copy-of-specification).

2. Navigate to the cloned directory and run the following command to generate the templates,

    ```
    bal health fhir -m template -o genereated_outputs --org-name healthcare_samples --dependent-package ballerinax/health.fhir.r4.uscore501 ig-uscore/definitions
    ```

    !!! explanaton 

            * -m [mode] - For this instance mode should be ***template***
            * -o [output directory] - Location of the generated Ballerina artifacts. If this path is not specified, the output will be written to the same directory from which the command is run.
            * --org-name - [Organization](https://ballerina.io/learn/package-references/#the-org-field) name of the Ballerina package/template to be generated.
            * --dependent-package - Fully qualified name of the published Ballerina package containing IG resources (eg: <org\>/<package\>). This option can be used to generate templates specifically for the resources in the given IG. The package name part of this value will be added as a prefix to the template name. The dependent package should be prior generated and pushed to the ballerina central.

    !!! notes
            You can find all the core packages of different fhir profiles in the [Ballerina central](https://central.ballerina.io/search?q=health.fhir.r4&sort=relevance%2CDESC&page=1&m=packages).
            
            For instance:

            * [FHIR base resources](https://central.ballerina.io/ballerinax/health.fhir.r4.international401/latest)
            * [US Core](https://central.ballerina.io/ballerinax/health.fhir.r4.uscore501/latest)
            * [AU Base](https://central.ballerina.io/ballerinax/health.fhir.r4.aubase421/latest)

            If you want to generate packages for any custom profiles you can use [Ballerina health package generation tool](https://ballerina.io/learn/health-tool/#package-generation). 


    !!! notes
            * While genertaing the templates, you can use  ***--included-profile*** or ***--excluded-profile*** to include and exclude whaterver profiles you want. 


3. After you have generated the templates, you should implement the business logic to fetch and process required data. Because, by default these templates do not have any business logic.

4. To run the service as a standalone server, execute the below command.

    ``` 
    bal run 
    ```


### [Optional] Steps to Deploy Metadata Prebuilt Service in Choreo

* Push the implemented template to your GitHub repository.
* Create a service component pointing to the above created repository. Follow the [official documentation](https://wso2.com/choreo/docs/develop-components/develop-services/develop-a-ballerina-rest-api/#step-1-create-a-service-component) of Choreo to create and configure a service:.
* Once the component creation is complete, you will see the component overview page.
* Then deploy the created service component.
