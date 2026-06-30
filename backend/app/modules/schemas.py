import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

from app.resources.schemas import ResourceRead
from app.assessments.schemas import AssessmentRead

# Module Schemas
class ModuleBase(BaseModel):
    learning_path_id: uuid.UUID
    title: str
    description: Optional[str] = None
    estimated_duration_minutes: int
    passing_percentage: int

class ModuleCreate(ModuleBase):
    display_order: Optional[int] = None

class ModuleUpdate(BaseModel):
    learning_path_id: Optional[uuid.UUID] = None
    title: Optional[str] = None
    description: Optional[str] = None
    estimated_duration_minutes: Optional[int] = None
    passing_percentage: Optional[int] = None
    display_order: Optional[int] = None

class ModuleRead(ModuleBase):
    id: uuid.UUID
    display_order: int
    resources: List[ResourceRead] = []
    assessment: Optional[AssessmentRead] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ModuleResource association schemas
class ModuleResourceBase(BaseModel):
    module_id: uuid.UUID
    resource_id: uuid.UUID
    display_order: int

class ModuleResourceCreate(ModuleResourceBase):
    pass

class ModuleResourceRead(ModuleResourceBase):
    model_config = ConfigDict(from_attributes=True)


# LearningPath Schemas
class LearningPathBase(BaseModel):
    title: str
    description: Optional[str] = None
    is_active: bool = True

class LearningPathCreate(LearningPathBase):
    pass

class LearningPathUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class LearningPathRead(LearningPathBase):
    id: uuid.UUID
    modules: List[ModuleRead] = []
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ModuleProgress Schemas
class ModuleProgressBase(BaseModel):
    user_id: uuid.UUID
    module_id: uuid.UUID
    progress_percentage: int = 0
    status: str = "not_started"  # 'not_started', 'in_progress', 'completed'

class ModuleProgressCreate(ModuleProgressBase):
    pass

class ModuleProgressUpdate(BaseModel):
    progress_percentage: Optional[int] = None
    status: Optional[str] = None
    completed_at: Optional[datetime] = None

class ModuleProgressRead(ModuleProgressBase):
    id: uuid.UUID
    started_at: datetime
    completed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
