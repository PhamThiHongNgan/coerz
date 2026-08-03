from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, text
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Chatbot(Base):
    __tablename__ = "chatbots"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    organization_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    website_url: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    status: Mapped[str] = mapped_column(
        String(50), default="draft", server_default="draft"
    )

    # AI configuration
    ai_config: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
        default=lambda: {
            "model": "gpt-4o-mini",
            "temperature": 0.7,
            "system_prompt": "You are a helpful assistant.",
        },
    )

    # Widget configuration
    widget_config: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
        default=lambda: {
            "theme": "light",
            "position": "bottom-right",
            "primary_color": "#6366f1",
            "text_color": "#ffffff",
            "avatar": None,
        },
    )

    embed_token: Mapped[str] = mapped_column(
        String(255), unique=True, nullable=False, index=True
    )
    total_conversations: Mapped[int] = mapped_column(
        Integer, default=0, server_default=text("0")
    )
    last_trained_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        server_default=text("now()"),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        server_default=text("now()"),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    organization = relationship("Organization", back_populates="chatbots")
    sources = relationship("ChatbotSource", back_populates="chatbot", lazy="selectin", cascade="all, delete-orphan")
    conversations = relationship("Conversation", back_populates="chatbot", lazy="noload", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Chatbot {self.name}>"
