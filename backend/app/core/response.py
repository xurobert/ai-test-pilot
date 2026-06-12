from typing import Any, Optional, TypeVar

T = TypeVar("T")


def success_response(
    data: Optional[T] = None,
    message: str = "Success",
    meta: Optional[dict[str, Any]] = None,
) -> dict[str, Any]:
    """Build a standardized success response."""
    response: dict[str, Any] = {
        "code": 0,
        "message": message,
        "data": data,
    }
    if meta is not None:
        response["meta"] = meta
    return response


def error_response(
    message: str = "Error",
    code: int = 500,
    data: Optional[Any] = None,
) -> dict[str, Any]:
    """Build a standardized error response."""
    response: dict[str, Any] = {
        "code": code,
        "message": message,
        "data": data,
    }
    return response


def paginated_response(
    items: list[T],
    total: int,
    page: int,
    page_size: int,
    message: str = "Success",
) -> dict[str, Any]:
    """Build a paginated response."""
    return success_response(
        data=items,
        message=message,
        meta={
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": (total + page_size - 1) // page_size,
        },
    )
