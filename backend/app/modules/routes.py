from typing import Optional
import uuid
from fastapi import APIRouter, Depends, Query, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.auth.dependencies import get_current_admin_user, get_current_user
from app.users.models import User
from app.common.pagination import PaginationParams, PaginatedResponse
from app.modules.schemas import (
    LearningPathCreate, LearningPathUpdate, LearningPathRead,
    ModuleCreate, ModuleUpdate, ModuleRead
)
from app.modules.services import LearningPathService, ModuleService
from app.modules.repositories import LearningPathRepository, ModuleRepository, ModuleProgressRepository

router = APIRouter(prefix="/modules", tags=["modules"])

# ==========================================
# LEARNING PATHS ENDPOINTS
# ==========================================

@router.post("/learning-paths", response_model=LearningPathRead, status_code=status.HTTP_201_CREATED)
async def create_learning_path(
    path_in: LearningPathCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    path_repo = LearningPathRepository(db)
    service = LearningPathService(path_repo)
    return await service.create_learning_path(path_in)


@router.get("/learning-paths", response_model=PaginatedResponse[LearningPathRead])
async def list_learning_paths(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    path_repo = LearningPathRepository(db)
    service = LearningPathService(path_repo)
    params = PaginationParams(page=page, page_size=page_size)
    return await service.list_learning_paths(params, search=search)


@router.get("/learning-paths/{path_id}", response_model=LearningPathRead)
async def get_learning_path(
    path_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    path_repo = LearningPathRepository(db)
    service = LearningPathService(path_repo)
    return await service.get_learning_path_by_id(path_id)


@router.put("/learning-paths/{path_id}", response_model=LearningPathRead)
async def update_learning_path(
    path_id: uuid.UUID,
    path_in: LearningPathUpdate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    path_repo = LearningPathRepository(db)
    service = LearningPathService(path_repo)
    return await service.update_learning_path(path_id, path_in)


@router.delete("/learning-paths/{path_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_learning_path(
    path_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    path_repo = LearningPathRepository(db)
    service = LearningPathService(path_repo)
    await service.delete_learning_path(path_id)


# ==========================================
# MODULES ENDPOINTS
# ==========================================

@router.post("/", response_model=ModuleRead, status_code=status.HTTP_201_CREATED)
async def create_module(
    module_in: ModuleCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    module_repo = ModuleRepository(db)
    path_repo = LearningPathRepository(db)
    progress_repo = ModuleProgressRepository(db)
    service = ModuleService(module_repo=module_repo, path_repo=path_repo, progress_repo=progress_repo)
    return await service.create_module(module_in)


@router.get("/", response_model=PaginatedResponse[ModuleRead])
async def list_modules(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    learning_path_id: Optional[uuid.UUID] = Query(None),
    search: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    module_repo = ModuleRepository(db)
    path_repo = LearningPathRepository(db)
    progress_repo = ModuleProgressRepository(db)
    service = ModuleService(module_repo=module_repo, path_repo=path_repo, progress_repo=progress_repo)
    params = PaginationParams(page=page, page_size=page_size)
    return await service.list_modules(params, learning_path_id=learning_path_id, search=search)


@router.get("/{module_id}", response_model=ModuleRead)
async def get_module(
    module_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    module_repo = ModuleRepository(db)
    path_repo = LearningPathRepository(db)
    progress_repo = ModuleProgressRepository(db)
    service = ModuleService(module_repo=module_repo, path_repo=path_repo, progress_repo=progress_repo)
    return await service.get_module_by_id(module_id)


@router.put("/{module_id}", response_model=ModuleRead)
async def update_module(
    module_id: uuid.UUID,
    module_in: ModuleUpdate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    module_repo = ModuleRepository(db)
    path_repo = LearningPathRepository(db)
    progress_repo = ModuleProgressRepository(db)
    service = ModuleService(module_repo=module_repo, path_repo=path_repo, progress_repo=progress_repo)
    return await service.update_module(module_id, module_in)


@router.delete("/{module_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_module(
    module_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    module_repo = ModuleRepository(db)
    path_repo = LearningPathRepository(db)
    progress_repo = ModuleProgressRepository(db)
    service = ModuleService(module_repo=module_repo, path_repo=path_repo, progress_repo=progress_repo)
    await service.delete_module(module_id)


@router.post("/{module_id}/complete", status_code=status.HTTP_200_OK)
async def complete_module_manually(
    module_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Mark a module (usually without assessment) as completed for the current user.
    """
    from app.modules.models import ModuleProgress
    module_repo = ModuleRepository(db)
    module = await module_repo.get_by_id(module_id)
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
        
    progress_repo = ModuleProgressRepository(db)
    progress = await progress_repo.get_user_progress_for_module(current_user.id, module_id)
    if not progress:
        progress = ModuleProgress(
            id=uuid.uuid4(),
            user_id=current_user.id,
            module_id=module_id,
            status="completed",
            progress_percentage=100
        )
        db.add(progress)
    else:
        progress.status = "completed"
        progress.progress_percentage = 100
        
    await db.commit()
    return {"status": "success", "message": "Module marked as completed"}
