"""
Router de Usuarios.

No es uno de los 4 requerimientos principales del laboratorio, pero se
implementa como CRUD básico de apoyo, ya que Tickets y Diagnósticos
necesitan usuarios (solicitantes y técnicos) existentes para funcionar.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/api/usuarios", tags=["Usuarios"])


@router.get("/", response_model=list[schemas.UsuarioOut])
def listar_usuarios(db: Session = Depends(get_db)):
    return db.query(models.Usuario).all()


@router.post("/", response_model=schemas.UsuarioOut, status_code=201)
def crear_usuario(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    existente = db.query(models.Usuario).filter(models.Usuario.email == usuario.email).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ya existe un usuario con ese email")
    nuevo = models.Usuario(**usuario.model_dump())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@router.get("/{usuario_id}", response_model=schemas.UsuarioOut)
def obtener_usuario(usuario_id: int, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario


@router.get("/rol/{rol}", response_model=list[schemas.UsuarioOut])
def listar_usuarios_por_rol(rol: models.RolUsuario, db: Session = Depends(get_db)):
    """Útil para el frontend: p. ej. listar solo los técnicos disponibles
    al momento de asignar un ticket."""
    return db.query(models.Usuario).filter(models.Usuario.rol == rol).all()
