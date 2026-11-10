# Functional Requirements Document (FRD) — NyayaSetu

## 1. Document Control
- Document Version: 1.0.0
- Status: Baseline Approved
- Phase Scope: Phase 1 (Backend and AI Microservice)

## 2. Requirement Taxonomy
Requirements are organized into functional clusters:
- `FR-AUTH`: Authentication, Account Lifecycle, and Role-Based Authorization
- `FR-DOC`: Document Ingestion, PDF Processing, and Storage
- `FR-AI`: Legal Intelligence Analysis Engine (Summary, FAQs, Timelines, Flowcharts, Arguments)
- `FR-CHAT`: Conversational Grounded Querying & Citation
- `FR-ADM`: Administrative Governance and System Diagnostics
- `FR-AUD`: Audit Trails and Operational Logging

## 3. Detailed Functional Specifications

### 3.1 Authentication & Authorization Module (`FR-AUTH`)

#### FR-AUTH-001: User Registration
- **Description:** Allows prospective users to create an account.
- **Actor:** Unauthenticated User.
- **Inputs:** `name` (string, 2-100 chars), `email` (valid email format), `password` (min 8 chars, 1 uppercase, 1 lowercase, 1 number), `role` (`citizen` or `lawyer`, default `citizen`).
- **Processing:**
  1. Validate input payload against Zod schema.
  2. Check if email already exists in `Users` collection. If exists, return HTTP 409 Conflict.
  3. Hash password using `bcrypt` with salt rounds = 10.
  4. Persist user record with `status: "active"`, `createdAt: ISO timestamp`.
  5. Return HTTP 201 with created `userId`, `email`, and `role` (exclude `passwordHash`).

#### FR-AUTH-002: User Login & Session Creation
- **Description:** Authenticates user credentials and issues a signed JWT token.
- **Actor:** Registered User.
- **Inputs:** `email`, `password`.
- **Processing:**
  1. Query user by email. If not found or status is `suspended`, return HTTP 401 Unauthorized.
  2. Compare provided password against `passwordHash` using `bcrypt.compare`.
  3. If invalid, return HTTP 401.
  4. Generate JWT signed with `JWT_SECRET`, payload `{ id: user._id, role: user.role, email: user.email }`, expiration `24h`.
  5. Log successful login to `SystemLogs`.
  6. Return HTTP 200 with `token`, `user: { id, name, email, role }`.

#### FR-AUTH-003: Role-Based Access Enforcement
- **Description:** Guards sensitive endpoints based on user roles (`citizen`, `lawyer`, `admin`).
- **Processing:**
  1. Extract `Authorization: Bearer <token>` from HTTP headers.
  2. Verify token signature and expiration.
  3. Inject `req.user` into request lifecycle.
  4. If user role does not satisfy route requirements, return HTTP 403 Forbidden.

---

### 3.2 Document Management Module (`FR-DOC`)

#### FR-DOC-001: Secure PDF Upload
- **Description:** Accepts multi-part legal document uploads.
- **Actor:** Authenticated User (`citizen` or `lawyer`).
- **Inputs:** Multipart form field `file` (single PDF file, max size 25MB).
- **Processing:**
  1. Validate content type is `application/pdf`.
  2. Verify file header magic bytes (`%PDF-`).
  3. Generate unique document UUID and compute SHA-256 checksum.
  4. Store physical file in secure workspace storage or persistent volume.
  5. Insert document metadata into `Documents` collection: `{ userId, fileName, fileSize, mimeType, checksum, status: "uploaded" }`.
  6. Return HTTP 201 with `docId`, `fileName`, and `status`.

#### FR-DOC-002: Document Extraction Pipeline
- **Description:** Coordinates text parsing and OCR fallback via the AI microservice.
- **Actor:** System / User Trigger.
- **Processing:**
  1. Mark document status as `"extracting"`.
  2. Send extraction request to internal AI microservice `/extract` endpoint.
  3. AI microservice utilizes PyMuPDF (`fitz`) to extract text and page numbers.
  4. If average character count per page is < 50 (scanned document), trigger Tesseract OCR fallback.
  5. Store extracted text chunks with page indices in the database.
  6. Update document status to `"ready"` or `"failed"`.

#### FR-DOC-003: Document Retrieval and Isolation
- **Description:** Retrieves document metadata and extracted text.
- **Processing:**
  1. Verify requester ID equals `document.userId` or requester has `role: "admin"`.
  2. If unauthorized, return HTTP 403 Forbidden.
  3. Return document metadata and paginated text chunks.

---

### 3.3 AI Document Analysis Module (`FR-AI`)

#### FR-AI-001: Structured Legal Summary
- **Description:** Generates executive and plain-language legal summaries.
- **Processing:**
  1. Feed document text into Gemini using standardized summarization prompt.
  2. Constrain temperature to 0.2.
  3. Output JSON structure containing: `disputeType`, `keyParties`, `backgroundFacts`, `legalIssues`, `rulingsOrObligations`, and `plainLanguageOverview`.
  4. Validate against Pydantic schema `DocumentSummaryModel`.
  5. Persist to `AnalysisResults` collection.

#### FR-AI-002: FAQ and Procedural Flowchart Generation
- **Description:** Produces citizen-centric FAQs and sequential legal steps.
- **Processing:**
  1. Extract common procedural steps (e.g., notice response, appeal windows, evidence submission).
  2. Structure procedural steps as ordered nodes: `{ stepNumber, stageName, description, deadline, jurisdiction }`.
  3. Formulate 5-10 common legal questions with grounded answers.
  4. Validate schema and return.

#### FR-AI-003: Timeline and Action Items Extraction
- **Description:** Generates chronological event timeline and actionable legal next steps.
- **Processing:**
  1. Detect dates and map to chronological events `{ date, event, sourcePage }`.
  2. Identify action items `{ priority, action, responsibleParty, deadline, consequenceOfDefault }`.

---

### 3.4 Document-Grounded Conversational Chat (`FR-CHAT`)

#### FR-CHAT-001: Conversational Grounding and Citation
- **Description:** Responds to user queries regarding specific documents.
- **Inputs:** `docId`, `message`.
- **Processing:**
  1. Verify ownership of `docId`.
  2. Retrieve relevant document segments.
  3. Execute Gemini query with prompt fencing and instruction isolation.
  4. Response must include: `answer`, `citedPages` (array of integers), and `confidence`.
  5. Append exchange to `ChatSessions` and `ChatMessages` collections.
  6. Return response to client.

---

### 3.5 Administration & Monitoring Module (`FR-ADM`)

#### FR-ADM-001: User & System Administration
- **Description:** Provides administrative controls over users and operational logs.
- **Access:** Restricted to `role: "admin"`.
- **Capabilities:**
  1. List and paginate users (`GET /api/admin/users`).
  2. Toggle user active/suspended state (`PATCH /api/admin/users/:id/status`).
  3. Retrieve system audit logs with filters (`GET /api/admin/logs`).
  4. Read system health and service heartbeats (`GET /api/health`).

