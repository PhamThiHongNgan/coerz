"""Chatbot CRUD API — create, list, get, update, delete."""
from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.chatbot import (
    ChatbotCreate,
    ChatbotListResponse,
    ChatbotResponse,
    ChatbotUpdate,
)
from app.services import chatbot_service

router = APIRouter(prefix="/chatbots", tags=["Chatbots"])


@router.post(
    "",
    response_model=ChatbotResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Tạo chatbot mới",
)
async def create_chatbot(
    body: ChatbotCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Tạo chatbot mới cho tổ chức của người dùng hiện tại."""
    try:
        chatbot = await chatbot_service.create_chatbot(
            db,
            user_id=current_user.id,
            name=body.name,
            description=body.description,
            website_url=body.website_url,
            ai_config=body.ai_config,
            widget_config=body.widget_config,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    return ChatbotResponse.model_validate(chatbot)


@router.get(
    "",
    response_model=ChatbotListResponse,
    summary="Danh sách chatbot",
)
async def list_chatbots(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Lấy danh sách chatbot của tổ chức (có phân trang)."""
    chatbots, total = await chatbot_service.list_chatbots(
        db, user_id=current_user.id, skip=skip, limit=limit
    )
    return ChatbotListResponse(
        items=[ChatbotResponse.model_validate(c) for c in chatbots],
        total=total,
    )


@router.get(
    "/{chatbot_id}",
    response_model=ChatbotResponse,
    summary="Chi tiết chatbot",
)
async def get_chatbot(
    chatbot_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Lấy thông tin chi tiết một chatbot theo ID."""
    chatbot = await chatbot_service.get_chatbot(
        db, chatbot_id=chatbot_id, user_id=current_user.id
    )
    if chatbot is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chatbot không tồn tại hoặc bạn không có quyền truy cập.",
        )
    return ChatbotResponse.model_validate(chatbot)


@router.patch(
    "/{chatbot_id}",
    response_model=ChatbotResponse,
    summary="Cập nhật chatbot",
)
async def update_chatbot(
    chatbot_id: uuid.UUID,
    body: ChatbotUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Cập nhật thông tin chatbot (chỉ các trường được gửi lên)."""
    updates = body.model_dump(exclude_unset=True)
    if not updates:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Không có trường nào để cập nhật.",
        )

    chatbot = await chatbot_service.update_chatbot(
        db, chatbot_id=chatbot_id, user_id=current_user.id, updates=updates
    )
    if chatbot is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chatbot không tồn tại hoặc bạn không có quyền truy cập.",
        )
    return ChatbotResponse.model_validate(chatbot)


@router.delete(
    "/{chatbot_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Xóa chatbot",
)
async def delete_chatbot(
    chatbot_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Xóa chatbot và tất cả dữ liệu liên quan (sources, conversations, leads)."""
    deleted = await chatbot_service.delete_chatbot(
        db, chatbot_id=chatbot_id, user_id=current_user.id
    )
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chatbot không tồn tại hoặc bạn không có quyền truy cập.",
        )
