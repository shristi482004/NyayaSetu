# Data Flow Diagrams (DFD) — NyayaSetu

## 1. DFD Level 0 (Context Diagram)
The Context Diagram establishes the boundary of the **NyayaSetu** system, illustrating external entities and primary information exchanges.

```mermaid
flowchart LR
    Citizen["Student / Citizen"]
    Lawyer["Lawyer / Legal Professional"]
    Admin["System Administrator"]
    System["NyayaSetu Legal Intelligence System"]

    Citizen -->|Credentials, Legal PDFs, Chat Questions| System
    System -->|Summaries, FAQs, Flowcharts, Citations| Citizen

    Lawyer -->|Credentials, Case Documents, Queries| System
    System -->|Argument Maps, Case Timelines, Citations| Lawyer

    Admin -->|Admin Auth, User Management, Configs| System
    System -->|Audit Logs, System Metrics, User Lists| Admin
```

## 2. DFD Level 1 (Detailed Subsystem Data Flows)
Level 1 illustrates processes P1 through P7, data stores D1 through D4, and cross-subsystem data movements (matching Executive Summary Figure 3).

```mermaid
flowchart TD
    subgraph Entities["External Entities"]
        Citizen["Student / Citizen"]
        Lawyer["Lawyer / Legal Professional"]
        Admin["Administrator"]
    end

    subgraph Processes["Processes"]
        P1["P1: Auth & User Management"]
        P2["P2: Document Upload & Processing"]
        P3["P3: AI Legal Analysis"]
        P4["P4: Response Generation & Formatting"]
        P5["P5: Document-Based Chat"]
        P6["P6: Dashboard & Reporting"]
        P7["P7: Admin Monitoring & Governance"]
    end

    subgraph Stores["Data Stores"]
        D1[("D1: User DB")]
        D2[("D2: Document DB")]
        D3[("D3: Analysis Results DB")]
        D4[("D4: System Logs DB")]
    end

    subgraph External["External AI Services"]
        Gemini["Google Gemini Generative AI"]
    end

    %% Interactions
    Citizen -->|Signup / Login| P1
    Lawyer -->|Signup / Login| P1
    P1 -->|Write User / Read Role| D1
    P1 -->|Issue JWT Token| Citizen
    P1 -->|Issue JWT Token| Lawyer

    Citizen -->|Upload Legal PDF| P2
    Lawyer -->|Upload Legal PDF| P2
    P2 -->|Store File Meta & Chunks| D2
    P2 -->|Dispatch Text for Analysis| P3

    P3 -->|Cleaned Text & Prompt| Gemini
    Gemini -->|Structured AI Output| P3
    P3 -->|Store Summaries, FAQs, Flows| D3
    P3 -->|Forward Results| P4

    P4 -->|Serve Visual Data Payload| Citizen
    P4 -->|Serve Advanced Legal Data| Lawyer

    Citizen -->|Chat Query| P5
    Lawyer -->|Chat Query| P5
    P5 -->|Read Chunks| D2
    P5 -->|Read History / Write Message| D3
    P5 -->|Grounded Prompt| Gemini
    Gemini -->|Grounded Answer & Citation| P5
    P5 -->|Answer & Citations| Citizen

    Citizen -->|View Dashboard| P6
    Lawyer -->|View Dashboard| P6
    P6 -->|Query Docs & Stats| D2
    P6 -->|Query Summaries| D3

    Admin -->|Admin Actions| P7
    P7 -->|Manage Accounts| D1
    P7 -->|Read Logs & Diagnostics| D4
    P1 -.->|Log Security Events| D4
    P2 -.->|Log Upload Events| D4
```

## 3. Data Store Definitions

| Store ID | Name | Primary Contents | Storage Engine |
|---|---|---|---|
| D1 | User DB | User credentials (bcrypt hash), role, contact info, account status | MongoDB (`users` collection) |
| D2 | Document DB | File metadata, checksums, physical paths, extracted text page chunks | MongoDB (`documents` collection) |
| D3 | Analysis Results DB | Structured summaries, FAQs, flowchart nodes, timelines, arguments, chat messages | MongoDB (`analysis_results`, `chat_sessions`, `chat_messages`) |
| D4 | System Logs DB | Security events, audit trail, extraction errors, API access logs | MongoDB (`system_logs` collection) |

## 4. DFD Level 2: Document Processing and AI Pipeline Deep-Dive

```mermaid
flowchart TD
    Upload["PDF Upload Stream"] --> P2_1["P2.1: Validate Magic Bytes & Size"]
    P2_1 --> P2_2["P2.2: Compute SHA-256 & Save File"]
    P2_2 --> P2_3["P2.3: Extract Text via PyMuPDF"]
    P2_3 --> P2_4{"P2.4: Character Count >= 50?"}
    P2_4 -- Yes --> P2_6["P2.6: Clean & Normalize Text"]
    P2_4 -- No --> P2_5["P2.5: Render Pixmap & Run Tesseract OCR"]
    P2_5 --> P2_6
    P2_6 --> P2_7["P2.7: Store Extracted Chunks to D2"]
    P2_7 --> P3_1["P3.1: Construct Structured Prompts"]
    P3_1 --> P3_2["P3.2: Invoke Gemini 2.0 / Pro API"]
    P3_2 --> P3_3["P3.3: Validate Response with Pydantic"]
    P3_3 --> P3_4["P3.4: Persist Analysis to D3"]
```

