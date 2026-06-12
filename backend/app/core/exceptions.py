from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.response import error_response


class APIException(Exception):
    """Custom API exception with error code."""

    def __init__(self, code: int, message: str, status_code: int = 400):
        self.code = code
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class BadRequestException(APIException):
    def __init__(self, message: str = "Bad request"):
        super().__init__(code=400, message=message, status_code=400)


class UnauthorizedException(APIException):
    def __init__(self, message: str = "Unauthorized"):
        super().__init__(code=401, message=message, status_code=401)


class ForbiddenException(APIException):
    def __init__(self, message: str = "Forbidden"):
        super().__init__(code=403, message=message, status_code=403)


class NotFoundException(APIException):
    def __init__(self, message: str = "Not found"):
        super().__init__(code=404, message=message, status_code=404)


class InternalErrorException(APIException):
    def __init__(self, message: str = "Internal server error"):
        super().__init__(code=500, message=message, status_code=500)


def add_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(APIException)
    async def api_exception_handler(request: Request, exc: APIException) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content=error_response(exc.message, exc.code),
        )

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content=error_response(exc.detail, exc.status_code),
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
        errors = []
        for error in exc.errors():
            loc = " -> ".join(str(x) for x in error.get("loc", []))
            errors.append(f"{loc}: {error.get('msg', '')}")
        return JSONResponse(
            status_code=400,
            content=error_response("; ".join(errors), 400),
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        return JSONResponse(
            status_code=500,
            content=error_response("Internal server error", 500),
        )
