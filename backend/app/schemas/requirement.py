"""Requirement schemas."""
from datetime import datetime
from typing import Optional, List
from enum import Enum

from pydantic import BaseModel, Field

from app.schemas.test_point import TestPointResponse


class RequirementStatus(str, Enum):
    DRAFT = "DRAFT"
    ANALYZING = "ANALYZING"
    ANALYZED = "ANALYZED"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class RequirementBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=300)
    description: Optional[str] = None
    status: RequirementStatus = RequirementStatus.DRAFT


class RequirementCreate(RequirementBase):
    project_id: int


class RequirementUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=300)
    description: Optional[str] = None
    status: Optional[RequirementStatus] = None


class RequirementResponse(RequirementBase):
    id: int
    project_id: int
    prd_file_path: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class RequirementWithTestPoints(RequirementResponse):
    test_points: List[TestPointResponse] = []
