#Architecture and key components

WSO2 Healthcare Solution is a solution built to leverage development of the Healthcare products to be easier and faster. It reiterates one of the main problems the healthcare industry is facing that is interoperability. The Healthcare solution is built on a novel approach to support healthcare interoperability through the widely-recognized Fast Healthcare Interoperability Resources (FHIR) standards. We provide several healthcare accelerators to speedup the development process and significantly improve the go-to-market time.

The diagram below depicts of what the WSO2 Healthcare Solution offers.

![Healthcare Architecture](../../assets/img/get-started/healthcare-architecture.png) 

Our solution caters main segments in the industry, namely, Providers (Hospitals, Clinics etc.), Payers (Health insurance companies), Vendors (companies who build healthcare products to solve various problems such as population health, patient360, interoperability etc.), PBMs (Pharmacy Benefit Managers), Pharmacies etc.

WSO2 Healthcare Solution is built on top of industry recognized WSO2 API Manager, WSO2 Enterprise Integrator and WSO2 Identity and Access Manager products. We always think from the health IT developer's perspective and come up with novel approaches to speed up the implementation process with reliability.

### Accelerators

WSO2 Healthcare Solution comes up with several accelerators to speed up the health IT development process. Source system connectors, FHIR templates, FHIR API definitions, HL7/X12 templates are some of the healthcare accelerators we provide in addition to many other integration accelerators.

#### Source System Connectors

WSO2 Healthcare Solution can connect to any source system which follows a standard protocol. Additionally, we provide low code developer accelerators called `Connectors` to any health system based on an Open API specification or based on FHIR standard. 

WSO2 Healthcare Solution has an in-built HL7 transport which allows you to communicate with HL7 servers in both receiving and sending modes.

We can also integrate easily with databases, devices, file servers, SaaS services etc. through our powerful integration platform.

<!-- Need to add the story of using of the data mapping with the pre-built schemas for each healthcare data protocol(FHIR, HL7)>
<!-- #### FHIR Templates

FHIR can be a bit challenging message format to learn hence developers may have to spend a lot of time to learn the format in detail if they are to implement FHIR APIs from scratch. We have a novel approach to bridge this knowledge gap - FHIR integration templates. WSO2's FHIR integration templates consist of more than 60% of the code you have to write in order to expose a FHIR API. You are required only to make connections to the source systems by using pre-built Connectors and filling the right hand side of a YAML file containing the data mappings. -->

<!-- ![](RackMultipart20230104-1-szav62_html_a901c08c240eef84.png)

These FHIR templates are auto-generated from FHIR specification, and we can generate the templates to any FHIR profile or an implementation guide. -->

#### FHIR API Definitions

FHIR defines a RESTful API interface to any FHIR resource](https://hl7.org/fhir/http.html). We built another tool to automatically generate the Open API Specification 3.0 based API definition files for any FHIR profile or an implementation guide. These API definitions can be imported to the API designer of WSO2 in order to expose respective FHIR APIs.

#### Security and Privacy

WSO2 Healthcare Solution supports SMART on FHIR specification and provides easy access to security and privacy controls your solution needs. Integration with your on-premise user stores, active directories and LDAPs are supported. If you have an on-premise IAM solution, WSO2 can federate identity and integrate with it. Open standards like OpenID Connect, OAuth 2.0 and scope based access control is supported natively in the solution. Advanced features such as multifactor authentication, adaptive authentication and fine-grained access control are also made available through WSO2 Healthcare Solution.