from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.users.schemas import UserRead, UserCreate
from app.users.services import UserService
from app.users.repositories import UserRepository

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
async def get_current_user_profile():
    """
    Get profile of the currently logged in user.
    """
    raise HTTPException(
        status_code=501, 
        detail="User profile retrieval is not implemented yet because Google OAuth authentication has not been enabled."
    )
