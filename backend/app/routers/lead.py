"""Lead management API — create, list, get, update, delete."""
from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.lead import (
    LeadCreate,
    LeadListResponse,
    LeadResponse,
    LeadUpdate,
)
from app.services import lead_service

router = APIRouter(prefix="/leads", tags=["Leads"])


@router.post(
    "",
    response_model=LeadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Tạo lead mới",
)
async def create_lead(
    body: LeadCreate,
    db: AsyncSession = Depends(get_db),
):
    """Tạo lead mới — thường được gọi từ chat widget khi khách hàng cung cấp
    thông tin liên hệ.

    Endpoint này không yêu cầu xác thực để widget có thể gọi trực tiếp.
    """
    lead = await lead_service.create_lead(
        db,
        chatbot_id=body.chatbot_id,
        conversation_id=body.conversation_id,
        email=body.email,
        phone=body.phone,
        name=body.name,
        custom_fields=body.custom_fields,
        source=body.source,
    )
    return LeadResponse.model_validate(lead)


@router.get(
    "",
    response_model=LeadListResponse,
    summary="Danh sách lead",
)
async def list_leads(
    chatbot_id: uuid.UUID | None = Query(None, description="Lọc theo chatbot"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Lấy danh sách lead của tổ chức (có phân trang, có thể lọc theo chatbot)."""
    leads, total = await lead_service.list_leads(
        db,
        user_id=current_user.id,
        chatbot_id=chatbot_id,
        skip=skip,
        limit=limit,
    )
    return LeadListResponse(
        items=[LeadResponse.model_validate(l) for l in leads],
        total=total,
    )


@router.get(
    "/{lead_id}",
    response_model=LeadResponse,
    summary="Chi tiết lead",
)
async def get_lead(
    lead_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Lấy thông tin chi tiết một lead."""
    lead = await lead_service.get_lead(
        db, lead_id=lead_id, user_id=current_user.id
    )
    if lead is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead không tồn tại hoặc bạn không có quyền truy cập.",
        )
    return LeadResponse.model_validate(lead)


@router.patch(
    "/{lead_id}",
    response_model=LeadResponse,
    summary="Cập nhật lead",
)
async def update_lead(
    lead_id: uuid.UUID,
    body: LeadUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Cập nhật thông tin lead (chỉ các trường được gửi lên)."""
    updates = body.model_dump(exclude_unset=True)
    if not updates:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Không có trường nào để cập nhật.",
        )

    lead = await lead_service.update_lead(
        db, lead_id=lead_id, user_id=current_user.id, updates=updates
    )
    if lead is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead không tồn tại hoặc bạn không có quyền truy cập.",
        )
    return LeadResponse.model_validate(lead)


@router.delete(
    "/{lead_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Xóa lead",
)
async def delete_lead(
    lead_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Xóa lead."""
    deleted = await lead_service.delete_lead(
        db, lead_id=lead_id, user_id=current_user.id
    )
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead không tồn tại hoặc bạn không có quyền truy cập.",
        )
