#!/usr/bin/env bash
set -euo pipefail

# Centralized startup script for Plus27
# - Starts PostgreSQL/MongoDB via Docker Compose (if available) and tears containers down on exit
#   (named volumes are preserved so data persists across runs)
# - Creates/activates Python virtual environment for FastAPI backend
# - Installs backend/frontend dependencies (backend only when requirements.txt changes)
# - Runs database migrations/initialization
# - Starts backend and frontend servers and shuts everything down cleanly on Ctrl+C
#
# Environment overrides:
#   BACKEND_PORT / FRONTEND_PORT   ports (default 8000 / 3000)
#   BACKEND_HOST / FRONTEND_HOST   bind addresses (default 127.0.0.1)
#   NEXT_PUBLIC_API_URL            API base URL for the frontend (default http://localhost:$BACKEND_PORT/api/v1)
#   CHECK_SERVICES                 space-separated host:port list that must be reachable
#                                  before migrations, e.g. "localhost:27017 localhost:9092"
#   MANAGE_DB=0                    do not start/stop DB containers via Docker Compose
#   ALLOW_DEFAULT_ENV=1            continue after copying .env.example to .env
#   SKIP_MIGRATE=1                 skip migrate.py

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend/fastAPI"
FRONTEND_DIR="$ROOT_DIR/frontend"
VENV_DIR="$BACKEND_DIR/.venv"
REQ_STAMP="$VENV_DIR/.requirements.sha256"
COMPOSE_FILE="$ROOT_DIR/docker-compose.yml"

BACKEND_PORT="${BACKEND_PORT:-8000}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"
BACKEND_HOST="${BACKEND_HOST:-127.0.0.1}"
FRONTEND_HOST="${FRONTEND_HOST:-127.0.0.1}"
CHECK_SERVICES="${CHECK_SERVICES:-}"

MIN_PY_MINOR=11   # Python 3.11+ required
PIDS=()
DB_MANAGED=0
COMPOSE=()

log() { printf "\n\033[1;34m[plus27]\033[0m %s\n" "$*"; }
warn() { printf "\n\033[1;33m[plus27]\033[0m %s\n" "$*"; }
err() { printf "\n\033[1;31m[plus27]\033[0m %s\n" "$*" >&2; }

# --- Log prefixer/colorizer (runs via python3 -c; keeps this a single file) ---
IFS= read -r -d '' PY_LOG_FILTER <<'PY' || true
import re
import sys

label = sys.argv[1] if len(sys.argv) > 1 else "app"
RESET = "\033[0m"
BOLD = "\033[1m"
LABEL_COLORS = {
    "python": "\033[1;32m",  # green
    "next": "\033[1;36m",    # cyan
    "java": "\033[1;35m",    # magenta
}
LABEL_COLOR = LABEL_COLORS.get(label, "\033[1;37m")

METHOD_COLORS = {
    "GET": "\033[1;32m",
    "POST": "\033[1;34m",
    "PUT": "\033[1;33m",
    "PATCH": "\033[1;35m",
    "DELETE": "\033[1;31m",
    "OPTIONS": "\033[1;36m",
    "HEAD": "\033[1;36m",
}
METHODS = "GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD"

method_re = re.compile(r"\b(" + METHODS + r")\b")
# Only color 3-digit numbers that are actually HTTP status codes:
#   uvicorn: ... "GET /docs HTTP/1.1" 200 OK
#   next:     GET /api/foo 200 in 12ms
uvicorn_status_re = re.compile(r'(HTTP/\d(?:\.\d)?"\s+)([1-5]\d{2})\b')
next_status_re = re.compile(r"(\b(?:" + METHODS + r")\s+\S+\s+)([1-5]\d{2})\b")


def status_color(code):
    if 200 <= code <= 299:
        return "\033[1;32m"
    if 300 <= code <= 399:
        return "\033[1;36m"
    if 400 <= code <= 499:
        return "\033[1;33m"
    if 500 <= code <= 599:
        return "\033[1;31m"
    return "\033[1;35m"


def color_status(m):
    return f"{m.group(1)}{status_color(int(m.group(2)))}{m.group(2)}{RESET}"


def color_method(m):
    word = m.group(1)
    return f"{METHOD_COLORS.get(word, BOLD)}{word}{RESET}"


def colorize(line):
    line = uvicorn_status_re.sub(color_status, line)
    line = next_status_re.sub(color_status, line)
    return method_re.sub(color_method, line)


sys.stdin.reconfigure(errors="replace")
prefix = f"{LABEL_COLOR}[{label}]{RESET} "
for raw in sys.stdin:
    line = raw.rstrip("\n")
    try:
        print(prefix + colorize(line), flush=True)
    except Exception:
        print(prefix + line, flush=True)
PY

prefix_logs() { python3 -u -c "$PY_LOG_FILTER" "$1"; }

