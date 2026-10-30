---
sidebar_position: 2
title: "Connecting to EHR/EMR Systems"
description: WSO2 Open Healthcare provides pre-built connectors for well-known EHR systems and supports generating connectors for any FHIR-based or proprietary EMR.
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

WSO2 Open Healthcare provides pre-built connectors for well-known EHR systems such as Epic, Cerner, and Athena. For other FHIR-based EHR systems, you can auto-generate connectors using the Ballerina Health Tool. For EHR systems that expose proprietary APIs, you can generate Ballerina clients from OpenAPI definitions.

## Pre-built Connectors

The following pre-built connectors are available for widely adopted EHR systems:

| EHR System | Connector |
|---|---|
| Epic | [health.clients.fhir.epic](https://wso2.com/integration-platform/connectors/connector/ballerinax/health.clients.fhir.epic/latest) |
| Cerner | [health.clients.fhir.cerner](https://wso2.com/integration-platform/connectors/connector/ballerinax/health.clients.fhir.cerner/latest) |
| Athena | [health.clients.fhir.athenahealth](https://wso2.com/integration-platform/connectors/connector/ballerinax/health.clients.fhir.athenahealth/latest) |

## Generating Connectors for FHIR-based EHRs

For FHIR-based EHR systems that don't have a pre-built connector, you can auto-generate one using the [Ballerina Health Tool](https://ballerina.io/learn/health-tool/) CLI, distributed via Ballerina Central.

The Health Tool's **FHIR - Connector** mode generates a Ballerina FHIR connector client for a given FHIR server based on its Capability Statement. The generated connector contains all the CRUD endpoints that the target FHIR server supports.

```bash
bal health fhir -m connector -o <output-directory> --capability-statement <capability-statement-url>
```

Refer to the [Ballerina Health Tool documentation](https://ballerina.io/learn/health-tool/) for full usage details and options.

## Generating Clients for Proprietary EHR APIs

For EHR systems that expose proprietary (non-FHIR) APIs with an OpenAPI definition, you can generate a Ballerina client using the `bal openapi` tool.

:::note
Before generating your client, check if a pre-generated client for your API already exists in [Ballerina Central](https://central.ballerina.io/). If so, you can refer to the client's API documentation for usage instructions.
:::

```bash
bal openapi -i <openapi-contract> --mode client
```

For example:

```bash
bal openapi -i hello.yaml --mode client
```

This generates the following files:

- `client.bal` -- the Ballerina client stub
- `types.bal` -- schema types from the OpenAPI contract
- `utils.bal` -- utility methods for the client stub

## Example: Unified patient access across Epic and Cerner

This example builds **UnifiedCare**, an API that gives care coordinators one view of a patient across two EHR systems. It's based on the [EMR unified patient access](https://github.com/wso2/solutions-healthcare-demos/tree/main/use-cases/emr-unified-patient-access) demo.

### Use case

A regional care network runs its tertiary hospital on **Epic** and its community clinics on **Cerner (Oracle Health)**. Instead of logging in to each EHR, care coordinators call one API. Lookups and searches fan out to both EHRs in parallel, and the API combines whatever each one returns. Patient-360 and referrals first read the patient from one EHR, then use those demographics to search the other:

| Operation | What it does |
|---|---|
| `GET /unifiedcare/patients/{id}` | **Unified lookup.** Resolves the id in Epic and in Cerner. `foundIn` lists where the patient exists. A miss in one EHR becomes a warning. |
| `GET /unifiedcare/patients?family=&given=&birthdate=` | **Unified search.** Merges demographic matches from both EHRs. `sourceEmr` marks where each record came from. |
| `GET /unifiedcare/patients/{id}/summary` | **Patient-360.** Aggregates conditions, medications, allergies, vitals, and labs where the id resolves. It then links the same person in the other EHR by family name and birth date (using the first match), and aggregates there too. |
| `POST /unifiedcare/referrals` | **Cross-EHR referral.** Pulls the clinical packet from the source EHR and looks for the patient in the receiving EHR (`MATCH_FOUND` with candidate ids, or `NO_MATCH`). |

All calls are read-only. The API uses system-to-system authentication, so no user logs in to either EHR:

| EHR | Authentication | Connector |
|---|---|---|
| Epic | SMART Backend Services: a private key JWT client assertion | `ballerinax/health.clients.fhir.epic` |
| Cerner | OAuth 2.0 client credentials with `system/*.read` scopes | `ballerinax/health.clients.fhir.cerner` |

The connectors get, cache, and refresh access tokens for you.

### Prerequisites

1. [WSO2 Integrator](https://wso2.com/products/downloads/?product=wso2integrator) installed.
2. An **Epic** backend app on the [Epic on FHIR](https://fhir.epic.com/) sandbox, with a client ID and its RSA private key. See [Creating the Epic backend app](#creating-the-epic-backend-app).
3. A **Cerner** system app on the [Oracle Health code console](https://code-console.cerner.com/), with a client ID, a client secret, and these scopes: `system/Patient.read`, `system/Condition.read`, `system/Observation.read`, `system/AllergyIntolerance.read`, and `system/MedicationRequest.read`.

#### Creating the Epic backend app

1. Create a public/private key pair with OpenSSL:

    ```bash
    openssl genrsa -out epic-private-key.pem 2048
    openssl req -new -x509 -key epic-private-key.pem -out epic-public-key509.pem -subj '/CN=unifiedcare'
    ```

2. Log in to [Epic on FHIR](https://fhir.epic.com/) and open **Build Apps**.
3. Create an application with these details:
    - **Application Audience:** Backend Systems
    - **Incoming APIs:** `Patient.Read`, `Patient.Search`, `Condition.Search`, `MedicationRequest.Search`, `AllergyIntolerance.Search`, and `Observation.Search` (R4)
    - Upload `epic-public-key509.pem` as the public key.
4. Note the **Non-Production Client ID**.

See [Epic's OAuth 2.0 documentation](https://fhir.epic.com/Documentation?docId=oauth2&section=BackendOAuth2Guide) for details.

:::note
If your Epic app isn't authorized for an API, the call fails and the API reports it as a warning instead of failing the request. For example, without the clinical search APIs, Patient-360 returns `FHIR server side error` warnings for the Epic clinical sections, while demographics still work.
:::

### Step 1: Create the integration project

1. Open WSO2 Integrator and click **Create**.
2. Enter `UnifiedCare` as the **Project name**.
3. Keep **Integration** selected and enter `unified_care_api` as the **Integration name**.
4. Click **Create**.

![Create the UnifiedCare project in WSO2 Integrator](/assets/img/emr-connectivity/unified-patient-access/01-create-project.gif)

### Step 2: Add the configurables

The API reads its EHR endpoints and credentials from configurables. Add them under **Configurations** in the sidebar, or paste them into `config.bal`:

```ballerina
// Port the UnifiedCare API listens on.
configurable int servicePort = 9095;

// Epic sandbox: SMART Backend Services (private key JWT client assertion).
configurable string epicBaseUrl = "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4";
configurable string epicTokenUrl = "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token";
configurable string epicClientId = ?;
configurable string epicKeyFile = ?;

// Cerner sandbox: system app (OAuth2 client credentials).
configurable string cernerBaseUrl = "https://fhir-ehr-code.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d";
configurable string cernerTokenUrl = "https://authorization.cerner.com/tenants/ec2458f2-1e24-41c8-b71b-0e701af7583d/protocols/oauth2/profiles/smart-v1/token";
configurable string cernerClientId = ?;
configurable string cernerClientSecret = ?;
configurable string[] cernerScopes = [
    "system/Patient.read",
    "system/Condition.read",
    "system/Observation.read",
    "system/AllergyIntolerance.read",
    "system/MedicationRequest.read"
];
```

Then create a `Config.toml` file in the integration folder with your values:

```toml
epicClientId = "<epic-backend-app-client-id>"
epicKeyFile = "epic-private-key.pem"

cernerClientId = "<cerner-system-app-client-id>"
cernerClientSecret = "<cerner-system-app-client-secret>"
```

:::caution
`Config.toml` and the private key file hold credentials. Keep them out of version control. The generated `.gitignore` already excludes `Config.toml`. Add `*.pem` too.
:::

### Step 3: Add the Epic and Cerner connections

1. In the design view, click **Add Artifact**, open the **Other** tab, and select **Connection**.
2. Search for `health.clients.fhir`. The pre-built EHR connectors are listed under **Pre-built Connectors**.

    ![Pre-built FHIR connectors for Epic, Cerner, and Athenahealth](/assets/img/emr-connectivity/unified-patient-access/add-connection.png)

3. Select **Epic FHIRClientConnector**, name the connection `epicClient`, and set **Fhir Connector Config** to the Epic configurables. The private key JWT settings go in `authConfig`:

    <Tabs>
    <TabItem value="lowcode" label="Low-code view" default>

    ![epicClient connection settings](/assets/img/emr-connectivity/unified-patient-access/epic-connection.png)

    </TabItem>
    <TabItem value="code" label="Source code">

    ```ballerina
    import ballerinax/health.clients.fhir.epic;

    final epic:FHIRClientConnector epicClient = check new ({
        baseURL: epicBaseUrl,
        authConfig: {clientId: epicClientId, tokenEndpoint: epicTokenUrl, keyFile: epicKeyFile},
        timeout: 90
    });
    ```

    </TabItem>
    </Tabs>

4. Repeat with **Cerner FHIRClientConnector**, naming the connection `cernerClient`. Cerner uses the OAuth 2.0 client credentials grant:

    <Tabs>
    <TabItem value="lowcode" label="Low-code view" default>

    ![cernerClient connection settings](/assets/img/emr-connectivity/unified-patient-access/cerner-connection.png)

    </TabItem>
    <TabItem value="code" label="Source code">

    ```ballerina
    import ballerinax/health.clients.fhir.cerner;

    final cerner:FHIRClientConnector cernerClient = check new ({
        baseURL: cernerBaseUrl,
        authConfig: {tokenUrl: cernerTokenUrl, clientId: cernerClientId, clientSecret: cernerClientSecret, scopes: cernerScopes},
        timeout: 90
    });
    ```

    </TabItem>
    </Tabs>

:::note
If the connection form shows **Failed to pull the connector**, add the connection from the **Source code** tab above into `connections.bal`. WSO2 Integrator pulls the package on the next build, and the connection then appears in the design view.
:::

### Step 4: Route each call to the right EHR

The Epic and Cerner connectors expose typed FHIR operations, such as `getPatientById`, `searchPatient`, `searchCondition`, and `searchObservation`. Add a small function per operation that takes the target EHR and calls the matching connector. The rest of the API then works with any EHR through these functions.

Add an `EmrSystem` enum under **Types**:

```ballerina
public enum EmrSystem {
    EPIC = "epic",
    CERNER = "cerner"
}
```

Then add the routing functions under **Functions**. For example, `readPatient`:

<Tabs>
<TabItem value="lowcode" label="Low-code view" default>

![readPatient function flow routing to epicClient or cernerClient](/assets/img/emr-connectivity/unified-patient-access/readpatient-flow.png)

</TabItem>
<TabItem value="code" label="Source code">

```ballerina
function readPatient(EmrSystem emr, string patientId) returns fhir:FHIRResponse|fhir:FHIRError {
    if emr == EPIC {
        return epicClient->getPatientById(patientId);
    }
    return cernerClient->getPatientById(patientId);
}

function findPatients(EmrSystem emr, string? family, string? given, string? birthdate)
        returns fhir:FHIRResponse|fhir:FHIRError {
    if emr == EPIC {
        return epicClient->searchPatient(family = family, given = given, birthdate = birthdate);
    }
    return cernerClient->searchPatient(family = family, given = given, birthdate = birthdate);
}

function searchObservations(EmrSystem emr, string patientId, string category)
        returns fhir:FHIRResponse|fhir:FHIRError {
    if emr == EPIC {
        return epicClient->searchObservation(patient = patientId, category = category);
    }
    return cernerClient->searchObservation(patient = patientId, category = category);
}
```

</TabItem>
</Tabs>

Add `searchConditions`, `searchMedications`, and `searchAllergies` the same way, using `searchCondition`, `searchMedicationRequest`, and `searchAllergyIntolerance`.

The resources don't call these routing functions directly. Helper functions such as `searchPatients` and `fetchPatientSummary` call them, then map the FHIR responses to the API's summary records. You can find the helpers in the [reference project](#reference-project).

### Step 5: Build the unified API

Add an **HTTP Service** with the base path `/unifiedcare` on port `servicePort`, and add the four resources from the [use case](#use-case). The design view shows the service calling both connections:

![UnifiedCare service connected to the Epic and Cerner connections](/assets/img/emr-connectivity/unified-patient-access/design-overview.png)

The lookup and search resources fan out to both EHRs with `start`, wait for both results, and combine them. A failure in one EHR becomes a warning instead of failing the whole request. For example, the unified search calls `searchPatients` for each EHR in parallel:

<Tabs>
<TabItem value="lowcode" label="Low-code view" default>

![GET /patients flow fanning out to Epic and Cerner in parallel](/assets/img/emr-connectivity/unified-patient-access/search-flow.png)

</TabItem>
<TabItem value="code" label="Source code">

```ballerina
resource function get patients(string? family, string? given, string? birthdate)
        returns UnifiedSearchResult|http:BadRequest {
    if family is () && given is () && birthdate is () {
        return <http:BadRequest>{
            body: <ErrorBody>{message: "Provide at least one of: family, given, birthdate"}
        };
    }
    future<PatientSummary[]|error> epicFuture = start searchPatients(emr = EPIC,
            family = family, given = given, birthdate = birthdate);
    future<PatientSummary[]|error> cernerFuture = start searchPatients(emr = CERNER,
            family = family, given = given, birthdate = birthdate);

    string[] foundIn = [];
    PatientSummary[] combinedPatients = [];
    string[] warnings = [];
    PatientSummary[]|error epicMatches = wait epicFuture;
    if epicMatches is PatientSummary[] {
        if epicMatches.length() > 0 {
            foundIn.push(EPIC);
            combinedPatients.push(...epicMatches);
        }
    } else {
        warnings.push(string `epic: ${epicMatches.message()}`);
    }
    PatientSummary[]|error cernerMatches = wait cernerFuture;
    if cernerMatches is PatientSummary[] {
        if cernerMatches.length() > 0 {
            foundIn.push(CERNER);
            combinedPatients.push(...cernerMatches);
        }
    } else {
        warnings.push(string `cerner: ${cernerMatches.message()}`);
    }
    return {foundIn, patients: combinedPatients, warnings};
}
```

</TabItem>
</Tabs>

The Patient-360 resource calls `buildUnifiedPatient360`, which aggregates the clinical sections in every EHR where the id resolves and links the other EHR by demographics. It returns `404` when no EHR has the patient:

![GET /patients/{id}/summary flow](/assets/img/emr-connectivity/unified-patient-access/summary-flow.png)

:::caution
Cross-EHR linking and referral matching use family name and birth date only. Patient-360 links the **first** candidate, and a referral reports `MATCH_FOUND` when there's at least one candidate. In the Cerner sandbox, one search can return several patients with the same name and birth date. This matching is for demonstration only. In production, use a master patient index or require a single unambiguous match on stronger identifiers before you link records.
:::

The FHIR-to-summary mappings (for example, `toPatientSummary` and `toConditionSummaries`) and the remaining resources are in the [reference project](#reference-project).

### Step 6: Run and test

Click **Run**. The API is ready when the terminal shows `Running executable`:

![Run the UnifiedCare API in WSO2 Integrator](/assets/img/emr-connectivity/unified-patient-access/02-run.gif)

Search both EHRs for the same patient:

```bash
curl -s "http://localhost:9095/unifiedcare/patients?family=Lopez&given=Camila&birthdate=1987-09-12"
```

Expected: `foundIn` is `["epic", "cerner"]`, and `patients` has matches from both, each with its `sourceEmr`.

Look up an Epic patient id in both EHRs:

```bash
curl -s "http://localhost:9095/unifiedcare/patients/erXuFYUfucBZaryVksYEcMg3"
```

Expected: `foundIn` is `["epic"]` with Camila Maria Lopez's record, and a `cerner:` warning because Cerner doesn't know that id.

Build the Patient-360 view:

```bash
curl -s "http://localhost:9095/unifiedcare/patients/erXuFYUfucBZaryVksYEcMg3/summary"
```

Expected: `linkedVia` is `family name + birthDate demographic match`, with one summary from Epic and one from the linked Cerner record.

Refer the patient from Epic to Cerner:

```bash
curl -s -X POST "http://localhost:9095/unifiedcare/referrals" \
  -H "Content-Type: application/json" \
  -d '{
    "sourceEmr": "epic",
    "targetEmr": "cerner",
    "patientId": "erXuFYUfucBZaryVksYEcMg3",
    "reason": "Endocrinology follow-up at community clinic"
  }'
```

Expected: `matchOutcome` is `MATCH_FOUND`, with Cerner candidate ids under `targetMatches`.

### Reference project

Download the complete source project: [unified-care.zip](pathname:///assets/attachments/emr-connectivity/unified-care.zip). It includes a `Config.toml.sample`. Copy it to `Config.toml` in the `unified_care_api` folder, fill in your credentials, place your Epic private key next to it, then open the project in WSO2 Integrator and click **Run**.
