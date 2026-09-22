"""
Configuración de la conexión a la base de datos PostgreSQL usando SQLAlchemy.

La cadena de conexión se lee de la variable de entorno DATABASE_URL,
que en docker-compose.yml apunta al servicio "db" (contenedor de Postgres).
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://helpdesk_user:helpdesk_pass@localhost:5432/helpdesk_db",
)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependencia de FastAPI: entrega una sesión de BD por cada request
    y la cierra automáticamente al finalizar."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
