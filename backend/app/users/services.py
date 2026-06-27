import uuid
from app.users.schemas import UserCreate, UserUpdate
from app.users.repositories import UserRepository

class UserService:
    def __init__(self, user_repo: UserRepository):
        """
        UserService initialized with UserRepository dependency.
        """
        self.user_repo = user_repo

    async def get_user_by_id(self, user_id: uuid.UUID):
        raise NotImplementedError("Retrieving user by ID has not been implemented yet.")

    async def get_user_by_email(self, email: str):
        raise NotImplementedError("Retrieving user by email has not been implemented yet.")

    async def create_user(self, user_in: UserCreate):
        raise NotImplementedError("Creating a user has not been implemented yet.")

    async def update_user(self, user_id: uuid.UUID, user_in: UserUpdate):
        raise NotImplementedError("Updating a user has not been implemented yet.")
