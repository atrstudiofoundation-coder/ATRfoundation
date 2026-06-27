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
    id_token: str

class CurrentUserResponse(BaseModel):
    id: uuid.UUID
    email: EmailStr
    full_name: str
    role: str
    profile_picture: Optional[str] = None
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

class AuthErrorResponse(BaseModel):
    detail: str
    code: Optional[str] = None
