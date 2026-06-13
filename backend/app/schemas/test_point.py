"""Test point schemas."""
from datetime import datetime
from typing import Optional
from enum import Enum

from pydantic import BaseModel, Field


class TestPointPriority(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class TestPointStatus(str, Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    MODIFIED = "MODIFIED"
    REJECTED = "REJECTED"


class TestPointBase(BaseModel):
    content: str = Field(..., min_length=1)
    priority: TestPointPriority = TestPointPriority.MEDIUM
    confidence_score: float = Field(0.0, ge=0.0, le=1.0)
    status: TestPointStatus = TestPointStatus.PENDING
    ai_reasoning: Optional[str] = None


class TestPointCreate(TestPointBase):
    requirement_id: int


class TestPointUpdate(BaseModel):
    content: Optional[str] = None
    priority: Optional[TestPointPriority] = None
    confidence_score: Optional[float] = Field(None, ge=0.0, le=1.0)
    status: Optional[TestPointStatus] = None
    ai_reasoning: Optional[str] = None


class TestPointResponse(TestPointBase):
    id: int
    requirement_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
