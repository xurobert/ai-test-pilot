from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.logging import configure_logging
from app.core.exceptions import add_exception_handlers
from app.api.v1.router import api_router
from app.db.base import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    configure_logging()
    await init_db()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-powered test point generation platform",
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT != "production" else None,
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
add_exception_handlers(app)

# API routes
app.include_router(api_router, prefix="/api/v1")


@app.get("/health", tags=["health"])
async def health_check() -> dict[str, str]:
    return {"status": "ok"}
