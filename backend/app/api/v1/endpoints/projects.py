from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from app.api.deps import get_db, get_current_active_user
from app.core.response import success_response, paginated_response
from app.core.exceptions import NotFoundException
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
from app.schemas.user import UserInDB, UserRole
from app.services.project_service import ProjectService

router = APIRouter()


@router.get("", response_model=dict)
async def list_projects(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user),
) -> dict:
    """List projects for current tenant."""
    projects, total = await ProjectService.get_multi(
        db, tenant_id=current_user.tenant_id, skip=skip, limit=limit, status=status
    )
    return paginated_response(
        items=[ProjectResponse.model_validate(p).model_dump() for p in projects],
        total=total,
        page=skip // limit + 1,
        page_size=limit,
    )


@router.post("", response_model=dict)
async def create_project(
    project_in: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user),
) -> dict:
    """Create new project."""
    project = await ProjectService.create(db, project_in, tenant_id=current_user.tenant_id)
    return success_response(
        data=ProjectResponse.model_validate(project).model_dump(),
        message="Project created",
    )


@router.get("/{project_id}", response_model=dict)
async def get_project(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user),
) -> dict:
    """Get project by ID."""
    project = await ProjectService.get_by_id(db, project_id)
    if not project or project.tenant_id != current_user.tenant_id:
        raise NotFoundException("Project not found")
    return success_response(
        data=ProjectResponse.model_validate(project).model_dump(),
    )


@router.put("/{project_id}", response_model=dict)
async def update_project(
    project_id: int,
    project_in: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user),
) -> dict:
    """Update project."""
    project = await ProjectService.get_by_id(db, project_id)
    if not project or project.tenant_id != current_user.tenant_id:
        raise NotFoundException("Project not found")
    updated = await ProjectService.update(db, project, project_in)
    return success_response(
        data=ProjectResponse.model_validate(updated).model_dump(),
        message="Project updated",
    )


@router.delete("/{project_id}", response_model=dict)
async def delete_project(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user),
) -> dict:
    """Delete project."""
    project = await ProjectService.get_by_id(db, project_id)
    if not project or project.tenant_id != current_user.tenant_id:
        raise NotFoundException("Project not found")
    await ProjectService.delete(db, project_id)
    return success_response(message="Project deleted")
