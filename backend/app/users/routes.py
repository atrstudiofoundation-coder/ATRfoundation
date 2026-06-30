from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.users.schemas import UserRead, UserCreate, UserUpdate
from app.users.services import UserService
from app.users.repositories import UserRepository
from app.auth.dependencies import get_current_user, get_current_admin_user
from app.database.base import User
from sqlalchemy import select
from typing import List
import uuid

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=UserRead)
async def create_user(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    """
    Register a new user in the system.
    """
    user_repo = UserRepository(db)
    service = UserService(user_repo)
    try:
        return await service.create_user(user_in)
    except NotImplementedError as e:
        raise HTTPException(status_code=501, detail=str(e))


@router.get("/me", response_model=UserRead)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """
    Get profile of the currently logged in user.
    """
    return current_user


@router.get("/", response_model=List[UserRead])
async def list_users(
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
):
    """
    List all users in the system (Admin Only).
    """
    result = await db.execute(select(User).order_by(User.created_at.desc()))
    users = result.scalars().all()
    return users


@router.put("/{user_id}", response_model=UserRead)
async def update_user(
    user_id: uuid.UUID,
    user_update: UserUpdate,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
):
    """
    Update user profile or status (Admin Only).
    """
    result = await db.execute(select(User).filter(User.id == user_id))
    user_obj = result.scalars().first()
    if not user_obj:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user_obj.id == admin_user.id and user_update.is_active is False:
        raise HTTPException(status_code=400, detail="Cannot deactivate yourself")

    if user_update.full_name is not None:
        user_obj.full_name = user_update.full_name
    if user_update.role is not None:
        user_obj.role = user_update.role
    if user_update.is_active is not None:
        user_obj.is_active = user_update.is_active
    if user_update.profile_picture is not None:
        user_obj.profile_picture = user_update.profile_picture

    await db.commit()
    await db.refresh(user_obj)
    return user_obj


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
):
    """
    Delete a user from the system (Admin Only).
    """
    result = await db.execute(select(User).filter(User.id == user_id))
    user_obj = result.scalars().first()
    if not user_obj:
        raise HTTPException(status_code=404, detail="User not found")

    if user_obj.id == admin_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")

    await db.delete(user_obj)
    await db.commit()

