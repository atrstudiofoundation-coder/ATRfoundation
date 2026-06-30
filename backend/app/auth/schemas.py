import uuid
from typing import Optional, Any
from pydantic import BaseModel, EmailStr, ConfigDict

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = 604800  # 7 days in seconds

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class GoogleOAuthRequest(BaseModel):
    id_token: Optional[str] = None
    token: Optional[str] = None
    credential: Optional[str] = None

class CurrentUserResponse(BaseModel):
    id: uuid.UUID
    email: EmailStr
    full_name: str
    role: str
    profile_picture: Optional[str] = None
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

class LearningPathSummary(BaseModel):
    id: uuid.UUID
    title: str
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class ProgressSummary(BaseModel):
    completed_modules: int = 0
    total_modules: int = 0
    average_score: float = 0.0
    hours_spent: float = 0.0
    completed_module_ids: list[uuid.UUID] = []
    module_scores: dict[str, float] = {}

class SessionResponse(BaseModel):
    user: CurrentUserResponse
    role: str
    profile: CurrentUserResponse
    assigned_learning_path: Optional[LearningPathSummary] = None
    progress_summary: ProgressSummary

class AuthErrorResponse(BaseModel):
    detail: str
    code: Optional[str] = None

