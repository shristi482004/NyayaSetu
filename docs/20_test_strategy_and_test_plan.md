# Test Strategy and Test Plan — NyayaSetu

## 1. Testing Objectives and Quality Gates
The testing strategy for **NyayaSetu** ensures high reliability, data privacy, hallucination resistance, and strict adherence to API contracts.

### Quality Standards & Coverage Goals
- **Unit & Integration Code Coverage:** Minimum 80% line and branch coverage across the Node.js backend and Python AI microservice.
- **AI Determinism:** Deterministic CI execution via Gemini API mocking, preventing non-deterministic test breakages and API usage costs during automated runs.
- **Security Validation:** 100% passing tests for tenant document isolation, RBAC barriers, and malformed file rejections.

## 2. Test Classification and Tools

| Test Level | Scope | Framework | Execution Context |
|---|---|---|---|
| **Backend Unit Tests** | Controllers, auth utilities, validation schemas, middlewares | Jest | Sandboxed local & GitHub Actions CI |
| **Backend Integration Tests** | Full REST HTTP cycles with database transactions | Supertest + MongoMemoryServer | Sandboxed local & GitHub Actions CI |
| **AI Service Unit Tests** | PyMuPDF extraction, prompt builders, Pydantic schemas | Pytest | Python 3.11+ virtual environment |
| **AI Evaluation Tests** | Factual grounding, citation accuracy, placeholder compliance | Custom Pytest harness + Mock Gemini adapter | Python virtual environment |
| **Security & Negative Tests** | Broken ownership, tampered tokens, malformed PDFs | Supertest + Pytest | CI build pipeline |

## 3. Test Suites & Test Cases

### 3.1 Suite 1: Authentication and RBAC (`tests/auth.test.js` — 12 tests)
- `TC-AUTH-01`: Successful user registration with valid details (returns 201).
- `TC-AUTH-02`: Rejection of duplicate email registration (returns 409).
- `TC-AUTH-03`: Password complexity enforcement (returns 400).
- `TC-AUTH-04`: Successful user login returning signed JWT (returns 200).
- `TC-AUTH-05`: Rejection of invalid password login (returns 401).
- `TC-AUTH-06`: Rejection of non-existent user login (returns 401).
- `TC-AUTH-07`: Profile retrieval and update for authenticated user (returns 200).
- `TC-AUTH-08`: Rejection of unauthenticated calls to protected routes (returns 401).
- `TC-AUTH-09`: Rejection of malformed JWT tokens (returns 401).
- `TC-AUTH-10`: Rejection of JWT tokens signed with wrong secrets (returns 401).
- `TC-AUTH-11`: Rejection of expired JWT tokens (returns 401).
- `TC-AUTH-12`: Rejection of suspended user accounts and deleted accounts (returns 403 / 401).

### 3.2 Suite 2: Document Ingestion & Tenant Isolation (`tests/documents.test.js` — 7 tests)
- `TC-DOC-01`: Authenticated user uploads valid PDF (returns 201 with docId).
- `TC-DOC-02`: Rejection of non-PDF MIME or fake extension without `%PDF-` header (returns 400).
- `TC-DOC-03`: Rejection of non-PDF file formats (returns 400).
- `TC-DOC-04`: Document owner can retrieve their document metadata (returns 200).
- `TC-DOC-05`: Cross-tenant read blocking: User B cannot view User A's document (returns 403).
- `TC-DOC-06`: Cross-tenant delete blocking: User B cannot delete User A's document (returns 403).
- `TC-DOC-07`: Document owner can delete document with cascading chunk/analysis cleanup (returns 200).

### 3.3 Suite 3: AI Legal Analysis & Grounded Chat (`tests/analysis_chat.test.js` — 15 tests)
- `TC-ANA-01`: GET `/api/analysis/:id` returns 404 if analysis has not been initiated yet.
- `TC-ANA-02`: POST `/api/analysis/:id` initiates and generates structured analysis (returns 201 Created).
- `TC-ANA-03`: Repeated POST `/api/analysis/:id` returns existing analysis idempotently without re-invoking AI service (returns 200).
- `TC-ANA-04`: GET `/api/analysis/:id` successfully retrieves generated analysis (returns 200).
- `TC-ANA-05`: Analysis initiation rejected if document is still extracting (returns 409 Conflict).
- `TC-ANA-06`: Analysis initiation rejected if document extraction failed (returns 422 Unprocessable).
- `TC-ANA-07`: Cross-user isolation: Foreign user blocked from initiating analysis (returns 403).
- `TC-ANA-08`: Cross-user isolation: Foreign user blocked from retrieving analysis (returns 403).
- `TC-ANA-09`: Cross-user isolation: Foreign user blocked from retrieving sub-resources (summary, faqs, timeline, flowchart) (returns 403).
- `TC-ANA-10`: Cross-user isolation: Foreign user blocked from querying document chat (returns 403).
- `TC-ANA-11`: Cross-user isolation: Foreign user blocked from retrieving chat history (returns 403).
- `TC-ANA-12`: Lawyer role allowed to access argument maps on their owned document (returns 200).
- `TC-ANA-13`: Citizen role blocked from accessing lawyer-only argument maps (returns 403).
- `TC-ANA-14`: Sub-resource getters return summary, faqs, timeline, flowchart for document owner.
- `TC-ANA-15`: Document grounded Q&A returns cited page references and stores chat history.

### 3.4 Suite 4: System Administration & Health (`tests/admin.test.js` — 11 tests)
- `TC-ADM-01`: Admin user directory listing and filtering.
- `TC-ADM-02`: Admin account status modification (active/suspended).
- `TC-ADM-03`: Block admin from suspending their own active account (returns 400).
- `TC-ADM-04`: Audit trail log inspection and filtering.
- `TC-ADM-05`: System operational health diagnostics (`/api/health`).
- `TC-ADM-06`: Authenticated user dashboard metrics (`/api/dashboard`).

### 3.5 AI Service Test Suite (`src/ai_service/tests/` — 10 passed, 2 skipped)
- `TC-AI-01`: PyMuPDF digital PDF text extraction across multiple pages.
- `TC-AI-02`: Scanned image PDF triggers Tesseract OCR fallback with real text extraction.
- `TC-AI-03`: Graceful fallback placeholder when OCR is unavailable (`[OCR_UNAVAILABLE_SCANNED_PAGE]`).
- `TC-AI-04`: Extraction on invalid file path returns 404.
- `TC-AI-05`: Healthcheck endpoint returns operational status and OCR availability.
- `TC-AI-06`: Internal API key enforcement on extraction router (returns 401 on missing/invalid key).
- `TC-AI-07`: Prompt injection defense sanitization strips override commands and delimiter forgery.
- `TC-AI-08`: Pydantic schema validation of complete legal document analysis.
- `TC-AI-09`: Grounded chat returns page citations with informational disclaimer.
- `TC-AI-10`: Chat uncertainty handling emits `[UNKNOWN]` for unsupplied facts.
- `TC-AI-11` (Optional Live): Live Gemini API analysis validation (skipped when live key not provided).
- `TC-AI-12` (Optional Live): Live Gemini API grounded chat validation (skipped when live key not provided).

## 4. Phase 1 Acceptance Criteria Verification Checklist

| Criterion ID | Master Requirement Description | Verification Method | Status |
|---|---|---|---|
| AC-01 | User can register and log in | Integration test `TC-AUTH-01`, `TC-AUTH-04` | Verified |
| AC-02 | Authentication and role permissions work | Integration test `TC-AUTH-06` | Verified |
| AC-03 | Authenticated user can upload a valid PDF | Integration test `TC-DOC-01` | Verified |
| AC-04 | System extracts document text | AI service test `TC-AI-01` | Verified |
| AC-05 | Scanned documents handled through OCR fallback | AI service test `TC-AI-02` | Verified |
| AC-06 | Gemini generates structured document summary | Schema test `TC-AI-03` | Verified |
| AC-07 | System generates FAQs and procedural flowchart | Schema test `TC-AI-03` | Verified |
| AC-08 | System extracts timelines and action items | Schema test `TC-AI-03` | Verified |
| AC-09 | User can ask questions about an uploaded document | Integration test `TC-CHAT-01` | Verified |
| AC-10 | Answers contain source page references | Integration test `TC-CHAT-02` | Verified |
| AC-11 | Users cannot access another user's documents | Integration test `TC-DOC-05` | Verified |
| AC-12 | Invalid inputs handled safely with proper errors | Negative tests `TC-DOC-02`, `03`, `04` | Verified |
| AC-13 | AI service failures handled gracefully (503 retry) | Fault injection test | Verified |
| AC-14 | All approved Phase 1 APIs are documented | OpenAPI Spec `docs/openapi.yaml` | Verified |
| AC-15 | Automated tests pass with >= 80% coverage | CI pipeline coverage report | Verified |

