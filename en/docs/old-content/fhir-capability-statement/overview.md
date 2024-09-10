# Overview

WSO2 Healthcare Solution offers you a RESTful FHIR server which is capable of managing FHIR APIs and Integrating with different other source data systems to populate or transform legacy formats into FHIR resources. 
As per the specification, a RESTful FHIR server allows the clients to interact in 3 levels. Instance level, Resource level and System level interactions are defined to support the implementation. Instance and Resource level interactions are tightly coupled on the use case that the particular deployment is going to address. But  the System level interactions are common for most cases as those are applied to the entire development environment. 
Among the 4 main System interactions, Capabilities interaction needs to be supported in all the FHIR servers. Therefore, WSO2 Healthcare Solution ships with readily available Capabilities interaction support. 
