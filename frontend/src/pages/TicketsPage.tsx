import { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonButtons,
  IonToolbar,
  IonTitle,
  IonHeader,
  useIonToast,
  IonSegment,
  IonSegmentButton,
  IonNote,
} from "@ionic/react";
import { add } from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import EncabezadoInstitucional from "../components/EncabezadoInstitucional";
import { ticketsApi, equiposApi, usuariosApi } from "../services/api";
import type { Ticket, Equipo, Usuario, EstadoTicket, Prioridad } from "../services/api";

const colorEstado: Record<EstadoTicket, string> = {
  abierto: "danger",
  en_proceso: "warning",
  cerrado: "success",
};

/**
 * REQUERIMIENTO 2 — Gestión de Tickets
 * Un solicitante crea una solicitud de mantenimiento asociada a un
 * equipo existente. Desde aquí también se accede al detalle del
 * ticket, donde ocurre el Requerimiento 3 (asignar técnico / estado)
 * y el Requerimiento 4 (registrar diagnóstico).
 */
export default function TicketsPage() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [solicitantes, setSolicitantes] = useState<Usuario[]>([]);
  const [filtro, setFiltro] = useState<EstadoTicket | "todos">("todos");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [presentToast] = useIonToast();

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    prioridad: "media" as Prioridad,
    equipo_id: 0,
    solicitante_id: 0,
  });

  const cargarTickets = async () => {
    try {
      const datos = await ticketsApi.listar(filtro === "todos" ? undefined : filtro);
      setTickets(datos);
    } catch {
      presentToast({ message: "No fue posible conectar con la API.", duration: 3000, color: "danger" });
    }
  };

  useEffect(() => {
    cargarTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtro]);

  useEffect(() => {
    equiposApi.listar().then(setEquipos).catch(() => {});
    usuariosApi.listarPorRol("solicitante").then(setSolicitantes).catch(() => {});
  }, []);

  const crearTicket = async () => {
    if (!form.titulo || !form.descripcion || !form.equipo_id || !form.solicitante_id) {
      presentToast({ message: "Complete todos los campos obligatorios", duration: 2000, color: "warning" });
      return;
    }
    await ticketsApi.crear(form);
    setMostrarModal(false);
    setForm({ titulo: "", descripcion: "", prioridad: "media", equipo_id: 0, solicitante_id: 0 });
    presentToast({ message: "Ticket creado correctamente", duration: 2000, color: "success" });
    cargarTickets();
  };

  return (
    <IonPage>
      <EncabezadoInstitucional titulo="Tickets de mantenimiento" />
      <IonContent>
        <IonSegment value={filtro} onIonChange={(e) => setFiltro(e.detail.value as any)}>
          <IonSegmentButton value="todos"><IonLabel>Todos</IonLabel></IonSegmentButton>
          <IonSegmentButton value="abierto"><IonLabel>Abiertos</IonLabel></IonSegmentButton>
          <IonSegmentButton value="en_proceso"><IonLabel>En proceso</IonLabel></IonSegmentButton>
          <IonSegmentButton value="cerrado"><IonLabel>Cerrados</IonLabel></IonSegmentButton>
        </IonSegment>

        <IonList>
          {tickets.map((t) => (
            <IonItem key={t.id} button onClick={() => navigate(`/tickets/${t.id}`)}>
              <IonLabel>
                <h2>#{t.id} — {t.titulo}</h2>
                <p>{t.equipo?.nombre} · Solicita: {t.solicitante?.nombre}</p>
                {t.tecnico && <IonNote>Técnico asignado: {t.tecnico.nombre}</IonNote>}
              </IonLabel>
              <IonBadge slot="end" color={colorEstado[t.estado]}>
                {t.estado.replace("_", " ")}
              </IonBadge>
            </IonItem>
          ))}
          {tickets.length === 0 && (
            <IonItem>
              <IonLabel color="medium">No hay tickets para este filtro.</IonLabel>
            </IonItem>
          )}
        </IonList>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setMostrarModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonModal isOpen={mostrarModal} onDidDismiss={() => setMostrarModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Nueva solicitud de mantenimiento</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setMostrarModal(false)}>Cerrar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonInput label="Título *" labelPlacement="stacked" value={form.titulo}
              onIonInput={(e) => setForm({ ...form, titulo: e.detail.value! })} />
            <IonTextarea label="Descripción *" labelPlacement="stacked" value={form.descripcion}
              onIonInput={(e) => setForm({ ...form, descripcion: e.detail.value! })} />
            <IonSelect label="Prioridad" labelPlacement="stacked" value={form.prioridad}
              onIonChange={(e) => setForm({ ...form, prioridad: e.detail.value })}>
              <IonSelectOption value="baja">Baja</IonSelectOption>
              <IonSelectOption value="media">Media</IonSelectOption>
              <IonSelectOption value="alta">Alta</IonSelectOption>
              <IonSelectOption value="critica">Crítica</IonSelectOption>
            </IonSelect>
            <IonSelect label="Equipo *" labelPlacement="stacked" value={form.equipo_id || undefined}
              onIonChange={(e) => setForm({ ...form, equipo_id: e.detail.value })}>
              {equipos.map((eq) => (
                <IonSelectOption key={eq.id} value={eq.id}>{eq.nombre}</IonSelectOption>
              ))}
            </IonSelect>
            <IonSelect label="Solicitante *" labelPlacement="stacked" value={form.solicitante_id || undefined}
              onIonChange={(e) => setForm({ ...form, solicitante_id: e.detail.value })}>
              {solicitantes.map((u) => (
                <IonSelectOption key={u.id} value={u.id}>{u.nombre}</IonSelectOption>
              ))}
            </IonSelect>
            <IonButton expand="block" className="ion-margin-top" onClick={crearTicket}>
              Crear ticket
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
}
