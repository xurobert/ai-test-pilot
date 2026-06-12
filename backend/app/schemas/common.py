"""Common response schemas."""
from typing import Any, Optional, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class APIResponse(BaseModel):
    code: int
    message: str
    data: Optional[Any] = None
    meta: Optional[dict[str, Any]] = None


class PaginationMeta(BaseModel):
    total: int
    page: int
    page_size: int
    total_pages: int


class PaginatedResponse(BaseModel):
    code: int = 0
    message: str = "Success"
    data: list[Any]
    meta: PaginationMeta
