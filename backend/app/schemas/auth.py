"""Pydantic schemas for authentication endpoints."""
from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


# ── Request Schemas ──────────────────────────────────────────

class RegisterRequest(BaseModel):
    """POST /auth/register body."""
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)
    full_name: str = Field(..., min_length=1, max_length=255)


class LoginRequest(BaseModel):
    """POST /auth/login body."""
    email: EmailStr
    password: str


# ── Response Schemas ─────────────────────────────────────────

class UserResponse(BaseModel):
    """Public user representation (no password hash)."""
    id: UUID
    email: str
    full_name: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    """Returned after successful login/register."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
