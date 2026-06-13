from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_current_active_user
from app.core.security import (
    create_access_token,
    create_refresh_token,
    verify_password,
    get_password_hash,
    decode_token,
)
from app.core.response import success_response
from app.schemas.user import UserCreate, UserLogin, UserResponse, UserInDB, UserRole
from app.services.user_service import UserService

router = APIRouter()


@router.post("/register", response_model=dict)
async def register(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Register a new user."""
    existing = await UserService.get_by_email(db, user_in.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    existing_username = await UserService.get_by_username(db, user_in.username)
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken",
        )
    user = await UserService.create(db, user_in)
    return success_response(
        data={"id": user.id, "username": user.username, "email": user.email},
        message="User registered successfully",
    )


@router.post("/login", response_model=dict)
async def login(
    credentials: UserLogin,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Authenticate user and return tokens."""
    identifier = credentials.get_identifier()
    user = await UserService.get_by_email(db, identifier)
    if not user and credentials.username:
        user = await UserService.get_by_username(db, credentials.username)
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is inactive",
        )
    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id)})
    return success_response(
        data={
            "token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
            },
        },
        message="Login successful",
    )


@router.post("/refresh", response_model=dict)
async def refresh_token(
    refresh_token: str,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Refresh access token."""
    payload = decode_token(refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type",
        )
    user_id = payload.get("sub")
    user = await UserService.get_by_id(db, int(user_id))
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )
    access_token = create_access_token({"sub": str(user.id)})
    return success_response(
        data={
            "access_token": access_token,
            "token_type": "bearer",
        },
        message="Token refreshed",
    )


@router.post("/logout", response_model=dict)
async def logout(
    current_user: UserInDB = Depends(get_current_active_user),
) -> dict:
    """Logout user (client should discard tokens)."""
    # In a real implementation, you might blacklist the token in Redis
    return success_response(message="Logout successful")


@router.get("/me", response_model=dict)
async def get_me(
    current_user: UserInDB = Depends(get_current_active_user),
) -> dict:
    """Get current user info."""
    return success_response(
        data={
            "id": current_user.id,
            "username": current_user.username,
            "email": current_user.email,
            "role": current_user.role,
            "is_active": current_user.is_active,
            "tenant_id": current_user.tenant_id,
            "created_at": current_user.created_at,
        },
        message="User info retrieved",
    )
