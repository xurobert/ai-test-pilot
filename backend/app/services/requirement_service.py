"""Requirement service."""
from typing import Optional, List

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.models.requirement import Requirement, RequirementStatus
from app.schemas.requirement import RequirementCreate, RequirementUpdate


class RequirementService:
    @staticmethod
    async def get_by_id(db: AsyncSession, requirement_id: int) -> Optional[Requirement]:
        result = await db.execute(select(Requirement).where(Requirement.id == requirement_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_multi(
        db: AsyncSession,
        project_id: Optional[int] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> tuple[List[Requirement], int]:
        query = select(Requirement)
        if project_id:
            query = query.where(Requirement.project_id == project_id)
        result = await db.execute(query.offset(skip).limit(limit))
        requirements = result.scalars().all()
        count_query = select(func.count()).select_from(Requirement)
        if project_id:
            count_query = count_query.where(Requirement.project_id == project_id)
        total_result = await db.execute(count_query)
        total = total_result.scalar_one()
        return list(requirements), total

    @staticmethod
    async def create(db: AsyncSession, requirement_in: RequirementCreate) -> Requirement:
        requirement = Requirement(
            title=requirement_in.title,
            description=requirement_in.description,
            status=requirement_in.status,
            project_id=requirement_in.project_id,
        )
        db.add(requirement)
        await db.commit()
        await db.refresh(requirement)
        return requirement

    @staticmethod
    async def update(db: AsyncSession, requirement: Requirement, requirement_in: RequirementUpdate) -> Requirement:
        update_data = requirement_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(requirement, field, value)
        await db.commit()
        await db.refresh(requirement)
        return requirement

    @staticmethod
    async def update_prd_path(db: AsyncSession, requirement: Requirement, file_path: str) -> Requirement:
        requirement.prd_file_path = file_path
        await db.commit()
        await db.refresh(requirement)
        return requirement

    @staticmethod
    async def delete(db: AsyncSession, requirement_id: int) -> None:
        requirement = await RequirementService.get_by_id(db, requirement_id)
        if requirement:
            await db.delete(requirement)
            await db.commit()
