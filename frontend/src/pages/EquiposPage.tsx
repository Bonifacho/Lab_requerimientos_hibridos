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
  IonSelect,
  IonSelectOption,
  IonButton,
  IonButtons,
  IonToolbar,
  IonTitle,
  IonHeader,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  useIonToast,
  IonNote,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import { add, trashOutline } from "ionicons/icons";
import EncabezadoInstitucional from "../components/EncabezadoInstitucional";
import { equiposApi } from "../services/api";
import type { Equipo, EstadoEquipo } from "../services/api";

const colorEstado: Record<EstadoEquipo, string> = {
  operativo: "success",
  en_mantenimiento: "warning",
  de_baja: "medium",
};

/**
 * REQUERIMIENTO 1 — CRUD de Equipos
 * Permite registrar, listar, editar y dar de baja (lógica) los equipos
 * que pueden ser objeto de un ticket de mantenimiento.
 */
export default function EquiposPage() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [presentToast] = useIonToast();

  const [form, setForm] = useState({
    nombre: "",
    tipo: "",
    marca: "",
    modelo: "",
    numero_serie: "",
    ubicacion: "",
  });

  const cargarEquipos = async () => {
    try {
      const datos = await equiposApi.listar();
      setEquipos(datos);
    } catch (e) {
      presentToast({ message: "No fue posible conectar con la API. Verifique que el backend esté en ejecución.", duration: 3000, color: "danger" });
    }
  };

  useEffect(() => {
    cargarEquipos();
  }, []);

  const guardarEquipo = async () => {
    if (!form.nombre || !form.tipo) {
      presentToast({ message: "Nombre y tipo son obligatorios", duration: 2000, color: "warning" });
      return;
    }
    await equiposApi.crear(form);
    setMostrarModal(false);
    setForm({ nombre: "", tipo: "", marca: "", modelo: "", numero_serie: "", ubicacion: "" });
    presentToast({ message: "Equipo registrado correctamente", duration: 2000, color: "success" });
    cargarEquipos();
  };

  const darDeBaja = async (id: number) => {
    await equiposApi.darDeBaja(id);
    presentToast({ message: "Equipo dado de baja", duration: 2000, color: "medium" });
    cargarEquipos();
  };

  return (
    <IonPage>
      <EncabezadoInstitucional titulo="Equipos" />
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={async (e) => { await cargarEquipos(); e.detail.complete(); }}>
          <IonRefresherContent />
        </IonRefresher>

        <IonList>
          {equipos.map((eq) => (
            <IonItemSliding key={eq.id}>
              <IonItem>
                <IonLabel>
                  <h2>{eq.nombre}</h2>
                  <p>{eq.tipo} {eq.marca ? `· ${eq.marca} ${eq.modelo ?? ""}` : ""}</p>
                  {eq.ubicacion && <IonNote>{eq.ubicacion}</IonNote>}
                </IonLabel>
                <IonBadge slot="end" color={colorEstado[eq.estado]}>
                  {eq.estado.replace("_", " ")}
                </IonBadge>
              </IonItem>
              <IonItemOptions side="end">
                <IonItemOption color="danger" onClick={() => darDeBaja(eq.id)}>
                  <IonIcon slot="icon-only" icon={trashOutline} />
                </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          ))}
          {equipos.length === 0 && (
            <IonItem>
              <IonLabel color="medium">No hay equipos registrados todavía.</IonLabel>
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
              <IonTitle>Registrar equipo</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setMostrarModal(false)}>Cerrar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonInput label="Nombre *" labelPlacement="stacked" value={form.nombre}
              onIonInput={(e) => setForm({ ...form, nombre: e.detail.value! })} />
            <IonSelect label="Tipo *" labelPlacement="stacked" value={form.tipo}
              onIonChange={(e) => setForm({ ...form, tipo: e.detail.value })}>
              <IonSelectOption value="Computador">Computador</IonSelectOption>
              <IonSelectOption value="Impresora">Impresora</IonSelectOption>
              <IonSelectOption value="Red">Equipo de red</IonSelectOption>
              <IonSelectOption value="Videobeam">Videobeam</IonSelectOption>
              <IonSelectOption value="Otro">Otro</IonSelectOption>
            </IonSelect>
            <IonInput label="Marca" labelPlacement="stacked" value={form.marca}
              onIonInput={(e) => setForm({ ...form, marca: e.detail.value! })} />
            <IonInput label="Modelo" labelPlacement="stacked" value={form.modelo}
              onIonInput={(e) => setForm({ ...form, modelo: e.detail.value! })} />
            <IonInput label="Número de serie" labelPlacement="stacked" value={form.numero_serie}
              onIonInput={(e) => setForm({ ...form, numero_serie: e.detail.value! })} />
            <IonInput label="Ubicación" labelPlacement="stacked" value={form.ubicacion}
              onIonInput={(e) => setForm({ ...form, ubicacion: e.detail.value! })} />
            <IonButton expand="block" className="ion-margin-top" onClick={guardarEquipo}>
              Guardar equipo
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
}
