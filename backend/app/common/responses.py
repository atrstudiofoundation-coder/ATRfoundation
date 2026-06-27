from typing import Generic, TypeVar, Optional, Any
from pydantic import BaseModel
from app.common.pagination import PaginatedResponse

T = TypeVar("T")

class MessageResponse(BaseModel):
    message: str

class SuccessResponse(BaseModel, Generic[T]):
    success: bool = True
    data: T
    message: Optional[str] = None

class ErrorResponse(BaseModel):
    success: bool = False
    error: str
    detail: Optional[Any] = None
