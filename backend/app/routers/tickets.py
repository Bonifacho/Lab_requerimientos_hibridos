"""
Router de Tickets.

REQUERIMIENTO 2 (Sesión 2): creación de una solicitud de mantenimiento
(ticket) por parte de un usuario solicitante, asociada a un equipo.

REQUERIMIENTO 3 (Sesión 2): asignación de un técnico al ticket y
cambio controlado de estado (abierto -> en_proceso -> cerrado).
"""
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/api/tickets", tags=["Tickets"])


def _cargar_relaciones(query):
    return query.options(
        joinedload(models.Ticket.equipo),
        joinedload(models.Ticket.solicitante),
        joinedload(models.Ticket.tecnico),
    )


# --- Requerimiento 2: creación y consulta de tickets ------------------------
@router.get("/", response_model=list[schemas.TicketDetalleOut])
def listar_tickets(estado: models.EstadoTicket | None = None, db: Session = Depends(get_db)):
    query = _cargar_relaciones(db.query(models.Ticket))
    if estado:
        query = query.filter(models.Ticket.estado == estado)
    return query.order_by(models.Ticket.id.desc()).all()


@router.post("/", response_model=schemas.TicketDetalleOut, status_code=201)
def crear_ticket(ticket: schemas.TicketCreate, db: Session = Depends(get_db)):
    equipo = db.query(models.Equipo).filter(models.Equipo.id == ticket.equipo_id).first()
    if not equipo:
        raise HTTPException(status_code=404, detail="El equipo indicado no existe")
    solicitante = db.query(models.Usuario).filter(models.Usuario.id == ticket.solicitante_id).first()
    if not solicitante:
        raise HTTPException(status_code=404, detail="El usuario solicitante no existe")

    nuevo = models.Ticket(**ticket.model_dump(), estado=models.EstadoTicket.abierto)
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return _cargar_relaciones(db.query(models.Ticket)).filter(models.Ticket.id == nuevo.id).first()


@router.get("/{ticket_id}", response_model=schemas.TicketDetalleOut)
def obtener_ticket(ticket_id: int, db: Session = Depends(get_db)):
    ticket = _cargar_relaciones(db.query(models.Ticket)).filter(models.Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket no encontrado")
    return ticket


# --- Requerimiento 3: asignación de técnico y cambio de estado -------------
@router.patch("/{ticket_id}/asignar", response_model=schemas.TicketDetalleOut)
def asignar_tecnico(ticket_id: int, datos: schemas.TicketAsignar, db: Session = Depends(get_db)):
    ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket no encontrado")

    tecnico = db.query(models.Usuario).filter(
        models.Usuario.id == datos.tecnico_id,
        models.Usuario.rol == models.RolUsuario.tecnico,
    ).first()
    if not tecnico:
        raise HTTPException(status_code=400, detail="El usuario indicado no es un técnico válido")

    ticket.tecnico_id = tecnico.id
    if ticket.estado == models.EstadoTicket.abierto:
        ticket.estado = models.EstadoTicket.en_proceso
    db.commit()
    return _cargar_relaciones(db.query(models.Ticket)).filter(models.Ticket.id == ticket_id).first()


TRANSICIONES_VALIDAS = {
    models.EstadoTicket.abierto: {models.EstadoTicket.en_proceso},
    models.EstadoTicket.en_proceso: {models.EstadoTicket.cerrado, models.EstadoTicket.abierto},
    models.EstadoTicket.cerrado: set(),  # un ticket cerrado no cambia de estado
}


@router.patch("/{ticket_id}/estado", response_model=schemas.TicketDetalleOut)
def cambiar_estado_ticket(ticket_id: int, datos: schemas.TicketCambiarEstado, db: Session = Depends(get_db)):
    ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket no encontrado")

    if datos.estado not in TRANSICIONES_VALIDAS[ticket.estado]:
        raise HTTPException(
            status_code=400,
            detail=f"No es válido pasar de '{ticket.estado.value}' a '{datos.estado.value}'",
        )

    # ------------------------------------------------------------------
    # TODO (Requerimiento 7 — propuesto a los estudiantes):
    # Antes de sobreescribir ticket.estado, registrar el cambio en una
    # tabla de historial/auditoría, por ejemplo:
    #   historial = models.TicketHistorial(
    #       ticket_id=ticket.id,
    #       estado_anterior=ticket.estado,
    #       estado_nuevo=datos.estado,
    #       fecha=datetime.utcnow(),
    #   )
    #   db.add(historial)
    # Esto permite mostrar al usuario una línea de tiempo del ticket.
    #
    # TODO (Requerimiento 6 — propuesto a los estudiantes):
    # Al cambiar el estado, generar una notificación para el
    # solicitante (por ejemplo, insertar un registro en una tabla
    # "Notificacion" o enviar un correo con una tarea en segundo plano).
    # ------------------------------------------------------------------

    ticket.estado = datos.estado
    if datos.estado == models.EstadoTicket.cerrado:
        ticket.fecha_cierre = datetime.utcnow()
    db.commit()
    return _cargar_relaciones(db.query(models.Ticket)).filter(models.Ticket.id == ticket_id).first()
