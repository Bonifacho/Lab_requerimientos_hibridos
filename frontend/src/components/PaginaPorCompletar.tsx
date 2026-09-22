import { IonPage, IonContent, IonCard, IonCardContent, IonIcon, IonText, IonList, IonItem, IonLabel } from "@ionic/react";
import { constructOutline } from "ionicons/icons";
import EncabezadoInstitucional from "./EncabezadoInstitucional";

interface Props {
  titulo: string;
  requerimiento: string;
  descripcion: string;
  pistas: string[];
}

/**
 * Plantilla común para las páginas de los 4 requerimientos propuestos a
 * los estudiantes (Sesión 3). No están implementadas a propósito: cada
 * una describe el requerimiento, da pistas técnicas de dónde conectarlo
 * con el backend (ver TODO en el código de FastAPI) y deja la pantalla
 * lista para que el estudiante agregue sus propios componentes.
 */
export default function PaginaPorCompletar({ titulo, requerimiento, descripcion, pistas }: Props) {
  return (
    <IonPage>
      <EncabezadoInstitucional titulo={titulo} />
      <IonContent className="ion-padding">
        <IonCard color="light">
          <IonCardContent>
            <IonText color="secondary">
              <h2><IonIcon icon={constructOutline} /> {requerimiento}</h2>
            </IonText>
            <p>{descripcion}</p>
            <IonText color="medium">
              <p><strong>Pistas para implementarlo:</strong></p>
            </IonText>
            <IonList>
              {pistas.map((pista, i) => (
                <IonItem key={i} lines="none">
                  <IonLabel className="ion-text-wrap">• {pista}</IonLabel>
                </IonItem>
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
}
