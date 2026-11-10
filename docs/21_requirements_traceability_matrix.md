# Requirements Traceability Matrix (RTM) — NyayaSetu

## 1. Overview
The Requirements Traceability Matrix connects every functional requirement (from `docs/03_srs.md` and `docs/04_functional_requirements.md`) through architectural design, API endpoints, frontend components, test cases, and implementation status across both Phase 1 and Phase 2.

## 2. Traceability Matrix Table

| Req ID | Requirement Description | Design Component | API Endpoint / Module | Frontend View Component | Test Case ID | Status |
|---|---|---|---|---|---|---|
| **FR-AUTH-001** | User registration (Citizen/Lawyer) | Auth Controller & Service | `POST /api/register` | `src/frontend/src/pages/RegisterPage.jsx` | `TC-AUTH-01`, `02`, `03` | Implemented & Verified |
| **FR-AUTH-002** | Password hashing via bcrypt | Password Utility | `backend/src/models/User.js` | `src/frontend/src/pages/RegisterPage.jsx` | `TC-AUTH-03` | Implemented & Verified |
| **FR-AUTH-003** | User login and signed JWT generation | Auth Controller & Service | `POST /api/login` | `src/frontend/src/pages/LoginPage.jsx` | `TC-AUTH-04`, `05`, `06` | Implemented & Verified |
| **FR-AUTH-004** | Role-based access control (RBAC) | Auth & Role Middleware | `backend/src/middleware/rbac.js` | `components/common/ProtectedRoute.jsx` | `TC-AUTH-08`, `12` | Implemented & Verified |
| **FR-AUTH-005** | User profile retrieval & update | User Controller | `GET /api/users/me`, `PUT /api/users/profile` | `context/AuthContext.jsx` | `TC-AUTH-07` | Implemented & Verified |
| **FR-DOC-001** | Secure PDF file upload (max 25MB) | Document Controller & Multer | `POST /api/documents` | `components/dashboard/FileUploadZone.jsx` | `TC-DOC-01`, `TC-DOC-04` | Implemented & Verified |
| **FR-DOC-002** | File format validation (MIME, magic bytes) | Ingestion Validator | `backend/src/middleware/upload.js` | `components/dashboard/FileUploadZone.jsx` | `TC-DOC-02`, `TC-DOC-03` | Implemented & Verified |
| **FR-DOC-003** | Document metadata persistence in MongoDB | Document Repository | `backend/src/models/Document.js` | `components/dashboard/DocumentList.jsx` | `TC-DOC-01` | Implemented & Verified |
| **FR-DOC-004** | PyMuPDF text & page extraction | AI Extraction Engine | `ai_service/services/extractor.py` | `components/dashboard/DocumentList.jsx` | `TC-AI-01` | Implemented & Verified |
| **FR-DOC-005** | Tesseract OCR fallback for scanned PDFs | OCR Fallback Service | `ai_service/services/ocr.py` | `components/dashboard/DocumentList.jsx` | `TC-AI-02` | Implemented & Verified |
| **FR-DOC-006** | Document ownership enforcement & deletion | Document Controller | `GET /api/documents/:id`, `DELETE /api/documents/:id` | `components/dashboard/DocumentList.jsx` | `TC-DOC-05`, `TC-DOC-06`, `07` | Implemented & Verified |
| **FR-AI-001** | Plain-language structured summary | Gemini Summarizer | `POST /api/analysis/:id`, `GET /api/analysis/:id/summary` | `components/analysis/SummaryTab.jsx` | `TC-AI-03`, `TC-ANA-02` | Implemented & Verified |
| **FR-AI-002** | Legal FAQ generation | Gemini FAQ Generator | `POST /api/analysis/:id`, `GET /api/analysis/:id/faqs` | `components/analysis/FaqsTab.jsx` | `TC-AI-03`, `TC-ANA-02` | Implemented & Verified |
| **FR-AI-003** | Chronological timeline extraction | Gemini Timeline Generator | `POST /api/analysis/:id`, `GET /api/analysis/:id/timeline` | `components/analysis/TimelineTab.jsx` | `TC-AI-03`, `TC-ANA-02` | Implemented & Verified |
| **FR-AI-004** | Procedural flowchart data extraction | Gemini Flowchart Generator | `POST /api/analysis/:id`, `GET /api/analysis/:id/flowchart` | `components/analysis/FlowchartTab.jsx` | `TC-AI-03`, `TC-ANA-02` | Implemented & Verified |
| **FR-AI-005** | Concrete action items identification | Gemini Action Extractor | `POST /api/analysis/:id`, `GET /api/analysis/:id/timeline` | `components/analysis/TimelineTab.jsx` | `TC-AI-03`, `TC-ANA-02` | Implemented & Verified |
| **FR-AI-006** | Argument mapping for lawyer personas | Gemini Argument Mapper | `POST /api/analysis/:id`, `GET /api/analysis/:id/arguments` | `components/analysis/ArgumentMapTab.jsx` | `TC-AI-03`, `TC-ANA-12` | Implemented & Verified |
| **FR-AI-007** | Pydantic schema validation of AI output | Pydantic Schemas | `ai_service/schemas/analysis.py` | `pages/AnalysisPage.jsx` | `TC-AI-04` | Implemented & Verified |
| **FR-CHAT-001** | Document chat session management | Chat Controller & Service | `POST /api/chat/:id` | `src/frontend/src/pages/ChatPage.jsx` | `TC-CHAT-01`, `TC-ANA-15` | Implemented & Verified |
| **FR-CHAT-002** | Grounded context passage retrieval | Retrieval Service | `ai_service/services/chat_service.py` | `src/frontend/src/pages/ChatPage.jsx` | `TC-CHAT-01` | Implemented & Verified |
| **FR-CHAT-003** | Grounded Gemini answer generation | Gemini Chat Engine | `ai_service/services/chat_service.py` | `src/frontend/src/pages/ChatPage.jsx` | `TC-CHAT-01` | Implemented & Verified |
| **FR-CHAT-004** | Source page citation extraction | Chat Citation Service | `ai_service/services/chat_service.py` | `src/frontend/src/pages/ChatPage.jsx` | `TC-CHAT-02`, `TC-ANA-15` | Implemented & Verified |
| **FR-CHAT-005** | Uncertainty handling with [UNKNOWN] placeholder | AI Safety Guard | `ai_service/services/chat_service.py` | `src/frontend/src/pages/ChatPage.jsx` | `TC-AI-06` | Implemented & Verified |
| **FR-ADM-001** | Administrator user directory management | Admin Controller | `GET /api/admin/users`, `PATCH /api/admin/users/:id/status` | `src/frontend/src/pages/AdminPage.jsx` | `TC-ADM-01`, `TC-ADM-02` | Implemented & Verified |
| **FR-ADM-002** | Audit trail & security event logging | SystemLog Model & Logger | `backend/src/services/auditService.js` | `src/frontend/src/pages/AdminPage.jsx` | `TC-ADM-04` | Implemented & Verified |
| **FR-ADM-003** | System health diagnostics | Health Controller | `GET /api/health` | `src/frontend/src/pages/AdminPage.jsx` | `TC-ADM-05` | Implemented & Verified |
| **NFR-SEC-004** | Prompt injection defense | Context Delimiter Fencer | `ai_service/services/prompts.py` | Security Layer | `TC-SEC-01`, `TC-AI-07` | Implemented & Verified |
| **NFR-COMP-001**| Mandatory legal disclaimer enforcement | Response Formatter | `backend/src/middleware/disclaimer.js` | `components/common/Footer.jsx` | `TC-COMP-01` | Implemented & Verified |
| **NFR-USAB-001**| Zero emojis in UI / Client outputs | UI & String Policy | Global System Standards | Automated Regex Verification | `TC-USAB-01` | Implemented & Verified |
