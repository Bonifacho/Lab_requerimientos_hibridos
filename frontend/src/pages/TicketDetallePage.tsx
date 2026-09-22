import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonBadge,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonTextarea,
  IonInput,
  IonList,
  IonIcon,
  useIonToast,
  IonText,
  IonChip,
} from "@ionic/react";
import { addCircleOutline, closeCircleOutline, buildOutline } from "ionicons/icons";
import EncabezadoInstitucional from "../components/EncabezadoInstitucional";
import { ticketsApi, diagnosticosApi, usuariosApi, repuestosApi } from "../services/api";
import type { Ticket, Usuario, Repuesto, Diagnostico, EstadoTicket } from "../services/api";

const colorEstado: Record<EstadoTicket, string> = {
  abierto: "danger",
  en_proceso: "warning",
  cerrado: "success",
};

interface RepuestoSeleccionado {
  repuesto_id: number;
  cantidad: number;
}

/**
 * REQUERIMIENTO 3 — Asignación de técnico y cambio de estado del ticket.
 * REQUERIMIENTO 4 — Registro de diagnóstico técnico con repuestos usados.
 */
export default function TicketDetallePage() {
  const { id } = useParams<{ id: string }>();
  const ticketId = Number(id);
  const [presentToast] = useIonToast();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [tecnicos, setTecnicos] = useState<Usuario[]>([]);
  const [repuestos, setRepuestos] = useState<Repuesto[]>([]);
  const [diagnosticos, setDiagnosticos] = useState<Diagnostico[]>([]);

  const [tecnicoSeleccionado, setTecnicoSeleccionado] = useState<number | undefined>();
  const [descripcionDiag, setDescripcionDiag] = useState("");
  const [costoManoObra, setCostoManoObra] = useState<number>(0);
  const [repuestoActual, setRepuestoActual] = useState<number | undefined>();
  const [cantidadActual, setCantidadActual] = useState<number>(1);
  const [repuestosSeleccionados, setRepuestosSeleccionados] = useState<RepuestoSeleccionado[]>([]);

  const cargarTodo = async () => {
    const [t, tecs, reps, diags] = await Promise.all([
      ticketsApi.listar().then((lista) => lista.find((x) => x.id === ticketId) || null),
      usuariosApi.listarPorRol("tecnico"),
      repuestosApi.listar(),
      diagnosticosApi.listarPorTicket(ticketId),
    ]);
    setTicket(t);
    setTecnicos(tecs);
    setRepuestos(reps);
    setDiagnosticos(diags);
  };

  useEffect(() => {
    cargarTodo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId]);

  // --- Requerimiento 3: asignar técnico -----------------------------------
  const asignarTecnico = async () => {
    if (!tecnicoSeleccionado) return;
    await ticketsApi.asignarTecnico(ticketId, tecnicoSeleccionado);
    presentToast({ message: "Técnico asignado. El ticket pasa a 'en proceso'.", duration: 2000, color: "success" });
    cargarTodo();
  };

  // --- Requerimiento 3: cambiar estado ------------------------------------
  const cambiarEstado = async (estado: EstadoTicket) => {
    try {
      await ticketsApi.cambiarEstado(ticketId, estado);
      presentToast({ message: `Estado actualizado a "${estado}"`, duration: 2000, color: "success" });
      cargarTodo();
    } catch (e: any) {
      presentToast({
        message: e?.response?.data?.detail || "No fue posible cambiar el estado",
        duration: 2500,
        color: "danger",
      });
    }
  };

  // --- Requerimiento 4: agregar repuesto a la lista temporal --------------
  const agregarRepuesto = () => {
    if (!repuestoActual || cantidadActual < 1) return;
    setRepuestosSeleccionados((prev) => [...prev, { repuesto_id: repuestoActual, cantidad: cantidadActual }]);
    setRepuestoActual(undefined);
    setCantidadActual(1);
  };

  // --- Requerimiento 4: registrar diagnóstico -------------------------------
  const registrarDiagnostico = async () => {
    if (!tecnicoSeleccionado || !descripcionDiag) {
      presentToast({ message: "Seleccione técnico y describa el diagnóstico", duration: 2000, color: "warning" });
      return;
    }
    try {
      await diagnosticosApi.crear({
        ticket_id: ticketId,
        tecnico_id: tecnicoSeleccionado,
        descripcion: descripcionDiag,
        costo_mano_obra: costoManoObra,
        repuestos: repuestosSeleccionados,
      });
      presentToast({ message: "Diagnóstico registrado. Stock de repuestos actualizado.", duration: 2500, color: "success" });
      setDescripcionDiag("");
      setCostoManoObra(0);
      setRepuestosSeleccionados([]);
      cargarTodo();
    } catch (e: any) {
      presentToast({
        message: e?.response?.data?.detail || "No fue posible registrar el diagnóstico",
        duration: 2500,
        color: "danger",
      });
    }
  };

  if (!ticket) {
    return (
      <IonPage>
        <EncabezadoInstitucional titulo="Ticket" />
        <IonContent className="ion-padding">Cargando…</IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <EncabezadoInstitucional titulo={`Ticket #${ticket.id}`} />
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>
              <IonBadge color={colorEstado[ticket.estado]}>{ticket.estado.replace("_", " ")}</IonBadge>{" "}
              Prioridad: {ticket.prioridad}
            </IonCardSubtitle>
            <IonCardTitle>{ticket.titulo}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>{ticket.descripcion}</p>
            <IonText color="medium">
              <p>Equipo: {ticket.equipo?.nombre} · Solicitante: {ticket.solicitante?.nombre}</p>
              {ticket.tecnico && <p>Técnico asignado: {ticket.tecnico.nombre}</p>}
            </IonText>
          </IonCardContent>
        </IonCard>

        {/* Requerimiento 3 */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Asignación y estado (Requerimiento 3)</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonSelect label="Técnico" labelPlacement="stacked" value={tecnicoSeleccionado}
                onIonChange={(e) => setTecnicoSeleccionado(e.detail.value)}>
                {tecnicos.map((t) => (
                  <IonSelectOption key={t.id} value={t.id}>{t.nombre}</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <IonButton expand="block" onClick={asignarTecnico} disabled={ticket.estado === "cerrado"}>
              Asignar técnico
            </IonButton>

            <div className="ion-margin-top">
              <IonButton color="warning" disabled={ticket.estado !== "en_proceso"} onClick={() => cambiarEstado("abierto")}>
                Reabrir
              </IonButton>
              <IonButton color="success" disabled={ticket.estado !== "en_proceso"} onClick={() => cambiarEstado("cerrado")}>
                <IonIcon slot="start" icon={closeCircleOutline} />
                Cerrar ticket
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Requerimiento 4 */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={buildOutline} /> Diagnóstico técnico (Requerimiento 4)
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              {diagnosticos.map((d) => (
                <IonItem key={d.id}>
                  <IonLabel>
                    <h3>{d.descripcion}</h3>
                    <p>Mano de obra: ${d.costo_mano_obra.toLocaleString()}</p>
                    {d.repuestos_usados.map((r) => (
                      <IonChip key={r.id} outline>
                        {r.repuesto.nombre} × {r.cantidad}
                      </IonChip>
                    ))}
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>

            <IonTextarea label="Descripción del diagnóstico *" labelPlacement="stacked" value={descripcionDiag}
              onIonInput={(e) => setDescripcionDiag(e.detail.value!)} />
            <IonInput type="number" label="Costo mano de obra" labelPlacement="stacked" value={costoManoObra}
              onIonInput={(e) => setCostoManoObra(Number(e.detail.value))} />

            <IonItem>
              <IonSelect label="Repuesto" labelPlacement="stacked" value={repuestoActual}
                onIonChange={(e) => setRepuestoActual(e.detail.value)}>
                {repuestos.map((r) => (
                  <IonSelectOption key={r.id} value={r.id}>{r.nombre} (stock: {r.stock})</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <IonInput type="number" label="Cantidad" labelPlacement="stacked" value={cantidadActual}
              onIonInput={(e) => setCantidadActual(Number(e.detail.value))} />
            <IonButton fill="outline" onClick={agregarRepuesto}>
              <IonIcon slot="start" icon={addCircleOutline} /> Agregar repuesto a la lista
            </IonButton>

            <div className="ion-margin-vertical">
              {repuestosSeleccionados.map((r, idx) => {
                const info = repuestos.find((x) => x.id === r.repuesto_id);
                return <IonChip key={idx} color="secondary">{info?.nombre} × {r.cantidad}</IonChip>;
              })}
            </div>

            <IonButton expand="block" onClick={registrarDiagnostico}>
              Registrar diagnóstico
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
}
