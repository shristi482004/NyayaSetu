# UI/UX Wireframes and Visual Architecture (Phase 2 Preparation) — NyayaSetu

## 1. Overview
This document records the user interface specifications, wireframe layouts, and user experience flows planned for **Phase 2 (Frontend Development)**. No frontend code is implemented in Phase 1; this document aligns Phase 1 API design with the future user interface.

## 2. Global UI Principles
- **No Emojis in UI:** In accordance with the system-wide user rule, no emojis shall be used in any UI screens, icons, buttons, banners, or typography. Use clean professional iconography (Lucide SVG icons or standard text indicators).
- **Accessibility & Contrast:** High contrast typography with support for standard screen readers and ARIA labels.
- **Informational Legal Banner:** Every screen displays a non-intrusive persistent footer: "NyayaSetu provides informational document assistance only and does not constitute formal legal counsel."

## 3. Screen Wireframe Specifications

### 3.1 Citizen Dashboard
- **Header:** Navigation, user greeting ("Welcome, [Name]"), role badge ("Citizen"), Logout.
- **Primary Action Panel:** Drag-and-drop PDF upload target with progress bar, 25MB indicator, and format badge ("PDF only").
- **Recent Documents Table:** Columns for Document Name, Upload Date, Status (`Uploaded`, `Processing`, `Ready`), and Actions (`View Analysis`, `Open Chat`, `Delete`).

### 3.2 Document Analysis View
- **Tab 1: Plain-Language Summary:**
  - Dispute Classification tag.
  - Involved Parties list.
  - Background Facts in structured bullet format.
  - Plain-language executive breakdown.
- **Tab 2: Interactive Procedural Flowchart:**
  - Interactive directed graph rendered via React Flow.
  - Nodes represent sequential legal phases (Notice -> Response -> Filing -> Hearing -> Judgment).
  - Deadlines and statutory limitations highlighted in alert panels.
- **Tab 3: FAQs:**
  - Expandable accordion displaying citizen-oriented questions and answers with source page tags.
- **Tab 4: Timeline & Action Items:**
  - Chronological vertical timeline of past events.
  - High-priority action items card with checkboxes and deadline dates.

### 3.3 Lawyer Advanced View
- Incorporates all Citizen views, plus:
  - **Argument Map:** Dual-column diagram contrasting Claimant Claims and Evidentiary Basis against Respondent Counter-Claims.
  - Multi-document comparison pane.

### 3.4 Conversational Document Chat
- Split-screen interface:
  - Left pane: PDF viewer showing source document pages.
  - Right pane: Grounded conversational chat thread.
  - Messages display source page citation pills (clicking a pill jumps to the corresponding page in the PDF viewer).
  - Uncertainty indicator for queries whose answers are not supported by the document record.

### 3.5 Administrator Dashboard
- User governance table with search, role filters (`citizen`, `lawyer`), and toggle switches (`active` / `suspended`).
- System log feed with severity filters (`info`, `warn`, `error`).
- System health status cards (API Gateway, AI Service, Database latency).