# --- Helpers ---
require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    err "Required command '$1' not found. Please install it and re-run."
    exit 1
  fi
}

hash_file() {
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$1" | cut -d' ' -f1
  else
    shasum -a 256 "$1" | cut -d' ' -f1
  fi
}

tcp_open() { (exec 3<>"/dev/tcp/$1/$2") 2>/dev/null; }

port_in_use() {
  local port="$1"
  if command -v ss >/dev/null 2>&1; then
    [[ -n "$(ss -ltn "sport = :${port}" 2>/dev/null | tail -n +2)" ]]
  elif command -v lsof >/dev/null 2>&1; then
    lsof -iTCP:"${port}" -sTCP:LISTEN -P -n >/dev/null 2>&1
  else
    tcp_open 127.0.0.1 "$port"
  fi
}

check_port() {
  local port="$1" name="$2"
  if port_in_use "$port"; then
    err "Port ${port} (${name}) is already in use."
    if command -v ss >/dev/null 2>&1; then
      ss -ltnp "sport = :${port}" 2>/dev/null >&2 || true
    elif command -v lsof >/dev/null 2>&1; then
      lsof -iTCP:"${port}" -sTCP:LISTEN -P -n >&2 || true
    fi
    err "Stop the process using it, or pick other ports (e.g. BACKEND_PORT=8001 FRONTEND_PORT=3001 ./start.sh)."
    exit 1
  fi
}

detect_compose() {
  if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
    COMPOSE=(docker compose)
  elif command -v docker-compose >/dev/null 2>&1; then
    COMPOSE=(docker-compose)
  else
    COMPOSE=()
  fi
}

compose() {
  (cd "$ROOT_DIR" && "${COMPOSE[@]}" -f "$COMPOSE_FILE" "$@")
}

wait_for_tcp() {
  local host="$1" port="$2" name="$3" attempts="${4:-60}"
  local i
  for ((i = 1; i <= attempts; i++)); do
    if tcp_open "$host" "$port"; then
      return 0
    fi
    sleep 1
  done
  err "Timed out waiting for ${name} at ${host}:${port}."
  return 1
}

