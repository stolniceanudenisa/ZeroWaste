import React from "react";
import { useHistory } from "react-router-dom";
import {
  IonPage,
  IonContent,
  IonIcon,
  IonRouterLink,
} from "@ionic/react";
import { logOutOutline } from "ionicons/icons";
import "../theme/profile.css";
import "../theme/darkMode.css"
import { useTheme } from "../components/ThemeContext"; 
import ProfileSettings from "../components/ProfileSettings";
import AccountSettings from "../components/AccountSettings";
import Menu from "../components/Menu";
import { useAuth } from "../services/authProvider";

const Profile: React.FC = () => {
 
  const history = useHistory();
  const { darkMode } = useTheme();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout().then(() => {
      history.push("/login");
      });
  };

  return (
    <IonPage>
      <IonContent>
        <div className={darkMode ? "dark-mode" : ""}>
          <div className="center-profile">
            <IonRouterLink
              onClick={handleLogout}
              color="danger"
              style={{
                display: "block",
                marginLeft: "auto",
                color: "red",
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: "36px",
                padding: "10px",
                cursor: "pointer",
              }}
            >
              <IonIcon icon={logOutOutline} style={{ marginRight: "8px", color:"red" }} />
            </IonRouterLink>
            <img
              src="/images/logo.png"
              alt="Logo"
              className="profile-photo"
              style={{
                objectFit: "cover",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            />

            <ProfileSettings />
            <div style={{ borderBottom: "1px solid #ccc", margin: "10px 0"}}></div>
            <AccountSettings />
          </div>
        </div>
      </IonContent>
      <div slot="bottom" className={darkMode ? "dark-mode" : ""}>
        <Menu />
      </div>
    </IonPage>
  );
};

export default Profile;
