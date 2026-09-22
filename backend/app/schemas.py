"""
Esquemas Pydantic (entrada/salida de la API) para las 6 entidades.
"""
from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, EmailStr, ConfigDict

from .models import RolUsuario, EstadoTicket, PrioridadTicket, EstadoEquipo


# ---------------------------------------------------------------------------
# Usuario
# ---------------------------------------------------------------------------
class UsuarioBase(BaseModel):
    nombre: str
    email: EmailStr
    rol: RolUsuario = RolUsuario.solicitante
    activo: bool = True


class UsuarioCreate(UsuarioBase):
    pass


class UsuarioOut(UsuarioBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    fecha_registro: datetime


# ---------------------------------------------------------------------------
# Equipo
# ---------------------------------------------------------------------------
class EquipoBase(BaseModel):
    nombre: str
    tipo: str
    marca: Optional[str] = None
    modelo: Optional[str] = None
    numero_serie: Optional[str] = None
    ubicacion: Optional[str] = None
    estado: EstadoEquipo = EstadoEquipo.operativo


class EquipoCreate(EquipoBase):
    pass


class EquipoUpdate(BaseModel):
    nombre: Optional[str] = None
    tipo: Optional[str] = None
    marca: Optional[str] = None
    modelo: Optional[str] = None
    numero_serie: Optional[str] = None
    ubicacion: Optional[str] = None
    estado: Optional[EstadoEquipo] = None


class EquipoOut(EquipoBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    fecha_registro: datetime


# ---------------------------------------------------------------------------
# Ticket
# ---------------------------------------------------------------------------
class TicketBase(BaseModel):
    titulo: str
    descripcion: str
    prioridad: PrioridadTicket = PrioridadTicket.media
    equipo_id: int
    solicitante_id: int


class TicketCreate(TicketBase):
    pass


class TicketAsignar(BaseModel):
    tecnico_id: int


class TicketCambiarEstado(BaseModel):
    estado: EstadoTicket


class TicketOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    titulo: str
    descripcion: str
    estado: EstadoTicket
    prioridad: PrioridadTicket
    fecha_creacion: datetime
    fecha_cierre: Optional[datetime] = None
    equipo_id: int
    solicitante_id: int
    tecnico_id: Optional[int] = None


class TicketDetalleOut(TicketOut):
    """Incluye los objetos relacionados completos (equipo, solicitante, técnico)."""
    equipo: EquipoOut
    solicitante: UsuarioOut
    tecnico: Optional[UsuarioOut] = None


# ---------------------------------------------------------------------------
# Repuesto
# ---------------------------------------------------------------------------
class RepuestoBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    stock: int = 0
    costo_unitario: float = 0.0


class RepuestoCreate(RepuestoBase):
    pass


class RepuestoOut(RepuestoBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


# ---------------------------------------------------------------------------
# Diagnostico + detalle de repuestos usados
# ---------------------------------------------------------------------------
class DiagnosticoRepuestoIn(BaseModel):
    repuesto_id: int
    cantidad: int = 1


class DiagnosticoRepuestoOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    repuesto_id: int
    cantidad: int
    repuesto: RepuestoOut


class DiagnosticoCreate(BaseModel):
    ticket_id: int
    tecnico_id: int
    descripcion: str
    costo_mano_obra: float = 0.0
    repuestos: List[DiagnosticoRepuestoIn] = []


class DiagnosticoOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    ticket_id: int
    tecnico_id: int
    descripcion: str
    costo_mano_obra: float
    fecha: datetime
    repuestos_usados: List[DiagnosticoRepuestoOut] = []
