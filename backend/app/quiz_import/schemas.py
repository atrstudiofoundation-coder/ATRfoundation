import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

# ImportError Schemas
class ImportErrorBase(BaseModel):
    import_job_id: uuid.UUID
    error_message: str
    line_number: Optional[int] = None

class ImportErrorCreate(ImportErrorBase):
    pass

class ImportErrorRead(ImportErrorBase):
    id: uuid.UUID

    model_config = ConfigDict(from_attributes=True)


# ImportJob Schemas
class ImportJobBase(BaseModel):
    filename: str
    uploaded_by: Optional[uuid.UUID] = None
    status: str = "pending"  # 'pending', 'processing', 'completed', 'failed'

class ImportJobCreate(ImportJobBase):
    pass

class ImportJobUpdate(BaseModel):
    status: Optional[str] = None
    completed_at: Optional[datetime] = None

class ImportJobRead(ImportJobBase):
    id: uuid.UUID
    uploaded_at: datetime
    completed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

# Quiz Import API Response Schema
class ImportQuizResponse(BaseModel):
    success: bool
    module_id: str
    questions_count: int
    message: str


# Validation and Preview Schemas
class ValidationErrorDetail(BaseModel):
    line: Optional[int] = None
    message: str

class ParsedQuestionPreview(BaseModel):
    question: str
    options: List[str]
    answer: List[int]
    question_type: str
    topic: str
    difficulty: str
    marks: Optional[int] = None
    explanation: str
    display_order: int
    line_number: int

class ImportUploadResponse(BaseModel):
    job_id: uuid.UUID
    filename: str
    questions_parsed: int
    questions_valid: int
    questions_invalid: int
    errors: List[ValidationErrorDetail]
    questions: List[ParsedQuestionPreview]

class ImportCommitResponse(BaseModel):
    imported_count: int
    failed_count: int
    message: Optional[str] = None

class ImportJobStatusResponse(BaseModel):
    id: uuid.UUID
    filename: str
    uploaded_by: Optional[uuid.UUID] = None
    status: str
    uploaded_at: datetime
    completed_at: Optional[datetime] = None
    errors: List[ValidationErrorDetail]

    model_config = ConfigDict(from_attributes=True)
