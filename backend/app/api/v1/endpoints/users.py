from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from app.api.deps import get_db, get_current_active_user
from app.core.response import success_response, paginated_response
from app.core.exceptions import NotFoundException
from app.schemas.user import UserCreate, UserUpdate, UserResponse, UserInDB, UserRole
from app.services.user_service import UserService

router = APIRouter()


@router.get("", response_model=dict)
async def list_users(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user),
) -> dict:
    """List all users (admin only)."""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    users, total = await UserService.get_multi(db, skip=skip, limit=limit)
    return paginated_response(
        items=[UserResponse.model_validate(u).model_dump() for u in users],
        total=total,
        page=skip // limit + 1,
        page_size=limit,
    )


@router.get("/{user_id}", response_model=dict)
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user),
) -> dict:
    """Get user by ID."""
    if current_user.role != UserRole.ADMIN and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied",
        )
    user = await UserService.get_by_id(db, user_id)
    if not user:
        raise NotFoundException("User not found")
    return success_response(
        data=UserResponse.model_validate(user).model_dump(),
    )


@router.put("/{user_id}", response_model=dict)
async def update_user(
    user_id: int,
    user_in: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user),
) -> dict:
    """Update user."""
    if current_user.role != UserRole.ADMIN and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied",
        )
    user = await UserService.get_by_id(db, user_id)
    if not user:
        raise NotFoundException("User not found")
    updated = await UserService.update(db, user, user_in)
    return success_response(
        data=UserResponse.model_validate(updated).model_dump(),
        message="User updated",
    )


@router.delete("/{user_id}", response_model=dict)
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user),
) -> dict:
    """Delete user (admin only)."""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    user = await UserService.get_by_id(db, user_id)
    if not user:
        raise NotFoundException("User not found")
    await UserService.delete(db, user_id)
    return success_response(message="User deleted")
