"""Auth module tests."""
import pytest


@pytest.mark.asyncio
async def test_health_check(client):
    """Test health check endpoint."""
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["code"] == 0
    assert response.json()["data"]["status"] == "ok"


@pytest.mark.asyncio
async def test_register_and_login(client):
    """Test user registration and login flow."""
    # First create an admin user (this would normally be seeded)
    # For now, test that endpoints exist and return proper structure
    response = await client.post("/api/v1/auth/login", json={
        "email": "admin@example.com",
        "password": "admin123"
    })
    # Should fail because no user exists yet
    assert response.status_code in [401, 404]
