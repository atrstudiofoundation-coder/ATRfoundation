import uuid
from typing import Optional, List
from app.common.pagination import PaginationParams, PaginatedResponse
from app.common.exceptions import EntityNotFoundException, EntityAlreadyExistsException
from app.resources.schemas import ResourceCreate, ResourceUpdate, ResourceRead
from app.resources.models import Resource
from app.resources.repositories import ResourceRepository
from app.modules.repositories import ModuleRepository
from app.modules.schemas import ModuleResourceRead

class ResourceService:
    def __init__(self, resource_repo: ResourceRepository, module_repo: Optional[ModuleRepository] = None):
        """
        ResourceService initialized with ResourceRepository dependency.
        """
        self.resource_repo = resource_repo
        self.module_repo = module_repo

    async def create_resource(self, resource_in: ResourceCreate) -> Resource:
        resource = Resource(
            title=resource_in.title,
            description=resource_in.description,
            resource_type=resource_in.resource_type,
            resource_url=resource_in.resource_url,
            uploaded_file_path=resource_in.uploaded_file_path
        )
        await self.resource_repo.create(resource)
        await self.resource_repo.db.commit()
        return resource

    async def get_resource_by_id(self, resource_id: uuid.UUID) -> Resource:
        resource = await self.resource_repo.get_by_id(resource_id)
        if not resource:
            raise EntityNotFoundException("Resource", str(resource_id))
        return resource

    async def list_resources(
        self, 
        params: PaginationParams, 
        resource_type: Optional[str] = None, 
        search: Optional[str] = None
    ) -> PaginatedResponse[ResourceRead]:
        items, total = await self.resource_repo.list_paginated(
            skip=params.offset, 
            limit=params.limit, 
            resource_type=resource_type, 
            search=search
        )
        read_items = [ResourceRead.model_validate(item) for item in items]
        return PaginatedResponse.create(items=read_items, total=total, params=params)

    async def update_resource(self, resource_id: uuid.UUID, resource_in: ResourceUpdate) -> Resource:
        resource = await self.get_resource_by_id(resource_id)
        if resource_in.title is not None:
            resource.title = resource_in.title
        if resource_in.description is not None:
            resource.description = resource_in.description
        if resource_in.resource_type is not None:
            resource.resource_type = resource_in.resource_type
        if resource_in.resource_url is not None:
            resource.resource_url = resource_in.resource_url
        if resource_in.uploaded_file_path is not None:
            resource.uploaded_file_path = resource_in.uploaded_file_path

        await self.resource_repo.update(resource)
        await self.resource_repo.db.commit()
        return resource

    async def delete_resource(self, resource_id: uuid.UUID) -> None:
        resource = await self.get_resource_by_id(resource_id)
        await self.resource_repo.delete(resource)
        await self.resource_repo.db.commit()

    async def link_resource_to_module(
        self, 
        module_id: uuid.UUID, 
        resource_id: uuid.UUID, 
        display_order: int = 0
    ) -> ModuleResourceRead:
        if self.module_repo:
            module = await self.module_repo.get_by_id(module_id)
            if not module:
                raise EntityNotFoundException("Module", str(module_id))
        await self.get_resource_by_id(resource_id)

        existing = await self.resource_repo.get_module_resource_assoc(module_id, resource_id)
        if existing:
            return ModuleResourceRead.model_validate(existing)

        assoc = await self.resource_repo.link_to_module(module_id, resource_id, display_order)
        await self.resource_repo.db.commit()
        return ModuleResourceRead.model_validate(assoc)

    async def unlink_resource_from_module(self, module_id: uuid.UUID, resource_id: uuid.UUID) -> None:
        success = await self.resource_repo.unlink_from_module(module_id, resource_id)
        if not success:
            raise EntityNotFoundException("ModuleResourceLink", f"module={module_id}, resource={resource_id}")
        await self.resource_repo.db.commit()

    async def get_resources_by_module(self, module_id: uuid.UUID) -> List[ResourceRead]:
        if self.module_repo:
            module = await self.module_repo.get_by_id(module_id)
            if not module:
                raise EntityNotFoundException("Module", str(module_id))
        resources = await self.resource_repo.get_resources_by_module_id(module_id)
        return [ResourceRead.model_validate(r) for r in resources]
