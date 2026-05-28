---
title: Bulk Data Export
sidebar_position: 3
---

# Bulk Data Export ($export)

The FHIR Bulk Data Export operation enables asynchronous export of large datasets, supporting population-level data access required by regulations like the ONC Cures Act.

## Overview

Bulk export follows an asynchronous pattern:

## Kick-off Request

### System-level Export (All Resources)

```bash
POST /fhir/r4/$export
Accept: application/fhir+json
Prefer: respond-async
```

### Patient-level Export

```bash
POST /fhir/r4/Patient/$export
Accept: application/fhir+json
Prefer: respond-async
```

### Group-level Export

```bash
POST /fhir/r4/Group/1/$export
Accept: application/fhir+json
Prefer: respond-async
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `_outputFormat` | string | Output format (default: `application/fhir+ndjson`) |
| `_since` | instant | Only resources modified after this time |
| `_type` | string | Comma-separated resource types to export |
| `_typeFilter` | string | FHIR search queries to filter resources |
| `_elements` | string | Specific elements to include |

### Example with Filters

```bash
POST /fhir/r4/Patient/$export?_type=Patient,Observation,Condition&_since=2024-01-01T00:00:00Z&_typeFilter=Observation%3Fcategory%3Dlaboratory
```

## Response Flow

### Kick-off Response (202 Accepted)

```http
HTTP/1.1 202 Accepted
Content-Location: https://fhir.example.com/fhir/r4/$export-poll/job-123
```

### Status Polling (In Progress)

```http
HTTP/1.1 202 Accepted
X-Progress: Exporting resources (45% complete)
Retry-After: 30
```

### Completion Response

```json
{
  "transactionTime": "2024-01-15T10:30:00Z",
  "request": "https://fhir.example.com/fhir/r4/$export?_type=Patient,Observation",
  "requiresAccessToken": true,
  "output": [
    {
      "type": "Patient",
      "url": "https://fhir.example.com/export/job-123/Patient-1.ndjson",
      "count": 15000
    },
    {
      "type": "Observation",
      "url": "https://fhir.example.com/export/job-123/Observation-1.ndjson",
      "count": 250000
    }
  ],
  "error": []
}
```

## NDJSON Output Format

Each line in the output file is a complete FHIR resource:

```
{"resourceType":"Patient","id":"1","name":[{"family":"Smith"}]}
{"resourceType":"Patient","id":"2","name":[{"family":"Jones"}]}
{"resourceType":"Patient","id":"3","name":[{"family":"Williams"}]}
```

## Configuration

```toml
[bulkExport]
enabled = true
maxConcurrentJobs = 5
outputDirectory = "./export-output"
fileMaxSize = 100000000  # 100MB per file
retentionHours = 72

[bulkExport.storage]
type = "filesystem"  # or "s3", "azure-blob"
```

## Security

Bulk export must be secured with:

- OAuth 2.0 Bearer tokens (SMART Backend Services)
- System-level scopes (`system/*.read`)
- Export files require the same access token for download

```bash
POST /fhir/r4/$export
Authorization: Bearer <system-access-token>
Accept: application/fhir+json
Prefer: respond-async
```

## Cancellation

Delete an in-progress export:

```bash
DELETE /fhir/r4/$export-poll/job-123
```

## Related Topics

- [Patient $everything](./patient-everything.md)
- [FHIR Operations Overview](./overview.md)
- [Compliance & Standards](../../compliance/overview.md)
