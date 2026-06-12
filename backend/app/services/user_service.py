"""User service."""
from typing import Optional, List

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash


class UserService:
    @staticmethod
    async def get_by_id(db: AsyncSession, user_id: int) -> Optional[User]:
        result = await db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_email(db: AsyncSession, email: str) -> Optional[User]:
        result = await db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_username(db: AsyncSession, username: str) -> Optional[User]:
        result = await db.execute(select(User).where(User.username == username))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_multi(
        db: AsyncSession, skip: int = 0, limit: int = 100
    ) -> tuple[List[User], int]:
        result = await db.execute(select(User).offset(skip).limit(limit))
        users = result.scalars().all()
        total_result = await db.execute(select(func.count()).select_from(User))
        total = total_result.scalar_one()
        return list(users), total

    @staticmethod
    async def create(db: AsyncSession, user_in: UserCreate) -> User:
        user = User(
            username=user_in.username,
            email=user_in.email,
            password_hash=get_password_hash(user_in.password),
            role=user_in.role,
            tenant_id=user_in.tenant_id,
            is_active=True,
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user

    @staticmethod
    async def update(db: AsyncSession, user: User, user_in: UserUpdate) -> User:
        update_data = user_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)
        await db.commit()
        await db.refresh(user)
        return user

    @staticmethod
    async def delete(db: AsyncSession, user_id: int) -> None:
        user = await UserService.get_by_id(db, user_id)
        if user:
            await db.delete(user)
            await db.commit()
