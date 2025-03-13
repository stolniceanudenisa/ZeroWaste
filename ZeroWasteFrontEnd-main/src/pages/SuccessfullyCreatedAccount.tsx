import React, { useEffect } from "react";
import { IonPage, IonContent, IonButton } from "@ionic/react";
import "../theme/info.css"; 
import { useTheme } from "../components/ThemeContext";
import { useLocation } from "react-router";
import { VerifyEmail } from "../services/apiClient";

const SuccessfullyCreatedAccount: React.FC = () => {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  const uid = searchParams.get('uid');
  
  const { darkMode } = useTheme();

  const [message, setMessage] = React.useState<string>("");

  useEffect(() => {

    if (!token || !uid) {
      console.error("Invalid token or user ID");
    }
    if (token && uid) {
      VerifyEmail(token, Number(uid)).then((response) => {
        if (response) {
          setMessage("Your account has been successfully activated. You can now log in and start using the app.")
        } else {
          console.log("Email not verified");
        }
      });
    }

  }, []);


  return (
    <IonPage>
      <IonContent className="content-container">
        <div className={darkMode ? "dark-mode" : ""}>
          <div
            className="content"
            style={{ backgroundColor: darkMode ? "#2c2c2c" : "white" }}
          >
            <h1 className="title">Account Successfully Created!</h1>
            <p>
                {message}
            </p>
            <IonButton
              expand="block"
              routerLink="/login"
              className="green-button"
            >
              Log in
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SuccessfullyCreatedAccount;
