# NyayaSetu — Project Charter

## 1. Project Title and Identification
- Project Name: NyayaSetu (Legal Document Intelligence Platform)
- Project Code: NYAYA-SETU-2026
- Initiative: AI-Powered Legal Understanding and Accessibility Platform
- Document Version: 1.0.0
- Date: 2026-11-08

## 2. Executive Summary and Problem Statement
Citizens and legal practitioners face significant barriers in interpreting, dissecting, and acting upon legal notices, court orders, petitions, and contractual documents. Complex legalese, procedural ambiguity, strict statutory deadlines, and dense clause structures cause delays and misunderstanding.

NyayaSetu bridges this gap by providing an enterprise-grade legal document intelligence engine that transforms unstructured legal PDFs into plain-language summaries, structured timelines, procedural flowcharts, frequently asked questions, and grounded chat responses.

## 3. Project Objectives
1. Provide automated, high-precision document text extraction from standard digital PDFs and scanned documents via OCR fallback.
2. Deliver grounded, hallucination-resistant summaries, action item extractions, procedural flowcharts, and legal terminology simplification using Google Gemini.
3. Enable document-grounded question answering with precise page references and clear indicators for facts not present in the record.
4. Enforce strict privacy, role-based authorization, and tenant isolation so that confidential legal records are never exposed across users or publicly.
5. Provide a decoupled, modular two-tier architecture (Node.js/Express API gateway and Python/FastAPI AI engine) built for independent scaling and automated testing.

## 4. Scope Definition
### In Scope (Phase 1 — Backend and AI System)
- User authentication, registration, password hashing (bcrypt), and JWT token management.
- Role-based authorization supporting Citizens, Lawyers, and Administrators.
- Secure PDF upload, validation (MIME, magic numbers, file size), metadata storage, and cleanup.
- PyMuPDF text extraction pipeline with Tesseract OCR fallback for scanned pages.
- Gemini API integration with strict prompt schemas, temperature control (0.2), and hallucination mitigation (`[UNKNOWN]`, `[CITE]` placeholders).
- AI analysis features: Plain-language summaries, legal FAQs, procedural flowchart data, timeline event extraction, action items, and argument maps.
- Document-grounded chat system with context retrieval, page citations, and conversation history.
- MongoDB data layer with collections for Users, Documents, AnalysisResults, ChatSessions, ChatMessages, and SystemLogs.
- Admin management endpoints for user lifecycle and audit log monitoring.
- Unit and integration test suites (Jest/Supertest for Node.js, Pytest for FastAPI) targeting >= 80% coverage.
- OpenAPI/Swagger specification and full developer documentation.

### Deferred to Phase 2 (Frontend System)
- React.js single-page application with Tailwind CSS and React Flow interactive flowcharts.
- Citizen, Lawyer, and Admin dashboards and client-side chat interface.

### Out of Scope
- Direct legal representation or automated legal counsel.
- Direct court registry filing automation or automated digital signatures.

## 5. Stakeholders and Project Roles
| Role | Responsibility |
|---|---|
| Project Manager | Overall project schedule, milestone tracking, and stakeholder communication |
| Senior Software Architect | Architecture oversight, microservice contracts, and technical compliance |
| Backend Developer | Node.js/Express API implementation, authentication, and MongoDB ODM |
| AI/ML Engineer | Python/FastAPI service, PDF/OCR pipeline, Gemini prompt engineering, schema validation |
| Database Engineer | MongoDB data modeling, indexing, query optimization, and data security |
| Security Engineer | Authentication hardening, RBAC, input sanitization, audit logging, and prompt injection defense |
| QA Engineer | Jest and Pytest suites, integration test coverage, regression testing, and AI evaluation |
| Sponsor / Educator | Project evaluation, academic oversight, and acceptance sign-off |

## 6. Success Criteria and Key Performance Indicators
- Accuracy: >= 90% grounded factual accuracy in document Q&A test cases with zero hallucinated statutory citations.
- Performance: AI query responses within 5 seconds under normal operational load; PDF text extraction completed within 10 seconds.
- Test Coverage: >= 80% automated test coverage across backend and AI service business logic.
- Reliability: 99.9% uptime target with graceful error handling and API fallback mechanisms.
- Compliance: 100% adherence to legal disclaimers stating that all AI outputs are informational assistance only.

## 7. Sign-off and Authorization
- Approved By: Lead Architect and Project Stakeholder
- Status: Baseline Approved for Phase 1 Implementation

