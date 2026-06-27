import uuid
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, Optional
from jose import jwt, JWTError, ExpiredSignatureError
from app.common.config import settings

ALGORITHM = "HS256"

def create_access_token(
    subject: str | uuid.UUID, 
    role: str, 
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Generate a signed JWT access token for a given user subject and role.
    Lifetime defaults to 7 days.
    """
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(days=settings.ACCESS_TOKEN_EXPIRE_DAYS)
    
    to_encode = {
        "sub": str(subject),
        "role": role,
        "exp": expire,
        "iat": now
    }
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Dict[str, Any]:
    """
    Decode JWT access token and return payload dictionary.
    Raises ExpiredSignatureError or JWTError if invalid.
    """
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
    return payload

def verify_token(token: str) -> Dict[str, Any]:
    """
    Verify incoming JWT access token signature and expiration.
    Returns payload dictionary if valid.
    """
    try:
        payload = decode_access_token(token)
        if "sub" not in payload:
            raise JWTError("Token payload missing subject claim")
        return payload
    except ExpiredSignatureError:
        raise ValueError("Token has expired")
    except JWTError as e:
        raise ValueError(f"Invalid token: {str(e)}")

def extract_user_id(token: str) -> uuid.UUID:
    """
    Extract and return user UUID from verified JWT token payload.
    """
    payload = verify_token(token)
    sub = payload.get("sub")
    if not sub:
        raise ValueError("Token payload missing subject claim")
    try:
        return uuid.UUID(sub)
    except ValueError:
        raise ValueError("Token subject is not a valid UUID")

def validate_token_expiry(token: str) -> bool:
    """
    Check if a token is valid and not expired.
    Returns True if valid, False otherwise.
    """
    try:
        verify_token(token)
        return True
    except ValueError:
        return False
