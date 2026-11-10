import logging
from fastapi import APIRouter, Header, HTTPException, status
from typing import Optional
from schemas.analysis import AnalysisRequest, DocumentAnalysisResponse
from services.analyzer import analyzer_service
from config import settings

logger = logging.getLogger("nyayasetu.ai.router.analysis")
router = APIRouter(tags=["AI Legal Analysis"])

def verify_internal_auth(x_internal_key: Optional[str] = Header(None)):
    if settings.AI_ENV != "production" and not settings.AI_INTERNAL_API_KEY:
        return
    if x_internal_key != settings.AI_INTERNAL_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing internal service key."
        )

@router.post("/analyze", response_model=DocumentAnalysisResponse)
async def analyze_legal_document(
    request: AnalysisRequest,
    x_internal_key: Optional[str] = Header(None)
):
    """
    Invokes Gemini with constrained prompting to generate structured summaries,
    FAQs, flowchart nodes, timelines, action items, and argument maps.
    """
    verify_internal_auth(x_internal_key)

    try:
        result = analyzer_service.analyze_document(
            document_id=request.document_id,
            document_text=request.document_text
        )
        return result
    except Exception as e:
        logger.error(f"Analysis error for document {request.document_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI analysis pipeline error: {str(e)}"
        )

