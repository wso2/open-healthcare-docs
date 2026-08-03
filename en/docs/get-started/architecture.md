---
sidebar_position: 1
title: "Accelerators"
description: WSO2 Open Healthcare accelerators, architecture, and AI-enabled interoperability capabilities.
---

# Accelerators

WSO2 Open Healthcare is a unified, AI-driven platform that combines API Management, Integration, Identity and Access Management, Developer Platform, and Agent Management. It is delivered with healthcare-native accelerators for FHIR, HL7, X12, CCDA, SMART-on-FHIR, CDS Hooks, IHE profiles, and regulation use cases, and is designed for the agentic healthcare enterprise.

The platform connects Patients, Practitioners, and Management through consumer apps such as contact centers, appointment booking platforms, patient portals, and population health analytics dashboards. It is built on Identity and Access Management, Integration, and API Management, with focused AI and digitalization tools that accelerate implementation with reliability.

![WSO2 Open Healthcare Accelerators and Architecture](/assets/img/get-started/healthcare-accelerators-architecture.png)

## Healthcare Accelerators and Standards

WSO2 Open Healthcare provides out-of-the-box accelerators to speed up health IT development across major healthcare standards:

- **HL7 v2.x** — Full parsing, validation, and transformation, with HL7 types as first-class language primitives in Ballerina.
- **HL7 v3 / CCDA** — Pre-built, highly customizable CCDA-to-FHIR transformers.
- **FHIR R4 and R4B** — FHIR server, terminology, audit, and bulk data support, plus FHIR Package Generator and FHIR API Template Generator for implementation-guide–specific packages and compliant APIs.
- **FHIR Implementation Guides** — Auto-generate APIs from IGs such as US Core, CARIN, Da Vinci, IPA, and QI-Core.
- **X12 EDI (270/271/278/837/835)** — Native X12 libraries for message parsing and serializing, with pre-built X12-to-FHIR mapping.
- **SMART-on-FHIR** — Native support for standalone and EHR launch flows via WSO2 Identity Server.
- **CDS Hooks** — Built-in CDS Service accelerator and CDS Template Generator.
- **IHE Profiles (PDQm, ATNA, and more)** — Provided as pre-built integrations.
- **DICOM** — Native DICOM libraries for message parsing and serializing, with DIMSE transport support.

## Source System Connectors and Integration

WSO2 Open Healthcare connects to source systems that follow standard protocols and bridges to systems of record, including EMR/EHR platforms (such as Epic, Cerner, and Athena), X12 clearinghouses, FHIR servers, Laboratory Information Systems (LIS), Radiology Information Systems (RIS), billing systems, and cloud applications.

The platform includes WSO2 Integrator with 300+ connectors, low-code developer accelerators, and a customizable integration layer. Developers can handle custom message structures (JSON, XML, CSV, and text) and implement custom data mappings using visual tools or AI-assisted auto-mapping.

Developer accelerators include:

- **Ballerina** — Open-source, cloud-native language with FHIR, HL7, X12, and CDS as first-class types.
- **Integrator Development Tool** — VS Code–based low-code visual flow designer with full parity between low-code and pro-code, plus desktop and browser-based IDE support.
- **AI Data Mapper** — Automatically generates field mappings between message structures.
- **Healthcare Copilot** — Developer assistant for healthcare-specific integration flows.
- Browser-based developer experience with VS Code and GitHub-native workflows.

## FHIR APIs and Data Repositories

FHIR provides a RESTful interface for modern healthcare interoperability, and WSO2 Open Healthcare places it at the center of the architecture. The platform includes a PostgreSQL-backed FHIR repository as a consistent source of truth.

To expose and govern this data, the platform offers dedicated FHIR APIs for base resources, audit, and terminology, alongside business APIs and IHE profiles. Supporting services include:

- **Master Patient Index (MPI)** — FHIR-based patient matching through a pre-built MPI service.
- **Terminology services** — Built-in FHIR Terminology Service supporting CodeSystem, ValueSet, and ConceptMap.
- **Consent Management** — Native consent management based on FHIR Consent, with an enforcement layer.

## Security, Privacy, and Agent Identity

WSO2 Open Healthcare supports SMART-on-FHIR and mTLS to meet healthcare security and privacy requirements. The solution natively supports OpenID Connect, OAuth 2.0, SAML, and SCIM, with passwordless, MFA, and adaptive authentication.

These standards extend to AI-enabled workflows through MCP Auth and Agent Identity Management, enabling precise and consistent authorization rules for AI models. Every transaction—whether initiated by a patient-facing app or an automated AI agent—is governed by fine-grained access control and robust identity management.

## AI, MCP, and Pre-Built Use Cases

WSO2 Open Healthcare is designed as a foundation for the agentic enterprise. Key AI capabilities include:

- **Agent Management Platform** — Build, run, manage, govern, and secure agents.
- **Agent Identity Management** — Verifiable identity and scoped permissions for every agent.
- **MCP Auth** — Precise access controls and consistent authorization for Model Context Protocol workloads.
- **FHIR MCP** — Expose any FHIR API over MCP for LLM consumption.
- **REST API MCP** — Expose any OpenAPI-described API over MCP.
- **Pre-built healthcare agents** — Appointment Scheduling, Patient Support, and Population Health.
- **Healthcare Copilot** — Accelerates development of healthcare integration flows.

Pre-built use cases reduce implementation from months of custom build to weeks of configuration:

- **Patient/Member 360 and Single Login** — Identity-led, AI-driven single customer profile that provides context to providers and payers.
- **Revenue Optimization through Prior Authorization Automation** — Conversational AI agents, Prior Authorization API, CDS Service, Patient Support agent, and Healthcare Copilot to automate manual prior-authorization tasks.
- **AI-driven Healthcare Interoperability** — Compliance-ready integration with EMRs, EHRs, LLMs, and HIEs via a FHIR-based API platform, adhering to HIPAA, CMS-0057, and G10 guidelines.
- **IT Cost Optimization through Vendor and Platform Consolidation** — Single-pane-of-glass consolidation of API gateways, IAM systems, and integration platforms for M&A and AI readiness.
