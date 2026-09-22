"""
Router de Repuestos.

CRUD de apoyo para el inventario de repuestos, necesario para poder
registrar diagnósticos con repuestos utilizados (Requerimiento 4).
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/api/repuestos", tags=["Repuestos"])


@router.get("/", response_model=list[schemas.RepuestoOut])
def listar_repuestos(db: Session = Depends(get_db)):
    return db.query(models.Repuesto).order_by(models.Repuesto.nombre).all()


@router.post("/", response_model=schemas.RepuestoOut, status_code=201)
def crear_repuesto(repuesto: schemas.RepuestoCreate, db: Session = Depends(get_db)):
    nuevo = models.Repuesto(**repuesto.model_dump())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@router.get("/{repuesto_id}", response_model=schemas.RepuestoOut)
def obtener_repuesto(repuesto_id: int, db: Session = Depends(get_db)):
    repuesto = db.query(models.Repuesto).filter(models.Repuesto.id == repuesto_id).first()
    if not repuesto:
        raise HTTPException(status_code=404, detail="Repuesto no encontrado")
    return repuesto
