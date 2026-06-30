from typing import List, Optional, Tuple
import uuid
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.common.base_repository import BaseRepository
from app.modules.models import LearningPath, Module, ModuleProgress, ModuleResource
from app.assessments.models import Assessment

class LearningPathRepository(BaseRepository[LearningPath]):
    def __init__(self, db: AsyncSession):
        super().__init__(LearningPath, db)

    async def get_by_id(self, id: uuid.UUID) -> Optional[LearningPath]:
        result = await self.db.execute(
            select(LearningPath)
            .options(
                selectinload(LearningPath.modules).selectinload(Module.module_resources_assoc).selectinload(ModuleResource.resource),
                selectinload(LearningPath.modules).selectinload(Module.assessment).selectinload(Assessment.questions)
            )
            .filter(LearningPath.id == id)
        )
        return result.scalars().first()

    async def get_by_title(self, title: str) -> Optional[LearningPath]:
        """
        Fetch a learning path by exact title match.
        """
        result = await self.db.execute(
            select(LearningPath).filter(LearningPath.title == title)
        )
        return result.scalars().first()

    async def list_paginated(
        self, 
        skip: int = 0, 
        limit: int = 20, 
        search: Optional[str] = None,
        active_only: bool = False
    ) -> Tuple[List[LearningPath], int]:
        """
        List learning paths with pagination offsets and search filtering.
        """
        query = select(LearningPath).options(
            selectinload(LearningPath.modules).selectinload(Module.module_resources_assoc).selectinload(ModuleResource.resource),
            selectinload(LearningPath.modules).selectinload(Module.assessment).selectinload(Assessment.questions)
        )
        count_query = select(func.count()).select_from(LearningPath)

        if active_only:
            query = query.filter(LearningPath.is_active == True)
            count_query = count_query.filter(LearningPath.is_active == True)

        if search:
            search_pattern = f"%{search}%"
            query = query.filter(LearningPath.title.ilike(search_pattern))
            count_query = count_query.filter(LearningPath.title.ilike(search_pattern))

        total_result = await self.db.execute(count_query)
        total = total_result.scalar() or 0

        query = query.order_by(LearningPath.created_at.desc()).offset(skip).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all()), total


class ModuleRepository(BaseRepository[Module]):
    def __init__(self, db: AsyncSession):
        super().__init__(Module, db)

    async def get_by_id(self, id: uuid.UUID) -> Optional[Module]:
        result = await self.db.execute(
            select(Module)
            .options(
                selectinload(Module.module_resources_assoc).selectinload(ModuleResource.resource),
                selectinload(Module.assessment).selectinload(Assessment.questions)
            )
            .filter(Module.id == id)
        )
        return result.scalars().first()

    async def get_by_learning_path(self, learning_path_id: uuid.UUID) -> List[Module]:
        """
        Fetch modules under a specific learning path, ordered by display_order.
        """
        result = await self.db.execute(
            select(Module)
            .options(
                selectinload(Module.module_resources_assoc).selectinload(ModuleResource.resource),
                selectinload(Module.assessment).selectinload(Assessment.questions)
            )
            .filter(Module.learning_path_id == learning_path_id)
            .order_by(Module.display_order.asc())
        )
        return list(result.scalars().all())

    async def get_by_title_in_path(self, learning_path_id: uuid.UUID, title: str) -> Optional[Module]:
        """
        Fetch a module by title within a learning path.
        """
        result = await self.db.execute(
            select(Module)
            .filter(Module.learning_path_id == learning_path_id, Module.title == title)
        )
        return result.scalars().first()

    async def list_paginated(
        self, 
        skip: int = 0, 
        limit: int = 20, 
        learning_path_id: Optional[uuid.UUID] = None,
        search: Optional[str] = None
    ) -> Tuple[List[Module], int]:
        """
        List modules with pagination offsets and search filtering.
        """
        query = select(Module).options(
            selectinload(Module.module_resources_assoc).selectinload(ModuleResource.resource),
            selectinload(Module.assessment).selectinload(Assessment.questions)
        )
        count_query = select(func.count()).select_from(Module)

        if learning_path_id:
            query = query.filter(Module.learning_path_id == learning_path_id)
            count_query = count_query.filter(Module.learning_path_id == learning_path_id)

        if search:
            search_pattern = f"%{search}%"
            query = query.filter(Module.title.ilike(search_pattern))
            count_query = count_query.filter(Module.title.ilike(search_pattern))

        total_result = await self.db.execute(count_query)
        total = total_result.scalar() or 0

        query = query.order_by(Module.display_order.asc()).offset(skip).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all()), total

    async def get_max_display_order(self, learning_path_id: uuid.UUID) -> int:
        """
        Get highest display order number in a learning path.
        """
        result = await self.db.execute(
            select(func.max(Module.display_order)).filter(Module.learning_path_id == learning_path_id)
        )
        return result.scalar() or 0


class ModuleProgressRepository(BaseRepository[ModuleProgress]):
    def __init__(self, db: AsyncSession):
        super().__init__(ModuleProgress, db)

    async def get_user_progress_for_module(self, user_id: uuid.UUID, module_id: uuid.UUID) -> Optional[ModuleProgress]:
        """
        Fetch module completion progress state for a specific employee.
        """
        result = await self.db.execute(
            select(ModuleProgress).filter(
                ModuleProgress.user_id == user_id,
                ModuleProgress.module_id == module_id
            )
        )
        return result.scalars().first()
