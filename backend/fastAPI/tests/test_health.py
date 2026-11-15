from contextlib import asynccontextmanager

from fastapi.testclient import TestClient

import main


@asynccontextmanager
async def noop_lifespan(app):
    yield {}


def test_health_check_returns_ok():
    original_lifespan = main.app.router.lifespan_context
    main.app.router.lifespan_context = noop_lifespan
    try:
        with TestClient(main.app) as client:
            response = client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}
    finally:
        main.app.router.lifespan_context = original_lifespan
