import os
import shutil
import logging
from PIL import Image
import pytesseract
from config import settings

logger = logging.getLogger("nyayasetu.ai.ocr")

class OCRService:
    def __init__(self):
        self.tesseract_cmd = settings.TESSERACT_CMD
        self.is_available = self._check_availability()

    def _check_availability(self) -> bool:
        """Check if tesseract binary is accessible in system PATH or common install locations."""
        resolved = shutil.which(self.tesseract_cmd)
        if not resolved:
            common_paths = [
                "/opt/homebrew/bin/tesseract",
                "/usr/local/bin/tesseract",
                "/usr/bin/tesseract"
            ]
            for p in common_paths:
                if os.path.exists(p):
                    resolved = p
                    break

        if resolved:
            pytesseract.pytesseract.tesseract_cmd = resolved
            logger.info(f"Tesseract OCR available at: {resolved}")
            return True
        logger.warning(
            "Tesseract OCR binary not found in system PATH. "
            "Scanned PDFs will rely on raw image fallback extraction."
        )
        return False

    def extract_text_from_image(self, image: Image.Image) -> str:
        """Extract text from a PIL Image using Tesseract OCR if available."""
        if not self.is_available:
            logger.warning("OCR requested but Tesseract is not installed on this system.")
            return "[OCR_UNAVAILABLE_SCANNED_PAGE]"

        try:
            text = pytesseract.image_to_string(image, lang="eng")
            return text.strip()
        except Exception as e:
            logger.error(f"Tesseract OCR failed during image processing: {str(e)}")
            return ""

ocr_service = OCRService()

