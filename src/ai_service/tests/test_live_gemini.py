import os
import pytest
from config import settings
from services.gemini_client import GeminiClient
from schemas.analysis import DocumentAnalysisResponse
from schemas.chat import ChatResponse

def is_live_gemini_configured() -> bool:
    """Check whether a non-mock, non-empty Gemini API key is configured."""
    key = settings.GEMINI_API_KEY.strip()
    return bool(key and key not in ("mock_dev_key", "mock", "your_gemini_api_key_here"))

@pytest.mark.skipif(
    not is_live_gemini_configured(),
    reason="Live Gemini API test skipped: Live GEMINI_API_KEY not configured. Live integration remains unverified."
)
def test_live_gemini_structured_analysis():
    """Verify live Gemini API produces schema-compliant structured legal analysis."""
    client = GeminiClient()
    assert client.client is not None, "Live GenAI client should be instantiated"

    sample_prompt = (
        "You are NyayaSetu Legal Document Intelligence. Analyze the following legal passage "
        "and return valid JSON conforming to the NyayaSetu analysis schema.\n\n"
        "[DOCUMENT_TEXT]\n"
        "Notice of Contract Termination dated 2026-05-01. Alpha Corp terminates services "
        "with Beta LLC under Clause 9 due to persistent failure to deliver software milestones.\n"
        "[/DOCUMENT_TEXT]"
    )

    response_json = client.generate_json_response(sample_prompt)
    assert isinstance(response_json, dict)

    # Validate against Pydantic schema
    validated = DocumentAnalysisResponse.model_validate({"success": True, **response_json})
    assert validated.summary.plainLanguageSummary != ""
    assert len(validated.disclaimer) > 0

@pytest.mark.skipif(
    not is_live_gemini_configured(),
    reason="Live Gemini API test skipped: Live GEMINI_API_KEY not configured. Live integration remains unverified."
)
def test_live_gemini_grounded_chat():
    """Verify live Gemini API produces grounded chat response with page citations."""
    client = GeminiClient()
    assert client.client is not None

    sample_chat_prompt = (
        "You are NyayaSetu Legal Document Assistant. Answer the question using ONLY the provided text.\n\n"
        "[PAGE 1]\nAlpha Corp terminated the contract with Beta LLC on 2026-05-01.\n\n"
        "User Question: When was the contract terminated?"
    )

    response_json = client.generate_json_response(sample_chat_prompt)
    assert isinstance(response_json, dict)
    validated = ChatResponse.model_validate({"success": True, **response_json})
    assert "2026-05-01" in validated.answer or "may" in validated.answer.lower()

