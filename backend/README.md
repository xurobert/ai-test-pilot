# AI Test Platform Backend

AI-powered test point generation platform - FastAPI backend.

## Tech Stack

- Python 3.11 + FastAPI
- SQLAlchemy 2.0 (async) + PostgreSQL
- Alembic (migrations)
- JWT + bcrypt (auth)
- Redis (cache/session)
- Qdrant (RAG vector store, reserved)
- Docker + Docker Compose

## Quick Start

### 1. Clone and configure

```bash
cp .env.example .env
# Edit .env with your settings
```

### 2. Docker Compose (recommended)

```bash
docker-compose up -d --build
```

Services:
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs
- PostgreSQL: localhost:5432
- Redis: localhost:6379
- Qdrant: localhost:6333

### 3. Local Development

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Run with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Database Migrations

```bash
# Create migration
alembic revision --autogenerate -m "description"

# Run migrations
alembic upgrade head

# Downgrade
alembic downgrade -1
```

### 5. Run Tests

```bash
pytest
```

## Project Structure

```
app/
├── main.py              # FastAPI entry
├── core/                # Config, security, exceptions, logging
├── api/                 # Routes & dependencies
│   └── v1/
│       └── endpoints/   # Auth, users, projects, requirements, test-points
├── db/                  # SQLAlchemy base & session
├── models/              # Database models
├── schemas/             # Pydantic schemas
├── services/            # Business logic
└── utils/               # File handler, etc.
alembic/                 # Migrations
tests/                   # pytest
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/auth/login | Login |
| POST | /api/v1/auth/register | Register (admin) |
| POST | /api/v1/auth/refresh | Refresh token |
| POST | /api/v1/auth/logout | Logout |
| GET | /api/v1/auth/me | Current user |
| GET/POST | /api/v1/projects | Project CRUD |
| GET/POST | /api/v1/requirements | Requirement CRUD |
| POST | /api/v1/requirements/{id}/upload-prd | Upload PRD |
| POST | /api/v1/requirements/{id}/parse-prd | Parse PRD |
| POST | /api/v1/requirements/{id}/generate-test-points | Generate test points |
| GET | /api/v1/test-points | List test points |
| PATCH | /api/v1/test-points/{id}/status | Update status |
| POST | /api/v1/test-points/{id}/regenerate | Regenerate |

## Response Format

All API responses follow:
```json
{
  "code": 0,
  "message": "Success",
  "data": {},
  "meta": { "total": 100, "page": 1, "page_size": 20 }
}
```

## License

MIT
