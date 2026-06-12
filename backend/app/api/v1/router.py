from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, projects, requirements, test_points

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(requirements.router, prefix="/requirements", tags=["requirements"])
api_router.include_router(test_points.router, prefix="/test-points", tags=["test-points"])
