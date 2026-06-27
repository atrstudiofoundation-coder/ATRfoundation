from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.auth.schemas import GoogleOAuthRequest, TokenResponse
from app.auth.services import AuthService
from app.auth.repositories import AuthRepository

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=TokenResponse)
async def login_for_access_token():
    """
    Standard login route (Disabled - Google SSO is the only authentication mechanism).
    """
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Standard password authentication is disabled. Please authenticate using Google OAuth."
    )


@router.post("/google", response_model=TokenResponse)
async def login_with_google(request: GoogleOAuthRequest, db: AsyncSession = Depends(get_db)):
    """
    Google OAuth login route.
    """
    auth_repo = AuthRepository(db)
    service = AuthService(auth_repo)
    try:
        token = await service.authenticate_with_google(request)
        return TokenResponse(access_token=token, token_type="bearer")
    except NotImplementedError as e:
        raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail=str(e))
