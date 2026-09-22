import PaginaPorCompletar from "../components/PaginaPorCompletar";

/** REQUERIMIENTO 7 (propuesto a los estudiantes) */
export default function HistorialPage() {
  return (
    <PaginaPorCompletar
      titulo="Historial del ticket"
      requerimiento="Requerimiento 7 — Auditoría de cambios de estado"
      descripcion="Registrar cada cambio de estado de un ticket (quién lo hizo, cuándo, y de qué estado a qué estado) y mostrarlo como una línea de tiempo dentro del detalle del ticket."
      pistas={[
        "Backend: crear la entidad TicketHistorial(id, ticket_id, estado_anterior, estado_nuevo, fecha) e insertarla en cambiar_estado_ticket() en routers/tickets.py (ver el TODO ya dejado allí).",
        "Backend: exponer GET /api/tickets/{id}/historial.",
        "Frontend: usar IonList con IonItem por evento, o un componente de timeline vertical dentro de TicketDetallePage.tsx.",
      ]}
    />
  );
}
