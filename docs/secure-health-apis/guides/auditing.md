---
title: "Auditing & Provenance"
---

# Auditing & Provenance

Comprehensive audit logging is essential for healthcare compliance (HIPAA, GDPR) and security monitoring. WSO2 Open Healthcare records FHIR interactions as [AuditEvent](https://hl7.org/fhir/R4/auditevent.html) resources through a dedicated audit service that integrates with FHIR facade APIs built using the Ballerina FHIR R4 service type.

## Overview

When audit logging is enabled on a FHIR API, each completed request produces an audit record that captures:

- **Who** accessed or modified data (agent identification)
- **What** resources were accessed (entity tracking)
- **When** the action occurred (timestamp)
- **Where** the request originated (source observer)
- **How** the access was performed (REST interaction and action code)
- **Outcome** of the request (success or failure)

## Audit Service

The WSO2 Healthcare Accelerator includes a pre-built **Audit Service** that accepts flattened audit payloads and persists them as FHIR R4 `AuditEvent` resources. The service is available in the [open-healthcare-choreo-accelerators](https://github.com/wso2/open-healthcare-choreo-accelerators) repository under `miscellaneous/audit-service`.

### Features

- Accepts audit events via a lightweight REST API (`POST /audits`)
- Converts incoming payloads to FHIR R4 `AuditEvent` resources with terminology-backed codings
- Appends audit events as newline-delimited JSON to a configurable log file
- Buffers failed writes in an in-memory cache and retries on a scheduled interval

### API Endpoint

| Operation | Endpoint | Description |
|-----------|----------|-------------|
| Post audit event | `POST /audits` | Accept an audit payload and persist it as an `AuditEvent` |

The service listens on port **9093** by default.

### Request Payload

The audit service accepts an `InternalAuditEvent` payload—a flattened representation of key `AuditEvent` fields:

| Field | Maps to | Description |
|-------|---------|-------------|
| `typeCode` | `AuditEvent.type` | Event type (default: `rest`) |
| `subTypeCode` | `AuditEvent.subtype` | REST interaction (for example, `read`, `create`, `search-type`) |
| `actionCode` | `AuditEvent.action` | Action performed (`R`, `C`, `U`, `D`, or `E`) |
| `outcomeCode` | `AuditEvent.outcome` | `0` for success, `8` for failure |
| `recordedTime` | `AuditEvent.recorded` | UTC timestamp of the event |
| `agentType` | `AuditEvent.agent.type` | Security role of the agent |
| `agentName` | `AuditEvent.agent.who.display` | Display name or ID of the agent |
| `agentIsRequestor` | `AuditEvent.agent.requestor` | Whether the agent initiated the request |
| `sourceObserverName` | `AuditEvent.source.observer.display` | Name of the observing system |
| `sourceObserverType` | `AuditEvent.source.type` | Source type code |
| `entityType` | `AuditEvent.entity.type` | Type of entity accessed |
| `entityRole` | `AuditEvent.entity.role` | Role of the entity in the event |
| `entityWhatReference` | `AuditEvent.entity.what.reference` | Relative path of the resource (for example, `Patient/example`) |

### Configuration

Configure the audit service in `Config.toml`:

```toml
# Path to the audit log file (use a mounted volume in production)
auditLogPath = "/tmp/audit-logs/fhir-audit.log"

# Capacity of the in-memory cache for failed writes
cacheCapacity = 1000

# Default FHIR server name used as the source observer when not provided
fhirServerName = "wso2fhirserver.com"

# Default agent type when not provided in the payload
agentType = "humanuser"
```

### Running the Service

Clone the accelerator repository and start the audit service:

```bash
git clone https://github.com/wso2/open-healthcare-choreo-accelerators.git
cd open-healthcare-choreo-accelerators/miscellaneous/audit-service
bal run
```

The service is available at `http://localhost:9093`.

### Verifying the Service

Post a sample audit event:

```bash
curl -X POST http://localhost:9093/audits \
  -H "Content-Type: application/json" \
  -d '{
    "typeCode": "rest",
    "subTypeCode": "read",
    "actionCode": "R",
    "outcomeCode": "0",
    "recordedTime": "2024-01-15T10:30:01Z",
    "agentType": "humanuser",
    "agentName": "dr-smith",
    "agentIsRequestor": true,
    "sourceObserverName": "",
    "sourceObserverType": "3",
    "entityType": "2",
    "entityRole": "1",
    "entityWhatReference": "Patient/123"
  }'
```

On success, the service returns the generated FHIR `AuditEvent` resource. The event is also appended to the configured log file.

## Enabling Audit on FHIR Facade APIs

FHIR facade APIs built with the [Ballerina FHIR R4 service type](https://central.ballerina.io/ballerinax/health.fhirr4/latest) can publish audit events to the audit service through the built-in audit handler. When a request completes, the `FHIRResponseInterceptor` sends the audit event asynchronously so that audit logging does not block the client response.

### Audit Configuration

Add an `auditConfig` block to the `ResourceAPIConfig` record for each FHIR API that should emit audit events:

```ballerina
import ballerinax/health.fhir.r4;

public final r4:ResourceAPIConfig patientApiConfig = {
    resourceType: "Patient",
    profiles: [
        "http://hl7.org/fhir/StructureDefinition/Patient"
    ],
    defaultProfile: (),
    searchParameters: [
        // ... search parameter configuration
    ],
    operations: [],
    serverConfig: (),
    authzConfig: (),
    auditConfig: {
        enabled: true,
        auditServiceUrl: "http://localhost:9093"
    }
};
```

| Field | Type | Description |
|-------|------|-------------|
| `enabled` | `boolean` | Enable or disable audit event publishing (default: `false`) |
| `auditServiceUrl` | `string` | Base URL of the audit service |

Pass the API config to the FHIR listener when defining the service:

```ballerina
import ballerinax/health.fhirr4;
import ballerinax/health.fhir.r4;

service / on new fhirr4:Listener(9090, patientApiConfig) {

    isolated resource function get fhir/r4/Patient(r4:FHIRContext fhirContext) returns r4:Bundle {
        // Implementation
    }
}
```

### Audit Handler Behavior

The audit handler (`handleAuditEvent` in `ballerinax/health.fhir.r4`) builds an `InternalAuditEvent` from the request context and posts it to `POST /audits` on the configured audit service. The handler populates the following fields automatically:

| Field | Source |
|-------|--------|
| `typeCode` | Fixed as `rest` |
| `subTypeCode` | FHIR REST interaction (for example, `read`, `vread`, `create`) |
| `actionCode` | Derived from interaction: `R` (read), `C` (create), `U` (update), `D` (delete), `E` (other) |
| `outcomeCode` | `0` on success, `8` when the request is in an error state |
| `recordedTime` | Current UTC time |
| `agentName` | Authenticated user ID, or `Unknown` if not available |
| `agentIsRequestor` | `true` |
| `sourceObserverType` | `3` (Application Server) |
| `entityType` | `2` (System Object) |
| `entityRole` | `1` (Patient) |
| `entityWhatReference` | Raw request path from the FHIR context |

The HTTP client used to call the audit service is configured with retries (3 attempts, 5-second interval, exponential backoff). If publishing still fails after retries, the error and audit payload are logged by the FHIR facade.

## AuditEvent Resource Structure

The audit service converts each `InternalAuditEvent` into a FHIR R4 `AuditEvent` resource. A typical event generated from a Patient read request looks like this:

```json
{
  "resourceType": "AuditEvent",
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "type": {
    "system": "http://terminology.hl7.org/CodeSystem/audit-event-type",
    "code": "rest",
    "display": "RESTful Operation"
  },
  "subtype": [{
    "system": "http://hl7.org/fhir/restful-interaction",
    "code": "read",
    "display": "read"
  }],
  "action": "R",
  "outcome": "0",
  "recorded": "2024-01-15T10:30:01Z",
  "agent": [{
    "type": {
      "coding": [{
        "system": "http://terminology.hl7.org/CodeSystem/extra-security-role-type",
        "code": "humanuser"
      }]
    },
    "who": {"display": "dr-smith"},
    "requestor": true
  }],
  "source": {
    "observer": {"display": "wso2fhirserver.com"},
    "type": [{
      "system": "http://terminology.hl7.org/CodeSystem/security-source-type",
      "code": "3"
    }]
  },
  "entity": [{
    "type": {
      "system": "http://terminology.hl7.org/CodeSystem/audit-entity-type",
      "code": "2"
    },
    "role": {
      "system": "http://terminology.hl7.org/CodeSystem/object-role",
      "code": "1"
    },
    "what": {"reference": "Patient/123"}
  }]
}
```

Audit events are persisted as newline-delimited JSON in the configured log file. For FHIR-native storage and search, you can forward events to an `AuditEvent` repository or implement a custom persistence layer on top of the audit log.

## Provenance

While `AuditEvent` resources record **who did what and when**, [Provenance](https://hl7.org/fhir/R4/provenance.html) resources track the **origin and lineage** of clinical data—who created or transmitted a resource and what activity produced it.

Provenance is a separate FHIR resource type. Applications that need provenance tracking should create `Provenance` resources explicitly when data is created, updated, or transmitted. For example, US Core requires provenance information for transmitted data—see [US Core Provenance Requirements](../../compliance/us-core.md#provenance-requirements).

```json
{
  "resourceType": "Provenance",
  "target": [{"reference": "Observation/789"}],
  "recorded": "2024-01-15T10:30:00Z",
  "activity": {
    "coding": [{
      "system": "http://terminology.hl7.org/CodeSystem/v3-DataOperation",
      "code": "CREATE"
    }]
  },
  "agent": [
    {
      "type": {"coding": [{"code": "author"}]},
      "who": {"reference": "Practitioner/dr-smith"}
    },
    {
      "type": {"coding": [{"code": "transmitter"}]},
      "who": {"reference": "Organization/hospital-a"}
    }
  ]
}
```

## Compliance

Audit logging supports regulatory requirements for access tracking and accountability:

| Regulation | Relevance |
|------------|-----------|
| [HIPAA](../../compliance/hipaa.md) | Audit controls (§164.312(b)) require logging access to PHI |
| [GDPR](../../compliance/gdpr.md) | Accountability principle requires demonstrable access records |

## Related Topics

- [SMART on FHIR Overview](./smart-on-fhir-overview.md)
- [Consent Management](./consent-management.md)
- [HIPAA Compliance](../../compliance/hipaa.md)
- [GDPR Compliance](../../compliance/gdpr.md)
- [US Core Compliance](../../compliance/us-core.md)
