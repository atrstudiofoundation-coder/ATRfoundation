from typing import Optional
from app.common.config import settings
from app.auth.repositories import AuthRepository
from app.auth.schemas import GoogleOAuthRequest
from app.auth.jwt import create_access_token
from app.users.models import User

def validate_studio_access_code(code: str) -> bool:
    """
    Validate provided Studio Access Code against system configuration.
    """
    if not code:
        return False
    return code.strip() == settings.APP_STUDIO_ACCESS_CODE.strip()

class AuthService:
    def __init__(self, auth_repo: AuthRepository):
        """
        AuthService initialized with AuthRepository dependency.
        """
        self.auth_repo = auth_repo

    def generate_jwt(self, user: User) -> str:
        """
        Generate a signed JWT access token for the given user entity.
        """
        return create_access_token(subject=user.id, role=user.role)

    async def authenticate_existing_user(self, email: str) -> Optional[User]:
        """
        Retrieve an existing user by email address from database.
        """
        return await self.auth_repo.get_by_email(email)

    async def create_first_login_user(
        self, 
        email: str, 
        full_name: str, 
        google_id: Optional[str] = None, 
        profile_picture: Optional[str] = None, 
        role: str = "Employee"
    ) -> User:
        """
        Register a new user in database during their first login.
        """
        return await self.auth_repo.create_user(
            email=email,
            full_name=full_name,
            google_id=google_id,
            profile_picture=profile_picture,
            role=role
        )

    def validate_studio_access_code(self, code: str) -> bool:
        """
        Validate Studio Access Code.
        """
        return validate_studio_access_code(code)

    async def authenticate_with_google(self, request: GoogleOAuthRequest) -> str:
        """
        Verify Google ID token, map to internal database user entity, and return access token.
        """
        raise NotImplementedError("Google OAuth authentication has not been implemented yet.")
