"""Project service."""
from typing import Optional, List

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_

from app.models.project import Project, ProjectStatus
from app.schemas.project import ProjectCreate, ProjectUpdate


class ProjectService:
    @staticmethod
    async def get_by_id(db: AsyncSession, project_id: int) -> Optional[Project]:
        result = await db.execute(select(Project).where(Project.id == project_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_multi(
        db: AsyncSession,
        tenant_id: int,
        skip: int = 0,
        limit: int = 100,
        status: Optional[str] = None,
    ) -> tuple[List[Project], int]:
        query = select(Project).where(Project.tenant_id == tenant_id)
        if status:
            query = query.where(Project.status == status)
        result = await db.execute(query.offset(skip).limit(limit))
        projects = result.scalars().all()
        count_query = select(func.count()).select_from(Project).where(Project.tenant_id == tenant_id)
        if status:
            count_query = count_query.where(Project.status == status)
        total_result = await db.execute(count_query)
        total = total_result.scalar_one()
        return list(projects), total

    @staticmethod
    async def create(db: AsyncSession, project_in: ProjectCreate, tenant_id: int) -> Project:
        project = Project(
            name=project_in.name,
            description=project_in.description,
            status=project_in.status,
            tenant_id=tenant_id,
        )
        db.add(project)
        await db.commit()
        await db.refresh(project)
        return project

    @staticmethod
    async def update(db: AsyncSession, project: Project, project_in: ProjectUpdate) -> Project:
        update_data = project_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(project, field, value)
        await db.commit()
        await db.refresh(project)
        return project

    @staticmethod
    async def delete(db: AsyncSession, project_id: int) -> None:
        project = await ProjectService.get_by_id(db, project_id)
        if project:
            await db.delete(project)
            await db.commit()
