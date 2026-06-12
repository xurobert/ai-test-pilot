"""Test point model."""
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from enum import Enum as PyEnum

from app.db.base import Base


class TestPointPriority(PyEnum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class TestPointStatus(PyEnum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    MODIFIED = "modified"
    REJECTED = "rejected"


class TestPoint(Base):
    __tablename__ = "test_points"

    id = Column(Integer, primary_key=True, index=True)
    requirement_id = Column(Integer, ForeignKey("requirements.id", ondelete="CASCADE"), nullable=False, index=True)
    content = Column(Text, nullable=False)
    priority = Column(Enum(TestPointPriority), default=TestPointPriority.MEDIUM, nullable=False)
    confidence_score = Column(Float, default=0.0, nullable=False)
    status = Column(Enum(TestPointStatus), default=TestPointStatus.PENDING, nullable=False)
    ai_reasoning = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    def __repr__(self) -> str:
        return f"<TestPoint(id={self.id}, priority={self.priority.value})>"
