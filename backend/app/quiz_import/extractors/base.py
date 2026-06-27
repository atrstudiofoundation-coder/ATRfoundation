from abc import ABC, abstractmethod

class BaseExtractor(ABC):
    @abstractmethod
    def extract(self, file_content: bytes) -> str:
        """
        Extract plain text from the raw binary file content.
        """
        pass
