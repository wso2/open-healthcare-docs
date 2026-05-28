---
sidebar_position: 1
title: "Accelerators"
description: WSO2 Open Healthcare accelerators, architecture, and AI-enabled interoperability capabilities.
---

# Accelerators

WSO2 Open Healthcare caters to the main segments in the healthcare industry, seamlessly connecting Patients, Practitioners, and Management through diverse Consumer Apps such as Contact Centers, Appointment Booking platforms, Patient Portals, and Population Health Analytics dashboards.

WSO2 Open Healthcare is built on a foundational core of Identity and Access Management, Integration, and API Management products. We design from the health IT developer's perspective and introduce focused AI and digitalization development tools to accelerate implementation with reliability.

![WSO2 Open Healthcare Accelerators and Architecture](/assets/img/get-started/healthcare-accelerators-architecture.png)

## Healthcare Accelerators and AI Capabilities

WSO2 Open Healthcare provides multiple accelerators to speed up health IT development. Out-of-the-box healthcare accelerators include specialized transformers for seamless conversion from HL7v2, CCDA, and X12 to FHIR, and comprehensive messaging support for FHIR, HL7, X12, and CCDA.

The platform also introduces Model Context Protocol (MCP) capabilities, including FHIR MCP and REST API MCP, to securely bridge enterprise data with AI agents for appointment scheduling, patient support, and population health use cases.

## Source System Connectors and Integration

WSO2 Open Healthcare connects to any source system that follows standard protocols. It bridges to backend systems of record, including EMR/EHR platforms (such as Epic, Cerner, and Athena), Laboratory Information Systems (LIS), Radiology Information Systems (RIS), and billing systems.

The platform provides low-code developer accelerators, out-of-the-box connectors, and a customizable integration layer. Developers can handle custom message structures (JSON, XML, CSV, and text) and implement custom data mappings using visual tools or AI-assisted auto-mapping.

## FHIR APIs and Data Repositories

FHIR provides a RESTful interface for modern healthcare interoperability, and WSO2 Open Healthcare places it at the center of the architecture. The platform includes a robust PostgreSQL-backed FHIR repository as a consistent source of truth.

To expose and govern this data, the platform offers dedicated FHIR APIs for base resources, audit, and terminology, alongside business APIs and IHE profiles. Built-in Master Patient Indexing and Consent Management capabilities help keep data accurate, unified, and compliant across the ecosystem.

## Security, Privacy, and Agent Identity

WSO2 Open Healthcare supports SMART on FHIR and MTLS to meet healthcare security and privacy requirements. The solution natively supports OpenID Connect and OAuth 2.0 based security controls.

These standards are extended to AI-enabled workflows through MCP Auth and Agent Identity Management, enabling precise and consistent authorization rules for AI models. Every transaction, whether initiated by a patient-facing app or an automated AI agent, is governed by fine-grained access control and robust identity management.
