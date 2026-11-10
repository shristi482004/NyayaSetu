# Developer Setup Guide — NyayaSetu

## 1. Prerequisites and System Requirements
To build and run **NyayaSetu** locally, ensure your development machine has the following installed:
- **Node.js:** v18.0.0 or higher (v20+ recommended)
- **npm:** v9.0.0 or higher
- **Python:** v3.11 or higher
- **MongoDB:** v6.0 or higher (local `mongod` instance or MongoDB Atlas connection URI)
- **Tesseract OCR (Optional for scanned PDF fallback):**
  - macOS: `brew install tesseract`
  - Ubuntu/Debian: `sudo apt-get install tesseract-ocr`
  - Windows: Install via official installer and add to system `PATH`
- **Docker & Docker Compose (Optional):** For containerized local execution

## 2. Repository Layout
```
NyayaSetu/
├── AGENTS.md                          # Permanent project guidelines for coding agents
├── README.md                          # Repository overview
├── docker-compose.yml                 # Multi-container orchestration
├── docs/                              # 25 System architecture and requirements docs
│   ├── 01_project_charter.md
│   ├── 02_spmp.md
│   ├── 03_srs.md
│   ├── ...
│   └── 25_developer_setup_guide.md
├── src/
│   ├── backend/                       # Node.js + Express API Gateway
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── server.js
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   ├── middleware/
│   │   │   └── services/
│   │   └── tests/
│   └── ai_service/                    # Python + FastAPI AI Microservice
│       ├── requirements.txt
│       ├── main.py
│       ├── schemas/
│       ├── services/
│       └── tests/
└── tests/                             # Root end-to-end and shared fixtures
```

## 3. Node.js Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd src/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create `.env` inside `src/backend/`:
   ```bash
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/nyayasetu
   JWT_SECRET=super_secret_jwt_key_for_development_purposes_only
   JWT_EXPIRES_IN=24h
   AI_SERVICE_URL=http://localhost:8000
   AI_INTERNAL_API_KEY=internal_secret_development_token
   MAX_FILE_SIZE_BYTES=26214400
   UPLOAD_DIR=./uploads
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Run the backend in development mode:**
   ```bash
   npm run dev
   # Server runs on http://localhost:5000
   ```

5. **Execute backend test suite:**
   ```bash
   npm test
   ```

## 4. Python AI Microservice Setup

1. **Navigate to AI service directory:**
   ```bash
   cd src/ai_service
   ```

2. **Create and activate virtual environment:**
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   Create `.env` inside `src/ai_service/`:
   ```bash
   AI_PORT=8000
   AI_ENV=development
   GEMINI_API_KEY=your_actual_google_gemini_api_key
   GEMINI_MODEL=gemini-2.0-flash
   AI_INTERNAL_API_KEY=internal_secret_development_token
   OCR_MIN_CHAR_THRESHOLD=50
   ```

5. **Start the FastAPI microservice:**
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   # AI service runs on http://localhost:8000 (Swagger docs at /docs)
   ```

6. **Execute AI service test suite:**
   ```bash
   pytest
   ```

## 5. Dockerized Execution (All Services)
To start MongoDB, the AI Service, and the Backend Gateway simultaneously using Docker:
```bash
docker-compose up --build
```
The services will be reachable at:
- Backend API: `http://localhost:5000/api`
- AI Microservice: `http://localhost:8000`
- MongoDB: `localhost:27017`

## 6. Common Troubleshooting Tips
- **MongoDB Connection Refused:** Verify that the `mongod` service is running locally (`brew services start mongodb-community` on macOS) or verify your MongoDB Atlas connection string.
- **Tesseract Not Found Warning:** If Tesseract is not installed, the AI microservice will gracefully warn and process digital PDFs with PyMuPDF. For scanned PDF support, install Tesseract via your system package manager.
- **Gemini Quota Exceeded (HTTP 429):** Ensure your Gemini API key is active. In tests, the mock adapter bypasses external API calls.

