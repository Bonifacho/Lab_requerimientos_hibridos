import {
  IonMenu,
  IonContent,
  IonList,
  IonListHeader,
  IonItem,
  IonIcon,
  IonLabel,
  IonMenuToggle,
} from "@ionic/react";
import {
  hardwareChipOutline,
  ticketOutline,
  statsChartOutline,
  notificationsOutline,
  timeOutline,
  searchOutline,
} from "ionicons/icons";
import escudo from "../theme/escudo.png";

const requerimientosDocente = [
  { titulo: "Equipos", path: "/equipos", icono: hardwareChipOutline },
  { titulo: "Tickets", path: "/tickets", icono: ticketOutline },
];

const requerimientosEstudiantes = [
  { titulo: "Reportes y estadísticas", path: "/reportes", icono: statsChartOutline },
  { titulo: "Notificaciones", path: "/notificaciones", icono: notificationsOutline },
  { titulo: "Historial del ticket", path: "/historial", icono: timeOutline },
  { titulo: "Búsqueda avanzada", path: "/busqueda", icono: searchOutline },
];

export default function MenuLateral() {
  return (
    <IonMenu contentId="main-content" type="overlay">
      <IonContent>
        <IonList>
          <IonListHeader>
            <img src={escudo} alt="Escudo" style={{ height: 40, marginRight: 10 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Universidad de Cundinamarca</div>
              <div style={{ fontSize: 12, color: "#757575" }}>Helpdesk Técnico</div>
            </div>
          </IonListHeader>

          <IonListHeader>Requerimientos desarrollados</IonListHeader>
          {requerimientosDocente.map((item) => (
            <IonMenuToggle key={item.path} autoHide={false}>
              <IonItem routerLink={item.path} routerDirection="none" detail={false}>
                <IonIcon slot="start" icon={item.icono} />
                <IonLabel>{item.titulo}</IonLabel>
              </IonItem>
            </IonMenuToggle>
          ))}

          <IonListHeader>Por completar (estudiantes)</IonListHeader>
          {requerimientosEstudiantes.map((item) => (
            <IonMenuToggle key={item.path} autoHide={false}>
              <IonItem routerLink={item.path} routerDirection="none" detail={false}>
                <IonIcon slot="start" icon={item.icono} color="secondary" />
                <IonLabel>{item.titulo}</IonLabel>
              </IonItem>
            </IonMenuToggle>
          ))}
        </IonList>
      </IonContent>
    </IonMenu>
  );
}
