import PaginaPorCompletar from "../components/PaginaPorCompletar";

/** REQUERIMIENTO 8 (propuesto a los estudiantes) */
export default function BusquedaPage() {
  return (
    <PaginaPorCompletar
      titulo="Búsqueda avanzada"
      requerimiento="Requerimiento 8 — Filtros y exportación"
      descripcion="Permitir buscar y filtrar tickets y equipos por múltiples criterios (estado, técnico asignado, prioridad, rango de fechas) y exportar el resultado a CSV."
      pistas={[
        "Backend: ampliar GET /api/tickets/ (routers/tickets.py) para aceptar parámetros opcionales adicionales: tecnico_id, prioridad, fecha_desde, fecha_hasta.",
        "Backend: considerar un endpoint GET /api/tickets/exportar que devuelva un archivo CSV con StreamingResponse.",
        "Frontend: usar IonSearchbar + varios IonSelect para los filtros, combinados en la query string de la petición axios.",
      ]}
    />
  );
}
