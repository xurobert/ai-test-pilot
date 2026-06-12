from functools import lru_cache
from typing import List, Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # App
    PROJECT_NAME: str = "AI Test Platform"
    VERSION: str = "0.1.0"
    ENVIRONMENT: str = "development"  # dev/test/prod
    DEBUG: bool = False

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # Database
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "aitest"
    POSTGRES_POOL_SIZE: int = 10
    POSTGRES_MAX_OVERFLOW: int = 20

    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_PASSWORD: Optional[str] = None

    # Qdrant (RAG预留)
    QDRANT_HOST: str = "localhost"
    QDRANT_PORT: int = 6333
    QDRANT_API_KEY: Optional[str] = None
    QDRANT_COLLECTION_NAME: str = "test_knowledge"

    # Security
    SECRET_KEY: str = "change-me-in-production-please"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    PASSWORD_MIN_LENGTH: int = 8

    # CORS
    CORS_ORIGINS: List[str] = ["*"]

    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"  # json or console

    @property
    def DATABASE_URL(self) -> str:
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    @property
    def REDIS_URL(self) -> str:
        auth = f":{self.REDIS_PASSWORD}@" if self.REDIS_PASSWORD else ""
        return f"redis://{auth}{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"

    @property
    def QDRANT_URL(self) -> str:
        return f"http://{self.QDRANT_HOST}:{self.QDRANT_PORT}"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
