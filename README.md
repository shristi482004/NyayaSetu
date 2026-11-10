# NyayaSetu (न्यायसेतु) — Legal Document Intelligence Platform

NyayaSetu is an enterprise-grade AI-powered legal document intelligence platform engineered to assist ordinary citizens and legal professionals in understanding, analyzing, and navigating complex legal documents and procedural stages.

---

## Architecture Overview
The platform is built using a decoupled, multi-tier microservices architecture:
- **Frontend SPA (`src/frontend`)**: Built with React.js, Vite, Tailwind CSS, and React Flow. Implements public showcase pages, Citizen workspace with drag-and-drop PDF ingestion, live document library, tabbed analysis views (summaries, interactive flowcharts, FAQs, timelines), document-grounded Q&A chat, Lawyer portal with Argument Mapping, and Admin governance console. Designed with warm ivory and deep forest-green editorial styling inspired by legal elegance.
- **Backend API Gateway (`src/backend`)**: Built with Node.js & Express.js. Manages user authentication (JWT/bcrypt), role-based access control (Citizen, Lawyer, Admin), multi-part PDF file uploads with magic-byte verification, tenant isolation, rate-limiting, and MongoDB data persistence.
- **AI/ML Microservice (`src/ai_service`)**: Built with Python & FastAPI. Handles text extraction via PyMuPDF, OCR fallback for scanned documents via Tesseract 5.5+, prompt management with injection defense, and Google Gemini API integration with strict Pydantic v2 response validation.
- **Database Layer**: MongoDB holding collections for Users, Documents, Extracted Chunks, Analysis Results, Chat Sessions, and System Audit Logs.

---

## Two-Phase Development Roadmap
1. **Phase 1 (Backend & AI Microservice Development) — Complete & Verified**:
   - Complete Node.js Express API gateway with security, auth, tenant isolation, and CRUD operations.
   - Complete Python FastAPI AI microservice with PDF parsing, live Tesseract OCR fallback, and Google Gemini integration.
   - Automated test suites (Jest/Supertest and Pytest) with 85.32% line coverage.
   - Containerization with Docker and multi-container orchestration.
2. **Phase 2 (Frontend Development) — Complete & Verified**:
   - React.js single-page application with Tailwind CSS and React Flow procedural directed graphs.
   - Public landing page, authentication views (Login & Registration with Citizen/Lawyer role selection).
   - Citizen Dashboard with drag-and-drop 25MB PDF upload and real-time document library.
   - Tabbed Document Analysis view (Plain-Language Summary, React Flow Flowchart, FAQs, Chronological Timeline & Action Items).
   - Document-Grounded Conversational Chat with source page citation pills and uncertainty detection (`[UNKNOWN]`).
   - Lawyer portal with dual-column Argument Mapping.
   - Admin governance console with health telemetry, user account controls, and security audit logs.
   - Zero-emoji design compliance strictly verified across all source files.

---

## Quick Start Guide

### 1. Prerequisites
- Node.js v18.0.0+
- Python 3.11+
- MongoDB v6.0+ (running locally on port 27017 or MongoDB Atlas connection URI)
- Tesseract OCR (Optional for scanned PDF fallback, installed via `brew install tesseract` on macOS or `apt-get install tesseract-ocr` on Linux)

### 2. Starting the Backend API Gateway
```bash
cd src/backend
npm install
npm run dev
# Server running at http://localhost:5000 (API prefix: /api)
```

### 3. Starting the Python AI Microservice
```bash
cd src/ai_service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
# AI microservice running at http://localhost:8000 (Interactive docs at /docs)
```

### 4. Starting the React Frontend
```bash
cd src/frontend
npm install
npm run dev
# Frontend running at http://localhost:3000 (proxies /api to localhost:5000)
```

### 5. Running with Docker Compose
To launch MongoDB, the AI Service, and the Backend simultaneously:
```bash
docker-compose up --build
```

---

## Automated Test Execution

### Backend Test Suite (Jest & Supertest)
```bash
npm test --prefix src/backend
# 45 passed out of 45 tests across 4 suites (85.32% line coverage)
```

### AI Service Test Suite (Pytest)
```bash
PYTHONPATH=src/ai_service src/ai_service/.venv/bin/pytest src/ai_service/tests/ -v
# 10 passed, 2 skipped (live tests cleanly skip when mock credentials are set)
```

### Frontend Build Verification
```bash
npm run build --prefix src/frontend
# 152 modules transformed cleanly with zero errors
```

