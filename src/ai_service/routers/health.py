from fastapi import APIRouter
from config import settings
from services.ocr import ocr_service
from services.gemini_client import gemini_client

router = APIRouter(tags=["Health & Diagnostics"])

@router.get("/health")
async def health_check():
    """Returns operational status of the AI microservice."""
    return {
        "status": "healthy",
        "service": "nyayasetu-ai-service",
        "environment": settings.AI_ENV,
        "ocr_available": ocr_service.is_available,
        "gemini_mode": "mock" if gemini_client.is_mock_mode else "live",
        "gemini_model": settings.GEMINI_MODEL
    }

