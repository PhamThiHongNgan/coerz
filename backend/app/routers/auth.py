"""Authentication API — register, login, current user."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
)
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Đăng ký tài khoản mới",
)
async def register(body: RegisterRequest, db: AsyncSession = Depends(get_db)):
    """Tạo tài khoản mới kèm tổ chức (organization) cá nhân.
    Trả về JWT access token.
    """
    try:
        user, token = await auth_service.register_user(
            db,
            email=body.email,
            password=body.password,
            full_name=body.full_name,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Đăng nhập",
)
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Xác thực bằng email + mật khẩu. Trả về JWT access token."""
    try:
        user, token = await auth_service.authenticate_user(
            db,
            email=body.email,
            password=body.password,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e)
        )

    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Thông tin người dùng hiện tại",
)
async def get_me(current_user: User = Depends(get_current_user)):
    """Trả về thông tin user đang đăng nhập (yêu cầu Bearer token)."""
    return UserResponse.model_validate(current_user)
