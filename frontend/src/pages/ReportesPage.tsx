import PaginaPorCompletar from "../components/PaginaPorCompletar";

/** REQUERIMIENTO 5 (propuesto a los estudiantes) */
export default function ReportesPage() {
  return (
    <PaginaPorCompletar
      titulo="Reportes y estadísticas"
      requerimiento="Requerimiento 5 — Dashboard de reportes"
      descripcion="Construir un panel con estadísticas agregadas del helpdesk: cantidad de tickets por estado, el equipo con más fallas reportadas, y el tiempo promedio de resolución de un ticket (fecha_cierre - fecha_creacion)."
      pistas={[
        "Backend: crear un endpoint GET /api/reportes/resumen que use func.count(), func.avg() y group_by() de SQLAlchemy sobre la tabla tickets.",
        "Frontend: usar IonCard con IonGrid para mostrar las cifras clave, y opcionalmente una librería de gráficos como recharts o chart.js.",
        "Considerar filtros por rango de fechas y por equipo.",
      ]}
    />
  );
}
