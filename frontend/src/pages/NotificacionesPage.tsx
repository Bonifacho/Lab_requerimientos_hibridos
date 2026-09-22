import PaginaPorCompletar from "../components/PaginaPorCompletar";

/** REQUERIMIENTO 6 (propuesto a los estudiantes) */
export default function NotificacionesPage() {
  return (
    <PaginaPorCompletar
      titulo="Notificaciones"
      requerimiento="Requerimiento 6 — Notificaciones de cambio de estado"
      descripcion="Avisar al solicitante cada vez que el estado de su ticket cambia (por ejemplo, cuando se le asigna un técnico o cuando se cierra)."
      pistas={[
        "Backend: crear una entidad Notificacion (id, usuario_id, mensaje, leida, fecha) y generar un registro dentro de cambiar_estado_ticket() en routers/tickets.py (ver el TODO ya dejado allí).",
        "Alternativa más simple: exponer un endpoint GET /api/notificaciones/usuario/{id} que la app consulte periódicamente (polling).",
        "Frontend: mostrar un IonBadge con el conteo de notificaciones no leídas sobre el ícono del menú.",
      ]}
    />
  );
}
