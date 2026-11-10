import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from ai_service directory if present
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

class Settings:
    AI_PORT: int = int(os.getenv("AI_PORT", "8000"))
    AI_ENV: str = os.getenv("AI_ENV", "development")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
    AI_INTERNAL_API_KEY: str = os.getenv("AI_INTERNAL_API_KEY", "internal_secret_development_token")
    OCR_MIN_CHAR_THRESHOLD: int = int(os.getenv("OCR_MIN_CHAR_THRESHOLD", "50"))
    TESSERACT_CMD: str = os.getenv("TESSERACT_CMD", "tesseract")
    MOCK_GEMINI_IN_DEV: bool = os.getenv("MOCK_GEMINI_IN_DEV", "false").lower() in ("true", "1", "yes")

settings = Settings()

