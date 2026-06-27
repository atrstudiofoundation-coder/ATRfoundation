from typing import Optional
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.auth.jwt import extract_user_id
from app.auth.cookies import read_auth_cookie
from app.auth.repositories import AuthRepository
from app.users.models import User

security_bearer = HTTPBearer(auto_error=False)

async def get_current_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer),
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    Dependency to read JWT from Bearer header or HTTP-Only cookie,
    validate token signature/expiry, load user entity from database, and return User.
    """
    token: Optional[str] = None
    
    # 1. Attempt reading from Bearer header
    if credentials and credentials.credentials:
        token = credentials.credentials
    # 2. Fallback reading from Cookie
    else:
        token = read_auth_cookie(request)
        
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token missing",
            headers={"WWW-Authenticate": "Bearer"}
        )
        
    try:
        user_id = extract_user_id(token)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"}
        )
        
    auth_repo = AuthRepository(db)
    user = await auth_repo.get_by_id(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User associated with token not found",
            headers={"WWW-Authenticate": "Bearer"}
        )
        
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
        
    return user

async def get_current_admin_user(current_user: User = Depends(get_current_user)) -> User:
    """
    Dependency enforcing Admin role requirement.
    """
    if current_user.role != "Admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operation requires Admin role permission"
        )
    return current_user
