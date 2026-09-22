import axios from "axios";

// La URL del backend se puede sobreescribir con la variable de entorno
// VITE_API_URL (ver archivo .env.example). Por defecto apunta al backend
// de FastAPI corriendo en Docker en el puerto 8000.
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// ---------------------------------------------------------------------------
// Tipos (reflejan los esquemas Pydantic del backend)
// ---------------------------------------------------------------------------
export type Rol = "admin" | "tecnico" | "solicitante";
export type EstadoTicket = "abierto" | "en_proceso" | "cerrado";
export type Prioridad = "baja" | "media" | "alta" | "critica";
export type EstadoEquipo = "operativo" | "en_mantenimiento" | "de_baja";

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
  activo: boolean;
  fecha_registro: string;
}

export interface Equipo {
  id: number;
  nombre: string;
  tipo: string;
  marca?: string;
  modelo?: string;
  numero_serie?: string;
  ubicacion?: string;
  estado: EstadoEquipo;
  fecha_registro: string;
}

export interface Ticket {
  id: number;
  titulo: string;
  descripcion: string;
  estado: EstadoTicket;
  prioridad: Prioridad;
  fecha_creacion: string;
  fecha_cierre?: string | null;
  equipo_id: number;
  solicitante_id: number;
  tecnico_id?: number | null;
  equipo: Equipo;
  solicitante: Usuario;
  tecnico?: Usuario | null;
}

export interface Repuesto {
  id: number;
  nombre: string;
  descripcion?: string;
  stock: number;
  costo_unitario: number;
}

export interface DiagnosticoRepuestoOut {
  id: number;
  repuesto_id: number;
  cantidad: number;
  repuesto: Repuesto;
}

export interface Diagnostico {
  id: number;
  ticket_id: number;
  tecnico_id: number;
  descripcion: string;
  costo_mano_obra: number;
  fecha: string;
  repuestos_usados: DiagnosticoRepuestoOut[];
}

// ---------------------------------------------------------------------------
// Requerimiento 1 — Equipos
// ---------------------------------------------------------------------------
export const equiposApi = {
  listar: () => api.get<Equipo[]>("/api/equipos/").then((r) => r.data),
  crear: (data: Partial<Equipo>) => api.post<Equipo>("/api/equipos/", data).then((r) => r.data),
  actualizar: (id: number, data: Partial<Equipo>) =>
    api.put<Equipo>(`/api/equipos/${id}`, data).then((r) => r.data),
  darDeBaja: (id: number) => api.delete(`/api/equipos/${id}`),
};

// ---------------------------------------------------------------------------
// Requerimientos 2 y 3 — Tickets (creación, asignación y cambio de estado)
// ---------------------------------------------------------------------------
export const ticketsApi = {
  listar: (estado?: EstadoTicket) =>
    api
      .get<Ticket[]>("/api/tickets/", { params: estado ? { estado } : {} })
      .then((r) => r.data),
  crear: (data: { titulo: string; descripcion: string; prioridad: Prioridad; equipo_id: number; solicitante_id: number }) =>
    api.post<Ticket>("/api/tickets/", data).then((r) => r.data),
  asignarTecnico: (id: number, tecnico_id: number) =>
    api.patch<Ticket>(`/api/tickets/${id}/asignar`, { tecnico_id }).then((r) => r.data),
  cambiarEstado: (id: number, estado: EstadoTicket) =>
    api.patch<Ticket>(`/api/tickets/${id}/estado`, { estado }).then((r) => r.data),
};

// ---------------------------------------------------------------------------
// Requerimiento 4 — Diagnósticos + repuestos
// ---------------------------------------------------------------------------
export const diagnosticosApi = {
  listarPorTicket: (ticketId: number) =>
    api.get<Diagnostico[]>(`/api/diagnosticos/ticket/${ticketId}`).then((r) => r.data),
  crear: (data: {
    ticket_id: number;
    tecnico_id: number;
    descripcion: string;
    costo_mano_obra: number;
    repuestos: { repuesto_id: number; cantidad: number }[];
  }) => api.post<Diagnostico>("/api/diagnosticos/", data).then((r) => r.data),
};

export const repuestosApi = {
  listar: () => api.get<Repuesto[]>("/api/repuestos/").then((r) => r.data),
  crear: (data: Partial<Repuesto>) => api.post<Repuesto>("/api/repuestos/", data).then((r) => r.data),
};

export const usuariosApi = {
  listar: () => api.get<Usuario[]>("/api/usuarios/").then((r) => r.data),
  listarPorRol: (rol: Rol) => api.get<Usuario[]>(`/api/usuarios/rol/${rol}`).then((r) => r.data),
  crear: (data: Partial<Usuario>) => api.post<Usuario>("/api/usuarios/", data).then((r) => r.data),
};

// ---------------------------------------------------------------------------
// Requerimiento 5 — Reportes y estadísticas
// ---------------------------------------------------------------------------
export interface CostoPorMes {
  mes: number;
  costo_total: number;
}

export interface ReporteResumenOut {
  tickets_por_estado: Record<string, number>;
  equipo_mas_fallas: { nombre: string; total_tickets: number } | null;
  tiempo_promedio_resolucion_horas: number | null;
  costo_repuestos_por_mes: CostoPorMes[];
}

export const reportesApi = {
  getResumen: () => api.get<ReporteResumenOut>("/api/reportes/resumen").then((r) => r.data),
};
