---
title: "Quick start guide"
---

# Quick start guide

This quick start walks you through building a FHIR R4 **Patient API facade** with [WSO2 Integrator](https://wso2.com/products/downloads/?product=wso2integrator). The facade sits in front of a [WSO2 FHIR Server](https://github.com/wso2/fhir-server) repository, proxies Patient read and search requests to it, and changes each response before it reaches the client. You describe the facade to **WSO2 Integrator Copilot** in plain language, then review the generated flows in the **low-code view**.

## Use case

A hospital stores Patient records in a FHIR repository. Client apps need access to those records, but must not see Social Security numbers or full phone numbers. Instead of changing the repository, you put a facade in front of it that:

- **Removes** identifiers with the system `http://hl7.org/fhir/sid/us-ssn`.
- **Masks** phone numbers so that only the last 4 digits are visible, for example `***-***-4412`.
- **Tags** every Patient with a `patient-api-facade` `meta.tag`, so clients can tell the data came through the facade.
- **Hides** the repository address by rewriting the Bundle `link` and `fullUrl` values to the facade's own base URL.

![Patient API facade use case: a client app calls the facade, which proxies requests to the WSO2 FHIR Server and changes the response](../assets/img/get-started/patient-api-facade-usecase.svg)

You will:

1. Start the WSO2 FHIR Server and load sample Patients.
2. Create an integration project in WSO2 Integrator.
3. Generate the facade with WSO2 Integrator Copilot.
4. Review the read, search, and response-change flows in the low-code view.
5. Run the facade and compare its responses with the repository's.

## Copilot prompt

You enter this prompt in [Step 4](#step-4-generate-the-facade-with-copilot):

```text
Create a FHIR R4 Patient API facade in front of a WSO2 FHIR Server repository. Expose an HTTP service on port 9091 with the base path /fhir/r4. Read the repository base URL from a configurable named fhirServerUrl with the default value http://localhost:9090/fhir/r4, and read the facade's own base URL from a configurable named facadeBaseUrl with the default value http://localhost:9091/fhir/r4. Call the repository with the ballerinax/health.clients.fhir FHIRConnector. Use the ballerinax/health.fhir.r4 and ballerinax/health.fhir.r4.international401 packages for the FHIR types, and return responses with the application/fhir+json content type.

1. GET /Patient/{id}: read the Patient from the repository. If it does not exist, return HTTP 404 with a FHIR OperationOutcome.
2. GET /Patient: forward all query parameters (for example family, gender and _count) to the repository search and return the searchset Bundle.

Apply these facade changes to every Patient the facade returns, both from a read and from each entry of a search Bundle. For search results, convert each Bundle entry resource to an international401:Patient (for example with toJson() and cloneWithType()), apply the changes, and put the changed Patient back into the entry:
- Remove identifiers with the system http://hl7.org/fhir/sid/us-ssn.
- Mask every phone number in telecom so that only the last 4 digits are visible, for example ***-***-4412.
- Add a meta.tag with system http://wso2.com/fhir/facade/source and code patient-api-facade.

In search Bundles, also replace the repository base URL with facadeBaseUrl in every link url and entry fullUrl, so clients never see the repository address.

If the repository is unreachable or returns an error, return HTTP 502 with an OperationOutcome.
```

Copilot output is AI-generated and can differ between runs. The flows and code in this guide are from one run of this prompt. Always review the generated changes, and test the facade before you rely on it.

## Prerequisites

1. [WSO2 Integrator](https://wso2.com/products/downloads/?product=wso2integrator) installed. It includes the Ballerina distribution, so you don't need to install Ballerina separately.
2. Signed in to WSO2 Integrator Copilot with your WSO2 account.
3. [Docker](https://docs.docker.com/get-docker/) with Docker Compose (or an alternative such as Rancher Desktop or Colima) to run the WSO2 FHIR Server.
4. `curl` or any HTTP client for testing.

## Step 1: Start the WSO2 FHIR Server

Download the WSO2 FHIR Server [Docker Compose file](https://github.com/wso2/fhir-server#getting-started) and start the stack. It runs the FHIR Server on port `9090` with a PostgreSQL database, and creates the database tables on first start:

```bash
curl -LO https://raw.githubusercontent.com/wso2/fhir-server/main/docker-compose.yml
docker compose up -d
```

Check that the server is ready:

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:9090/health/ready
# Expect: 200
```

The FHIR base URL is `http://localhost:9090/fhir/r4`.

The stack also uses port `5432` for PostgreSQL and port `8080` for the Adminer database UI. Stop anything else using ports `9090`, `5432`, or `8080` before you start it.

If the image pull fails with `denied`, Docker may have expired credentials saved for `ghcr.io`. The image is public, so run `docker logout ghcr.io` and try again.

## Step 2: Load sample Patients

Save this transaction Bundle as `patients-bundle.json`. It contains three Patients with MRNs, phone numbers, and, for two of them, Social Security numbers:

```json
{
  "resourceType": "Bundle",
  "type": "transaction",
  "entry": [
    {
      "request": {"method": "POST", "url": "Patient"},
      "resource": {
        "resourceType": "Patient",
        "identifier": [
          {"system": "http://hospital.example.org/mrn", "value": "MRN-100234"},
          {"system": "http://hl7.org/fhir/sid/us-ssn", "value": "123-45-6789"}
        ],
        "name": [{"family": "Smith", "given": ["Alice"]}],
        "telecom": [
          {"system": "phone", "value": "555-201-4412", "use": "mobile"},
          {"system": "email", "value": "alice.smith@example.org"}
        ],
        "gender": "female",
        "birthDate": "1990-05-15"
      }
    },
    {
      "request": {"method": "POST", "url": "Patient"},
      "resource": {
        "resourceType": "Patient",
        "identifier": [
          {"system": "http://hospital.example.org/mrn", "value": "MRN-100235"},
          {"system": "http://hl7.org/fhir/sid/us-ssn", "value": "987-65-4321"}
        ],
        "name": [{"family": "Smith", "given": ["Robert"]}],
        "telecom": [{"system": "phone", "value": "555-201-7788", "use": "home"}],
        "gender": "male",
        "birthDate": "1985-11-02"
      }
    },
    {
      "request": {"method": "POST", "url": "Patient"},
      "resource": {
        "resourceType": "Patient",
        "identifier": [{"system": "http://hospital.example.org/mrn", "value": "MRN-100236"}],
        "name": [{"family": "Perera", "given": ["Nimal"]}],
        "telecom": [{"system": "phone", "value": "555-301-1200", "use": "work"}],
        "gender": "male",
        "birthDate": "1978-03-21"
      }
    }
  ]
}
```

Post the Bundle to the repository:

```bash
curl -s -X POST http://localhost:9090/fhir/r4 \
  -H "Content-Type: application/fhir+json" \
  -d @patients-bundle.json
```

Expected: a `transaction-response` Bundle with a `201 Created` entry for each Patient. Note the `id` of Alice Smith from her `location` (for example `Patient/04c9555f-.../_history/1`). You use it in [Step 7](#step-7-test-the-facade).

## Step 3: Create an integration project

1. Open WSO2 Integrator and click **Create**.
2. Enter `PatientFacade` as the **Project name**. The **Location** updates to match.
3. Keep **Integration** selected under **What do you want to build?**
4. Enter `patient_facade` as the **Integration name**, then click **Create**.

The project opens on the integration's **Design** view, with WSO2 Integrator Copilot ready for a prompt.

![Create the PatientFacade project in WSO2 Integrator](../assets/img/get-started/quickstart/01-create-project.gif)

## Step 4: Generate the facade with Copilot

1. In the **What would you like to build?** box, paste the [Copilot prompt](#copilot-prompt).
2. Keep **Edit** mode selected and send the prompt.

Copilot opens in a side panel. It looks up the `ballerinax/health.clients.fhir` and FHIR R4 APIs, then writes the connection, service, and helper functions into the project and checks that they compile. This takes several minutes. The recording below is sped up.

![Generate the Patient API facade with WSO2 Integrator Copilot](../assets/img/get-started/quickstart/02-copilot-prompt.gif)

When Copilot finishes, it summarizes what it built and lists the changes under **Changes made**:

![Copilot summary and the generated facade](../assets/img/get-started/quickstart/copilot-result.png)

Copilot spreads the code across the integration's files:

| File | Contents |
|------|----------|
| `config.bal` | The `fhirServerUrl` and `facadeBaseUrl` configurables |
| `connections.bal` | The `fhirServerClient` FHIR connector for the repository |
| `main.bal` | The `/fhir/r4` HTTP service with the read and search resources |
| `functions.bal` | The facade changes: SSN removal, phone masking, the facade tag, and the Bundle URL rewrite |
| `data_mappings.bal` | OperationOutcome builders for the 404 and 502 responses |
| `types.bal` | Constants for the SSN system and the facade tag |

## Step 5: Review the flows in the low-code view

Close the Copilot panel to see the service design. The HTTP listener feeds the `/fhir/r4` service, and both resources call the repository through the `fhirServerClient` connection.

![Patient API facade in the WSO2 Integrator design view](../assets/img/get-started/quickstart/design-overview.png)

Click a resource or function to open its flow. Each node maps to a statement in the source code. Use the **Low-code view** and **Source code** tabs below to compare them.

### Read a Patient

The `GET /Patient/[string id]` flow:

1. Calls `getById` on the `fhirServerClient` connection.
2. Returns HTTP `404` when the repository reports the Patient as not found, and HTTP `502` for any other repository error or when the repository is unreachable.
3. Converts the payload to an `international401:Patient`, applies the facade changes, and returns it.

Repository call and error handling:

![GET /Patient/[string id] flow: repository call and error handling](../assets/img/get-started/quickstart/read-flow-1.png)

Response changes and return:

![GET /Patient/[string id] flow: apply facade changes and return](../assets/img/get-started/quickstart/read-flow-2.png)

```ballerina
resource function get Patient/[string id]() returns http:Response {
    fhir:FHIRResponse|fhir:FHIRServerError|fhir:FHIRConnectorError result = fhirServerClient->getById("Patient", id);

    if result is fhir:FHIRServerError {
        int statusCode = result.detail().httpStatusCode;
        if statusCode == 404 {
            return buildOutcomeResponse(buildNotFoundOutcome(string `Patient/${id} not found`), 404);
        }
        return buildOutcomeResponse(buildBadGatewayOutcome(string `Repository returned an error for Patient/${id}`), 502);
    }

    if result is fhir:FHIRConnectorError {
        return buildOutcomeResponse(buildBadGatewayOutcome(string `Repository is unreachable for Patient/${id}`), 502);
    }

    json|xml resourcePayload = result.'resource;
    international401:Patient|error patient = trap resourcePayload.cloneWithType(international401:Patient);
    if patient is error {
        return buildOutcomeResponse(buildBadGatewayOutcome(string `Repository returned an invalid Patient payload for Patient/${id}`), 502);
    }

    international401:Patient changedPatient = applyFacadeChanges(patient);
    return buildJsonResponse(changedPatient.toJson(), 200);
}
```

### Apply the facade changes

The `applyFacadeChanges` function holds the response changes. It filters out SSN identifiers, masks each phone number with `maskIfPhone`, and adds the facade tag to `meta.tag`, keeping any tags the repository already set.

![applyFacadeChanges function flow](../assets/img/get-started/quickstart/apply-facade-changes.png)

```ballerina
isolated function applyFacadeChanges(international401:Patient patient) returns international401:Patient {
    r4:Identifier[]? identifiers = patient.identifier;
    if identifiers is r4:Identifier[] {
        patient.identifier = from r4:Identifier identifier in identifiers
            where identifier.system != US_SSN_IDENTIFIER_SYSTEM
            select identifier;
    }

    r4:ContactPoint[]? telecom = patient.telecom;
    if telecom is r4:ContactPoint[] {
        patient.telecom = from r4:ContactPoint contactPoint in telecom
            select maskIfPhone(contactPoint);
    }

    r4:Meta? meta = patient.meta;
    r4:Coding facadeTag = {system: FACADE_TAG_SYSTEM, code: FACADE_TAG_CODE};
    if meta is r4:Meta {
        r4:Coding[]? tags = meta.tag;
        if tags is r4:Coding[] {
            tags.push(facadeTag);
            meta.tag = tags;
        } else {
            meta.tag = [facadeTag];
        }
        patient.meta = meta;
    } else {
        patient.meta = {tag: [facadeTag]};
    }

    return patient;
}

isolated function maskIfPhone(r4:ContactPoint contactPoint) returns r4:ContactPoint {
    r4:ContactPointSystem? system = contactPoint.system;
    string? value = contactPoint.value;
    if system == r4:phone && value is string {
        contactPoint.value = maskPhoneNumber(value);
    }
    return contactPoint;
}
```

### Search Patients

The `GET /Patient` flow:

1. Forwards every query parameter, including `_count`, to the repository's `search`.
2. Returns HTTP `502` when the repository fails or returns an invalid Bundle.
3. Loops over the Bundle entries and applies the facade changes to each Patient with `applyFacadeChangesToEntry`.
4. Rewrites the Bundle `link` and entry `fullUrl` values to `facadeBaseUrl` with `rewriteBundleUrls`.

![GET /Patient search flow: loop over Bundle entries](../assets/img/get-started/quickstart/search-flow.png)

```ballerina
resource function get Patient(http:Request request) returns http:Response {
    map<string[]> searchParameters = request.getQueryParams();

    fhir:FHIRResponse|fhir:FHIRServerError|fhir:FHIRConnectorError result = fhirServerClient->search("Patient", searchParameters);

    if result is fhir:FHIRServerError {
        return buildOutcomeResponse(buildBadGatewayOutcome("Repository returned an error for Patient search"), 502);
    }

    if result is fhir:FHIRConnectorError {
        return buildOutcomeResponse(buildBadGatewayOutcome("Repository is unreachable for Patient search"), 502);
    }

    json|xml resourcePayload = result.'resource;
    r4:Bundle|error bundle = trap resourcePayload.cloneWithType(r4:Bundle);
    if bundle is error {
        return buildOutcomeResponse(buildBadGatewayOutcome("Repository returned an invalid Bundle payload for Patient search"), 502);
    }

    r4:BundleEntry[]? entries = bundle.entry;
    if entries is r4:BundleEntry[] {
        r4:BundleEntry[] changedEntries = [];
        foreach r4:BundleEntry entry in entries {
            r4:BundleEntry|error changedEntry = applyFacadeChangesToEntry(entry);
            if changedEntry is error {
                changedEntries.push(entry);
                continue;
            }
            changedEntries.push(changedEntry);
        }
        bundle.entry = changedEntries;
    }

    r4:Bundle rewrittenBundle = rewriteBundleUrls(bundle);
    return buildJsonResponse(rewrittenBundle.toJson(), 200);
}

isolated function applyFacadeChangesToEntry(r4:BundleEntry entry) returns r4:BundleEntry|error {
    anydata|r4:FHIRWireFormat resource = entry.'resource;
    if resource is () {
        return entry;
    }

    json resourceJson = check resource.cloneWithType(json);
    international401:Patient patient = check resourceJson.cloneWithType(international401:Patient);
    international401:Patient changedPatient = applyFacadeChanges(patient);
    entry.'resource = changedPatient.toJson();
    return entry;
}
```

If an entry can't be converted to a Patient, this generated code passes it through **unchanged**, without the facade changes. For a production facade that must never leak sensitive data, change the `changedEntry is error` branch to drop the entry or fail the request instead.

## Step 6: Run the facade

Click **Run** in the integration's toolbar. WSO2 Integrator compiles the integration and starts it in the **Terminal** panel. The facade is ready when the terminal shows `Running executable`.

![Run the Patient API facade from WSO2 Integrator](../assets/img/get-started/quickstart/03-run.gif)

The facade listens at `http://localhost:9091/fhir/r4/Patient` and proxies to the repository at `http://localhost:9090/fhir/r4`. To point it at a different repository, set `fhirServerUrl` in `Config.toml` or with **Configure**.

## Step 7: Test the facade

### Compare a read

Read Alice Smith from the repository directly. Replace `{id}` with her id from [Step 2](#step-2-load-sample-patients):

```bash
curl -s "http://localhost:9090/fhir/r4/Patient/{id}"
```

The repository returns the full record, including the SSN and the full phone number:

```json
{
  "resourceType": "Patient",
  "id": "04c9555f-5dce-4bef-be99-c24201b48d41",
  "meta": {"versionId": "1", "lastUpdated": "2026-10-30T14:05:55+05:30"},
  "identifier": [
    {"system": "http://hospital.example.org/mrn", "value": "MRN-100234"},
    {"system": "http://hl7.org/fhir/sid/us-ssn", "value": "123-45-6789"}
  ],
  "name": [{"family": "Smith", "given": ["Alice"]}],
  "telecom": [
    {"system": "phone", "use": "mobile", "value": "555-201-4412"},
    {"system": "email", "value": "alice.smith@example.org"}
  ],
  "gender": "female",
  "birthDate": "1990-05-15"
}
```

Now read the same Patient through the facade:

```bash
curl -s "http://localhost:9091/fhir/r4/Patient/{id}"
```

The facade returns HTTP `200` with `application/fhir+json`. The SSN is gone, the phone number is masked, the email is unchanged, and the facade tag is added:

```json
{
  "resourceType": "Patient",
  "id": "04c9555f-5dce-4bef-be99-c24201b48d41",
  "meta": {
    "versionId": "1",
    "lastUpdated": "2026-10-30T14:05:55+05:30",
    "tag": [{"system": "http://wso2.com/fhir/facade/source", "code": "patient-api-facade"}]
  },
  "identifier": [{"system": "http://hospital.example.org/mrn", "value": "MRN-100234"}],
  "name": [{"family": "Smith", "given": ["Alice"]}],
  "telecom": [
    {"system": "phone", "value": "***-***-4412", "use": "mobile"},
    {"system": "email", "value": "alice.smith@example.org"}
  ],
  "gender": "female",
  "birthDate": "1990-05-15"
}
```

### Search through the facade

```bash
curl -s "http://localhost:9091/fhir/r4/Patient?family=Smith"
```

Expected: a `searchset` Bundle with Alice and Robert Smith. Each entry has the facade changes applied: no SSN, masked phone numbers (`***-***-4412` and `***-***-7788`), and the `patient-api-facade` tag. The `link` and `fullUrl` values point to `http://localhost:9091/fhir/r4`, not the repository.

Query parameters are passed through to the repository. Add `_count=1` to get one entry per page, with a `next` link that also uses the facade's URL:

```bash
curl -s "http://localhost:9091/fhir/r4/Patient?family=Smith&_count=1"
```

### Read a Patient that doesn't exist

```bash
curl -s "http://localhost:9091/fhir/r4/Patient/does-not-exist"
```

Expected: HTTP `404` with an OperationOutcome with code `not-found`.

### Stop the repository

Stop the WSO2 FHIR Server, then repeat the read or search through the facade:

```bash
docker compose stop server
```

Expected: HTTP `502` with an OperationOutcome with severity `fatal`, for example `Repository is unreachable for Patient search`. Start the server again with `docker compose start server` to restore normal responses. The data is stored in PostgreSQL, so the sample Patients are still there.

## Reference project

Download the source project generated in this guide: [patient-facade.zip](pathname:///assets/attachments/get-started/patient-facade.zip). Use it to compare against your own Copilot output, or to run the facade without generating it.

The zip contains:

- The `PatientFacade` WSO2 Integrator project, with the `patient_facade` integration source files from [Step 4](#step-4-generate-the-facade-with-copilot).
- `patients-bundle.json`, the sample data from [Step 2](#step-2-load-sample-patients).
- A `README.md` with run instructions.

To run it:

1. Start the WSO2 FHIR Server and load the sample data, as in [Step 1](#step-1-start-the-wso2-fhir-server) and [Step 2](#step-2-load-sample-patients).
2. Extract the zip.
3. Run the facade in one of these ways:
    - **WSO2 Integrator:** on the start page, click **Open Existing**, select the extracted `patient-facade` folder, then click **Run**.
    - **Command line:** with Ballerina 2201.14.1 or later, run:

        ```bash
        cd patient-facade/patient_facade
        bal run
        ```

4. Test it with the requests in [Step 7](#step-7-test-the-facade).

## Next steps

- [Developing FHIR APIs](../fhir/guides/fhir-resource-api-template.md): Generate templates for more resources and IGs
- [FHIR Search](../fhir/search/overview.md): Deeper search parameter handling and pagination
- [Using FHIR Connector](../fhir/guides/fhir-repository-connector.md): Full connector operation reference
- [Deploy FHIR APIs](../install-and-setup/deploy-fhir-apis.md): Expose the facade through WSO2 API Manager
