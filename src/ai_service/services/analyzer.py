import logging
from typing import Dict, Any
from schemas.analysis import DocumentAnalysisResponse
from services.prompts import prompt_manager
from services.gemini_client import gemini_client

logger = logging.getLogger("nyayasetu.ai.analyzer")

class DocumentAnalyzer:
    def analyze_document(self, document_id: str, document_text: str) -> DocumentAnalysisResponse:
        """
        Executes end-to-end legal intelligence extraction:
        1. Formats prompt with strict system instructions and untrusted text fencing.
        2. Invokes Gemini API via gemini_client.
        3. Validates and enforces schema via Pydantic v2.
        """
        logger.info(f"Analyzing document {document_id} ({len(document_text)} characters)...")

        prompt = prompt_manager.build_analysis_prompt(document_text)
        raw_json = gemini_client.generate_json_response(prompt)

        # Ensure document_id is injected into response payload
        raw_json["document_id"] = document_id
        if "success" not in raw_json:
            raw_json["success"] = True

        # Validate with Pydantic
        validated_response = DocumentAnalysisResponse.model_validate(raw_json)
        logger.info(f"Document {document_id} successfully analyzed and validated with Pydantic.")
        return validated_response

analyzer_service = DocumentAnalyzer()

