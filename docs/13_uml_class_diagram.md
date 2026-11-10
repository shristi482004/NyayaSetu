# UML Class Diagram — NyayaSetu

## 1. Class Diagram Architecture
The class diagram represents the object-oriented structure of the **NyayaSetu** backend and AI microservice, showing relationships, attributes, and core methods.

```mermaid
classDiagram
    class User {
        +ObjectId id
        +String name
        +String email
        +String passwordHash
        +String role
        +String status
        +Date createdAt
        +Date updatedAt
        +verifyPassword(password) Boolean
        +generateJWT() String
    }

    class Document {
        +ObjectId id
        +ObjectId userId
        +String fileName
        +String originalName
        +Number fileSize
        +String mimeType
        +String checksum
        +String status
        +Number pageCount
        +Date uploadDate
        +getChunks() List
    }

    class DocumentChunk {
        +ObjectId id
        +ObjectId documentId
        +Number pageNumber
        +Number chunkIndex
        +String textContent
        +Boolean isOcrApplied
    }

    class AnalysisResult {
        +ObjectId id
        +ObjectId documentId
        +Object summary
        +List~Object~ faqs
        +List~Object~ timeline
        +List~Object~ flowchart
        +List~Object~ arguments
        +List~Object~ actionItems
        +Date generatedAt
    }

    class ChatSession {
        +ObjectId id
        +ObjectId documentId
        +ObjectId userId
        +String sessionTitle
        +Date createdAt
        +Date lastActiveAt
    }

    class ChatMessage {
        +ObjectId id
        +ObjectId sessionId
        +String senderRole
        +String content
        +List~Number~ citedPages
        +Date timestamp
    }

    class SystemLog {
        +ObjectId id
        +Date timestamp
        +ObjectId userId
        +String action
        +String level
        +Object details
        +String ipAddress
    }

    class AIServiceClient {
        +String baseUrl
        +extractText(filePath) ExtractedData
        +analyzeDocument(text) AnalysisResultDTO
        +chatWithDocument(context, query) ChatResponseDTO
    }

    class GeminiAdapter {
        +String apiKey
        +String modelName
        +generateStructured(prompt, schema) Dict
        +generateChatAnswer(context, history, query) Dict
    }

    User "1" --> "0..*" Document : owns
    User "1" --> "0..*" ChatSession : initiates
    User "1" --> "0..*" SystemLog : logs
    Document "1" --> "1..*" DocumentChunk : contains
    Document "1" --> "0..1" AnalysisResult : analyzed_into
    Document "1" --> "0..*" ChatSession : context_for
    ChatSession "1" --> "1..*" ChatMessage : contains
    AIServiceClient --> GeminiAdapter : utilizes
```

## 2. Pydantic Validation Schemas (AI Microservice)

### SummarySchema
- `dispute_type`: str
- `key_parties`: list[str]
- `factual_background`: list[str]
- `legal_issues`: list[str]
- `rulings_or_obligations`: list[str]
- `plain_language_summary`: str

### FAQItemSchema
- `question`: str
- `answer`: str
- `relevant_clause_or_page`: str

### TimelineEventSchema
- `date`: str
- `event`: str
- `source_page`: int

### FlowchartStepSchema
- `step_number`: int
- `stage_name`: str
- `description`: str
- `action_required`: str
- `deadline_or_timeframe`: str

### ArgumentItemSchema
- `claim`: str
- `evidence_or_basis`: str
- `counter_argument`: str

### ChatResponseSchema
- `answer`: str
- `cited_pages`: list[int]
- `confidence`: str
- `disclaimer`: str

