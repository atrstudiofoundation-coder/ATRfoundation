from typing import List, Optional, Tuple
import uuid
from sqlalchemy import select, func, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.common.base_repository import BaseRepository
from app.resources.models import Resource
from app.modules.models import ModuleResource

class ResourceRepository(BaseRepository[Resource]):
    def __init__(self, db: AsyncSession):
        super().__init__(Resource, db)

    async def list_paginated(
        self, 
        skip: int = 0, 
        limit: int = 20, 
        resource_type: Optional[str] = None,
        search: Optional[str] = None
    ) -> Tuple[List[Resource], int]:
        """
        List resources with pagination and optional type/search filtering.
        """
        query = select(Resource)
        count_query = select(func.count()).select_from(Resource)

        if resource_type:
            query = query.filter(Resource.resource_type == resource_type)
            count_query = count_query.filter(Resource.resource_type == resource_type)

        if search:
            search_pattern = f"%{search}%"
            query = query.filter(Resource.title.ilike(search_pattern))
            count_query = count_query.filter(Resource.title.ilike(search_pattern))

        total_result = await self.db.execute(count_query)
        total = total_result.scalar() or 0

        query = query.order_by(Resource.created_at.desc()).offset(skip).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all()), total

    async def get_resources_by_module_id(self, module_id: uuid.UUID) -> List[Resource]:
        """
        Retrieve resources linked to a module via the module_resources junction.
        """
        result = await self.db.execute(
            select(Resource)
            .join(ModuleResource, Resource.id == ModuleResource.resource_id)
            .filter(ModuleResource.module_id == module_id)
            .order_by(ModuleResource.display_order.asc())
        )
        return list(result.scalars().all())

    async def get_module_resource_assoc(self, module_id: uuid.UUID, resource_id: uuid.UUID) -> Optional[ModuleResource]:
        """
        Fetch module-resource association row if present.
        """
        result = await self.db.execute(
            select(ModuleResource).filter(
                ModuleResource.module_id == module_id,
                ModuleResource.resource_id == resource_id
            )
        )
        return result.scalars().first()

    async def link_to_module(self, module_id: uuid.UUID, resource_id: uuid.UUID, display_order: int = 0) -> ModuleResource:
        """
        Link a resource to a module.
        """
        assoc = ModuleResource(
            module_id=module_id,
            resource_id=resource_id,
            display_order=display_order
        )
        self.db.add(assoc)
        await self.db.flush()
        return assoc

    async def unlink_from_module(self, module_id: uuid.UUID, resource_id: uuid.UUID) -> bool:
        """
        Unlink a resource from a module.
        """
        assoc = await self.get_module_resource_assoc(module_id, resource_id)
        if assoc:
            await self.db.delete(assoc)
            await self.db.flush()
            return True
        return False
