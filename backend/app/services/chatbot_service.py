"""Chatbot CRUD service — create, read, update, delete chatbots."""
from __future__ import annotations

import secrets
import uuid
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.chatbot import Chatbot
from app.models.organization_member import OrganizationMember


async def _get_user_org_id(db: AsyncSession, user_id: uuid.UUID) -> uuid.UUID:
    """Return the first organization the user belongs to.

    Raises ValueError if the user is not a member of any organization.
    """
    result = await db.execute(
        select(OrganizationMember.organization_id)
        .where(OrganizationMember.user_id == user_id)
        .limit(1)
    )
    org_id = result.scalar_one_or_none()
    if org_id is None:
        raise ValueError("Người dùng chưa thuộc tổ chức nào.")
    return org_id


async def create_chatbot(
    db: AsyncSession,
    *,
    user_id: uuid.UUID,
    name: str,
    description: str | None = None,
    website_url: str | None = None,
    ai_config: dict[str, Any] | None = None,
    widget_config: dict[str, Any] | None = None,
) -> Chatbot:
    """Create a new chatbot under the user's organization."""
    org_id = await _get_user_org_id(db, user_id)

    # Generate a unique embed token
    embed_token = secrets.token_urlsafe(32)

    chatbot = Chatbot(
        organization_id=org_id,
        name=name,
        description=description,
        website_url=website_url,
        ai_config=ai_config or {
            "model": "gpt-4o-mini",
            "temperature": 0.7,
            "system_prompt": "You are a helpful assistant.",
        },
        widget_config=widget_config or {
            "theme": "light",
            "position": "bottom-right",
            "primary_color": "#6366f1",
            "text_color": "#ffffff",
            "avatar": None,
        },
        embed_token=embed_token,
        status="draft",
    )
    db.add(chatbot)
    await db.flush()
    return chatbot


async def list_chatbots(
    db: AsyncSession,
    *,
    user_id: uuid.UUID,
    skip: int = 0,
    limit: int = 50,
) -> tuple[list[Chatbot], int]:
    """Return (chatbots, total_count) for the user's organization."""
    org_id = await _get_user_org_id(db, user_id)

    # Total count
    count_result = await db.execute(
        select(func.count()).select_from(Chatbot).where(Chatbot.organization_id == org_id)
    )
    total = count_result.scalar() or 0

    # Paginated list with sources eagerly loaded
    result = await db.execute(
        select(Chatbot)
        .options(selectinload(Chatbot.sources))
        .where(Chatbot.organization_id == org_id)
        .order_by(Chatbot.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    chatbots = list(result.scalars().all())

    return chatbots, total


async def get_chatbot(
    db: AsyncSession,
    *,
    chatbot_id: uuid.UUID,
    user_id: uuid.UUID,
) -> Chatbot | None:
    """Get a single chatbot if the user has access."""
    org_id = await _get_user_org_id(db, user_id)

    result = await db.execute(
        select(Chatbot)
        .options(selectinload(Chatbot.sources))
        .where(Chatbot.id == chatbot_id, Chatbot.organization_id == org_id)
    )
    return result.scalar_one_or_none()


async def update_chatbot(
    db: AsyncSession,
    *,
    chatbot_id: uuid.UUID,
    user_id: uuid.UUID,
    updates: dict[str, Any],
) -> Chatbot | None:
    """Update a chatbot's fields. Returns None if not found or unauthorized."""
    chatbot = await get_chatbot(db, chatbot_id=chatbot_id, user_id=user_id)
    if chatbot is None:
        return None

    for field, value in updates.items():
        if value is not None and hasattr(chatbot, field):
            setattr(chatbot, field, value)

    await db.flush()
    return chatbot


async def delete_chatbot(
    db: AsyncSession,
    *,
    chatbot_id: uuid.UUID,
    user_id: uuid.UUID,
) -> bool:
    """Delete a chatbot. Returns True if deleted, False if not found."""
    chatbot = await get_chatbot(db, chatbot_id=chatbot_id, user_id=user_id)
    if chatbot is None:
        return False

    await db.delete(chatbot)
    await db.flush()
    return True
