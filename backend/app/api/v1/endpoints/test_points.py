from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from app.api.deps import get_db, get_current_active_user
from app.core.response import success_response, paginated_response
from app.core.exceptions import NotFoundException
from app.schemas.test_point import (
    TestPointCreate,
    TestPointUpdate,
    TestPointResponse,
    TestPointStatus,
)
from app.schemas.user import UserInDB
from app.services.test_point_service import TestPointService

router = APIRouter()


@router.get("", response_model=dict)
async def list_test_points(
    requirement_id: Optional[int] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user),
) -> dict:
    """List test points."""
    test_points, total = await TestPointService.get_multi(
        db, requirement_id=requirement_id, status=status, skip=skip, limit=limit
    )
    return paginated_response(
        items=[TestPointResponse.model_validate(tp).model_dump() for tp in test_points],
        total=total,
        page=skip // limit + 1,
        page_size=limit,
    )


@router.get("/{test_point_id}", response_model=dict)
async def get_test_point(
    test_point_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user),
) -> dict:
    """Get test point by ID."""
    test_point = await TestPointService.get_by_id(db, test_point_id)
    if not test_point:
        raise NotFoundException("Test point not found")
    return success_response(
        data=TestPointResponse.model_validate(test_point).model_dump(),
    )


@router.patch("/{test_point_id}/status", response_model=dict)
async def update_test_point_status(
    test_point_id: int,
    status: TestPointStatus,
    db: AsyncSession = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user),
) -> dict:
    """Update test point status."""
    test_point = await TestPointService.get_by_id(db, test_point_id)
    if not test_point:
        raise NotFoundException("Test point not found")
    updated = await TestPointService.update_status(db, test_point, status)
    return success_response(
        data=TestPointResponse.model_validate(updated).model_dump(),
        message="Status updated",
    )


@router.post("/{test_point_id}/regenerate", response_model=dict)
async def regenerate_test_point(
    test_point_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user),
) -> dict:
    """Regenerate test point (placeholder)."""
    test_point = await TestPointService.get_by_id(db, test_point_id)
    if not test_point:
        raise NotFoundException("Test point not found")
    # TODO: Implement AI regeneration logic
    return success_response(
        data=TestPointResponse.model_validate(test_point).model_dump(),
        message="Test point regenerated (placeholder)",
    )
