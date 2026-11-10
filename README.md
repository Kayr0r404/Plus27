# PLUS27

A FastAPI-based backend application with dual-database support (PostgreSQL + MongoDB) and javalin starter scaffolding.

## Architecture

```
plus27/
├── backend/
│   ├── fastAPI/                   # Python FastAPI application
│   │   ├── main.py                # Entry point – creates FastAPI app, registers routers
│   │   ├── migrate.py             # Database initialization/migration script
│   │   ├── .env.example           # Environment variable template
│   │   ├── requirements.txt       # Python dependencies
│   │   ├── shared/                # Shared modules (engine, models, auth, repositories)
│   │   └── services/              # Domain services (auth, user)
│   └── javalin/plus27/            # javalin starter (Java, placeholder)
├── frontend/                      # Next.js frontend
├── docker-compose.yml             # PostgreSQL + MongoDB services for local development
├── start.sh                       # Centralized startup/shutdown script
└── README.md
```

## Backend: FastAPI (`backend/fastAPI/`)

### Entry Point — `main.py`

Creates a `FastAPI` app with a lifespan handler (`int_db_engine`) that initialises both databases on startup and tears down PostgreSQL on shutdown. Registers two routers under `/api/v1`:

| Router        | Prefix                |
|---------------|-----------------------|
| User service  | `/api/v1/users`       |
| Auth service  | `/api/v1/auth`        |

---

### `shared/` — Shared Layer

#### `shared/confiq.py`
Pydantic `Settings` loaded from `.env`. Provides:
- JWT secrets (`secret_key`, `refresh_key`) and token lifetimes
- PostgreSQL credentials and computed connection URL (`postgresql+asyncpg://…`)
- MongoDB credentials and computed connection URL (`mongodb://…`)
- `user_db_provider` switch (`"mongo"` / `"postgres"`) to select user repository backend

#### `shared/engine/db_engine.py`
FastAPI lifespan handler. Calls `init_postgres()` and `init_mongo()`, yields a session factory, and closes PostgreSQL on shutdown.

#### `shared/engine/postgres.py`
Initialises an async SQLAlchemy engine (`create_async_engine`) with `asyncpg`, creates all tables via `SQLModel.metadata.create_all`, and exposes an `async_sessionmaker`. Provides `get_session()` and `close_postgres()`.

#### `shared/engine/mongo.py`
Connects to MongoDB via `AsyncMongoClient` and initialises Beanie ODM with the `User` document model.

#### `shared/models/no_sql_models.py`
Beanie ODM documents stored in MongoDB:

| Document | Collection | Key fields |
|----------|------------|------------|
| `User`   | `users`    | username, email, hashed_password, first_name, last_name, avatar_url, sex, created_at |
| `Review` | `reviews`  | user (Link[User]), rating (1-5), content (max 2000 chars), created_at |

- `User` has unique indexes on `username` and `email`, and auto-normalises both to lowercase.
- `Review` indexes on `user.$id` for efficient lookups.

#### `shared/models/sql_models.py`
SQLModel ORM tables stored in PostgreSQL:

| Table     | Fields                                  |
|-----------|-----------------------------------------|
| `Image`   | id (UUID PK), image_url (unique), created_at |
| `Comment` | id, content, created_at                 |
| `Like`    | id, user_id (UUID), created_at          |

All share a `BaseModel` with auto-generated UUID primary key and UTC `created_at`.

#### `shared/models/token.py`
Pydantic model `Token` with `access_token: str` and `token_type: str`.

#### `shared/models/users.py`
Empty file (placeholder).

#### `shared/auth.py`
JWT authentication utilities:

| Function | Purpose |
|----------|---------|
| `hash_password` / `verify_password` | Argon2 password hashing via `pwdlib` |
| `create_access_token` | Short-lived JWT (default 10 min) with `exp`, `iat`, `jti`, `type="access"` |
| `verify_access_token` | Decodes and validates access JWT; returns `sub` (user ID) |
| `try_get_user_id_from_access_token` | Non-raising variant; returns `None` on failure |
| `create_refresh_token` | Long-lived JWT (default 7 days) with `type="refresh"` |
| `verify_refresh_token` | Decodes refresh JWT; validates `type` claim |
| `get_current_user` | FastAPI dependency – reads `access_token` + `csrf_token` cookies, verifies CSRF for mutating methods, fetches user from MongoDB via Beanie |

#### `shared/route_guard.py`
Route-level guard system combining authentication, rate-limiting, and CSRF protection.

