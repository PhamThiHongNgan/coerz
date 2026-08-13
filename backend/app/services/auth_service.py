"""Authentication service — register, login, lookup."""
from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import User
from app.models.organization import Organization
from app.models.organization_member import OrganizationMember


async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    """Find a user by email address."""
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def register_user(
    db: AsyncSession,
    *,
    email: str,
    password: str,
    full_name: str,
) -> tuple[User, str]:
    """Create a new user + personal organization. Returns (user, access_token).

    Raises ValueError if the email is already taken.
    """
    existing = await get_user_by_email(db, email)
    if existing is not None:
        raise ValueError("Email này đã được đăng ký.")

    # Create user
    user = User(
        email=email,
        password_hash=hash_password(password),
        full_name=full_name,
    )
    db.add(user)
    await db.flush()  # get user.id

    # Create a personal organization for the user
    slug = email.split("@")[0].lower().replace(".", "-") + "-" + str(user.id)[:8]
    org = Organization(
        name=f"{full_name}'s Organization",
        slug=slug,
        plan="free",
    )
    db.add(org)
    await db.flush()  # get org.id

    # Link user → organization as owner
    membership = OrganizationMember(
        organization_id=org.id,
        user_id=user.id,
        role="owner",
    )
    db.add(membership)

    # Generate JWT
    token = create_access_token(data={"sub": str(user.id)})

    return user, token


async def authenticate_user(
    db: AsyncSession,
    *,
    email: str,
    password: str,
) -> tuple[User, str]:
    """Verify credentials and return (user, access_token).

    Raises ValueError on bad credentials.
    """
    user = await get_user_by_email(db, email)
    if user is None:
        raise ValueError("Email hoặc mật khẩu không đúng.")

    if not verify_password(password, user.password_hash):
        raise ValueError("Email hoặc mật khẩu không đúng.")

    if not user.is_active:
        raise ValueError("Tài khoản đã bị vô hiệu hóa.")

    token = create_access_token(data={"sub": str(user.id)})
    return user, token
