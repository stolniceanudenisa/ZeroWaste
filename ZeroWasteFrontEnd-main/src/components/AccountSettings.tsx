import {
  IonLabel,
  IonButton,
  IonInput, IonModal,
  IonLoading,
  IonToast
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../services/authProvider";
import { useTheme } from "./ThemeContext";

const AccountSettings: React.FC = () => {

    const { darkMode } = useTheme();

    const history = useHistory();
    const { user, deleteAccount, changePassword } = useAuth();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const [showChangePasswordModal, setShowChangePasswordModal] =
    useState<boolean>(false);
    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

    const [showDeleteAccountModal, setShowDeleteAccountModal] =
    useState<boolean>(false);
    const [deletePassword, setDeletePassword] = useState<string>("");
    const [showToast, setShowToast] = useState(false);
    const [toastmessage, setToastMessage] = useState<string>("");

    useEffect(() => {
    
      if (user) {
        setEmail(user.email);
      }

    }, [user]);

    const handleSaveNewPassword = () => {
        setLoading(true);
        changePassword(oldPassword, newPassword, confirmNewPassword).then((response) => {
          if (response ){
            setLoading(false);
            setShowChangePasswordModal(false);}
        }).catch((error) => {
          setToastMessage(error.detail);
          setShowToast(true);
          setLoading(false);
          setShowChangePasswordModal(false);
        });
      };

  const handleDeleteAccount = () => {
    setLoading(true);
      
    deleteAccount(deletePassword)
      .then((response) => {
      setShowDeleteAccountModal(false);
        if (response) {
          history.push("/successfully-deleted-account");
          setLoading(false);
        }
      })
        .catch((error) => {
          setToastMessage(error.detail);
          setShowToast(true);
          setLoading(false);
          setShowDeleteAccountModal(false);
        });
      };

    const isSaveDisabled = newPassword !== confirmNewPassword;
    

  return (
    <div className={`${darkMode ? "dark-mode" : ""}`}>
      <div className="check-in">
        <div className="input">
          <IonLabel position="floating" style={{ marginBottom: "20px" }}>
            Email
          </IonLabel>
          <IonInput value={email} type="email" readonly />
        </div>

        <IonButton
          onClick={() => setShowChangePasswordModal(true)}
          className="green-button-gradient"
          style={{
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            width: "90vw",
          }}
        >
          Change password
        </IonButton>
      </div>

      <IonModal
        isOpen={showChangePasswordModal}
        className="ion-modal-container"
      >
        <div
          className="modal-content"
          style={{ backgroundColor: darkMode ? "#2c2c2c" : "white" }}
        >
          <div>
            <IonLabel position="floating" style={{ marginBottom: "20px" }}>
              Old Password
            </IonLabel>
            <IonInput
              value={oldPassword}
              type="password"
              onIonInput={(e) => setOldPassword(e.detail.value!)}
            />
          </div>
          <div>
            <IonLabel position="floating" style={{ marginBottom: "20px" }}>
              New Password
            </IonLabel>
            <IonInput
              value={newPassword}
              type="password"
              onIonInput={(e) => setNewPassword(e.detail.value!)}
            />
          </div>
          <div>
            <IonLabel position="floating" style={{ marginBottom: "20px" }}>
              Confirm New Password
            </IonLabel>
            <IonInput
              value={confirmNewPassword}
              type="password"
              onIonInput={(e) => setConfirmNewPassword(e.detail.value!)}
            />
          </div>

          <IonButton
            expand="block"
            className="green-button-gradient"
            disabled={isSaveDisabled}
            onClick={handleSaveNewPassword}
            style={{
              marginTop: "20px",
            }}
          >
            Save
          </IonButton>
          <IonButton
            expand="block"
            color="danger"
            onClick={() => setShowChangePasswordModal(false)}
            style={{
              marginTop: "10px",
            }}
          >
            Cancel
          </IonButton>
        </div>
      </IonModal>

      <IonButton
        color="danger"
        onClick={() => setShowDeleteAccountModal(true)}
        style={{
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          width: "90vw",
        }}
      >
        Delete Account
      </IonButton>
      <IonModal isOpen={showDeleteAccountModal} className="ion-modal-container">
        <div
          className="modal-content"
          style={{ backgroundColor: darkMode ? "#2c2c2c" : "white" }}
        >
          <h4
            style={{ textAlign: "center", color: "red", marginBottom: "20px" }}
          >
            Warning! Irreversible action
          </h4>
          <div>
            <IonLabel position="floating" style={{ marginBottom: "20px" }}>
              Password
            </IonLabel>
            <IonInput
              placeholder="Type your password"
              value={deletePassword}
              type="password"
              onIonInput={(e) => setDeletePassword(e.detail.value!)}
            />
          </div>

          <IonButton
            expand="block"
            className="green-button-gradient"
            onClick={() => setShowDeleteAccountModal(false)}
            style={{
              marginTop: "10px",
            }}
          >
            Keep my account
          </IonButton>
          <IonButton
            expand="block"
            color="danger"
            onClick={handleDeleteAccount}
            style={{
              marginTop: "20px",
            }}
          >
            Delete my account
          </IonButton>
        </div>
      </IonModal>
      
      {/* Loading spinner */}
      <IonLoading isOpen={loading} message="Please wait..." />

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastmessage}
        duration={3000}
        position="top"
        style={{marginTop : "20px"}}
      />
    </div>
  );
};

export default AccountSettings;
