# Required Features

WSO2 OH 3.0.0 accelerators are designed by adhering to the FHIR R4, aka version 4.0.1. According to the specification, the following attributes are mandatory to include in a FHIR server’s Capability Statement. 

Table

Apart from these required attributes, WSO2 OH provides other metadata as well. Even though the FHIR specification does not mark those as must support properties, some properties are commonly used in a general use case. 
Supported properties are as follows.
> Url - canonical url of the Capability statement.

## FHIR APIs’ metadata

FHIR server capability statement includes the necessary metadata about the available FHIR resources(FHIR APIs) in the server and client applications or any other dependent services can query the capabilities interaction before starting communication with the server. 
FHIR spec allows the servers to include a large range of important information to be available for each FHIR resource. Among them, the following information has been included in the Capability Statement of WSO2 Open Healthcare solution. 
>Resource type, supported FHIR profiles
>Interaction - Http interactions configured for the FHIR API. Available values: create, read, vread, update, patch,...
>Search parameters supported - for the search interaction, these parameters can be used as query parameters. 

All these attributes are dynamically populated and updated according to the changes done through the WSO2 OH Portals.  

