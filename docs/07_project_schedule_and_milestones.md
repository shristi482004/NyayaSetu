# Project Schedule and Milestones — NyayaSetu

## 1. Project Timeline Overview
The **NyayaSetu** project is executed in two primary phases spanning a total of 23 calendar weeks. Phase 1 delivers the complete backend, database, and AI service architecture. Phase 2 develops the responsive web frontend and dashboard interfaces.

## 2. Schedule Breakdown by Week

| Week Range | Phase | Workstream | Key Deliverables | Status |
|---|---|---|---|---|
| Weeks 1 - 2 | Phase 1 | Requirements & Architecture | SRS, SPMP, Architecture, OpenAPI, AI Schemas | Complete |
| Weeks 3 - 4 | Phase 1 | Core Backend & Database | Express framework, Mongoose models, JWT Auth, RBAC | Scheduled |
| Weeks 5 - 6 | Phase 1 | AI Service & PDF Extraction | FastAPI app, PyMuPDF engine, OCR fallback | Scheduled |
| Weeks 7 - 8 | Phase 1 | Gemini Integration & Prompts | Summarizer, FAQ, Flowchart, Timeline, Action items | Scheduled |
| Weeks 9 - 10 | Phase 1 | Document Chat & Citations | Context retrieval, citation extraction, chat history | Scheduled |
| Weeks 11 - 12 | Phase 1 | Admin Controls & Auditing | Admin endpoints, user governance, audit logging | Scheduled |
| Weeks 13 - 14 | Phase 1 | Testing, Hardening & CI/CD | Jest/Pytest suites, Dockerization, Phase 1 sign-off | Scheduled |
| Weeks 15 - 16 | Phase 2 | UI/UX Wireframes & Design | Tailwind layout, component architecture, mockups | Deferred |
| Weeks 17 - 20 | Phase 2 | React Client Development | Dashboards, file upload UI, chat UI, React Flow | Deferred |
| Weeks 21 - 22 | Phase 2 | Integration & System QA | End-to-end integration, performance tuning | Deferred |
| Week 23 | Phase 2 | Final Deployment & Handoff | Production cloud release, user manuals | Deferred |

## 3. Milestones and Acceptance Gates

### Milestone M1: Phase 1 Baseline Delivery (v1.0)
- **Target Date:** End of Week 14
- **Acceptance Criteria:**
  1. Fully functional Node.js Express API and Python FastAPI AI microservice.
  2. PDF upload, extraction, and OCR fallback validated against real and scanned test PDFs.
  3. Google Gemini integrated with structured output schemas for summaries, FAQs, flowcharts, timelines, and action items.
  4. Document-grounded chat system returning grounded answers with page citations and uncertainty flags.
  5. Role-based access control protecting citizen, lawyer, and admin endpoints.
  6. Automated test suite achieving >= 80% coverage with all tests passing.
  7. OpenAPI documentation fully aligned with implemented endpoints.

### Milestone M2: Phase 2 Baseline Delivery (v2.0)
- **Target Date:** End of Week 22
- **Acceptance Criteria:**
  1. Responsive React.js frontend integrated with all Phase 1 backend APIs.
  2. Citizen and lawyer dashboards with document visualization and chat.
  3. Interactive procedural flowchart rendering using React Flow.
  4. End-to-end integration tests passing under production-like conditions.

### Milestone M3: Production Cloud Release & Project Closeout
- **Target Date:** End of Week 23
- **Acceptance Criteria:**
  1. Deployed services on cloud infrastructure (Render / GCP).
  2. Complete user manual, developer documentation, and maintenance handbook delivered.

## 4. Critical Path Analysis
The critical path for Phase 1 runs as follows:
`A1 (Architecture) -> A2.1 (Auth & DB) -> A2.2 (PDF & OCR) -> A2.3 (Gemini & Prompts) -> A2.4 (Chat & Admin) -> A3 (Testing & Docker)`

Any delay in API contract finalization or text extraction directly impacts downstream Gemini prompt tuning and conversational chat integration.

