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

    async def authenticate_with_google(self, request: GoogleOAuthRequest) -> User:
        """
        Verify Google ID token, map to internal database user entity, and return user.
        """
        from google.oauth2 import id_token
        from google.auth.transport import requests as google_requests

        token_str = request.id_token or request.credential
        if not token_str:
            raise ValueError("Token is required")
            
        try:
            # Verify signature, expiration, audience, and issuer
            # google.oauth2.id_token.verify_oauth2_token automatically handles all these checks.
            idinfo = id_token.verify_oauth2_token(
                token_str, 
                google_requests.Request(), 
                settings.GOOGLE_CLIENT_ID,
                clock_skew_in_seconds=10
            )
            
            # Check issuer domain
            if idinfo["iss"] not in ["accounts.google.com", "https://accounts.google.com"]:
                raise ValueError("Invalid issuer")

            email = idinfo["email"]
            name = idinfo.get("name", email.split("@")[0])
            google_id = idinfo["sub"]
            profile_picture = idinfo.get("picture")
            
            # Define role based on ADMIN_EMAIL config
            if settings.ADMIN_EMAIL and email.lower() == settings.ADMIN_EMAIL.lower():
                role = "Admin"
            else:
                role = "Employee"
        except Exception as e:
            raise ValueError(f"Google ID Token verification failed: {str(e)}")
            
        user = await self.auth_repo.get_by_email(email)
        if not user:
            if not request.access_code:
                raise ValueError("access_code_required")
            if not self.validate_studio_access_code(request.access_code):
                raise ValueError("invalid_access_code")
            user = await self.create_first_login_user(
                email=email,
                full_name=name,
                google_id=google_id,
                profile_picture=profile_picture,
                role=role
            )
        else:
            updated = False
            update_data = {}
            if user.full_name != name:
                update_data["full_name"] = name
                updated = True
            if user.profile_picture != profile_picture:
                update_data["profile_picture"] = profile_picture
                updated = True
            if not user.google_id:
                update_data["google_id"] = google_id
                updated = True
                
            # Enforce that only the configured admin email can be Admin, demote any others
            target_role = "Admin" if (settings.ADMIN_EMAIL and email.lower() == settings.ADMIN_EMAIL.lower()) else "Employee"
            if user.role != target_role:
                update_data["role"] = target_role
                updated = True
                
            if updated:
                user = await self.auth_repo.update_user(user, update_data)
                
        return user

