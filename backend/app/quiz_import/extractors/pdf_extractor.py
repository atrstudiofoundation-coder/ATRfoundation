import io
import pdfplumber
from app.quiz_import.extractors.base import BaseExtractor

class PdfExtractor(BaseExtractor):
    def extract(self, file_content: bytes) -> str:
        """
        Extract text from a PDF file using pdfplumber.
        """
        text_list = []
        with pdfplumber.open(io.BytesIO(file_content)) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    text_list.append(text)
        return "\n".join(text_list)
