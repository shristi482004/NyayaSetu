# Risk Management Plan — NyayaSetu

## 1. Overview and Objectives
Risk management for **NyayaSetu** provides continuous identification, assessment, mitigation, and monitoring of risks across technical architecture, AI safety, data privacy, and project scheduling.

## 2. Risk Classification Framework
Risks are classified into four key categories:
1. **AI Safety & Ethical Risks (AI):** Hallucinations, erroneous legal citations, prompt injection.
2. **Security & Privacy Risks (SEC):** Data breaches, unauthorized document access, credential leakage.
3. **Technical & Architectural Risks (TECH):** Microservice latency, PDF parsing failures, API rate limits.
4. **Project & Operational Risks (OPS):** Scope creep, dependency obsolescence, integration delays.

## 3. Comprehensive Risk Register

| Risk ID | Category | Description | Prob | Impact | Severity | Mitigation Strategy | Contingency Plan |
|---|---|---|---|---|---|---|---|
| R-AI-01 | AI | Gemini hallucinates non-existent statutory provisions or case rulings | Med | High | High | Strict system prompts forbidding unverified citations; replace unknowns with `[UNKNOWN]` and `[CITE]` placeholders; temperature 0.2 | Flag ungrounded claims; trigger secondary verification check or fallback disclaimer |
| R-AI-02 | AI | Prompt injection via malicious instructions embedded in uploaded legal PDFs | Med | High | High | Treat PDF text strictly as untrusted data; sanitize text; enclose text within boundary markers; system instructions precede user payload | Reject document processing if heuristic detector detects instruction override attempts |
| R-SEC-01 | SEC | Cross-user document disclosure (broken tenant isolation) | Low | High | High | Enforce ownership filter (`userId == req.user.id`) at the repository layer; verify in unit/integration tests | Revoke token; isolate compromised record; notify administrator |
| R-SEC-02 | SEC | Hardcoded credentials or API keys exposed in version control | Low | High | High | Strict `.gitignore` rules; automated git pre-commit scanning; load all keys exclusively via `.env` | Immediate key rotation via Google Cloud Console / MongoDB Atlas |
| R-TECH-01 | TECH | PyMuPDF fails or yields empty text on scanned/image-based PDFs | Med | Med | Med | Automatic character density threshold check triggering Tesseract OCR fallback engine | Log extraction failure; notify user with actionable guidance to upload clear digital document |
| R-TECH-02 | TECH | Google Gemini API rate limiting or temporary upstream outage | Med | Med | Med | Implement exponential backoff, request throttling, and circuit breaker in backend client | Return HTTP 503 with Retry-After header; display friendly retry message |
| R-TECH-03 | TECH | Large document uploads causing memory exhaustion or timeouts | Low | Med | Med | 25MB file upload limit; streaming file handling; async document chunking | Reject oversized files immediately at multer gateway level |
| R-OPS-01 | OPS | Premature frontend development causing API contract churn | Med | Med | Med | Strict Phase 1 sign-off gate; freeze OpenAPI specifications before Phase 2 initiation | Formal review gate requiring PM and Architect sign-off before Phase 2 |

## 4. Risk Monitoring and Governance Cadence
- **Weekly Risk Reviews:** Held during sprint planning to evaluate register status.
- **Automated Regression Audits:** Continuous integration tests ensure security rules, ownership validations, and AI schema constraints remain enforced on every commit.
- **Audit Log Inspection:** Administrator reviews `SystemLogs` for anomalous patterns (e.g. repeated 403 Forbidden errors or failed extraction alerts).

