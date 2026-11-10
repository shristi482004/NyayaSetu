import logging
from fastapi import APIRouter, Header, HTTPException, status
from typing import Optional
from schemas.extraction import ExtractionRequest, ExtractionResponse
from services.extractor import extractor_service
from config import settings

logger = logging.getLogger("nyayasetu.ai.router.extraction")
router = APIRouter(tags=["Document Extraction"])

def verify_internal_auth(x_internal_key: Optional[str] = Header(None)):
    """Verifies that requests originate from the internal backend API gateway."""
    if settings.AI_ENV != "production" and not settings.AI_INTERNAL_API_KEY:
        return
    if x_internal_key != settings.AI_INTERNAL_API_KEY:
        logger.warning("Unauthorized call to internal AI extraction endpoint.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing internal service key."
        )

@router.post("/extract", response_model=ExtractionResponse)
async def extract_document_text(
    request: ExtractionRequest,
    x_internal_key: Optional[str] = Header(None)
):
    """
    Extracts text page-by-page from an uploaded PDF file on the shared filesystem.
    Triggers OCR fallback automatically for low-density/scanned pages.
    """
    verify_internal_auth(x_internal_key)

    try:
        total_pages, chunks = extractor_service.extract_from_file(
            file_path=request.file_path,
            force_ocr=request.force_ocr
        )
        return ExtractionResponse(
            success=True,
            document_id=request.document_id,
            total_pages=total_pages,
            chunks=chunks,
            message=f"Successfully extracted {total_pages} pages."
        )
    except FileNotFoundError as fnf:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(fnf))
    except Exception as e:
        logger.error(f"Extraction error for document {request.document_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Extraction pipeline failure: {str(e)}"
        )

