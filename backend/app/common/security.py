from fastapi import Security, HTTPException, status, Depends
from typing import Dict, Any
from app.auth.jwt import verify_token
from app.auth.dependencies import security_bearer
from fastapi.security import HTTPAuthorizationCredentials

def verify_jwt_token(credentials: HTTPAuthorizationCredentials = Security(security_bearer)) -> Dict[str, Any]:
    """
    Verify incoming JWT bearer token signature and structure.
    """
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token missing",
            headers={"WWW-Authenticate": "Bearer"}
        )
    try:
        return verify_token(credentials.credentials)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"}
        )

def get_current_user_claims(token_claims: Dict[str, Any] = Security(verify_jwt_token)) -> Dict[str, Any]:
    """
    Extract roles and identity claims from verified token parameters.
    """
    return token_claims

def require_role(role: str):
    """
    Dependency generator enforcing role-based access control.
    """
    def dependency(claims: Dict[str, Any] = Security(get_current_user_claims)):
        user_role = claims.get("role")
        if user_role != role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"User does not have required role '{role}'"
            )
        return claims
    return dependency
