import { useState, useEffect } from "react";
import { 
  IonPage, 
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
  cashOutline,
  warningOutline,
  checkmarkCircleOutline
} from "ionicons/icons";
import { reportesApi } from "../services/api";
import type { ReporteResumenOut } from "../services/api";
import EncabezadoInstitucional from "../components/EncabezadoInstitucional";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

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

  // Preparar datos para gráficos
  const pieData = resumen ? Object.entries(resumen.tickets_por_estado).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  })) : [];

  const barData = resumen ? resumen.costo_repuestos_por_mes.map(c => ({
    name: `Mes ${c.mes}`,
    costo: c.costo_total
  })) : [];

  const getColor = (name: string) => name.toLowerCase() === 'abierto' ? 'var(--ion-color-danger)' : 'var(--ion-color-success)';

  return (
    <IonPage>
      <EncabezadoInstitucional titulo="Dashboard de Análisis" />
      
      <IonContent className="ion-padding" color="light">
        {loading ? (
          <div className="ion-text-center ion-padding" style={{ marginTop: '50px' }}>
            <IonSpinner name="crescent" color="primary" />
            <p>Cargando estadísticas...</p>
          </div>
        ) : !resumen ? (
          <div className="ion-text-center">
            <IonText color="danger">No se pudieron cargar los datos.</IonText>
          </div>
        ) : (
          <IonGrid>
            {/* FILA 1: KPIs (Tarjetas proporcionales) */}
            <IonRow>
              <IonCol size="12" sizeMd="6" sizeLg="3">
                <IonCard style={{ height: '100%', margin: 0, display: 'flex', flexDirection: 'column' }}>
                  <IonCardContent style={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <IonIcon icon={checkmarkCircleOutline} color="success" style={{ fontSize: '3rem' }} />
                    <div>
                      <IonText color="medium"><h3 style={{ margin: 0, fontSize: '0.9rem', textTransform: 'uppercase' }}>Cerrados</h3></IonText>
                      <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: 'var(--ion-text-color)' }}>
                        {resumen.tickets_por_estado['cerrado'] || 0}
                      </h1>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>

              <IonCol size="12" sizeMd="6" sizeLg="3">
                <IonCard style={{ height: '100%', margin: 0, display: 'flex', flexDirection: 'column' }}>
                  <IonCardContent style={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <IonIcon icon={warningOutline} color="danger" style={{ fontSize: '3rem' }} />
                    <div>
                      <IonText color="medium"><h3 style={{ margin: 0, fontSize: '0.9rem', textTransform: 'uppercase' }}>Abiertos</h3></IonText>
                      <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: 'var(--ion-text-color)' }}>
                        {resumen.tickets_por_estado['abierto'] || 0}
                      </h1>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>

              <IonCol size="12" sizeMd="6" sizeLg="3">
                <IonCard style={{ height: '100%', margin: 0, display: 'flex', flexDirection: 'column' }}>
                  <IonCardContent style={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <IonIcon icon={desktopOutline} color="warning" style={{ fontSize: '3rem' }} />
                    <div style={{ overflow: 'hidden' }}>
                      <IonText color="medium"><h3 style={{ margin: 0, fontSize: '0.9rem', textTransform: 'uppercase' }}>Más Crítico</h3></IonText>
                      <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--ion-text-color)' }}>
                        {resumen.equipo_mas_fallas?.nombre || "N/A"}
                      </h1>
                      <IonText color="medium" style={{ fontSize: '0.8rem' }}>{resumen.equipo_mas_fallas?.total_tickets || 0} fallas</IonText>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>

              <IonCol size="12" sizeMd="6" sizeLg="3">
                <IonCard style={{ height: '100%', margin: 0, display: 'flex', flexDirection: 'column' }}>
                  <IonCardContent style={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <IonIcon icon={timeOutline} color="tertiary" style={{ fontSize: '3rem' }} />
                    <div>
                      <IonText color="medium"><h3 style={{ margin: 0, fontSize: '0.9rem', textTransform: 'uppercase' }}>Resolución</h3></IonText>
                      <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: 'var(--ion-text-color)' }}>
                        {resumen.tiempo_promedio_resolucion_horas ?? 0}h
                      </h1>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>

            {/* FILA 2: Gráficos reales */}
            <IonRow className="ion-margin-top">
              <IonCol size="12" sizeMd="6">
                <IonCard style={{ height: '100%', margin: 0 }}>
                  <IonCardHeader>
                    <IonCardTitle style={{ fontSize: '1.1rem' }}>
                      <IonIcon icon={pieChartOutline} color="primary" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                      Distribución de Tickets
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent style={{ height: '300px' }}>
                    {pieData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} tickets`, 'Cantidad']} />
                          <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <IonText color="medium">Sin datos para graficar</IonText>
                      </div>
                    )}
                  </IonCardContent>
                </IonCard>
              </IonCol>

              <IonCol size="12" sizeMd="6">
                <IonCard style={{ height: '100%', margin: 0 }}>
                  <IonCardHeader>
                    <IonCardTitle style={{ fontSize: '1.1rem' }}>
                      <IonIcon icon={cashOutline} color="success" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                      Costo de Repuestos por Mes
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent style={{ height: '300px' }}>
                    {barData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" />
                          <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                          <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Costo']} />
                          <Bar dataKey="costo" fill="var(--ion-color-success)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <IonText color="medium">Sin gastos registrados</IonText>
                      </div>
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