| Component | Description |
|-----------|-------------|
| `InMemoryRateStore` | Async-safe in-memory sliding-window rate limiter |
| `GuardConfig` | Frozen dataclass holding auth mode, throttle config, CSRF flag, email verification flag |
| `public_route()` | Returns FastAPI deps for unauthenticated routes (rate-limited by IP) |
| `protected_route()` | Returns FastAPI deps for authenticated routes (rate-limited by user ID, CSRF on mutations, optional email verification) |

Default limits: 120 req/window for public, 60 req/window for protected routes.

#### `shared/repositories/factory.py`
Factory function `get_user_repository()` that returns either a `MongoUserRepository` or `PostgresUserRepository` based on `settings.user_db_provider`.

#### `shared/repositories/UserRepository/`

| File | Description |
|------|-------------|
| `schemas/user_repository.py` | `PrivateUserRecord` / `PublicUserRecord` Pydantic models + `UserRepository` Protocol |
| `mongo_user_repository.py` | MongoDB implementation via Beanie – `get_by_email`, `get_by_id`, `create_user`, stubs for `update_user`/`delete_user`/`get_users` |
| `postgres_user_repository.py` | PostgreSQL implementation – all methods are stubs (not yet implemented) |

---

### `services/auth/` — Authentication Service

#### `services/auth/schemas/schemas.py`
`LoginSchema` – `email: EmailStr`, `password: str`.

#### `services/auth/api/v1/endpoints/endpoints.py`

| Endpoint | Function | Description |
|----------|----------|-------------|
| `POST /token` | `login_for_access_token` | Validates credentials, issues access + refresh JWT + CSRF cookies (HttpOnly, Secure, SameSite) |
| `POST /refresh` | `refresh_token` | Placeholder |
| `DELETE /logout` | `logout` | Placeholder |

The login response sets three cookies:
- `access_token` (HttpOnly, 15 min)
- `refresh_token` (HttpOnly, 30 days)
- `csrf_token` (JS-accessible, 15 min)

#### `services/auth/api/v1/routes/routes.py`
Registers auth endpoints under `/auth`.

---

### `services/user/` — User Service

#### `services/user/schemas/user_schema.py`

| Model | Fields |
|-------|--------|
| `CreateUser` | email, password, first_name, last_name, username, optional avatar_url, optional sex |
| `PrivateUser` | id, email, password, names, username, avatar_url, sex |
| `PublicUser` | id, names, username, avatar_url, sex |

#### `services/user/api/v1/endpoints/endpoints.py`

| Endpoint | Function | Description |
|----------|----------|-------------|
| `POST /register-new-account` | `create_user` | Checks for duplicate email, creates user via repository |
| `PUT /update/{user_id}` | `update_user` | Authorises via `CurrentUser`, updates user fields |
| `DELETE /delete/{user_id}` | `delete_user` | Authorises via `CurrentUser`, deletes user |
| `GET /{user_id}` | `get_user_by_id` | Returns public user profile |
| `GET /` | `get_users` | Lists users (pagination via `skip`/`limit`) |

#### `services/user/api/v1/routes/routes.py`
Registers user endpoints under `/users`. All routes use `public_route()` guard.

---

## Backend: javalin (`backend/javalin/`)

Minimal javalin 3 application with a single starter class (`plus27Application`) and a context-loads test. Currently a placeholder for future Java microservices.

## Running the Application

### Prerequisites
- **Docker** + **Docker Compose** (recommended, for PostgreSQL and MongoDB)
- **Python 3.11+** (3.14 may require dependency pin updates in `backend/fastAPI/requirements.txt`)
- **Node.js** and **pnpm** (for the Next.js frontend)
- Bash 4.3+ (for `./start.sh`)

> If you do not use Docker, you can run PostgreSQL and MongoDB yourself, but `./start.sh` manages DB containers via `docker-compose.yml` by default.

### Quick start (recommended)

From the repository root:

```bash
./start.sh
```

On the first run, if `backend/fastAPI/.env` does not exist, the script copies it from `.env.example` and exits so you can review/update credentials. After updating `.env`, re-run `./start.sh` (or set `ALLOW_DEFAULT_ENV=1` to continue with the copied defaults).

### What `./start.sh` does
- Checks prerequisites and app ports (`8000`/`3000` by default)
- Starts database containers with Docker Compose (`postgres`, `mongo`) when `docker-compose.yml` is available
- Waits for PostgreSQL and MongoDB to be reachable
- Creates/activates a Python virtual environment at `backend/fastAPI/.venv`
- Installs backend dependencies (skips reinstall when `backend/fastAPI/requirements.txt` is unchanged)
- Runs database initialization/migrations (`backend/fastAPI/migrate.py`)
  - Creates PostgreSQL tables via SQLModel metadata
  - Initializes MongoDB/Beanie models
