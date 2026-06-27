import io
import docx
from app.quiz_import.extractors.base import BaseExtractor

class DocxExtractor(BaseExtractor):
    def extract(self, file_content: bytes) -> str:
        """
        Extract text from a DOCX file using python-docx.
        """
        doc = docx.Document(io.BytesIO(file_content))
        text_list = []
        for paragraph in doc.paragraphs:
            text_list.append(paragraph.text)
        return "\n".join(text_list)