cleanup() {
  local code=$?
  set +e
  trap - EXIT INT TERM
  if [[ ${#PIDS[@]} -gt 0 ]]; then
    log "Shutting down servers..."
    local pid i alive
    # Each server runs in its own process group (set -m), so signal the whole group.
    for pid in "${PIDS[@]}"; do kill -TERM -- "-$pid" 2>/dev/null; done
    for i in 1 2 3 4 5 6 7 8 9 10; do
      alive=0
      for pid in "${PIDS[@]}"; do
        if kill -0 -- "-$pid" 2>/dev/null; then alive=1; fi
      done
      [[ $alive -eq 0 ]] && break
      sleep 0.5
    done
    for pid in "${PIDS[@]}"; do kill -KILL -- "-$pid" 2>/dev/null; done
    wait 2>/dev/null
  fi

  if [[ "$DB_MANAGED" -eq 1 && ${#COMPOSE[@]} -gt 0 ]]; then
    log "Stopping database containers (preserving volumes/data)..."
    compose down >/dev/null 2>&1 || warn "Failed to stop database containers; you can run: docker compose down"
  fi

  exit "$code"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

# --- Prerequisites ---
log "Checking prerequisites..."

# `wait -n` needs bash 4.3+ (macOS ships 3.2; use `brew install bash`).
if (( BASH_VERSINFO[0] < 4 || (BASH_VERSINFO[0] == 4 && BASH_VERSINFO[1] < 3) )); then
  err "bash 4.3+ is required (found ${BASH_VERSION}). On macOS: brew install bash"
  exit 1
fi

require_cmd python3
require_cmd node
require_cmd pnpm

read -r PY_MAJOR PY_MINOR < <(python3 -c 'import sys; print(*sys.version_info[:2])')
PY_VER="${PY_MAJOR}.${PY_MINOR}"
if [[ "$PY_MAJOR" -ne 3 || "$PY_MINOR" -lt "$MIN_PY_MINOR" ]]; then
  err "Python 3.${MIN_PY_MINOR}+ is required (found ${PY_VER})."
  exit 1
fi
if [[ "$PY_MINOR" -ge 14 ]]; then
  warn "Detected Python ${PY_VER}. Some pinned backend dependencies (e.g. beanie==2.1.0 in requirements.txt) may not support Python 3.14+. If dependency installation fails, use Python 3.11-3.13 or update backend/fastAPI/requirements.txt."
fi

# Fail fast on port conflicts, before any slow installs.
log "Checking server ports..."
check_port "$BACKEND_PORT" "backend/python"
check_port "$FRONTEND_PORT" "frontend/next"

# --- Databases (Docker Compose) ---
detect_compose
if [[ "${MANAGE_DB:-1}" == "1" && -f "$COMPOSE_FILE" && ${#COMPOSE[@]} -gt 0 ]]; then
  log "Starting database containers (docker compose)..."
  compose up -d postgres mongo
  DB_MANAGED=1
  wait_for_tcp "127.0.0.1" "${POSTGRES_DB_PORT:-5432}" "PostgreSQL"
  wait_for_tcp "127.0.0.1" "${MONGO_DB_PORT:-27017}" "MongoDB"
elif [[ "${MANAGE_DB:-1}" == "1" && -f "$COMPOSE_FILE" ]]; then
  warn "Docker Compose not found; skipping automatic DB startup (install Docker Compose or start DBs manually)."
fi

# --- Backend setup ---
log "Setting up backend (FastAPI)..."
cd "$BACKEND_DIR"

if [[ ! -f ".env" ]]; then
  if [[ -f ".env.example" ]]; then
    cp .env.example .env
    if [[ "${ALLOW_DEFAULT_ENV:-0}" != "1" ]]; then
      err "Created backend/fastAPI/.env from .env.example. Review and fill in real credentials, then re-run (or set ALLOW_DEFAULT_ENV=1 to continue with the defaults)."
      exit 1
    fi
    warn "Copied .env.example to .env and continuing with its defaults (ALLOW_DEFAULT_ENV=1)."
  else
    warn ".env not found and no .env.example available. Backend may fail without configuration."
  fi
fi

# A half-created venv (e.g. missing python3-venv) has no activate script; rebuild it.
if [[ -d "$VENV_DIR" && ! -f "$VENV_DIR/bin/activate" ]]; then
  warn "Found incomplete virtual environment at $VENV_DIR; recreating."
  rm -rf "$VENV_DIR"
fi
if [[ ! -d "$VENV_DIR" ]]; then
  log "Creating Python virtual environment at $VENV_DIR"
  python3 -m venv "$VENV_DIR"
  # shellcheck disable=SC1091
  source "$VENV_DIR/bin/activate"
  python -m pip install --disable-pip-version-check --upgrade pip >/dev/null
else
  # shellcheck disable=SC1091
  source "$VENV_DIR/bin/activate"
fi
log "Activated virtual environment: $(python --version) (from $VENV_DIR)"

REQ_HASH="$(hash_file requirements.txt)"
if [[ -f "$REQ_STAMP" && "$(cat "$REQ_STAMP")" == "$REQ_HASH" ]]; then
  log "Backend dependencies unchanged; skipping install."
else
  log "Installing backend dependencies..."
  python -m pip install --disable-pip-version-check -r requirements.txt
  printf "%s" "$REQ_HASH" > "$REQ_STAMP"
fi

# Optional: make sure required services are reachable before migrating.
for svc in $CHECK_SERVICES; do
  svc_host="${svc%:*}"
  svc_port="${svc##*:}"
  if ! tcp_open "$svc_host" "$svc_port"; then
    err "Cannot reach ${svc_host}:${svc_port}. Start the service (or fix CHECK_SERVICES) and re-run."
    exit 1
  fi
done

if [[ "${SKIP_MIGRATE:-0}" == "1" ]]; then
  warn "SKIP_MIGRATE=1 set; skipping migrations."
else
  log "Running database migrations/initialization..."
  python migrate.py
fi

# --- Frontend setup ---
log "Setting up frontend (Next.js)..."
cd "$FRONTEND_DIR"

log "Installing frontend dependencies..."
pnpm install

# Keep the frontend pointed at the backend API even when BACKEND_PORT is overridden.
export NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-http://localhost:${BACKEND_PORT}/api/v1}"

# --- Start servers ---
log "Starting servers..."
log "Backend (python/FastAPI):  http://${BACKEND_HOST}:${BACKEND_PORT} (docs: /docs)"
log "Frontend (next):           http://${FRONTEND_HOST}:${FRONTEND_PORT}"
log "Java (javalin):            not started (placeholder service in backend/javalin)"
log "Press Ctrl+C to stop all servers."

# Job control: each background job gets its own process group so cleanup can
# kill the entire tree (uvicorn reloader + worker, next dev + children).
set -m

cd "$BACKEND_DIR"
(PYTHONUNBUFFERED=1 python -m uvicorn main:app --reload \
  --host "$BACKEND_HOST" --port "$BACKEND_PORT" 2>&1 </dev/null | prefix_logs "python") &
PIDS+=($!)

cd "$FRONTEND_DIR"
(pnpm dev --port "$FRONTEND_PORT" --hostname "$FRONTEND_HOST" 2>&1 </dev/null | prefix_logs "next") &
PIDS+=($!)

# Wait for either to exit; the EXIT trap handles cleanup.
status=0
wait -n "${PIDS[@]}" || status=$?
err "A server process exited (status: ${status}). Shutting down remaining processes."
exit "$status"