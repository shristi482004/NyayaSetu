import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from config import settings
from routers import extraction, analysis, chat, health

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [%(name)s]: %(message)s"
)
logger = logging.getLogger("nyayasetu.ai.main")

app = FastAPI(
    title="NyayaSetu AI Microservice",
    description="Document Extraction, OCR, and Google Gemini Legal Intelligence Processing Service",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration (restrict to localhost and backend gateway)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://127.0.0.1:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global unhandled exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.method} {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal AI Service Error",
            "message": str(exc),
            "disclaimer": "NyayaSetu provides informational assistance only and does not constitute formal legal counsel."
        }
    )

# Include routers
app.include_router(health.router)
app.include_router(extraction.router)
app.include_router(analysis.router)
app.include_router(chat.router)

@app.get("/")
async def root():
    return {
        "service": "NyayaSetu AI Processing Microservice",
        "version": "1.0.0",
        "status": "online",
        "documentation": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=settings.AI_PORT, reload=True)

