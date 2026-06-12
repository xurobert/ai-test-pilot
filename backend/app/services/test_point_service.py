"""Test point service."""
from typing import Optional, List

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.models.test_point import TestPoint, TestPointStatus
from app.schemas.test_point import TestPointCreate, TestPointUpdate, TestPointStatus as TestPointStatusEnum


class TestPointService:
    @staticmethod
    async def get_by_id(db: AsyncSession, test_point_id: int) -> Optional[TestPoint]:
        result = await db.execute(select(TestPoint).where(TestPoint.id == test_point_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_multi(
        db: AsyncSession,
        requirement_id: Optional[int] = None,
        status: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> tuple[List[TestPoint], int]:
        query = select(TestPoint)
        if requirement_id:
            query = query.where(TestPoint.requirement_id == requirement_id)
        if status:
            query = query.where(TestPoint.status == status)
        result = await db.execute(query.offset(skip).limit(limit))
        test_points = result.scalars().all()
        count_query = select(func.count()).select_from(TestPoint)
        if requirement_id:
            count_query = count_query.where(TestPoint.requirement_id == requirement_id)
        if status:
            count_query = count_query.where(TestPoint.status == status)
        total_result = await db.execute(count_query)
        total = total_result.scalar_one()
        return list(test_points), total

    @staticmethod
    async def create(db: AsyncSession, test_point_in: TestPointCreate) -> TestPoint:
        test_point = TestPoint(
            content=test_point_in.content,
            priority=test_point_in.priority,
            confidence_score=test_point_in.confidence_score,
            status=test_point_in.status,
            ai_reasoning=test_point_in.ai_reasoning,
            requirement_id=test_point_in.requirement_id,
        )
        db.add(test_point)
        await db.commit()
        await db.refresh(test_point)
        return test_point

    @staticmethod
    async def update(db: AsyncSession, test_point: TestPoint, test_point_in: TestPointUpdate) -> TestPoint:
        update_data = test_point_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(test_point, field, value)
        await db.commit()
        await db.refresh(test_point)
        return test_point

    @staticmethod
    async def update_status(db: AsyncSession, test_point: TestPoint, status: TestPointStatusEnum) -> TestPoint:
        test_point.status = status
        await db.commit()
        await db.refresh(test_point)
        return test_point

    @staticmethod
    async def delete(db: AsyncSession, test_point_id: int) -> None:
        test_point = await TestPointService.get_by_id(db, test_point_id)
        if test_point:
            await db.delete(test_point)
            await db.commit()
