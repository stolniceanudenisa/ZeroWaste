import { useTheme } from "./ThemeContext";
import { closeOutline } from "ionicons/icons";
import { IonContent, IonList, IonItem, IonLabel, IonListHeader, IonModal, IonIcon } from "@ionic/react";
import { useEffect, useState } from "react";
import { GetCollaborators } from "../services/apiClient";
import { useAuth } from "../services/authProvider";

interface ModalProps {
  showCollaboratorsModal: boolean;
  setShowCollaboratorsModal: (showCollaboratorsModal: boolean) => void;
}

const CollaboratorsModal: React.FC<ModalProps> = ({ showCollaboratorsModal, setShowCollaboratorsModal }) => {
  const { darkMode } = useTheme();

  const [collaborators, setCollaborators] = useState<string[]>([]);
  const {accessToken} = useAuth();

  useEffect(() => {
    const fetchData = async () => {

      const waitForToken = new Promise<void>((resolve) => {
        const checkToken = setInterval(() => {
          if (accessToken) {
            clearInterval(checkToken);
            resolve();
          }
        }, 500);
      });

      await waitForToken;
      GetCollaborators().then((response) => {
        if(response){
          setCollaborators(response.map((collaborator) => collaborator.email));
        }
        else{
          setCollaborators(sessionStorage.getItem("collaborators") ? JSON.parse(sessionStorage.getItem("collaborators")!) : []);
        }
      });
    };

    fetchData();
    
  }, []);

  return (
    <div className={darkMode ? "dark-mode" : ""}>
    <IonModal
      isOpen={showCollaboratorsModal}
      onDidDismiss={() => setShowCollaboratorsModal(false)}
      style={{
        maxHeight: "50vh",
        width: "80vw",
        margin: "auto",
        justifyContent: "center",
        alignitems: "center",
        border: `1px solid ${darkMode ? "white" : "black"}`,
      }}
    >
      <IonContent>
        <IonList>
          <IonListHeader
            className="label-dark-mode"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: `1px solid ${darkMode ? "white" : "black"}`,
              position: "sticky",
              top: 0,
              zIndex: 10,
              backgroundColor: "inherit",
            }}
          >
            <div style={{ fontSize: "1rem", flexGrow: 1 }}>Collaborators</div>
            <div>
              <IonIcon
                icon={closeOutline}
                onClick={() => setShowCollaboratorsModal(false)}
                style={{
                  fontSize: "2rem",
                  marginLeft: "auto",
                  paddingRight: "1rem",
                }}
              />
            </div>
          </IonListHeader>

            {/* pentru fiecare colaborator, avem un IonItem ce contine un IonLabel cu adresa de email*/}
          {collaborators.map((collaborator, index) => (
            <IonItem key={index}>
              <IonLabel className="label-dark-mode">{collaborator}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonModal>
    </div>
  );
};

export default CollaboratorsModal;
