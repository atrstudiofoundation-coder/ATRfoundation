from sqlalchemy.ext.asyncio import AsyncSession
from app.common.base_repository import BaseRepository
from app.users.models import User

class UserRepository(BaseRepository[User]):
    def __init__(self, db: AsyncSession):
        """
        Database query repository for User entities.
        """
        super().__init__(User, db)

    async def get_by_email(self, email: str) -> None:
        """
        Specific query to fetch user by email.
        """
        raise NotImplementedError("Fetching user by email has not been implemented yet.")

    async def get_by_google_id(self, google_id: str) -> None:
        """
        Specific query to fetch user by Google OAuth ID.
        """
        raise NotImplementedError("Fetching user by Google ID has not been implemented yet.")
