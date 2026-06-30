from fastapi import HTTPException, status

class EntityNotFoundException(HTTPException):
    def __init__(self, entity_name: str, entity_id: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{entity_name} with id '{entity_id}' was not found."
        )

class EntityAlreadyExistsException(HTTPException):
    def __init__(self, entity_name: str, field_name: str, value: str):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{entity_name} with {field_name} '{value}' already exists."
        )

class InvalidQuizFormatException(HTTPException):
    def __init__(self, reason: str):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=f"Invalid quiz import schema format: {reason}"
        )
