from __future__ import annotations

from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # ── General ──────────────────────────────────────────────
    APP_NAME: str = "CoerVora AI"
    DEBUG: bool = False

    # ── Database ─────────────────────────────────────────────
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/coervora"

    # ── Auth / JWT ───────────────────────────────────────────
    SECRET_KEY: str = "change-me-in-production-use-a-strong-random-key"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 60 * 24  # 24 hours

    # ── CORS ─────────────────────────────────────────────────
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: str | List[str]) -> List[str]:
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    # ── AI Engine ────────────────────────────────────────────
    AI_ENGINE_HOST: str = "localhost"
    AI_ENGINE_PORT: int = 50051

    # ── ChromaDB ─────────────────────────────────────────────
    CHROMA_HOST: str = "localhost"
    CHROMA_PORT: int = 8100

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
    }


settings = Settings()
