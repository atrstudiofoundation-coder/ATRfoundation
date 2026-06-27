import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, DateTime, Uuid
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base

class Resource(Base):
    __tablename__ = "resources"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    resource_type: Mapped[str] = mapped_column(String, nullable=False)  # e.g., 'pdf', 'dwg', 'video', 'link'
    resource_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    uploaded_file_path: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationships
    # Association proxy support or direct many-to-many intermediate model relationship
    module_resources_assoc: Mapped[List["ModuleResource"]] = relationship(
        "ModuleResource", back_populates="resource", cascade="all, delete-orphan"
    )
