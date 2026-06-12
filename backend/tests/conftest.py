"""Test configuration and fixtures."""
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.pool import NullPool

from app.main import app
from app.db.base import Base, get_db as db_get_db
from app.api.deps import get_db as deps_get_db

# Use an in-memory SQLite for tests or a test PostgreSQL database
TEST_DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5432/postgres"

engine = create_async_engine(TEST_DATABASE_URL, poolclass=NullPool, future=True)
TestingSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False, autocommit=False, autoflush=False)


async def override_get_db():
    async with TestingSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


app.dependency_overrides[db_get_db] = override_get_db
app.dependency_overrides[deps_get_db] = override_get_db


@pytest_asyncio.fixture(scope="function")
async def db():
    """Create a fresh database session for each test."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with TestingSessionLocal() as session:
        yield session
        await session.rollback()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture(scope="function")
async def client(db):
    """Create an async test client."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
