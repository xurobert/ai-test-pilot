"""Project model."""
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum
from sqlalchemy.sql import func
from enum import Enum as PyEnum

from app.db.base import Base


class ProjectStatus(PyEnum):
    ACTIVE = "active"
    ARCHIVED = "archived"
    DRAFT = "draft"


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, nullable=False, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(Enum(ProjectStatus), default=ProjectStatus.ACTIVE, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    def __repr__(self) -> str:
        return f"<Project(id={self.id}, name={self.name})>"
