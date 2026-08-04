---
title: "Architecture"
---

# Architecture

WSO2 Open Healthcare provides a unified interoperability architecture for healthcare organizations to securely exchange, transform, and govern clinical and administrative data across systems. It is built with [Ballerina](https://ballerina.io/) and designed to support providers, payers, health information exchanges, and digital health platforms.

![Unified Interoperability Architecture](/assets/img/architecture/unified-interoperability-architecture.png)

## Overview

The Unified Interoperability Architecture is a comprehensive, scalable model for secure bi-directional data exchange across the healthcare ecosystem. In an Open Healthcare deployment, it operates as the central orchestration engine between front-end consumers and complex systems of record, while enforcing interoperability standards, compliance requirements, and AI governance.

## Architectural Tiers

The architecture is organized into three tiers: Consumers, the Core Healthcare Platform, and Systems of Record.

### 1. Consumers (Front-End Interfaces)

This tier includes the users and applications that interact with healthcare services:

- **Members/Patients**: Access health data, enrollment details, and care-related information through portals and apps.
- **Providers**: Submit authorizations, process clinical interactions, and access patient and operational records.
- **Payers**: Coordinate claims, network operations, and interoperability workflows with providers and partner systems.

### 2. Core Healthcare Platform (WSO2 Open Healthcare)

This central layer delivers security, data normalization, workflow automation, and API-first interoperability. In WSO2 Open Healthcare, these capabilities are achieved through WSO2 API platform, WSO2 Identity platform and WSO2 Integration platform along with pre-built healthcare accelerators, APIs, connectors, and templates.

#### Security and Identity Management

- **Identity and Access Management**: Enforces access controls with SSO and MFA.
- **Authorization**: Enables secure delegated access using SMART on FHIR, OAuth2, and OpenID Connect.
- **Consent Management**: Enforces patient consent and data-sharing preferences across workflows.

#### Data Management

- **Master Patient Index (MPI)**: Resolves patient identity across multiple upstream and downstream systems.
- **Provider Directory**: Maintains a trusted, current provider registry for routing and validation.
- **FHIR Repository**: Stores and serves normalized healthcare data in standard FHIR representations.

#### Workflows (Business Logic)

- Supports and automates core healthcare operations, including:
  - Prior authorization and utilization management (including electronic and conversational prior authorization patterns)
  - Claims processing workflows
  - Member and patient enrollment workflows

#### Observability and Analytics

- **Logging and Audit Trails**: Provides end-to-end traceability required for operational reliability and regulations such as HIPAA.
- **Reporting and Metrics**: Supports public reporting requirements and internal business analytics for service and cost optimization.

#### API Management and Integration

- **API Gateway and Developer Portal**: Exposes governed APIs to internal teams and external partners.
- **Integration Engine and Pre-built Integrations**: Connects to EHR/EMR, payer, lab, and enterprise systems.
- **Healthcare Protocol Support**: Supports and translates across FHIR, HL7, CDA, DICOM, and X12.

#### AI and Agent Management

- **MCP Support and Prompt Management**: Enables structured, context-aware AI integrations.
- **Agent Identity and Rate Limiting**: Enforces trust boundaries and usage controls.
- **Observability, Governance, and Guardrails**: Reduces hallucination risk, enforces policy boundaries, and helps ensure compliance-safe AI automation.

### 3. Systems of Record (Back-End Data Sources)

This tier contains the source systems that hold operational and clinical truth. Open Healthcare integrates bi-directionally with:

- Claim management systems
- CRM, ERP, and billing platforms
- Health information networks (HINs)
- SaaS backends
- Custom and legacy data sources (including on-premise repositories and proprietary EHRs)

## Data Flow and System Value

The architecture enables a controlled, bi-directional data lifecycle:

1. The Core Healthcare Platform ingests data from systems of record and normalizes it through standards-aligned models and integration pipelines.
2. Governed APIs deliver that data securely to consumer applications and partner ecosystems.
3. Incoming requests from consumers are validated, authorized, audited, and routed back into source systems with full traceability.

By abstracting legacy complexity and applying strong security, compliance controls, and AI guardrails, Open Healthcare helps organizations become interoperable, audit-ready, and prepared for next-generation intelligent workflows.

## Related Topics

- [Getting Started](../get-started/introduction.md)
