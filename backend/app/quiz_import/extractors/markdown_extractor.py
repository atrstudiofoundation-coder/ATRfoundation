from app.quiz_import.extractors.base import BaseExtractor

class MarkdownExtractor(BaseExtractor):
    def extract(self, file_content: bytes) -> str:
        """
        Extract text from a Markdown (.md) file by decoding it.
        """
        return file_content.decode("utf-8", errors="replace")
