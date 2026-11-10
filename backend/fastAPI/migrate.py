#!/usr/bin/env python3
"""
Centralized migration / database initialization script.
Creates PostgreSQL tables via SQLModel and initializes Beanie ODM for MongoDB.
"""
import asyncio
import sys
from pathlib import Path

# Ensure backend/fastAPI is on path
sys.path.insert(0, str(Path(__file__).parent))

from shared.engine.postgres import init_postgres
from shared.engine.mongo import init_mongo


async def main():
    print("Starting database initialization/migrations...")
    try:
        print("Initializing PostgreSQL...")
        await init_postgres()
        print("✓ PostgreSQL initialized (tables created if missing)")
    except Exception as e:
        print(f"✗ PostgreSQL initialization failed: {e}")
        raise

    try:
        print("Initializing MongoDB (Beanie)...")
        await init_mongo()
        print("✓ MongoDB initialized (Beanie ready)")
    except Exception as e:
        print(f"✗ MongoDB initialization failed: {e}")
        raise

    print("\nAll migrations/initializations completed successfully!")


if __name__ == "__main__":
    asyncio.run(main())
