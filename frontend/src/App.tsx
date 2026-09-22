import { Navigate, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

/* Core CSS requerido por Ionic */
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Tema institucional (verde/dorado UCundinamarca) */
import "./theme/variables.css";

import MenuLateral from "./components/MenuLateral";
import EquiposPage from "./pages/EquiposPage";
import TicketsPage from "./pages/TicketsPage";
import TicketDetallePage from "./pages/TicketDetallePage";
import ReportesPage from "./pages/ReportesPage";
import NotificacionesPage from "./pages/NotificacionesPage";
import HistorialPage from "./pages/HistorialPage";
import BusquedaPage from "./pages/BusquedaPage";

setupIonicReact();

export default function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main-content">
          <MenuLateral />
          <IonRouterOutlet id="main-content">
            <Route path="/equipos" element={<EquiposPage />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/tickets/:id" element={<TicketDetallePage />} />
            <Route path="/reportes" element={<ReportesPage />} />
            <Route path="/notificaciones" element={<NotificacionesPage />} />
            <Route path="/historial" element={<HistorialPage />} />
            <Route path="/busqueda" element={<BusquedaPage />} />
            <Route path="/" element={<Navigate to="/equipos" />} />
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
}
