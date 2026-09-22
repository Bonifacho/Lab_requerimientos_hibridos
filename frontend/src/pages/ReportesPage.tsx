import { useState, useEffect } from "react";
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent,
  IonSpinner,
  IonIcon,
  IonText
} from "@ionic/react";
import { 
  pieChartOutline, 
  desktopOutline, 
  timeOutline, 
  cashOutline 
} from "ionicons/icons";
import { reportesApi } from "../services/api";
import type { ReporteResumenOut } from "../services/api";

export default function ReportesPage() {
  const [resumen, setResumen] = useState<ReporteResumenOut | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportesApi
      .getResumen()
      .then((data) => {
        setResumen(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar reportes", err);
        setLoading(false);
      });
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Dashboard de Reportes</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        {loading ? (
          <div className="ion-text-center ion-padding">
            <IonSpinner name="crescent" />
            <p>Cargando estadísticas...</p>
          </div>
        ) : !resumen ? (
          <div className="ion-text-center">
            <IonText color="danger">No se pudieron cargar los datos.</IonText>
          </div>
        ) : (
          <IonGrid>
            <IonRow>
              {/* 1. Cantidad de tickets por estado */}
              <IonCol size="12" sizeMd="6" sizeLg="3">
                <IonCard>
                  <IonCardHeader>
                    <IonIcon icon={pieChartOutline} size="large" color="tertiary" />
                    <IonCardTitle>Tickets por Estado</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                      {Object.entries(resumen.tickets_por_estado).map(([estado, count]) => (
                        <li key={estado} style={{ marginBottom: "8px" }}>
                          <strong>{estado.toUpperCase()}:</strong> {count}
                        </li>
                      ))}
                    </ul>
                  </IonCardContent>
                </IonCard>
              </IonCol>

              {/* 2. Equipo con más fallas */}
              <IonCol size="12" sizeMd="6" sizeLg="3">
                <IonCard>
                  <IonCardHeader>
                    <IonIcon icon={desktopOutline} size="large" color="danger" />
                    <IonCardTitle>Equipo con más Fallas</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    {resumen.equipo_mas_fallas ? (
                      <>
                        <h2 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                          {resumen.equipo_mas_fallas.nombre}
                        </h2>
                        <p>{resumen.equipo_mas_fallas.total_tickets} tickets reportados</p>
                      </>
                    ) : (
                      <p>No hay datos suficientes.</p>
                    )}
                  </IonCardContent>
                </IonCard>
              </IonCol>

              {/* 3. Tiempo promedio de resolución */}
              <IonCol size="12" sizeMd="6" sizeLg="3">
                <IonCard>
                  <IonCardHeader>
                    <IonIcon icon={timeOutline} size="large" color="warning" />
                    <IonCardTitle>Tiempo Promedio Resolución</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    {resumen.tiempo_promedio_resolucion_horas !== null ? (
                      <>
                        <h1 style={{ fontSize: "2.5rem", margin: "10px 0" }}>
                          {resumen.tiempo_promedio_resolucion_horas}
                        </h1>
                        <p>horas en promedio</p>
                      </>
                    ) : (
                      <p>Sin tickets cerrados para calcular.</p>
                    )}
                  </IonCardContent>
                </IonCard>
              </IonCol>

              {/* 4. Costo repuestos por mes */}
              <IonCol size="12" sizeMd="6" sizeLg="3">
                <IonCard>
                  <IonCardHeader>
                    <IonIcon icon={cashOutline} size="large" color="success" />
                    <IonCardTitle>Costo Repuestos/Mes</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    {resumen.costo_repuestos_por_mes.length > 0 ? (
                      <ul style={{ listStyleType: "none", padding: 0 }}>
                        {resumen.costo_repuestos_por_mes.map((c) => (
                          <li key={c.mes} style={{ marginBottom: "8px" }}>
                            <strong>Mes {c.mes}:</strong> ${c.costo_total.toLocaleString()}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No se han registrado repuestos.</p>
                    )}
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        )}
      </IonContent>
    </IonPage>
  );
}
