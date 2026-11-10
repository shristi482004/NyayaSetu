# UML Activity Diagrams — NyayaSetu

## 1. Activity Diagram 1: Document Ingestion and Extraction Workflow

```mermaid
flowchart TD
    Start([User Initiates Upload]) --> SelectFile[Select PDF Document]
    SelectFile --> UploadReq[Send POST /api/documents]
    UploadReq --> CheckAuth{Is Authenticated?}
    CheckAuth -- No --> Ret401[Return 401 Unauthorized]
    CheckAuth -- Yes --> CheckFormat{MIME == application/pdf & Magic Header Valid?}
    CheckFormat -- No --> Ret400[Return 400 Bad Request]
    CheckFormat -- Yes --> CheckSize{Size <= 25MB?}
    CheckSize -- No --> Ret413[Return 413 Payload Too Large]
    CheckSize -- Yes --> SaveStorage[Persist File & Compute SHA-256]
    SaveStorage --> CreateDocRecord[Create DB Record: status=extracting]
    CreateDocRecord --> SendToAIService[Dispatch /extract to AI Microservice]
    SendToAIService --> OpenPDF[PyMuPDF: Open Document Stream]
    OpenPDF --> LoopPage[Read Next Page]
    LoopPage --> ExtractPyMuPDF[Extract Text via fitz]
    ExtractPyMuPDF --> CheckYield{Char Count >= 50?}
    CheckYield -- Yes --> StoreChunk[Buffer Text Chunk with Page No]
    CheckYield -- No --> RenderImage[Render Page Pixmap to Memory]
    RenderImage --> RunTesseract[Run Tesseract OCR Engine]
    RunTesseract --> StoreChunk
    StoreChunk --> HasMorePages{More Pages Remaining?}
    HasMorePages -- Yes --> LoopPage
    HasMorePages -- No --> SaveDBChunks[Persist DocumentChunks to MongoDB]
    SaveDBChunks --> UpdateStatus[Update Document status: ready]
    UpdateStatus --> Done([Document Extraction Complete])
```

## 2. Activity Diagram 2: Legal Analysis Generation and Pydantic Validation

```mermaid
flowchart TD
    StartAnalysis([User Requests GET /api/analysis/:id]) --> CheckOwnership{Does User Own Document?}
    CheckOwnership -- No --> Ret403[Return 403 Forbidden]
    CheckOwnership -- Yes --> CheckCached{Cached Analysis in DB?}
    CheckCached -- Yes --> ReturnCached[Return Cached Analysis Result]
    CheckCached -- No --> ReadChunks[Read Stored Document Chunks]
    ReadChunks --> BuildPrompt[Assemble Multi-Section System Prompts]
    BuildPrompt --> CallGemini[Invoke Google Gemini API: temp=0.2]
    CallGemini --> CheckAPIStatus{Gemini API Response Success?}
    CheckAPIStatus -- No (Timeout/Quota) --> RetryOrDegrade[Retry with Backoff / Return 503]
    CheckAPIStatus -- Yes --> ParseJSON[Parse Raw JSON String]
    ParseJSON --> ValidatePydantic{Validates Against Pydantic Schemas?}
    ValidatePydantic -- No --> LogValidationError[Log Validation Error in SystemLogs]
    LogValidationError --> FallbackParse[Apply Sanitization Repair & Reprompt]
    ValidatePydantic -- Yes --> PersistAnalysis[Persist in AnalysisResults Collection]
    PersistAnalysis --> ReturnResult[Return Structured JSON Payload to Client]
    ReturnResult --> EndAnalysis([Analysis Delivery Complete])
```

## 3. Activity Diagram 3: Document Chat and Hallucination Prevention

```mermaid
flowchart TD
    StartChat([User Enters Chat Query]) --> CheckDocAccess{User Document Verified?}
    CheckDocAccess -- No --> Chat403[Return 403 Forbidden]
    CheckDocAccess -- Yes --> RetrievePassages[Retrieve Relevant Text Chunks]
    RetrievePassages --> FormatContext[Enclose Chunks in Delimited Context Fence]
    FormatContext --> InjectSafetyPrompt[Append Strict Safety & Grounding Rules]
    InjectSafetyPrompt --> CallGeminiChat[Call Gemini API generate_content]
    CallGeminiChat --> EvaluateEvidence{Evidence Present in Context?}
    EvaluateEvidence -- Yes --> ExtractCitation[Extract Cited Page Numbers & Answer]
    EvaluateEvidence -- No --> InsertUnknown[Emit '[UNKNOWN]' & Stated Uncertainty]
    ExtractCitation --> AttachDisclaimer[Attach Mandatory Legal Disclaimer]
    InsertUnknown --> AttachDisclaimer
    AttachDisclaimer --> SaveMessage[Save to ChatMessages Collection]
    SaveMessage --> DeliverResponse[Deliver Grounded Response to User]
    DeliverResponse --> EndChat([Chat Turn Complete])
```

