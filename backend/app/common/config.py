import os
from typing import Any, Dict, Optional
from pydantic import PostgresDsn, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    PROJECT_NAME: str = "ATR Foundation"
    API_V1_STR: str = "/api/v1"

    # Security & Authentication
    SECRET_KEY: str = "supersecretkeychangeinproduction1234567890"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 7
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 Days
    APP_STUDIO_ACCESS_CODE: str = "ATR-STUDIO-2026"
    COOKIE_SECURE: bool = False
    AUTH_COOKIE_NAME: str = "access_token"

    # Database Configuration
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "atr_foundation"
    POSTGRES_PORT: str = "5432"
    
    SQLALCHEMY_DATABASE_URI: Optional[str] = None
    SQLALCHEMY_DATABASE_URI_ASYNC: Optional[str] = None

    @field_validator("SQLALCHEMY_DATABASE_URI", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: Optional[str], values: Any) -> Any:
        if isinstance(v, str) and v:
            return v
        
        # Pydantic v2 validation input could be validation Info object or dictionary
        data = values.data if hasattr(values, "data") else values
        
        user = data.get("POSTGRES_USER")
        password = data.get("POSTGRES_PASSWORD")
        server = data.get("POSTGRES_SERVER")
        port = data.get("POSTGRES_PORT")
        db = data.get("POSTGRES_DB")
        
        return f"postgresql://{user}:{password}@{server}:{port}/{db}"

    @field_validator("SQLALCHEMY_DATABASE_URI_ASYNC", mode="before")
    @classmethod
    def assemble_async_db_connection(cls, v: Optional[str], values: Any) -> Any:
        if isinstance(v, str) and v:
            return v
        
        data = values.data if hasattr(values, "data") else values
        
        user = data.get("POSTGRES_USER")
        password = data.get("POSTGRES_PASSWORD")
        server = data.get("POSTGRES_SERVER")
        port = data.get("POSTGRES_PORT")
        db = data.get("POSTGRES_DB")
        
        return f"postgresql+asyncpg://{user}:{password}@{server}:{port}/{db}"


settings = Settings()
export_settings = settings
