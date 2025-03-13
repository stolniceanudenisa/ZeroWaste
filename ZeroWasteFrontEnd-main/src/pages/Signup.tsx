import { useState } from "react";
import React from "react";
import {
  IonButton,
  IonContent,
  IonPage,
  IonItem,
  IonLabel,
  IonInput,
  IonText,
  IonToast
} from "@ionic/react";
import "../theme/login.css";
import { registerUser } from '../services/apiClient';
import { useTheme } from "../components/ThemeContext";
import { useHistory } from "react-router-dom";

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const history = useHistory();

  const [showToast, setShowToast] = useState(false);
  const [toastmessage, setToastMessage] = useState<string>("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      registerUser(email, password, confirmPassword).then((response) => {
        if (response) {
          setShowToast(true);
          setToastMessage(
            "Please verify your email to complete the registration."
          );
          console.log(response);

          // redirectionare dupa activarea toast-ului
          setTimeout(() => {
            history.push("/login");
          }, 3000); // asteptam ca toast-ul sa dispara
        } else {
          console.log("Signup failed");
        }
      });
    } catch (error) {
      console.error("Error during signup:", error);
    }
  }


  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (!validateEmail(value)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError(""); // emailul este valid, se sterge mesajul de eroare
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (value !== password) {
      setError("Passwords do not match!");
    } else {
      setError(""); // parolele coincid, se sterge mesajul de eroare
    }
  };

  const { darkMode } = useTheme();

  return (
    <IonPage>
        <div className={darkMode ? "dark-mode" : ""}>
          <div className="center-content-vertically">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="img-logo"
              style={{ objectFit: "cover", maxWidth: "400px" }}
            />
            <form onSubmit={handleSignup}>
              {/* Email */}
              <IonItem style={{ marginTop: "10px", width: "75vw" }}>
                <IonLabel position="stacked" className="label-dark-mode">
                  Email
                </IonLabel>
                <IonInput
                  type="email"
                  placeholder="Type your email"
                  value={email}
                  onIonInput={(e) => handleEmailChange(e.detail.value!)}
                />
              </IonItem>
              {emailError && (
                <IonText color="danger" style={{ marginTop: "10px" }}>
                  {emailError}
                </IonText>
              )}

              {/* Parola */}
              <IonItem style={{ marginTop: "10px", width: "75vw" }}>
                <IonLabel position="stacked" className="label-dark-mode">
                  Password
                </IonLabel>
                <IonInput
                  type="password"
                  placeholder="Type your password"
                  value={password}
                  onIonInput={(e) => setPassword(e.detail.value!)}
                />
              </IonItem>

              {/* Confirmare parola */}
              <IonItem style={{ marginTop: "10px", width: "75vw" }}>
                <IonLabel position="stacked" className="label-dark-mode">
                  Confirm Password
                </IonLabel>
                <IonInput
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onIonInput={(e) =>
                    handleConfirmPasswordChange(e.detail.value!)
                  }
                />
              </IonItem>
              {error && (
                <IonText color="danger" style={{ marginTop: "10px" }}>
                  {error}
                </IonText>
              )}

              <IonButton
                expand="block"
                className="green-button-gradient"
                type="submit"
                style={{
                  marginTop: "40px",
                  backgroundColor: "green",
                  color: "white",
                  width: "50vw",
                }}
                disabled={!validateEmail(email) || error !== ""}
              >
                Sign Up!
              </IonButton>
              <div style={{ margin: "20px", textAlign: "center" }}>
                <span>Already a member? </span>
                <a
                  href="/login"
                  style={{ color: "gray", textDecoration: "none" }}
                >
                  Login here!
                </a>
              </div>
            </form>
          </div>
        </div>

        {/* Toast */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastmessage}
          duration={3000}
          position="top"
          style={{ marginTop: "20px" }}
        />
    </IonPage>
  );
};

export default Signup;
