# Non-Functional Requirements Document (NFRD) — NyayaSetu

## 1. Introduction
This document defines the quality attributes, constraints, performance metrics, and security controls governing the **NyayaSetu** platform.

## 2. Performance Requirements (`NFR-PERF`)
- **NFR-PERF-001 (API Response Times):** Standard metadata and administrative API endpoints shall respond within 200ms under standard concurrency (50 requests/sec).
- **NFR-PERF-002 (Text Extraction Latency):** PyMuPDF extraction for digital PDF files up to 20 pages shall complete within 5.0 seconds. Scanned files triggering OCR fallback shall complete within 20 seconds.
- **NFR-PERF-003 (Gemini AI Processing Latency):** AI summary, FAQ, and flowchart operations shall complete within 5 to 10 seconds under typical Google Cloud Generative AI latency conditions.
- **NFR-PERF-004 (Database Query Optimization):** MongoDB queries must utilize targeted B-tree indexes (`userId`, `docId`, `createdAt`) ensuring execution times remain under 50ms.

## 3. Scalability Requirements (`NFR-SCALE`)
- **NFR-SCALE-001 (Stateless Architecture):** The Node.js Express server and Python FastAPI service shall maintain zero local session state to facilitate horizontal scaling behind cloud load balancers.
- **NFR-SCALE-002 (Concurrent Users):** The Phase 1 architecture shall support a minimum baseline of 500 active concurrent users with horizontal pod auto-scaling.
- **NFR-SCALE-003 (Database Scalability):** Document chunks and chat messages shall be decoupled from document metadata to prevent unbounded MongoDB document growth beyond the 16MB BSON limit.

## 4. Reliability and Availability (`NFR-REL`)
- **NFR-REL-001 (Service Availability):** The platform targets 99.9% uptime during operational service windows.
- **NFR-REL-002 (Graceful Degradation):** If the Google Gemini API experiences rate limits or intermittent outages, the system shall return HTTP 503 with a structured retry-after interval without crashing the service.
- **NFR-REL-003 (Fault Isolation):** A failure in PDF text extraction or OCR shall fail the specific document task gracefully without impacting concurrent user operations.

## 5. Security and Privacy Requirements (`NFR-SEC`)
- **NFR-SEC-001 (Transport Encryption):** All external and inter-service HTTP communications must enforce TLS 1.3 / HTTPS.
- **NFR-SEC-002 (Cryptographic Storage):** User passwords must be hashed using `bcrypt` with a minimum salt rounds factor of 10.
- **NFR-SEC-003 (Access Control & Tenant Isolation):** All document endpoints must verify that the requesting authenticated user owns the document record. Unauthorized cross-tenant queries must return HTTP 403.
- **NFR-SEC-004 (Prompt Injection Defense):** Uploaded text must be stripped of prompt escaping patterns, delimited by explicit structural fences, and accompanied by strict system instructions forbidding instruction override.
- **NFR-SEC-005 (File Upload Security):** The system shall enforce a 25MB maximum upload limit, verify MIME types, inspect magic numbers, and reject executable or malformed attachments.
- **NFR-SEC-006 (Zero Hardcoded Credentials):** Secrets, API keys, database connection strings, and JWT signing keys must be loaded exclusively via environment variables.

## 6. Maintainability and Usability Requirements
- **NFR-MAINT-001 (Code Modularity):** Code must be structured into independent route, controller, service, repository, and validation layers.
- **NFR-MAINT-002 (Linting and Formatting):** Node.js code must adhere to ESLint/Prettier standards; Python code must adhere to PEP8/Ruff standards.
- **NFR-MAINT-003 (Documentation):** All endpoints must be documented via OpenAPI/Swagger.
- **NFR-USAB-001 (No Emojis in UI):** Consistent with user rules, all UI components, CLI responses, and user-facing notifications must avoid emojis, utilizing clear alphanumeric labeling.

## 7. Legal Compliance and Ethical AI (`NFR-COMP`)
- **NFR-COMP-001 (Informational AI Disclaimer):** Every analysis result and chat reply must prominently state: "NyayaSetu provides informational document assistance only and does not constitute formal legal counsel or professional advice."
- **NFR-COMP-002 (Hallucination Prevention):** If factual evidence is absent from the provided source text, the AI model must emit explicit placeholders (`[UNKNOWN]`, `[CITE]`) or state lack of evidence.

