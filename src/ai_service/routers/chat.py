import logging
from fastapi import APIRouter, Header, HTTPException, status
from typing import Optional
from schemas.chat import ChatRequest, ChatResponse
from services.chat_service import chat_service
from config import settings

logger = logging.getLogger("nyayasetu.ai.router.chat")
router = APIRouter(tags=["Document Grounded Chat"])

def verify_internal_auth(x_internal_key: Optional[str] = Header(None)):
    if settings.AI_ENV != "production" and not settings.AI_INTERNAL_API_KEY:
        return
    if x_internal_key != settings.AI_INTERNAL_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing internal service key."
        )

@router.post("/chat", response_model=ChatResponse)
async def chat_with_document(
    request: ChatRequest,
    x_internal_key: Optional[str] = Header(None)
):
    """
    Answers natural language questions about a document using grounded Gemini prompts.
    Returns direct answers, cited page numbers, and uncertainty indicators.
    """
    verify_internal_auth(x_internal_key)

    try:
        response = chat_service.answer_question(request)
        return response
    except Exception as e:
        logger.error(f"Chat error for document {request.document_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat pipeline error: {str(e)}"
        )

