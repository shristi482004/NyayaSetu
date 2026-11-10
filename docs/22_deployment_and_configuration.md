# Deployment and Configuration Document — NyayaSetu

## 1. Overview and Infrastructure Strategy
**NyayaSetu** is designed for modern containerized cloud deployment. The architecture operates across two decoupled containers:
1. `backend-service`: Node.js LTS container serving Express API gateway on port 5000.
2. `ai-service`: Python 3.11+ slim container serving FastAPI AI microservice on port 8000.
3. `database`: MongoDB Atlas Managed Cluster (Free Tier) or local MongoDB 7.0 container.

Target deployment hosts include Render.com (Web Services free tier) or Google Cloud Run (Serverless container runtime).

## 2. Environment Variables Configuration

### 2.1 Backend API Gateway (`src/backend/.env`)
```bash
# Server Configuration
PORT=5000
NODE_ENV=development
API_PREFIX=/api

# Database Connectivity
MONGODB_URI=mongodb://localhost:27017/nyayasetu
# Or MongoDB Atlas: mongodb+srv://<user>:<password>@cluster0.mongodb.net/nyayasetu?retryWrites=true&w=majority

# Authentication Secrets
JWT_SECRET=replace_with_a_secure_random_sha256_secret_key_minimum_32_characters
JWT_EXPIRES_IN=24h

# Internal AI Microservice Endpoint
AI_SERVICE_URL=http://localhost:8000
AI_INTERNAL_API_KEY=replace_with_internal_microservice_shared_secret

# Upload Configuration
MAX_FILE_SIZE_BYTES=26214400
UPLOAD_DIR=./uploads

# CORS Allowed Origins
CORS_ORIGIN=http://localhost:3000
```

### 2.2 Python AI Microservice (`src/ai_service/.env`)
```bash
# Server Configuration
AI_PORT=8000
AI_ENV=development

# Google Gemini API Credentials
GEMINI_API_KEY=AIzaSyYourActualGoogleGeminiApiKeyHere
GEMINI_MODEL=gemini-2.0-flash

# Shared Internal Secret for Authentication
AI_INTERNAL_API_KEY=replace_with_internal_microservice_shared_secret

# OCR Configuration
TESSERACT_CMD=/usr/bin/tesseract
OCR_MIN_CHAR_THRESHOLD=50
```

## 3. Containerization Architecture

### 3.1 Backend Dockerfile (`src/backend/Dockerfile`)
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm prune --production

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./
EXPOSE 5000
USER node
CMD ["node", "src/server.js"]
```

### 3.2 AI Service Dockerfile (`src/ai_service/Dockerfile`)
```dockerfile
FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 3.3 Multi-Container Orchestration (`docker-compose.yml`)
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    container_name: nyayasetu-mongodb
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    networks:
      - nyayasetu-network

  ai-service:
    build:
      context: ./src/ai_service
      dockerfile: Dockerfile
    container_name: nyayasetu-ai-service
    restart: on-failure
    environment:
      - AI_PORT=8000
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - GEMINI_MODEL=gemini-2.0-flash
      - AI_INTERNAL_API_KEY=${AI_INTERNAL_API_KEY}
    ports:
      - "8000:8000"
    networks:
      - nyayasetu-network

  backend:
    build:
      context: ./src/backend
      dockerfile: Dockerfile
    container_name: nyayasetu-backend
    restart: on-failure
    depends_on:
      - mongodb
      - ai-service
    environment:
      - PORT=5000
      - MONGODB_URI=mongodb://mongodb:27017/nyayasetu
      - JWT_SECRET=${JWT_SECRET}
      - AI_SERVICE_URL=http://ai-service:8000
      - AI_INTERNAL_API_KEY=${AI_INTERNAL_API_KEY}
    ports:
      - "5000:5000"
    networks:
      - nyayasetu-network

networks:
  nyayasetu-network:
    driver: bridge

volumes:
  mongo_data:
```

## 4. Continuous Integration / Continuous Deployment (CI/CD)
Automated GitHub Actions pipelines execute on each push and pull request:
1. **Linting & Code Quality:** ESLint on Node.js; Ruff/Flake8 on Python.
2. **Automated Unit & Integration Tests:**
   - Run Jest tests using in-memory Mongo test cluster.
   - Run Pytest with Gemini mock fixtures.
3. **Build Verification:** Multi-stage Docker image builds.
4. **Staging / Production Deployment:** Render auto-deploy hook triggered on successful merge to `main`.

