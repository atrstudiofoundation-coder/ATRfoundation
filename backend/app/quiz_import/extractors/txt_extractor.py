from app.quiz_import.extractors.base import BaseExtractor

class TxtExtractor(BaseExtractor):
    def extract(self, file_content: bytes) -> str:
        """
        Extract text from a plain TXT file by decoding it.
        """
        return file_content.decode("utf-8", errors="replace")
