# Software Requirements Specification (SRS) — NyayaSetu

## 1. Introduction
### 1.1 Purpose
This Software Requirements Specification (SRS) establishes the complete functional and non-functional requirements for the **NyayaSetu** legal document intelligence platform. It serves as the formal baseline for system design, implementation, and testing in accordance with IEEE 830 guidelines.

### 1.2 Scope
NyayaSetu ingests unstructured legal documents (court judgments, legal notices, agreements, petitions) in PDF format, applies text extraction and optical character recognition (OCR), and leverages Google Gemini to deliver structured legal analysis (summaries, FAQs, procedural flowcharts, timelines, action items, argument maps, and conversational Q&A).

### 1.3 Definitions, Acronyms, and Abbreviations
- **API:** Application Programming Interface
- **JWT:** JSON Web Token
- **RBAC:** Role-Based Access Control
- **OCR:** Optical Character Recognition
- **RAG:** Retrieval-Augmented Generation
- **LLM:** Large Language Model
- **ODM:** Object-Document Mapper (Mongoose)

## 2. Overall Description
### 2.1 Product Perspective
NyayaSetu operates as a decoupled microservice platform composed of:
1. **Node.js Express Backend API Gateway:** Client-facing endpoint managing authentication, sessions, file upload validation, business orchestration, and MongoDB persistence.
2. **Python FastAPI AI/ML Microservice:** Internal service executing text extraction, OCR fallback, prompt structuring, Gemini API interactions, and Pydantic response validation.
3. **MongoDB Database:** Persistent datastore for users, document metadata, text chunks, AI analysis results, chat sessions, and audit logs.
4. **Phase 2 React.js Client:** Single-page frontend application for end users and administrators (deferred to Phase 2).

### 2.2 User Classes and Characteristics
- **Citizen / General User:** Requires plain-language legal explanations, actionable timelines, and step-by-step guidance without dense legal terminology.
- **Lawyer / Legal Professional:** Requires detailed case summaries, argument mapping, evidentiary breakdown, and rapid search across uploaded filings.
- **System Administrator:** Oversees user account status, manages system configurations, and inspects system performance and audit logs without viewing confidential client documents.

### 2.3 Operating Environment
- Node.js LTS (v18+) runtime environment.
- Python 3.11+ runtime environment.
- MongoDB 7.0+ (Local or MongoDB Atlas cluster).
- Google Gemini API via official Google GenAI SDK.
- Containerized deployment using Docker.

## 3. Specific Functional Requirements

### 3.1 Module A: Authentication & User Management
- **FR-AUTH-001 (Registration):** The system shall allow users to register with name, email, password, and requested role (citizen or lawyer).
- **FR-AUTH-002 (Password Hashing):** The system shall hash all passwords using `bcrypt` with a minimum cost factor of 10 prior to database persistence.
- **FR-AUTH-003 (Login & Token Generation):** The system shall authenticate credentials and return signed JWT tokens with 24-hour expiration.
- **FR-AUTH-004 (RBAC Middleware):** The system shall enforce role-based access control protecting lawyer-specific, user-owned, and admin endpoints.
- **FR-AUTH-005 (Profile Management):** The system shall allow authenticated users to view and update their profile metadata.

### 3.2 Module B: Document Management
- **FR-DOC-001 (PDF Upload):** The system shall allow authenticated users to upload PDF documents up to 25MB.
- **FR-DOC-002 (File Validation):** The system shall validate uploaded file magic numbers (`%PDF-`), MIME types (`application/pdf`), and sanitize filenames.
- **FR-DOC-003 (Document Storage):** The system shall store document metadata (filename, size, hash, upload timestamp, ownership) in the `Documents` collection.
- **FR-DOC-004 (Text Extraction):** The system shall extract text and page numbers from uploaded PDFs using PyMuPDF.
- **FR-DOC-005 (OCR Fallback):** If extracted text density is below a defined threshold (scanned document), the system shall trigger OCR fallback via Tesseract to extract textual content.
- **FR-DOC-006 (Document Ownership & Deletion):** The system shall restrict document access and deletion to the verified owner or authorized system administrator.

### 3.3 Module C: AI Document Analysis
- **FR-AI-001 (Plain-Language Summary):** The system shall generate a structured summary including core dispute, key parties, essential facts, and conclusions.
- **FR-AI-002 (Legal FAQ Generation):** The system shall generate common questions and answers relevant to citizens interpreting the document.
- **FR-AI-003 (Timeline Extraction):** The system shall extract dates, associated events, and legal deadlines chronologically.
- **FR-AI-004 (Procedural Flowchart Data):** The system shall generate ordered procedural steps (e.g., notice received -> response filing deadline -> hearing -> appellate route).
- **FR-AI-005 (Action Items):** The system shall identify immediate legal actions, notices required, and compliance requirements.
- **FR-AI-006 (Argument Mapping):** For lawyer personas, the system shall extract contested claims, supporting evidence, and opposing counterarguments.
- **FR-AI-007 (Schema Validation):** All AI outputs from Gemini shall be validated against strict Pydantic schemas prior to returning to the caller.

### 3.4 Module D: Document-Grounded AI Chat
- **FR-CHAT-001 (Chat Session Management):** The system shall create and maintain conversational chat sessions linked to a specific document.
- **FR-CHAT-002 (Passage Retrieval):** The system shall retrieve relevant document chunks matching user queries to construct grounded prompts.
- **FR-CHAT-003 (Grounded Answer Generation):** The system shall invoke Gemini with temperature 0.2 to generate answers strictly grounded in the document text.
- **FR-CHAT-004 (Source Page Citation):** The system shall include source page numbers with generated answers wherever passages are cited.
- **FR-CHAT-005 (Uncertainty Handling):** If a query cannot be answered from document content, the system shall explicitly communicate uncertainty using `[UNKNOWN]` placeholders.

### 3.5 Module E: System Administration & Auditing
- **FR-ADM-001 (User Directory):** The system shall allow administrators to search, inspect, and toggle user account status (active/suspended).
- **FR-ADM-002 (Audit Logging):** The system shall log security events, authentication attempts, document uploads, and errors to `SystemLogs`.
- **FR-ADM-003 (System Health):** The system shall expose `/api/health` checking database, AI service, and runtime status.

## 4. Non-Functional Requirements (NFR)
- **NFR-PERF-001 (AI Latency):** AI analysis operations shall complete within 5-10 seconds under typical cloud API conditions.
- **NFR-PERF-002 (Extraction Latency):** Digital PDF text extraction shall complete within 5 seconds for documents under 20 pages.
- **NFR-SEC-001 (Data in Transit):** All communications shall utilize TLS/HTTPS.
- **NFR-SEC-002 (Zero Plaintext Secrets):** API keys, JWT secrets, and connection strings must only be read from environment variables.
- **NFR-SEC-003 (Prompt Injection Resistance):** The AI service shall treat all document contents as untrusted data enclosed in strict boundary tags.
- **NFR-COMP-001 (Legal Disclaimers):** Every analysis result and chat reply must include a prominent informational disclaimer.

