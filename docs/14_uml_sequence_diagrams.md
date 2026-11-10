# UML Sequence Diagrams — NyayaSetu

## 1. Sequence Diagram 1: User Registration and Authentication

```mermaid
sequenceDiagram
    autonumber
    actor User as Client User
    participant Gateway as Express API Gateway
    participant Validator as Zod Validator
    participant DB as MongoDB (Users)
    participant Log as SystemLogs

    User->>Gateway: POST /api/register (name, email, password, role)
    Gateway->>Validator: Validate input schema
    alt Invalid Input
        Validator-->>Gateway: Validation Errors
        Gateway-->>User: 400 Bad Request
    else Valid Input
        Gateway->>DB: findOne({ email })
        alt Email Exists
            DB-->>Gateway: Existing Record Found
            Gateway-->>User: 409 Conflict
        else Email Available
            Gateway->>Gateway: bcrypt.hash(password, 10)
            Gateway->>DB: User.create({ ...hashedData })
            DB-->>Gateway: Created User Document
            Gateway->>Log: Log user registration event
            Gateway-->>User: 201 Created (userId, email, role)
        end
    end

    User->>Gateway: POST /api/login (email, password)
    Gateway->>DB: findOne({ email })
    alt User Not Found or Suspended
        Gateway-->>User: 401 Unauthorized
    else User Exists & Active
        Gateway->>Gateway: bcrypt.compare(password, passwordHash)
        alt Password Mismatch
            Gateway-->>User: 401 Unauthorized
        else Password Valid
            Gateway->>Gateway: jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' })
            Gateway->>Log: Log user login event
            Gateway-->>User: 200 OK (JWT Token, User Profile)
        end
    end
```

## 2. Sequence Diagram 2: Document Upload and Text/OCR Extraction

```mermaid
sequenceDiagram
    autonumber
    actor User as Authenticated User
    participant Gateway as Express Gateway
    participant Storage as File Storage
    participant DB as MongoDB
    participant AI as FastAPI AI Service
    participant Fitz as PyMuPDF Extractor
    participant Tesseract as Tesseract OCR

    User->>Gateway: POST /api/documents (Multipart PDF, Bearer JWT)
    Gateway->>Gateway: Verify JWT & Validate Magic Bytes (%PDF-)
    alt Invalid Header or > 25MB
        Gateway-->>User: 400 Bad Request / 413 Payload Too Large
    else Valid PDF
        Gateway->>Storage: Persist file to uploads/
        Gateway->>DB: Documents.create({ status: "extracting", ...meta })
        DB-->>Gateway: Saved Document with docId
        Gateway-->>User: 201 Created (docId, status: "extracting")

        Gateway->>AI: POST /extract (filePath, docId)
        AI->>Fitz: fitz.open(filePath)
        loop Each Page 1..N
            Fitz->>Fitz: extract_text()
            alt Chars < 50 (Scanned Page)
                Fitz->>Fitz: get_pixmap()
                Fitz->>Tesseract: image_to_string(pixmap)
                Tesseract-->>Fitz: OCR Text Result
            end
        end
        Fitz-->>AI: Complete Page Chunks & Metadata
        AI-->>Gateway: Extraction Success (chunks, pageCount)
        Gateway->>DB: Store DocumentChunks & update Document status: "ready"
    end
```

## 3. Sequence Diagram 3: AI Document Analysis (Gemini Integration)

```mermaid
sequenceDiagram
    autonumber
    actor User as Authenticated User
    participant Gateway as Express Gateway
    participant DB as MongoDB
    participant AI as FastAPI AI Service
    participant Gemini as Google Gemini API

    User->>Gateway: GET /api/analysis/:docId (Bearer JWT)
    Gateway->>DB: Verify Ownership (doc.userId == req.user.id)
    alt Unauthorized Access
        Gateway-->>User: 403 Forbidden
    else Authorized
        Gateway->>DB: AnalysisResults.findOne({ docId })
        alt Cached Analysis Exists
            DB-->>Gateway: Analysis Record
            Gateway-->>User: 200 OK (Cached Analysis)
        else Fresh Analysis Required
            Gateway->>DB: Retrieve Document Text Chunks
            DB-->>Gateway: Document Text
            Gateway->>AI: POST /analyze (docId, text)
            AI->>AI: Construct Structured Prompt & Inject Fences
            AI->>Gemini: generate_content(prompt, temperature=0.2)
            Gemini-->>AI: Raw JSON Output
            AI->>AI: Pydantic Validation (Summary, FAQs, Timeline, Flowchart)
            AI-->>Gateway: Validated Analysis DTO
            Gateway->>DB: AnalysisResults.create(analysisData)
            Gateway-->>User: 200 OK (Structured Analysis Result)
        end
    end
```

## 4. Sequence Diagram 4: Document-Grounded Conversational Chat

```mermaid
sequenceDiagram
    autonumber
    actor User as Authenticated User
    participant Gateway as Express Gateway
    participant DB as MongoDB
    participant AI as FastAPI AI Service
    participant Gemini as Google Gemini API

    User->>Gateway: POST /api/chat/:docId (query: "What is the penalty?")
    Gateway->>DB: Check Document Ownership & Fetch Text Chunks
    DB-->>Gateway: Validated Chunks & Previous Chat History
    Gateway->>AI: POST /chat (query, chunks, history)
    AI->>AI: Retrieve Top Relevant Chunks & Build Fenced Context
    AI->>Gemini: generate_content(SystemPrompt + FencedContext + History + Query)
    alt Fact Present in Text
        Gemini-->>AI: Answer citing Page Numbers
    else Fact Not Present
        Gemini-->>AI: "This information is not present in the document. [UNKNOWN]"
    end
    AI->>AI: Validate ChatResponseSchema (answer, cited_pages, disclaimer)
    AI-->>Gateway: Structured Chat Answer
    Gateway->>DB: Append to ChatSession & ChatMessages
    Gateway-->>User: 200 OK (answer, citedPages, disclaimer)
```

