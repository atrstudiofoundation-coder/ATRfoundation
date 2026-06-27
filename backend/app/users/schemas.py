import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str  # 'Admin' or 'Employee'
    google_id: Optional[str] = None
    profile_picture: Optional[str] = None

class UserCreate(UserBase):
    pass  # No password fields required per database specs

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None
    profile_picture: Optional[str] = None
    is_active: Optional[bool] = None

class UserRead(UserBase):
    id: uuid.UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
