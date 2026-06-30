from typing import Optional, List
import uuid
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.auth.dependencies import get_current_admin_user
from app.users.models import User
from app.common.pagination import PaginationParams, PaginatedResponse
from app.resources.schemas import ResourceCreate, ResourceUpdate, ResourceRead
from app.resources.services import ResourceService
from app.resources.repositories import ResourceRepository
from app.modules.repositories import ModuleRepository
from app.modules.schemas import ModuleResourceRead

router = APIRouter(prefix="/resources", tags=["resources"])

@router.post("/", response_model=ResourceRead, status_code=status.HTTP_201_CREATED)
async def create_resource(
    resource_in: ResourceCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    resource_repo = ResourceRepository(db)
    service = ResourceService(resource_repo)
    return await service.create_resource(resource_in)


@router.get("/", response_model=PaginatedResponse[ResourceRead])
async def list_resources(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    resource_type: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    resource_repo = ResourceRepository(db)
    service = ResourceService(resource_repo)
    params = PaginationParams(page=page, page_size=page_size)
    return await service.list_resources(params, resource_type=resource_type, search=search)


@router.get("/{resource_id}", response_model=ResourceRead)
async def get_resource(
    resource_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    resource_repo = ResourceRepository(db)
    service = ResourceService(resource_repo)
    return await service.get_resource_by_id(resource_id)


@router.put("/{resource_id}", response_model=ResourceRead)
async def update_resource(
    resource_id: uuid.UUID,
    resource_in: ResourceUpdate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    resource_repo = ResourceRepository(db)
    service = ResourceService(resource_repo)
    return await service.update_resource(resource_id, resource_in)


@router.delete("/{resource_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resource(
    resource_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    resource_repo = ResourceRepository(db)
    service = ResourceService(resource_repo)
    await service.delete_resource(resource_id)


@router.post("/{resource_id}/attach/{module_id}", response_model=ModuleResourceRead)
@router.post("/module/{module_id}/link/{resource_id}", response_model=ModuleResourceRead)
async def link_resource_to_module(
    module_id: uuid.UUID,
    resource_id: uuid.UUID,
    display_order: int = Query(0),
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    resource_repo = ResourceRepository(db)
    module_repo = ModuleRepository(db)
    service = ResourceService(resource_repo, module_repo)
    return await service.link_resource_to_module(module_id, resource_id, display_order)


@router.delete("/{resource_id}/detach/{module_id}", status_code=status.HTTP_204_NO_CONTENT)
@router.delete("/module/{module_id}/unlink/{resource_id}", status_code=status.HTTP_204_NO_CONTENT)
async def unlink_resource_from_module(
    module_id: uuid.UUID,
    resource_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    resource_repo = ResourceRepository(db)
    module_repo = ModuleRepository(db)
    service = ResourceService(resource_repo, module_repo)
    await service.unlink_resource_from_module(module_id, resource_id)


@router.get("/module/{module_id}", response_model=List[ResourceRead])
async def get_resources_for_module(
    module_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    resource_repo = ResourceRepository(db)
    module_repo = ModuleRepository(db)
    service = ResourceService(resource_repo, module_repo)
    return await service.get_resources_by_module(module_id)
