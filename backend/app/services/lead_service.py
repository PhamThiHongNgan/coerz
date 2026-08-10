"""Lead management service — create, list, update, delete leads."""
from __future__ import annotations

import uuid
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.lead import Lead
from app.models.chatbot import Chatbot
from app.models.organization_member import OrganizationMember


async def _verify_chatbot_access(
    db: AsyncSession,
    chatbot_id: uuid.UUID,
    user_id: uuid.UUID,
) -> bool:
    """Check if the user's org owns the chatbot."""
    result = await db.execute(
        select(Chatbot.organization_id).where(Chatbot.id == chatbot_id)
    )
    chatbot_org_id = result.scalar_one_or_none()
    if chatbot_org_id is None:
        return False

    member_result = await db.execute(
        select(OrganizationMember.id).where(
            OrganizationMember.user_id == user_id,
            OrganizationMember.organization_id == chatbot_org_id,
        )
    )
    return member_result.scalar_one_or_none() is not None


async def create_lead(
    db: AsyncSession,
    *,
    chatbot_id: uuid.UUID,
    conversation_id: uuid.UUID | None = None,
    email: str | None = None,
    phone: str | None = None,
    name: str | None = None,
    custom_fields: dict[str, Any] | None = None,
    source: str = "chat",
) -> Lead:
    """Create a new lead linked to a chatbot."""
    lead = Lead(
        chatbot_id=chatbot_id,
        conversation_id=conversation_id,
        email=email,
        phone=phone,
        name=name,
        custom_fields=custom_fields or {},
        source=source,
    )
    db.add(lead)
    await db.flush()
    return lead


async def list_leads(
    db: AsyncSession,
    *,
    user_id: uuid.UUID,
    chatbot_id: uuid.UUID | None = None,
    skip: int = 0,
    limit: int = 50,
) -> tuple[list[Lead], int]:
    """Return (leads, total_count) for chatbots owned by the user's org."""
    # Get all chatbot IDs the user has access to
    from app.services.chatbot_service import _get_user_org_id
    org_id = await _get_user_org_id(db, user_id)

    chatbot_ids_query = select(Chatbot.id).where(Chatbot.organization_id == org_id)

    # Base query
    base = select(Lead).where(Lead.chatbot_id.in_(chatbot_ids_query))
    count_base = select(func.count()).select_from(Lead).where(Lead.chatbot_id.in_(chatbot_ids_query))

    if chatbot_id is not None:
        base = base.where(Lead.chatbot_id == chatbot_id)
        count_base = count_base.where(Lead.chatbot_id == chatbot_id)

    # Total
    count_result = await db.execute(count_base)
    total = count_result.scalar() or 0

    # Paginated list
    result = await db.execute(
        base.order_by(Lead.captured_at.desc()).offset(skip).limit(limit)
    )
    leads = list(result.scalars().all())

    return leads, total


async def get_lead(
    db: AsyncSession,
    *,
    lead_id: uuid.UUID,
    user_id: uuid.UUID,
) -> Lead | None:
    """Get a single lead if the user has access to its chatbot."""
    result = await db.execute(select(Lead).where(Lead.id == lead_id))
    lead = result.scalar_one_or_none()
    if lead is None:
        return None

    has_access = await _verify_chatbot_access(db, lead.chatbot_id, user_id)
    if not has_access:
        return None

    return lead


async def update_lead(
    db: AsyncSession,
    *,
    lead_id: uuid.UUID,
    user_id: uuid.UUID,
    updates: dict[str, Any],
) -> Lead | None:
    """Update a lead's fields."""
    lead = await get_lead(db, lead_id=lead_id, user_id=user_id)
    if lead is None:
        return None

    for field, value in updates.items():
        if value is not None and hasattr(lead, field):
            setattr(lead, field, value)

    await db.flush()
    return lead


async def delete_lead(
    db: AsyncSession,
    *,
    lead_id: uuid.UUID,
    user_id: uuid.UUID,
) -> bool:
    """Delete a lead. Returns True if deleted."""
    lead = await get_lead(db, lead_id=lead_id, user_id=user_id)
    if lead is None:
        return False

    await db.delete(lead)
    await db.flush()
    return True
