---
sidebar_position: 9
title: "FHIR Resource API Template"
description: This section will cover the approaches to implement and deploy the different FHIR resources and profiles as service.
---

# Overview

This section will cover the approaches to implement and deploy the different FHIR resources and profiles as service.



In this implementation pattern, each FHIR resource and profile is represented as an individual service (microservice). A separate Ballerina service will represent a FHIR Resource API. To implement FHIR APIs that support FHIR profiles, it's essential to provide endpoints that client applications can use to interact with your FHIR resources (for creating, reading, updating, deleting, and searching).

To streamline the setup of these APIs, we can use the [Ballerina Health CLI Tool](https://ballerina.io/learn/health-tool/) to generate the necessary API templates for a FHIR Facade. FHIR API developers can then write the business logic in the generated templates. The Health Tool is versatile and can be used to generate templates for various FHIR specifications such as base resources, USCore, AUBase etc.

Here's an example of how to utilize the Health Tool to generate USCore API templates

1. Start by cloning the example artifacts of particular FHIR profile and extracting them to a preferred location. This includes the ig-uscore/definitions directory, which includes the definition files of the FHIR specification.

   - For instance you can find all the latest version of US Core profiles [here](https://www.hl7.org/fhir/us/core/downloads.html#downloadable-copy-of-specification).

2. Navigate to the cloned directory and run the following command to generate the templates,

```bash
bal health fhir -m template -o genereated_outputs --org-name healthcare_samples --dependent-package ballerinax/health.fhir.r4.uscore501 ig-uscore/definitions
```

:::info Explanation
- `-m [mode]` - For this instance, mode should be `template`.
- `-o [output directory]` - Location of the generated Ballerina artifacts. If this path is not specified, the output will be written to the same directory from which the command is run.
- `--org-name` - [Organization](https://ballerina.io/learn/package-references/#the-org-field) name of the Ballerina package/template to be generated.
- `--dependent-package` - Fully qualified name of the published Ballerina package containing IG resources (for example: `<org>/<package>`). This option can be used to generate templates specifically for resources in the given IG. The package name part of this value will be added as a prefix to the template name. The dependent package should be generated first and pushed to Ballerina Central.

:::
:::note
You can find all the core packages of different FHIR profiles in [Ballerina Central](https://central.ballerina.io/search?q=health.fhir.r4&sort=relevance%2CDESC&page=1&m=packages).

For instance:

- [FHIR base resources](https://central.ballerina.io/ballerinax/health.fhir.r4.international401/latest)
- [US Core](https://central.ballerina.io/ballerinax/health.fhir.r4.uscore501/latest)
- [AU Base](https://central.ballerina.io/ballerinax/health.fhir.r4.aubase421/latest)

If you want to generate packages for any custom profiles, you can use the [Ballerina health package generation tool](https://ballerina.io/learn/health-tool/#package-generation).
:::
:::note
- While generating templates, you can use `--included-profile` or `--excluded-profile` to include or exclude whichever profiles you want.

:::
3. After you have generated the templates, you should implement the business logic to fetch and process required data. Because, by default these templates do not have any business logic. See [Implementing FHIR Search](../search/overview.md) and [Implementing FHIR Operations](../operations/overview.md) for how to implement search and custom operations in your facade.

   For an end-to-end Patient API facade that uses the international R4 profile and the [WSO2 FHIR Server](https://github.com/wso2/fhir-server) repository, follow the [Quick start guide](../../get-started/open-healthcare-quickstart.md).

4. Select **Run** to run the service.

    ![Run integration](/assets/img/common/run-ballerina-program.png)
