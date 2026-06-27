from typing import Optional, Any, Dict
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.common.base_repository import BaseRepository
from app.users.models import User

class AuthRepository(BaseRepository[User]):
    def __init__(self, db: AsyncSession):
        """
        Database repository for authentication user entity management.
        """
        super().__init__(User, db)

    async def get_by_google_id(self, google_id: str) -> Optional[User]:
        """
        Fetch a user by their Google OAuth unique identifier.
        """
        result = await self.db.execute(
            select(User).filter(User.google_id == google_id)
        )
        return result.scalars().first()

    async def get_by_email(self, email: str) -> Optional[User]:
        """
        Fetch a user by their email address.
        """
        result = await self.db.execute(
            select(User).filter(User.email == email)
        )
        return result.scalars().first()

    async def create_user(
        self, 
        email: str, 
        full_name: str, 
        google_id: Optional[str] = None, 
        profile_picture: Optional[str] = None, 
        role: str = "Employee"
    ) -> User:
        """
        Create and persist a new User entity in PostgreSQL.
        """
        user = User(
            email=email,
            full_name=full_name,
            google_id=google_id,
            profile_picture=profile_picture,
            role=role,
            is_active=True
        )
        self.db.add(user)
        await self.db.flush()
        return user

    async def update_user(self, user: User, update_data: Dict[str, Any]) -> User:
        """
        Update fields on an existing User entity.
        """
        for key, value in update_data.items():
            if hasattr(user, key) and value is not None:
                setattr(user, key, value)
        self.db.add(user)
        await self.db.flush()
        return user
