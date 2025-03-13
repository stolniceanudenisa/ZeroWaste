import React from "react";
import { IonPage, IonContent, IonButton } from "@ionic/react";
import "../theme/info.css";
import { useTheme } from "../components/ThemeContext";

const NotFound: React.FC = () => {
  
  const { darkMode } = useTheme();

  return (
    <IonPage>
      <IonContent className="content-container">
        <div className={darkMode ? "dark-mode" : ""}>
          <div
            className="content"
            style={{ backgroundColor: darkMode ? "#2c2c2c" : "white" }}
          >
            <h1 className="title">Page Not Found</h1>
            <p>
              The page you are looking for does not exist. Please check the URL
              or return to the home page.
            </p>
            <IonButton
              expand="block"
              routerLink="/home"
              className="green-button"
            >
              Go to Home
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default NotFound;
