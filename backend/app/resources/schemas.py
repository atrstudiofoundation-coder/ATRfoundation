import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class ResourceBase(BaseModel):
    title: str
    description: Optional[str] = None
    resource_type: str  # 'pdf', 'dwg', 'video', 'link'
    resource_url: Optional[str] = None
    uploaded_file_path: Optional[str] = None

class ResourceCreate(ResourceBase):
    pass

class ResourceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    resource_type: Optional[str] = None
    resource_url: Optional[str] = None
    uploaded_file_path: Optional[str] = None

class ResourceRead(ResourceBase):
    id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
