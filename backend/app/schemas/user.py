"""User schemas."""
from datetime import datetime
from typing import Optional
from enum import Enum

from pydantic import BaseModel, EmailStr, Field


class UserRole(str, Enum):
    TE = "te"
    TAE = "tae"
    TM = "tm"
    PM = "pm"
    DEV = "dev"
    ADMIN = "admin"


class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=100)
    email: EmailStr
    role: UserRole = UserRole.TE
    tenant_id: int = 1


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=100)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=100)
    email: Optional[EmailStr] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserInDB(UserBase):
    id: int
    password_hash: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
