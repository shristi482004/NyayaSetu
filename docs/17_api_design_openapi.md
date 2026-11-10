# API Design and OpenAPI Specification — NyayaSetu

## 1. Overview and Standards
The **NyayaSetu** API is a RESTful service operating over HTTPS. All request bodies and response structures use JSON, except file uploads which use `multipart/form-data`.

### 1.1 Authentication & Security Headers
- Protected endpoints require an `Authorization` header: `Authorization: Bearer <jwt_token>`
- Responses include standard security headers (Content-Security-Policy, X-Frame-Options, Strict-Transport-Security via `helmet`).

### 1.2 Standard HTTP Status Codes
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Validation failure or malformed payload.
- `401 Unauthorized`: Missing or invalid JWT credentials.
- `403 Forbidden`: Authenticated user lacks permission or does not own the requested resource.
- `404 Not Found`: Target entity does not exist.
- `409 Conflict`: Resource collision (e.g., duplicate email).
- `413 Payload Too Large`: Upload exceeds size limit (25MB).
- `500 Internal Server Error`: Unhandled server exception.
- `503 Service Unavailable`: Upstream AI engine (Gemini) temporarily unavailable or rate limited.

## 2. API Endpoints Catalog

### 2.1 Authentication & Profile
| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/register` | POST | Public | Register new citizen or lawyer account |
| `/api/login` | POST | Public | Authenticate and obtain JWT token |
| `/api/users/me` | GET | Authenticated | Retrieve authenticated user profile |
| `/api/users/profile` | PUT | Authenticated | Update user profile details |

### 2.2 Document Management
| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/documents` | POST | Authenticated | Upload legal PDF (max 25MB) |
| `/api/documents` | GET | Authenticated | List all uploaded documents owned by current user |
| `/api/documents/:id` | GET | Authenticated | Retrieve document metadata and extracted text |
| `/api/documents/:id` | DELETE | Authenticated | Delete document and associated chunks/analyses |

### 2.3 AI Legal Analysis
| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/analysis/:id` | GET | Authenticated | Retrieve or trigger complete AI analysis for document |
| `/api/analysis/:id/summary` | GET | Authenticated | Retrieve plain-language summary |
| `/api/analysis/:id/faqs` | GET | Authenticated | Retrieve legal FAQs |
| `/api/analysis/:id/flowchart` | GET | Authenticated | Retrieve procedural flowchart steps |
| `/api/analysis/:id/timeline` | GET | Authenticated | Retrieve extracted event timeline |
| `/api/analysis/:id/arguments` | GET | Lawyer / Admin | Retrieve legal argument maps |

### 2.4 Document-Grounded Chat
| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/chat/:id` | POST | Authenticated | Submit query regarding document; returns answer with citations |
| `/api/chat/:id/history` | GET | Authenticated | Retrieve conversation history for document |

### 2.5 Dashboard & Metrics
| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/dashboard` | GET | Authenticated | Fetch aggregated metrics, recent documents, and chat sessions |

### 2.6 Administration & Diagnostics
| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/admin/users` | GET | Admin | Search and paginate registered users |
| `/api/admin/users/:id/status` | PATCH | Admin | Update user account status (active/suspended) |
| `/api/admin/logs` | GET | Admin | Query system audit trails and error logs |
| `/api/health` | GET | Public | Healthcheck for backend, AI service, and database |

## 3. Sample Requests and Responses

### 3.1 Upload Document
```http
POST /api/documents HTTP/1.1
Host: api.nyayasetu.local
Authorization: Bearer <token>
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="legal_notice.pdf"
Content-Type: application/pdf

<binary data>
------WebKitFormBoundary--
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "docId": "654321fedcba0987654321fe",
    "fileName": "654321fedcba0987654321fe_legal_notice.pdf",
    "originalName": "legal_notice.pdf",
    "fileSize": 184520,
    "status": "extracting",
    "uploadDate": "2026-11-08T10:00:00.000Z"
  },
  "message": "Document uploaded successfully and queued for text extraction"
}
```

### 3.2 AI Analysis Endpoints (Initiation & Retrieval)

#### Analysis Initiation
```http
POST /api/analysis/654321fedcba0987654321fe HTTP/1.1
Host: api.nyayasetu.local
Authorization: Bearer <token>
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Analysis initiated and generated successfully.",
  "data": {
    "docId": "654321fedcba0987654321fe",
    "summary": { ... },
    "faqs": [ ... ],
    "timeline": [ ... ],
    "flowchart": [ ... ],
    "disclaimer": "NyayaSetu provides informational assistance only and does not constitute formal legal counsel."
  }
}
```

#### Analysis Retrieval
```http
GET /api/analysis/654321fedcba0987654321fe HTTP/1.1
Host: api.nyayasetu.local
Authorization: Bearer <token>
```

*Note: Returns 404 Not Found if POST initiation has not been executed.*

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "docId": "654321fedcba0987654321fe",
    "summary": {
      "disputeType": "Commercial Contract Breach",
      "keyParties": ["ABC Enterprises Pvt Ltd", "XYZ Logistics Ltd"],
      "factualBackground": [
        "Agreement entered on 2026-01-10 for supply of goods.",
        "Alleged failure to deliver consignments by agreed deadline."
      ],
      "legalIssues": ["Non-performance under Clause 14", "Liquidated damages calculation"],
      "rulingsOrObligations": ["Demand for payment of liquidated damages within 15 days."],
      "plainLanguageSummary": "ABC Enterprises claims XYZ Logistics failed to deliver goods on schedule and demands damages under the contract terms."
    },
    "faqs": [
      {
        "question": "What is the primary demand in this notice?",
        "answer": "Payment of liquidated damages within 15 days of notice receipt.",
        "relevantClauseOrPage": "Page 2, Paragraph 4"
      }
    ],
    "timeline": [
      { "date": "2026-01-10", "event": "Agreement executed between parties", "sourcePage": 1 },
      { "date": "2026-03-15", "event": "Consignment delivery due date", "sourcePage": 2 }
    ],
    "flowchart": [
      {
        "stepNumber": 1,
        "stageName": "Notice Receipt",
        "description": "Recipient receives demand notice.",
        "actionRequired": "Review terms and consult counsel",
        "deadlineOrTimeframe": "Day 0"
      },
      {
        "stepNumber": 2,
        "stageName": "Response Filing",
        "description": "Formulate and dispatch formal written reply.",
        "actionRequired": "Submit defense or cure defect",
        "deadlineOrTimeframe": "Within 15 days"
      }
    ],
    "disclaimer": "NyayaSetu provides informational assistance only and does not constitute formal legal counsel."
  }
}
```

