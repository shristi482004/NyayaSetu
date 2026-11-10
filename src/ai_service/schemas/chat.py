from pydantic import BaseModel, Field
from typing import List, Optional

class ContextChunk(BaseModel):
    page_number: int = Field(..., description="Source PDF page number (1-indexed)")
    text_content: str = Field(..., description="Extracted text from this page")

class ChatTurn(BaseModel):
    role: str = Field(..., description="'user' or 'assistant'")
    content: str = Field(..., description="Message text")

class ChatRequest(BaseModel):
    document_id: str = Field(..., description="MongoDB Document ObjectId")
    question: str = Field(..., description="User's natural language question")
    context_chunks: List[ContextChunk] = Field(..., description="Candidate document passages")
    history: Optional[List[ChatTurn]] = Field(default_factory=list, description="Recent conversation turns")

class ChatResponse(BaseModel):
    success: bool = True
    answer: str = Field(..., description="Direct, grounded factual answer")
    cited_pages: List[int] = Field(default_factory=list, description="Page numbers directly supporting the answer")
    confidence: str = Field("High", description="High, Medium, or Low confidence")
    is_unknown: bool = Field(False, description="True if question cannot be answered from document")
    disclaimer: str = Field(
        "NyayaSetu provides informational assistance only and does not constitute formal legal counsel.",
        description="Mandatory legal disclaimer"
    )

