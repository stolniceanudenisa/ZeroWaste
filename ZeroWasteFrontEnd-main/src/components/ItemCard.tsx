import {
  IonIcon,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonButton,
  useIonAlert,
} from "@ionic/react";
import {
  trashOutline,
  restaurantOutline,
} from "ionicons/icons";
import { useHistory } from "react-router-dom";
import "../theme/itemCard.css";
import { useTheme } from "./ThemeContext";
import { DeleteProduct } from "../services/apiClient";
import { useAuth } from "../services/authProvider";

interface ItemProps {
  id: number;
  name: string;
  best_before: string; // Format: "DD.MM.YYYY"
  opened: string;
  consumption_days: string;
  onEdit: (
    id: number,
    name: string,
    best_before: string,  // Format: "DD.MM.YYYY"
    opened: string,
    consumption_days: string
  ) => void; 
}


const ItemCard: React.FC<ItemProps> = ({id,name, best_before, opened, consumption_days, onEdit }) => {
  const history = useHistory();
  const { darkMode } = useTheme();
  const [presentAlert] = useIonAlert();

  const convertDateFormat = (date: string) => {
    const parts = date.split("-");
    return `${parts[2]}.${parts[1]}.${parts[0]}`; // "DD.MM.YYYY"
  };

  best_before ? best_before = convertDateFormat(best_before) : best_before; // conversie a formatului datei daca best_before nu este null
  opened ? (opened = convertDateFormat(opened)) : opened; // conversie a formatului datei daca opened nu este null

 
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    DeleteProduct(id)
  };

   const isExpired = () => {
     const today = new Date();
     const parts = best_before ? best_before.split(".") : [];
     if (parts.length === 3) {
       const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`; // "YYYY-MM-DD"
       const expDate = new Date(formattedDate);
       today.setHours(0, 0, 0, 0);
       expDate.setHours(0, 0, 0, 0);
       return expDate < today;
     }
     return false;
   };

   const handleItemEdit = () => {
    onEdit(id,name, best_before, opened, consumption_days); // editarea produsului
  };

  const isSoonToExpire = () => {
    const today = new Date();
    const parts = best_before ? best_before.split(".") : [];
    if (parts.length === 3) {
      const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`; // "YYYY-MM-DD"
      const expDate = new Date(formattedDate);
      today.setHours(0, 0, 0, 0);
      expDate.setHours(0, 0, 0, 0);
      const diffTime = expDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 3 && diffDays > 0;
    }
    return false;
  };

  const {user} = useAuth();

  return (
    <div className={darkMode ? "dark-mode" : ""}>
      <IonCard
        className={`item-card ${best_before ? isExpired() ? "expired" : isSoonToExpire() ? "soon-to-expire" : "" : ""}`}
        onClick={handleItemEdit}
      >
        <IonCardHeader>
          <IonLabel className="item-card-title">{name}</IonLabel>
        </IonCardHeader>

        <IonCardContent className="item-card-content">
          <div className="footer-container">
        <div className="expiration-text">
            {isExpired() ? "Expired: " + (best_before) : "Expiration date: " + (best_before ? best_before : "Unknown")}
        </div>
        <div className="button-container">
            <IonButton
            color="success"
            size="small"
            onClick={handleDeleteClick}
            disabled={isExpired()}
            >
            <IonIcon icon={restaurantOutline} slot="icon-only" />
            </IonButton>
          <IonButton
            color="danger"
            size="small"
            onClick={(e) => handleDeleteClick(e)}
          >
            <IonIcon icon={trashOutline} slot="icon-only" />
          </IonButton>
        </div>
          </div>
        </IonCardContent>
      </IonCard>
    </div>
  );
};

export default ItemCard;