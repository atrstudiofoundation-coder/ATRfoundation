from typing import List, Optional, Tuple
import uuid
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.common.base_repository import BaseRepository
from app.assessments.models import Assessment, Question, Attempt, Answer

class AssessmentRepository(BaseRepository[Assessment]):
    def __init__(self, db: AsyncSession):
        super().__init__(Assessment, db)

    async def get_by_module_id(self, module_id: uuid.UUID) -> Optional[Assessment]:
        """
        Fetch assessment tied 1-to-1 to a module.
        """
        result = await self.db.execute(
            select(Assessment).filter(Assessment.module_id == module_id)
        )
        return result.scalars().first()

    async def list_paginated(
        self, 
        skip: int = 0, 
        limit: int = 20, 
        search: Optional[str] = None
    ) -> Tuple[List[Assessment], int]:
        """
        List assessments with pagination and optional search filter.
        """
        query = select(Assessment)
        count_query = select(func.count()).select_from(Assessment)

        if search:
            search_pattern = f"%{search}%"
            query = query.filter(Assessment.title.ilike(search_pattern))
            count_query = count_query.filter(Assessment.title.ilike(search_pattern))

        total_result = await self.db.execute(count_query)
        total = total_result.scalar() or 0

        query = query.order_by(Assessment.created_at.desc()).offset(skip).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all()), total


class QuestionRepository(BaseRepository[Question]):
    def __init__(self, db: AsyncSession):
        super().__init__(Question, db)

    async def get_by_assessment_id(self, assessment_id: uuid.UUID) -> List[Question]:
        """
        Fetch all questions associated with an assessment, ordered by display_order.
        """
        result = await self.db.execute(
            select(Question)
            .filter(Question.assessment_id == assessment_id)
            .order_by(Question.display_order.asc())
        )
        return list(result.scalars().all())

    async def get_max_display_order(self, assessment_id: uuid.UUID) -> int:
        """
        Get current highest display order for an assessment's questions.
        """
        result = await self.db.execute(
            select(func.max(Question.display_order)).filter(Question.assessment_id == assessment_id)
        )
        return result.scalar() or 0


class AttemptRepository(BaseRepository[Attempt]):
    def __init__(self, db: AsyncSession):
        super().__init__(Attempt, db)

    async def get_user_attempts(self, user_id: uuid.UUID) -> List[Attempt]:
        """
        Fetch attempt logs for a specific employee user.
        """
        result = await self.db.execute(
            select(Attempt)
            .filter(Attempt.user_id == user_id)
            .order_by(Attempt.started_at.desc())
        )
        return list(result.scalars().all())


class AnswerRepository(BaseRepository[Answer]):
    def __init__(self, db: AsyncSession):
        super().__init__(Answer, db)

    async def get_attempt_answers(self, attempt_id: uuid.UUID) -> List[Answer]:
        """
        Fetch selected answers logged for a specific assessment attempt.
        """
        result = await self.db.execute(
            select(Answer).filter(Answer.attempt_id == attempt_id)
        )
        return list(result.scalars().all())
