import os
import fitz  # PyMuPDF
import io
import logging
from PIL import Image
from typing import List, Tuple
from schemas.extraction import PageChunk
from services.ocr import ocr_service
from config import settings

logger = logging.getLogger("nyayasetu.ai.extractor")

class DocumentExtractor:
    def __init__(self, min_char_threshold: int = settings.OCR_MIN_CHAR_THRESHOLD):
        self.min_char_threshold = min_char_threshold

    def extract_from_file(self, file_path: str, force_ocr: bool = False) -> Tuple[int, List[PageChunk]]:
        """
        Extract text from a PDF file page-by-page.
        If character count on a page is below threshold (scanned page) or force_ocr is True,
        rasterizes the page and triggers Tesseract OCR fallback.
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"PDF file not found at path: {file_path}")

        doc = fitz.open(file_path)
        total_pages = len(doc)
        chunks: List[PageChunk] = []

        logger.info(f"Extracting {total_pages} pages from '{file_path}' (force_ocr={force_ocr})")

        for page_idx in range(total_pages):
            page_num = page_idx + 1
            page = doc[page_idx]

            extracted_text = ""
            is_ocr = False

            if not force_ocr:
                # Fast digital text extraction via PyMuPDF
                extracted_text = page.get_text("text").strip()

            char_count = len(extracted_text)

            # Check if page looks like a scan (insufficient character count)
            if force_ocr or char_count < self.min_char_threshold:
                logger.info(f"Page {page_num} yield ({char_count} chars) below threshold. Triggering OCR fallback.")
                pix = page.get_pixmap(dpi=200)
                img_data = pix.tobytes("png")
                pil_img = Image.open(io.BytesIO(img_data))

                ocr_text = ocr_service.extract_text_from_image(pil_img)
                if ocr_text:
                    extracted_text = ocr_text
                    is_ocr = True
                    char_count = len(extracted_text)

            # Clean and normalize text
            cleaned_text = self._normalize_text(extracted_text)

            chunk = PageChunk(
                page_number=page_num,
                chunk_index=page_idx,
                text_content=cleaned_text,
                char_count=len(cleaned_text),
                is_ocr_applied=is_ocr
            )
            chunks.append(chunk)

        doc.close()
        return total_pages, chunks

    def _normalize_text(self, text: str) -> str:
        """Sanitize text, remove zero-width chars, and normalize excessive whitespace."""
        if not text:
            return ""
        # Remove null bytes and zero-width spaces
        text = text.replace("\x00", "").replace("\u200b", "").replace("\ufeff", "")
        # Normalize multiple blank lines to double newlines
        lines = [line.strip() for line in text.splitlines()]
        return "\n".join(lines).strip()

extractor_service = DocumentExtractor()

