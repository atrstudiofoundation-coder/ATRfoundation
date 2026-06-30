import uuid
from typing import Optional, List
from app.common.pagination import PaginationParams, PaginatedResponse
from app.common.exceptions import EntityNotFoundException, EntityAlreadyExistsException
from app.modules.schemas import (
    LearningPathCreate, LearningPathUpdate, LearningPathRead,
    ModuleCreate, ModuleUpdate, ModuleRead
)
from app.modules.models import LearningPath, Module
from app.modules.repositories import LearningPathRepository, ModuleRepository, ModuleProgressRepository

class LearningPathService:
    def __init__(self, path_repo: LearningPathRepository):
        self.path_repo = path_repo

    async def create_learning_path(self, path_in: LearningPathCreate) -> LearningPath:
        existing = await self.path_repo.get_by_title(path_in.title)
        if existing:
            raise EntityAlreadyExistsException("LearningPath", "title", path_in.title)
        
        path = LearningPath(
            title=path_in.title,
            description=path_in.description,
            is_active=path_in.is_active
        )
        await self.path_repo.create(path)
        await self.path_repo.db.commit()
        return await self.get_learning_path_by_id(path.id)

    async def get_learning_path_by_id(self, path_id: uuid.UUID) -> LearningPath:
        path = await self.path_repo.get_by_id(path_id)
        if not path:
            raise EntityNotFoundException("LearningPath", str(path_id))
        return path

    async def list_learning_paths(
        self, 
        params: PaginationParams, 
        search: Optional[str] = None
    ) -> PaginatedResponse[LearningPathRead]:
        items, total = await self.path_repo.list_paginated(
            skip=params.offset, 
            limit=params.limit, 
            search=search
        )
        read_items = [LearningPathRead.model_validate(item) for item in items]
        return PaginatedResponse.create(items=read_items, total=total, params=params)

    async def update_learning_path(self, path_id: uuid.UUID, path_in: LearningPathUpdate) -> LearningPath:
        path = await self.get_learning_path_by_id(path_id)
        if path_in.title is not None and path_in.title != path.title:
            existing = await self.path_repo.get_by_title(path_in.title)
            if existing:
                raise EntityAlreadyExistsException("LearningPath", "title", path_in.title)
            path.title = path_in.title
            
        if path_in.description is not None:
            path.description = path_in.description
        if path_in.is_active is not None:
            path.is_active = path_in.is_active
            
        await self.path_repo.update(path)
        await self.path_repo.db.commit()
        return await self.get_learning_path_by_id(path_id)

    async def delete_learning_path(self, path_id: uuid.UUID) -> None:
        path = await self.get_learning_path_by_id(path_id)
        await self.path_repo.delete(path)
        await self.path_repo.db.commit()


class ModuleService:
    def __init__(
        self, 
        module_repo: ModuleRepository, 
        path_repo: LearningPathRepository, 
        progress_repo: ModuleProgressRepository
    ):
        self.module_repo = module_repo
        self.path_repo = path_repo
        self.progress_repo = progress_repo

    async def create_module(self, module_in: ModuleCreate) -> Module:
        path = await self.path_repo.get_by_id(module_in.learning_path_id)
        if not path:
            raise EntityNotFoundException("LearningPath", str(module_in.learning_path_id))
            
        display_order = module_in.display_order
        if display_order is None:
            max_order = await self.module_repo.get_max_display_order(module_in.learning_path_id)
            display_order = max_order + 1

        module = Module(
            learning_path_id=module_in.learning_path_id,
            title=module_in.title,
            description=module_in.description,
            estimated_duration_minutes=module_in.estimated_duration_minutes,
            passing_percentage=module_in.passing_percentage,
            display_order=display_order
        )
        await self.module_repo.create(module)
        await self.module_repo.db.commit()
        return await self.get_module_by_id(module.id)

    async def get_module_by_id(self, module_id: uuid.UUID) -> Module:
        module = await self.module_repo.get_by_id(module_id)
        if not module:
            raise EntityNotFoundException("Module", str(module_id))
        return module

    async def list_modules(
        self, 
        params: PaginationParams, 
        learning_path_id: Optional[uuid.UUID] = None,
        search: Optional[str] = None
    ) -> PaginatedResponse[ModuleRead]:
        items, total = await self.module_repo.list_paginated(
            skip=params.offset, 
            limit=params.limit, 
            learning_path_id=learning_path_id,
            search=search
        )
        read_items = [ModuleRead.model_validate(item) for item in items]
        return PaginatedResponse.create(items=read_items, total=total, params=params)

    async def update_module(self, module_id: uuid.UUID, module_in: ModuleUpdate) -> Module:
        module = await self.get_module_by_id(module_id)
        if module_in.learning_path_id is not None:
            path = await self.path_repo.get_by_id(module_in.learning_path_id)
            if not path:
                raise EntityNotFoundException("LearningPath", str(module_in.learning_path_id))
            module.learning_path_id = module_in.learning_path_id
            
        if module_in.title is not None:
            module.title = module_in.title
        if module_in.description is not None:
            module.description = module_in.description
        if module_in.estimated_duration_minutes is not None:
            module.estimated_duration_minutes = module_in.estimated_duration_minutes
        if module_in.passing_percentage is not None:
            module.passing_percentage = module_in.passing_percentage
        if module_in.display_order is not None:
            module.display_order = module_in.display_order
            
        await self.module_repo.update(module)
        await self.module_repo.db.commit()
        return await self.get_module_by_id(module_id)

    async def delete_module(self, module_id: uuid.UUID) -> None:
        module = await self.get_module_by_id(module_id)
        await self.module_repo.delete(module)
        await self.module_repo.db.commit()
