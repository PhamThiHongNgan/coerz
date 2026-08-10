"""Pydantic schemas for lead management endpoints."""
from __future__ import annotations

from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


# ── Request Schemas ──────────────────────────────────────────

class LeadCreate(BaseModel):
    """POST /leads body — typically created by the chat widget."""
    chatbot_id: UUID
    conversation_id: UUID | None = None
    email: EmailStr | None = None
    phone: str | None = Field(None, max_length=50)
    name: str | None = Field(None, max_length=255)
    custom_fields: dict[str, Any] | None = None
    source: str = "chat"


class LeadUpdate(BaseModel):
    """PATCH /leads/{id} body."""
    email: EmailStr | None = None
    phone: str | None = Field(None, max_length=50)
    name: str | None = Field(None, max_length=255)
    custom_fields: dict[str, Any] | None = None
    source: str | None = None


# ── Response Schemas ─────────────────────────────────────────

class LeadResponse(BaseModel):
    """Public lead representation."""
    id: UUID
    chatbot_id: UUID
    conversation_id: UUID | None
    email: str | None
    phone: str | None
    name: str | None
    custom_fields: dict[str, Any] | None
    source: str
    captured_at: datetime

    model_config = {"from_attributes": True}


class LeadListResponse(BaseModel):
    """Paginated list of leads."""
    items: list[LeadResponse]
    total: int
