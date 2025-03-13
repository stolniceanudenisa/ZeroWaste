import { IonTabBar, IonTabButton, IonIcon, IonLabel } from "@ionic/react";
import { homeOutline, listOutline, personOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { useTheme } from "./ThemeContext";

const Menu: React.FC = () => {
  const history = useHistory();
  const {darkMode} = useTheme();

  return (
    <div className={darkMode ? "dark-mode" : ""}>
    <IonTabBar>
      <IonTabButton tab="myproducts" onClick={() => history.push("/home")}>
        <IonIcon icon={homeOutline} />
        <IonLabel>Products</IonLabel>
      </IonTabButton>

      <IonTabButton tab="recipes" onClick={() => history.push("/recipes")}>
        <IonIcon icon={listOutline} />
        <IonLabel>Recipes</IonLabel>
      </IonTabButton>

      <IonTabButton tab="profile" onClick={() => history.push("/profile")}>
        <IonIcon icon={personOutline} />
        <IonLabel>Profile</IonLabel>
      </IonTabButton>
    </IonTabBar>
    </div>
  );
};

export default Menu;
