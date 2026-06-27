from typing import Optional
from fastapi import Request, Response
from app.common.config import settings

def set_auth_cookie(response: Response, token: str) -> None:
    """
    Set HTTP-Only authentication cookie on the response.
    Expires in 7 days.
    """
    max_age_seconds = settings.ACCESS_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    response.set_cookie(
        key=settings.AUTH_COOKIE_NAME,
        value=token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite="lax",
        max_age=max_age_seconds
    )

def clear_auth_cookie(response: Response) -> None:
    """
    Clear the HTTP-Only authentication cookie from the response.
    """
    response.delete_cookie(
        key=settings.AUTH_COOKIE_NAME,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite="lax"
    )

def read_auth_cookie(request: Request) -> Optional[str]:
    """
    Read the authentication token from the request cookies if present.
    """
    return request.cookies.get(settings.AUTH_COOKIE_NAME)