- Installs frontend dependencies (`pnpm install` in `frontend/`)
- Starts the app servers with color-coded, prefixed logs:
  - `[python]` FastAPI/Uvicorn
  - `[next]` Next.js dev server
  - HTTP methods and response status codes are highlighted in logs

### Services and URLs
- **Backend (FastAPI):** `http://127.0.0.1:8000`
  - Docs: `http://127.0.0.1:8000/docs`
  - Health check: `GET http://127.0.0.1:8000/health` → `{"status":"ok"}`
  - API base path: `/api/v1` (e.g. `/api/v1/auth/token`, `/api/v1/users/register-new-account`)
- **Frontend (Next.js):** `http://127.0.0.1:3000`
- **Javalin (`backend/javalin`)**: placeholder, not started by `start.sh`

### Stopping and data persistence
- Press `Ctrl+C` to stop `./start.sh`.
- The script shuts down app servers and runs `docker compose down` for DB containers.
- **Database data is preserved** because `docker-compose.yml` uses named volumes (`postgres_data`, `mongo_data`). Containers are removed on teardown, but data remains for the next run.
- To remove containers **and** persisted DB data, run manually:
  ```bash
  docker compose down -v
  ```

### Database containers (`docker-compose.yml`)
`docker-compose.yml` defines:
- **PostgreSQL** (`postgres:16-alpine`, container `plus27-postgres`, default port `5432`)
- **MongoDB** (`mongo:7`, container `plus27-mongo`, default port `27017`)

Defaults are aligned with `backend/fastAPI/.env.example` / `.env` (DB names, users, passwords, ports). You can manage DBs manually if needed:

```bash
docker compose up -d
docker compose ps
docker compose logs -f postgres mongo
docker compose down        # keeps volumes/data
```

### Environment variables (`backend/fastAPI/.env`)
`start.sh` reads backend config from `backend/fastAPI/.env` (copied from `.env.example` on first run if missing).

| Variable | Description |
|----------|-------------|
| `SECRET_KEY` | JWT signing key for access tokens |
| `REFRESH_KEY` | JWT signing key for refresh tokens |
| `POSTGRES_DB_*` | PostgreSQL connection parameters (`NAME`, `HOST`, `PORT`, `USER`, `PASSWORD`) |
| `MONGO_DB_*` | MongoDB connection parameters (`NAME`, `HOST`, `PORT`, `USER`, `PASSWORD`) |
| `USER_DB_PROVIDER` | `mongo` (default) or `postgres` |
| `REVIEW_DB_PROVIDER` / `LIKE_DB_PROVIDER` / `COMMENT_DB_PROVIDER` | Provider selectors for related services (as configured in `.env.example`) |

### `start.sh` environment overrides
| Variable | Default | Description |
|----------|---------|-------------|
| `BACKEND_PORT` / `FRONTEND_PORT` | `8000` / `3000` | App server ports |
| `BACKEND_HOST` / `FRONTEND_HOST` | `127.0.0.1` / `127.0.0.1` | Bind addresses |
| `NEXT_PUBLIC_API_URL` | `http://localhost:$BACKEND_PORT/api/v1` | Frontend API base URL (inlined into Next.js dev/build) |
| `MANAGE_DB` | `1` | Set to `0` to skip starting/stopping DB containers via Docker Compose |
| `SKIP_MIGRATE` | `0` | Set to `1` to skip `migrate.py` |
| `ALLOW_DEFAULT_ENV` | `0` | Set to `1` to continue if `.env` was auto-copied from `.env.example` |
| `CHECK_SERVICES` | empty | Space-separated `host:port` checks before migrations (e.g. `localhost:5432 localhost:27017`) |

Example:
```bash
BACKEND_PORT=8001 FRONTEND_PORT=3001 ./start.sh
```

### Manual run (advanced)
If you prefer to run components separately:

```bash
# 1) Start databases
docker compose up -d

# 2) Backend
cd backend/fastAPI
cp .env.example .env          # edit with your credentials
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python migrate.py
uvicorn main:app --reload --host 127.0.0.1 --port 8000

# 3) Frontend (new terminal)
cd frontend
pnpm install
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1 pnpm dev --port 3000
```

## Key Dependencies

- **FastAPI** – web framework
- **Beanie** – MongoDB ODM (async)
- **SQLModel / SQLAlchemy** – PostgreSQL ORM (async)
- **PyJWT** – JWT encoding/decoding
- **pwdlib** – Argon2 password hashing
- **pydantic-settings** – environment config
- **uvicorn** – ASGI server
