import React from "react";
import { IonPage, IonContent, IonButton } from "@ionic/react";
import "../theme/info.css";
import { useTheme } from "../components/ThemeContext";

const SuccessfullyDeletedAccount: React.FC = () => {

  const { darkMode } = useTheme();

  return (
    <IonPage>
      <IonContent className="content-container">
        <div className={darkMode ? "dark-mode" : ""}>
          <div
            className="content"
            style={{ backgroundColor: darkMode ? "#2c2c2c" : "white" }}
          >
            <h1 className="title">Account Deleted</h1>
            <p>
              Your account has been successfully deleted. We’re sorry to see you
              go. If you ever change your mind, you can create a new account
              anytime.
            </p>
            <IonButton
              expand="block"
              routerLink="/signup"
              className="green-button"
            >
              Sign Up
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SuccessfullyDeletedAccount;
