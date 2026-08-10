"""Pydantic schemas for chatbot CRUD endpoints."""
from __future__ import annotations

from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field


# ── Request Schemas ──────────────────────────────────────────

class ChatbotCreate(BaseModel):
    """POST /chatbots body."""
    name: str = Field(..., min_length=1, max_length=255)
    description: str | None = None
    website_url: str | None = None
    ai_config: dict[str, Any] | None = None
    widget_config: dict[str, Any] | None = None


class ChatbotUpdate(BaseModel):
    """PATCH /chatbots/{id} body — all fields optional."""
    name: str | None = Field(None, min_length=1, max_length=255)
    description: str | None = None
    website_url: str | None = None
    status: str | None = None
    ai_config: dict[str, Any] | None = None
    widget_config: dict[str, Any] | None = None


# ── Response Schemas ─────────────────────────────────────────

class ChatbotSourceResponse(BaseModel):
    """Nested source inside chatbot response."""
    id: UUID
    source_type: str
    source_url: str | None
    chunk_count: int
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ChatbotResponse(BaseModel):
    """Public chatbot representation."""
    id: UUID
    organization_id: UUID
    name: str
    description: str | None
    website_url: str | None
    status: str
    ai_config: dict[str, Any] | None
    widget_config: dict[str, Any] | None
    embed_token: str
    total_conversations: int
    last_trained_at: datetime | None
    created_at: datetime
    updated_at: datetime
    sources: list[ChatbotSourceResponse] = []

    model_config = {"from_attributes": True}


class ChatbotListResponse(BaseModel):
    """Paginated list of chatbots."""
    items: list[ChatbotResponse]
    total: int
