from pydantic import BaseModel, Field
from typing import List, Optional

class ExtractionRequest(BaseModel):
    file_path: str = Field(..., description="Absolute path to the target PDF file on server")
    document_id: str = Field(..., description="Unique MongoDB Document ObjectId string")
    force_ocr: bool = Field(False, description="Whether to bypass digital extraction and force OCR")

class PageChunk(BaseModel):
    page_number: int = Field(..., description="Source PDF page number (1-indexed)")
    chunk_index: int = Field(..., description="Sequential index within the document")
    text_content: str = Field(..., description="Extracted clean text for this page")
    char_count: int = Field(..., description="Character count of extracted content")
    is_ocr_applied: bool = Field(False, description="True if extracted via OCR fallback")

class ExtractionResponse(BaseModel):
    success: bool
    document_id: str
    total_pages: int
    chunks: List[PageChunk]
    message: str
    error: Optional[str] = None

