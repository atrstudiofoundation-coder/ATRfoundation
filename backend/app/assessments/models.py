import uuid
from datetime import datetime
from typing import List, Optional, Any
from sqlalchemy import String, Integer, Float, ForeignKey, DateTime, Uuid
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base

class Assessment(Base):
    __tablename__ = "assessments"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    module_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("modules.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    title: Mapped[str] = mapped_column(String, nullable=False)
    passing_marks: Mapped[int] = mapped_column(Integer, nullable=False)
    max_attempts: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationships
    module: Mapped["Module"] = relationship("Module", back_populates="assessment")
    questions: Mapped[List["Question"]] = relationship(
        "Question", back_populates="assessment", cascade="all, delete-orphan"
    )
    attempts: Mapped[List["Attempt"]] = relationship(
        "Attempt", back_populates="assessment", cascade="all, delete-orphan"
    )

    @property
    def question_count(self) -> int:
        return len(self.questions) if self.questions else 0


class Question(Base):
    __tablename__ = "questions"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    assessment_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False
    )
    question: Mapped[str] = mapped_column(String, nullable=False)
    options: Mapped[Any] = mapped_column(JSONB, nullable=False)  # JSONB array of strings
    answer: Mapped[Any] = mapped_column(JSONB, nullable=False)  # JSONB array of correct option index/indices
    question_type: Mapped[str] = mapped_column(String, nullable=False)  # e.g., 'single_choice', 'multiple_choice'
    topic: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    difficulty: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    marks: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    explanation: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    display_order: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationships
    assessment: Mapped[Assessment] = relationship("Assessment", back_populates="questions")
    answers: Mapped[List["Answer"]] = relationship(
        "Answer", back_populates="question", cascade="all, delete-orphan"
    )


class Attempt(Base):
    __tablename__ = "attempts"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    assessment_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    attempt_number: Mapped[int] = mapped_column(Integer, nullable=False)
    score: Mapped[int] = mapped_column(Integer, nullable=False)
    percentage: Mapped[float] = mapped_column(Float, nullable=False)
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    submitted_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # Relationships
    assessment: Mapped[Assessment] = relationship("Assessment", back_populates="attempts")
    user: Mapped["User"] = relationship("User", back_populates="attempts")
    answers: Mapped[List["Answer"]] = relationship(
        "Answer", back_populates="attempt", cascade="all, delete-orphan"
    )


class Answer(Base):
    __tablename__ = "answers"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    attempt_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("attempts.id", ondelete="CASCADE"), nullable=False
    )
    question_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False
    )
    selected_answer: Mapped[Any] = mapped_column(JSONB, nullable=False)  # JSONB array of indices
    awarded_marks: Mapped[int] = mapped_column(Integer, nullable=False)

    # Relationships
    attempt: Mapped[Attempt] = relationship("Attempt", back_populates="answers")
    question: Mapped[Question] = relationship("Question", back_populates="answers")
