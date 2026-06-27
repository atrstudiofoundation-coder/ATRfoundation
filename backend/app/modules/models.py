import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Boolean, DateTime, Integer, ForeignKey, Uuid
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base

class LearningPath(Base):
    __tablename__ = "learning_paths"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationships
    modules: Mapped[List["Module"]] = relationship(
        "Module", back_populates="learning_path", cascade="all, delete-orphan"
    )


class ModuleResource(Base):
    __tablename__ = "module_resources"

    module_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("modules.id", ondelete="CASCADE"), primary_key=True
    )
    resource_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("resources.id", ondelete="CASCADE"), primary_key=True
    )
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Relationships
    module: Mapped["Module"] = relationship("Module", back_populates="module_resources_assoc")
    resource: Mapped["Resource"] = relationship("Resource", back_populates="module_resources_assoc")


class Module(Base):
    __tablename__ = "modules"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    learning_path_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("learning_paths.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    estimated_duration_minutes: Mapped[int] = mapped_column(Integer, nullable=False)
    passing_percentage: Mapped[int] = mapped_column(Integer, nullable=False)
    display_order: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationships
    learning_path: Mapped[LearningPath] = relationship("LearningPath", back_populates="modules")
    
    # Many-to-many relationship with Resource through association model
    module_resources_assoc: Mapped[List[ModuleResource]] = relationship(
        "ModuleResource", back_populates="module", cascade="all, delete-orphan"
    )
    
    # 1-to-1 relationship with Assessment
    assessment: Mapped[Optional["Assessment"]] = relationship(
        "Assessment", back_populates="module", uselist=False, cascade="all, delete-orphan"
    )
    
    # Progress records
    progress_records: Mapped[List["ModuleProgress"]] = relationship(
        "ModuleProgress", back_populates="module", cascade="all, delete-orphan"
    )


class ModuleProgress(Base):
    __tablename__ = "module_progress"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    module_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("modules.id", ondelete="CASCADE"), nullable=False
    )
    progress_percentage: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    status: Mapped[str] = mapped_column(String, default="not_started", nullable=False)  # 'not_started', 'in_progress', 'completed'
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    completed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="module_progress")
    module: Mapped[Module] = relationship("Module", back_populates="progress_records")
