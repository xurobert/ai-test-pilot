from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from app.api.deps import get_db, get_current_active_user
from app.core.response import success_response, paginated_response
from app.core.exceptions import NotFoundException
from app.schemas.requirement import (
    RequirementCreate,
    RequirementUpdate,
    RequirementResponse,
    RequirementWithTestPoints,
)
from app.schemas.user import UserInDB
from app.services.requirement_service import RequirementService
from app.utils.file_handler import save_upload_file

router = APIRouter()


@router.get("", response_model=dict)
async def list_requirements(
    project_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user),
) -> dict:
    """List requirements."""
    requirements, total = await RequirementService.get_multi(
        db, project_id=project_id, skip=skip, limit=limit
    )
    return paginated_response(
        items=[RequirementResponse.model_validate(r).model_dump() for r in requirements],
        total=total,
        page=skip // limit + 1,
        page_size=limit,
    )


@router.post("", response_model=dict)
async def create_requirement(
    requirement_in: RequirementCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user),
) -> dict:
    """Create new requirement."""
    requirement = await RequirementService.create(db, requirement_in)
    return success_response(
        data=RequirementResponse.model_validate(requirement).model_dump(),
        message="Requirement created",
    )


@router.get("/{requirement_id}", response_model=dict)
async def get_requirement(
    requirement_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user),
) -> dict:
    """Get requirement by ID."""
    requirement = await RequirementService.get_by_id(db, requirement_id)
    if not requirement:
        raise NotFoundException("Requirement not found")
    return success_response(
        data=RequirementResponse.model_validate(requirement).model_dump(),
    )


@router.put("/{requirement_id}", response_model=dict)
async def update_requirement(
    requirement_id: int,
    requirement_in: RequirementUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user),
) -> dict:
    """Update requirement."""
    requirement = await RequirementService.get_by_id(db, requirement_id)
    if not requirement:
        raise NotFoundException("Requirement not found")
    updated = await RequirementService.update(db, requirement, requirement_in)
    return success_response(
        data=RequirementResponse.model_validate(updated).model_dump(),
        message="Requirement updated",
    )


@router.delete("/{requirement_id}", response_model=dict)
async def delete_requirement(
    requirement_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user),
) -> dict:
    """Delete requirement."""
    requirement = await RequirementService.get_by_id(db, requirement_id)
    if not requirement:
        raise NotFoundException("Requirement not found")
    await RequirementService.delete(db, requirement_id)
    return success_response(message="Requirement deleted")


@router.post("/upload", response_model=dict)
async def upload_prd_new(
    file: UploadFile = File(...),
    project_id: str = Form(...),
    db: AsyncSession = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user),
) -> dict:
    """Upload PRD file for a project."""
    # Validate file type
    allowed_types = [
        'application/pdf',
        'application/octet-stream',  # Some browsers send this for PDFs
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/markdown',
        'text/plain',
    ]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type: {file.content_type}. Allowed: PDF, Word, Markdown",
        )
    
    # Save file
    file_path = await save_upload_file(file, f"prd/{project_id}")
    
    # Create a requirement entry
    requirement_in = RequirementCreate(
        project_id=int(project_id),
        title=file.filename or "Uploaded PRD",
        description="",
    )
    requirement = await RequirementService.create(db, requirement_in)
    
    # Update with file path
    updated = await RequirementService.update_prd_path(db, requirement, file_path)
    
    return success_response(
        data=RequirementResponse.model_validate(updated).model_dump(),
        message="PRD uploaded successfully",
    )


@router.post("/{requirement_id}/parse-prd", response_model=dict)
async def parse_prd(
    requirement_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user),
) -> dict:
    """Parse uploaded PRD file (placeholder)."""
    requirement = await RequirementService.get_by_id(db, requirement_id)
    if not requirement:
        raise NotFoundException("Requirement not found")
    if not requirement.prd_file_path:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No PRD file uploaded",
        )
    # TODO: Implement actual PRD parsing logic
    return success_response(
        data={"parsed_content": "Placeholder parsed content", "requirement_id": requirement_id},
        message="PRD parsed (placeholder)",
    )


@router.post("/{requirement_id}/generate-test-points", response_model=dict)
async def generate_test_points(
    requirement_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user),
) -> dict:
    """Generate test points from requirement (placeholder)."""
    requirement = await RequirementService.get_by_id(db, requirement_id)
    if not requirement:
        raise NotFoundException("Requirement not found")
    # TODO: Implement AI test point generation
    return success_response(
        data={"generated_count": 0, "requirement_id": requirement_id},
        message="Test points generated (placeholder)",
    )
