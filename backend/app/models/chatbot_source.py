from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class ChatbotSource(Base):
    __tablename__ = "chatbot_sources"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    chatbot_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("chatbots.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    source_type: Mapped[str] = mapped_column(
        String(50), nullable=False
    )  # url, sitemap, document, text
    source_url: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    content_hash: Mapped[str | None] = mapped_column(String(64), nullable=True)
    raw_content: Mapped[str | None] = mapped_column(Text, nullable=True)
    chunk_count: Mapped[int] = mapped_column(
        Integer, default=0, server_default=text("0")
    )
    status: Mapped[str] = mapped_column(
        String(50), default="pending", server_default="pending"
    )  # pending, processing, completed, failed
    processed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        server_default=text("now()"),
    )

    # Relationships
    chatbot = relationship("Chatbot", back_populates="sources")

    def __repr__(self) -> str:
        return f"<ChatbotSource {self.source_type} chatbot={self.chatbot_id}>"
