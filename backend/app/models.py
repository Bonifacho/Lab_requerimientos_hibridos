"""
Modelos SQLAlchemy del Sistema de Gestión de Mantenimiento de Equipos
(Helpdesk Técnico) — Universidad de Cundinamarca
Asignatura: Desarrollo de Software para Sistemas Híbridos
Docente: Edicson Pineda Cadena

Seis entidades del modelo de datos:
    1. Usuario                 (solicitantes, técnicos y administradores)
    2. Equipo                  (activos que pueden requerir mantenimiento)
    3. Ticket                  (solicitud de mantenimiento sobre un equipo)
    4. Diagnostico              (informe técnico asociado a un ticket)
    5. Repuesto                 (inventario de repuestos disponibles)
    6. DiagnosticoRepuesto      (detalle: repuestos usados en un diagnóstico)
"""
import enum
from datetime import datetime

from sqlalchemy import (
    Column, Integer, String, Text, Float, DateTime, ForeignKey, Enum, Boolean
)
from sqlalchemy.orm import relationship

from .database import Base


class RolUsuario(str, enum.Enum):
    admin = "admin"
    tecnico = "tecnico"
    solicitante = "solicitante"


class EstadoTicket(str, enum.Enum):
    abierto = "abierto"
    en_proceso = "en_proceso"
    cerrado = "cerrado"


class PrioridadTicket(str, enum.Enum):
    baja = "baja"
    media = "media"
    alta = "alta"
    critica = "critica"


class EstadoEquipo(str, enum.Enum):
    operativo = "operativo"
    en_mantenimiento = "en_mantenimiento"
    de_baja = "de_baja"


# ---------------------------------------------------------------------------
# 1. Usuario
# ---------------------------------------------------------------------------
class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(120), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    rol = Column(Enum(RolUsuario), nullable=False, default=RolUsuario.solicitante)
    activo = Column(Boolean, default=True)
    fecha_registro = Column(DateTime, default=datetime.utcnow)

    tickets_solicitados = relationship(
        "Ticket", foreign_keys="Ticket.solicitante_id", back_populates="solicitante"
    )
    tickets_asignados = relationship(
        "Ticket", foreign_keys="Ticket.tecnico_id", back_populates="tecnico"
    )
    diagnosticos = relationship("Diagnostico", back_populates="tecnico")


# ---------------------------------------------------------------------------
# 2. Equipo
# ---------------------------------------------------------------------------
class Equipo(Base):
    __tablename__ = "equipos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(120), nullable=False)
    tipo = Column(String(80), nullable=False)  # ej. "Computador", "Impresora", "Router"
    marca = Column(String(80))
    modelo = Column(String(80))
    numero_serie = Column(String(100), unique=True)
    ubicacion = Column(String(120))
    estado = Column(Enum(EstadoEquipo), default=EstadoEquipo.operativo)
    fecha_registro = Column(DateTime, default=datetime.utcnow)

    tickets = relationship("Ticket", back_populates="equipo")


# ---------------------------------------------------------------------------
# 3. Ticket
# ---------------------------------------------------------------------------
class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(150), nullable=False)
    descripcion = Column(Text, nullable=False)
    estado = Column(Enum(EstadoTicket), default=EstadoTicket.abierto, nullable=False)
    prioridad = Column(Enum(PrioridadTicket), default=PrioridadTicket.media)
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
    fecha_cierre = Column(DateTime, nullable=True)

    equipo_id = Column(Integer, ForeignKey("equipos.id"), nullable=False)
    solicitante_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    tecnico_id = Column(Integer, ForeignKey("usuarios.id"), nullable=True)

    equipo = relationship("Equipo", back_populates="tickets")
    solicitante = relationship(
        "Usuario", foreign_keys=[solicitante_id], back_populates="tickets_solicitados"
    )
    tecnico = relationship(
        "Usuario", foreign_keys=[tecnico_id], back_populates="tickets_asignados"
    )
    diagnosticos = relationship("Diagnostico", back_populates="ticket")

    # ------------------------------------------------------------------
    # Requerimiento 7 (propuesto a los estudiantes): historial de cambios
    # de estado con auditoría (línea de tiempo). Aquí solo se deja el
    # campo estado actual; se sugiere crear una tabla adicional
    # "TicketHistorial(id, ticket_id, estado_anterior, estado_nuevo,
    # usuario_id, fecha)" y registrar un evento cada vez que cambie el
    # estado del ticket (ver TODO en routers/tickets.py).
    # ------------------------------------------------------------------


# ---------------------------------------------------------------------------
# 4. Diagnostico
# ---------------------------------------------------------------------------
class Diagnostico(Base):
    __tablename__ = "diagnosticos"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("tickets.id"), nullable=False)
    tecnico_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    descripcion = Column(Text, nullable=False)
    costo_mano_obra = Column(Float, default=0.0)
    fecha = Column(DateTime, default=datetime.utcnow)

    ticket = relationship("Ticket", back_populates="diagnosticos")
    tecnico = relationship("Usuario", back_populates="diagnosticos")
    repuestos_usados = relationship(
        "DiagnosticoRepuesto", back_populates="diagnostico", cascade="all, delete-orphan"
    )


# ---------------------------------------------------------------------------
# 5. Repuesto
# ---------------------------------------------------------------------------
class Repuesto(Base):
    __tablename__ = "repuestos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(120), nullable=False)
    descripcion = Column(String(255))
    stock = Column(Integer, default=0)
    costo_unitario = Column(Float, default=0.0)

    usos = relationship("DiagnosticoRepuesto", back_populates="repuesto")


# ---------------------------------------------------------------------------
# 6. DiagnosticoRepuesto (tabla de detalle / relación muchos a muchos)
# ---------------------------------------------------------------------------
class DiagnosticoRepuesto(Base):
    __tablename__ = "diagnostico_repuestos"

    id = Column(Integer, primary_key=True, index=True)
    diagnostico_id = Column(Integer, ForeignKey("diagnosticos.id"), nullable=False)
    repuesto_id = Column(Integer, ForeignKey("repuestos.id"), nullable=False)
    cantidad = Column(Integer, nullable=False, default=1)

    diagnostico = relationship("Diagnostico", back_populates="repuestos_usados")
    repuesto = relationship("Repuesto", back_populates="usos")
