import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict

# Assessment Schemas
class AssessmentBase(BaseModel):
    module_id: uuid.UUID
    title: str
    passing_marks: int
    max_attempts: int

class AssessmentCreate(AssessmentBase):
    pass

class AssessmentUpdate(BaseModel):
    module_id: Optional[uuid.UUID] = None
    title: Optional[str] = None
    passing_marks: Optional[int] = None
    max_attempts: Optional[int] = None

class AssessmentRead(AssessmentBase):
    id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Question Schemas
class QuestionBase(BaseModel):
    assessment_id: uuid.UUID
    question: str
    options: List[str]  # JSONB array of strings
    answer: List[int]   # JSONB array of integers (e.g. [0] or [0,2])
    question_type: str
    topic: Optional[str] = None
    difficulty: Optional[str] = None
    marks: int = 1
    explanation: Optional[str] = None
    display_order: int

class QuestionCreate(QuestionBase):
    pass

class QuestionUpdate(BaseModel):
    assessment_id: Optional[uuid.UUID] = None
    question: Optional[str] = None
    options: Optional[List[str]] = None
    answer: Optional[List[int]] = None
    question_type: Optional[str] = None
    topic: Optional[str] = None
    difficulty: Optional[str] = None
    marks: Optional[int] = None
    explanation: Optional[str] = None
    display_order: Optional[int] = None

class QuestionRead(QuestionBase):
    id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class QuestionReorderRequest(BaseModel):
    question_ids: List[uuid.UUID]


# Attempt Schemas
class AttemptBase(BaseModel):
    assessment_id: uuid.UUID
    user_id: uuid.UUID
    attempt_number: int
    score: int
    percentage: float

class AttemptCreate(AttemptBase):
    started_at: Optional[datetime] = None
    submitted_at: Optional[datetime] = None

class AttemptUpdate(BaseModel):
    score: Optional[int] = None
    percentage: Optional[float] = None
    submitted_at: Optional[datetime] = None

class AttemptRead(AttemptBase):
    id: uuid.UUID
    started_at: datetime
    submitted_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# Answer Schemas
class AnswerBase(BaseModel):
    attempt_id: uuid.UUID
    question_id: uuid.UUID
    selected_answer: List[int]  # JSONB array of indices (e.g. [0] or [0, 2])
    awarded_marks: int

class AnswerCreate(AnswerBase):
    pass

class AnswerUpdate(BaseModel):
    selected_answer: Optional[List[int]] = None
    awarded_marks: Optional[int] = None

class AnswerRead(AnswerBase):
    id: uuid.UUID

    model_config = ConfigDict(from_attributes=True)


# Route Compatibility Schemas (Pydantic v2 compatible)
class AssessmentSubmitRequest(BaseModel):
    answers: Dict[str, List[int]]  # Maps question ID (string format) to list of selected option indices

class AssessmentAttemptRead(BaseModel):
    id: uuid.UUID
    assessment_id: uuid.UUID
    user_id: uuid.UUID
    attempt_number: int
    score: int
    percentage: float
    status: str  # 'pass' or 'fail'
    started_at: datetime
    submitted_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

