import os

# Provide required settings values before application modules are imported.
os.environ.setdefault("SECRET_KEY", "test-secret-key")
os.environ.setdefault("REFRESH_KEY", "test-refresh-key")
os.environ.setdefault("POSTGRES_DB_NAME", "plus27_test")
os.environ.setdefault("POSTGRES_DB_HOST", "localhost")
os.environ.setdefault("POSTGRES_DB_PORT", "5432")
os.environ.setdefault("POSTGRES_DB_USER", "test_user")
os.environ.setdefault("POSTGRES_DB_PASSWORD", "test_password")
os.environ.setdefault("MONGO_DB_NAME", "plus27_test")
os.environ.setdefault("MONGO_DB_HOST", "localhost")
os.environ.setdefault("MONGO_DB_PORT", "27017")
os.environ.setdefault("MONGO_DB_USER", "test_user")
os.environ.setdefault("MONGO_DB_PASSWORD", "test_password")
os.environ.setdefault("USER_DB_PROVIDER", "mongo")
