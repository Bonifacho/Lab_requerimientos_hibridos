import { IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton } from "@ionic/react";
import escudo from "../theme/escudo.png";

interface Props {
  titulo: string;
}

/**
 * Encabezado reutilizado en todas las páginas: escudo institucional +
 * nombre de la página. Mantiene la identidad visual (verde/dorado) de la
 * Universidad de Cundinamarca en toda la aplicación.
 */
export default function EncabezadoInstitucional({ titulo }: Props) {
  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonMenuButton />
        </IonButtons>
        <div className="encabezado-institucional">
          <img src={escudo} alt="Escudo Universidad de Cundinamarca" />
          <IonTitle>{titulo}</IonTitle>
        </div>
      </IonToolbar>
    </IonHeader>
  );
}
