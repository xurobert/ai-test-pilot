"""User model."""
from datetime import datetime, timezone
from enum import Enum as PyEnum

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.sql import func

from app.db.base import Base


class UserRole(PyEnum):
    TE = "TE"          # Test Engineer
    TAE = "TAE"        # Test Automation Engineer
    TM = "TM"          # Test Manager
    PM = "PM"          # Product Manager
    DEV = "DEV"        # Developer
    ADMIN = "ADMIN"    # Administrator


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, nullable=False, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.TE)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    def __repr__(self) -> str:
        return f"<User(id={self.id}, username={self.username}, role={self.role.value})>"
