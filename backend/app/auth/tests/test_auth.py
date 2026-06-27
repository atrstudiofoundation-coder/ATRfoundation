import uuid
from datetime import timedelta
import pytest
from app.common.config import settings
from app.auth.jwt import (
    create_access_token,
    verify_token,
    extract_user_id,
    validate_token_expiry
)
from app.auth.services import validate_studio_access_code

def test_jwt_creation():
    user_id = uuid.uuid4()
    role = "Admin"
    token = create_access_token(subject=user_id, role=role)
    
    assert isinstance(token, str)
    assert len(token) > 0

def test_jwt_validation():
    user_id = uuid.uuid4()
    role = "Employee"
    token = create_access_token(subject=user_id, role=role)
    
    payload = verify_token(token)
    assert payload["sub"] == str(user_id)
    assert payload["role"] == role
    
    extracted_id = extract_user_id(token)
    assert extracted_id == user_id
    assert validate_token_expiry(token) is True

def test_expired_token():
    user_id = uuid.uuid4()
    role = "Employee"
    # Create token expired 10 seconds ago
    token = create_access_token(subject=user_id, role=role, expires_delta=timedelta(seconds=-10))
    
    assert validate_token_expiry(token) is False
    with pytest.raises(ValueError) as exc_info:
        verify_token(token)
    assert "expired" in str(exc_info.value).lower()

def test_invalid_token():
    invalid_token = "invalid.jwt.token.string"
    
    assert validate_token_expiry(invalid_token) is False
    with pytest.raises(ValueError):
        verify_token(invalid_token)
        
    with pytest.raises(ValueError):
        extract_user_id(invalid_token)

def test_studio_access_code_validation():
    valid_code = settings.APP_STUDIO_ACCESS_CODE
    assert validate_studio_access_code(valid_code) is True
    assert validate_studio_access_code(f"  {valid_code}  ") is True
    
    assert validate_studio_access_code("WRONG_CODE_123") is False
    assert validate_studio_access_code("") is False
    assert validate_studio_access_code(None) is False