---

## System Documentation Index
All formal system engineering documentation is maintained in the [`docs/`](docs/) directory:

1. [01_project_charter.md](docs/01_project_charter.md) — Project Charter & Mandate
2. [02_spmp.md](docs/02_spmp.md) / [SPMP.md](docs/SPMP.md) — Software Project Management Plan
3. [03_srs.md](docs/03_srs.md) / [SRS.md](docs/SRS.md) — Software Requirements Specification
4. [04_functional_requirements.md](docs/04_functional_requirements.md) — Functional Requirements Document
5. [05_non_functional_requirements.md](docs/05_non_functional_requirements.md) — Non-Functional Requirements Document
6. [06_work_breakdown_structure.md](docs/06_work_breakdown_structure.md) — Work Breakdown Structure (WBS)
7. [07_project_schedule_and_milestones.md](docs/07_project_schedule_and_milestones.md) — Schedule and Milestones
8. [08_risk_management_plan.md](docs/08_risk_management_plan.md) — Risk Management Plan & Register
9. [09_software_architecture.md](docs/09_software_architecture.md) / [Architecture.md](docs/Architecture.md) — Software Architecture Document
10. [10_system_design.md](docs/10_system_design.md) — System Design Document (SDD)
11. [11_data_flow_diagrams.md](docs/11_data_flow_diagrams.md) / [DFD.md](docs/DFD.md) — Data Flow Diagrams (Level 0, 1, 2)
12. [12_uml_use_case_diagram.md](docs/12_uml_use_case_diagram.md) / [UseCases.md](docs/UseCases.md) — UML Use Case Diagram and Specs
13. [13_uml_class_diagram.md](docs/13_uml_class_diagram.md) / [ClassModel.md](docs/ClassModel.md) — UML Class Diagram and Data Models
14. [14_uml_sequence_diagrams.md](docs/14_uml_sequence_diagrams.md) — UML Sequence Diagrams
15. [15_uml_activity_diagrams.md](docs/15_uml_activity_diagrams.md) — UML Activity Diagrams
16. [16_database_design.md](docs/16_database_design.md) — Database Design Document (MongoDB Schemas)
17. [17_api_design_openapi.md](docs/17_api_design_openapi.md) & [openapi.yaml](docs/openapi.yaml) — API Design and OpenAPI 3.0 Specs
18. [18_ai_architecture_and_prompt_design.md](docs/18_ai_architecture_and_prompt_design.md) / [AI_Design.md](docs/AI_Design.md) / [AI_Prompts.md](docs/AI_Prompts.md) / [AI_Schema.json](docs/AI_Schema.json) — AI Design & Prompts
19. [19_security_and_privacy_design.md](docs/19_security_and_privacy_design.md) — Security, Privacy & Threat Model
20. [20_test_strategy_and_test_plan.md](docs/20_test_strategy_and_test_plan.md) / [TestPlan.md](docs/TestPlan.md) — Test Strategy and Test Plan
21. [21_requirements_traceability_matrix.md](docs/21_requirements_traceability_matrix.md) / [RTM.md](docs/RTM.md) — Requirements Traceability Matrix
22. [22_deployment_and_configuration.md](docs/22_deployment_and_configuration.md) / [Deployment.md](docs/Deployment.md) / [CI_CD.md](docs/CI_CD.md) — Deployment & CI/CD Guide
23. [23_maintenance_plan.md](docs/23_maintenance_plan.md) — Maintenance & Model Migration Plan
24. [24_user_manual.md](docs/24_user_manual.md) / [UserManual.md](docs/UserManual.md) — End-User Operations Manual
25. [25_developer_setup_guide.md](docs/25_developer_setup_guide.md) / [DevSetup.md](docs/DevSetup.md) — Developer Setup Guide
- [Wireframes.md](docs/Wireframes.md) — UI/UX Wireframes & Component Design

---

## Permanent Project Rules
1. **Zero Emojis in UI**: In accordance with user rules, under no circumstances should emojis be used in any UI screens, notifications, buttons, or generated client outputs. Clean geometric SVGs and standard alphanumeric indicators are used exclusively.
2. **Mandatory Legal Disclaimer**: Every summary, procedural flowchart, timeline, and conversational answer explicitly states:
   > *"NyayaSetu provides informational assistance only and does not constitute formal legal counsel."*
3. **Tenant Isolation**: Documents, extracted passages, analyses, and chat histories are strictly isolated to authenticated user accounts.
