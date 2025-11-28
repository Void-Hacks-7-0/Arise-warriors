# database.py
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Read DB URL from env if present, otherwise use local default
DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql://postgres:rabbit@localhost/fraud_db"
)

# Optional echo for debugging (set SQLALCHEMY_ECHO=1 in env to enable)
ECHO = os.getenv("SQLALCHEMY_ECHO", "0") in ("1", "true", "True")

# Create SQLAlchemy engine (future=True recommended for 2.x style)
engine = create_engine(DATABASE_URL, pool_pre_ping=True, echo=ECHO, future=True)

# Session factory
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)

# Declarative base class for models
Base = declarative_base()


def get_db():
    """
    Dependency to use in FastAPI endpoints:

        from database import get_db
        def endpoint(db: Session = Depends(get_db)): ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """
    Create tables for all models that import `Base`.

    IMPORTANT:
    - This function imports models *inside* the function to avoid circular imports.
    - If tables already exist, create_all() will NOT alter existing columns.
    """
    # import models here to ensure they are registered on Base
    import models  # noqa: F401 (models must be imported so SQLAlchemy sees them)

    Base.metadata.create_all(bind=engine)
