import { IonLabel, IonButton, IonSelect, IonSelectOption, IonInput, IonToggle, IonText } from "@ionic/react";
import React, { useState, useEffect } from "react";
import { useTheme } from "./ThemeContext";
import { IonPopover, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonCheckbox, IonIcon } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../services/authProvider";
import { useProductList } from "../services/ProductListProvider";

const ProfileSettings: React.FC = () => {
  const [preferredTime, setPreferredTime] = useState<string>("");
  const [notificationDays, setNotificationDays] = useState<number>(1);
  const { user, updateNotificationDay, updateAllergies, updatePreferences, share_code, updatePreferredNotificationHour } = useAuth();
  const { joinProductList } = useProductList();
  const { darkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  const [showPopoverAllergies, setShowPopoverAllergies] = useState(false);
  const [showPopoverPreferences, setShowPopoverPreferences] = useState(false);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<string[]>([]);

  useEffect(() => {

      if (user) {
        setAllergies(user.allergies || []);
        setPreferences(user.preferences || []);
        setNotificationDays(user.notification_day || 1);
        setPreferredTime(user.preferred_notification_hour || "");
      }
  
  }, [user]);

  const allergyOptions: { label: string; value: string }[] = [
    { label: "Celery", value: "Celery" },
    { label: "Cereals containing gluten", value: "Cereals" },
    { label: "Crustaceans", value: "Crustaceans" },
    { label: "Eggs", value: "Eggs" },
    { label: "Fish", value: "Fish" },
    { label: "Lupin", value: "Lupin" },
    { label: "Milk", value: "Milk" },
    { label: "Molluscs", value: "Molluscs" },
    { label: "Mustard", value: "Mustard" },
    { label: "Peanuts", value: "Peanuts" },
    { label: "Sesame", value: "Sesame" },
    { label: "Soybeans", value: "Soybeans" },
    { label: "Sulphur dioxide and sulphites", value: "Sulphur" },
  ];

  const preferenceOptions: { label: string; value: string }[] = [
    { label: "Dairy-Free", value: "Dairy-Free" },
    { label: "Gluten-Free", value: "Gluten-Free" },
    { label: "Vegan", value: "Vegan" },
    { label: "Vegetarian", value: "Vegetarian" },
  ];

  // panou alergii
  const toggleAllergy = (value: string) => {
    setAllergies((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // panou preferinte
  const togglePreference = (value: string) => {
    setPreferences((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

   const [shareCode, setShareCode] = useState<string | null>(null);
   const [showJoinInput, setShowJoinInput] = useState<boolean>(false);
   const [joinCode, setJoinCode] = useState<string>("");
   const [errorMessage, setErrorMessage] = useState<string>("");

   const history = useHistory();


    const handleShare = () => {
      const Code = share_code;

      if (Code) {
        setShareCode(Code);
        setShowJoinInput(false); // ascundem inputul de join list daca era deschis
      } else {
        console.error("share_code nu este definit");
        setErrorMessage("Nu s-a putut obține codul de partajare.");
      }

    };

    // afisam inputul pentru a introduce codul de alaturare la o lista
    const handleJoin = () => {
      setShareCode(null); // ascundem inputul de share daca era deschis
      setShowJoinInput(true);
    };

    // copiem codul listei in clipboard
    const copyToClipboard = () => {
      if (shareCode) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard
            .writeText(shareCode)
            .then(() => {
              console.log("Cod copiat în clipboard!");
              setShareCode(null); // resetare pentru a afisa butoanele
            })
            .catch((error) => {
              console.error("Eroare la copierea codului:", error);
              setErrorMessage("Nu s-a putut copia codul. Încearcă din nou.");
            });
        } else {
          // Fallback: folosim execCommand pentru copiere
          const textArea = document.createElement("textarea");
          textArea.value = shareCode;
          document.body.appendChild(textArea);
          textArea.select();
          try {
            document.execCommand("copy");
            console.log("Cod copiat în clipboard folosind fallback!");
            setShareCode(null);
          } catch (err) {
            console.error("Fallback pentru copiere a eșuat:", err);
            setErrorMessage(
              "Funcția de copiere nu este suportată pe acest dispozitiv."
            );
          }
          document.body.removeChild(textArea);
        }
      } else {
        setErrorMessage("Codul nu este disponibil pentru copiere.");
      }
    };


    const validateJoinCode = () => {
      if (joinCode.length === 6) {
        joinProductList(joinCode).then((response) => {
          console.log(response);
          history.push("/home");
        }); 
      } else {
        setErrorMessage(
          "Invalid code. Please try again."
        );
      }
    };

  return (
    <div className={darkMode ? "dark-mode" : ""}>
      <div className="grid-item items">
        {/* afisam fie cele doua butoane "Share list" si "Join list", fie inputul cu codul */}
        {shareCode === null && !showJoinInput ? (
          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <IonButton
              className="green-button-gradient"
              onClick={handleShare}
              style={{ flex: 1 }}
            >
              Share list
            </IonButton>
            <IonButton
              className="green-button-gradient"
              onClick={handleJoin}
              style={{ flex: 1 }}
            >
              Join list
            </IonButton>
          </div>
        ) : shareCode !== null ? (
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
          >
            <IonInput
              readonly
              value={shareCode}
              style={{
                textAlign: "center",
                flex: 1,
                marginRight: "10px",
              }}
            />
            <IonButton
              onClick={copyToClipboard}
              className="green-button-gradient"
            >
              COPY
            </IonButton>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "10px",
              flexDirection: "column",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <IonInput
                placeholder="Enter code"
                value={joinCode}
                onIonInput={(e) => setJoinCode(e.detail.value!)}
                style={{
                  textAlign: "center",
                  flex: 1,
                  marginRight: "10px",
                }}
              />
              <IonButton
                onClick={validateJoinCode}
                className="green-button-gradient"
              >
                JOIN
              </IonButton>
            </div>
            {errorMessage && (
              <IonText color="danger" style={{ marginTop: "10px" }}>
                {errorMessage}
              </IonText>
            )}
          </div>
        )}
      </div>

      <div className="settings">
        <div className="grid-item">
          <IonLabel>Notify me</IonLabel>
          <IonSelect
            value={notificationDays}
            onIonChange={(e) => {
              setNotificationDays(e.detail.value!); 
              updateNotificationDay(e.detail.value!);
            }}
            interface="popover"
          >
            <IonSelectOption value={1} className="label-dark-mode">
              1 day before
            </IonSelectOption>
            <IonSelectOption value={2} className="label-dark-mode">
              2 days before
            </IonSelectOption>
            <IonSelectOption value={3} className="label-dark-mode">
              3 days before
            </IonSelectOption>
          </IonSelect>
        </div>

        <div className="grid-item">
          <div>
            <IonLabel position="floating" style={{ marginBottom: "20px" }}>
              Notification Hour
            </IonLabel>
            <IonInput
              value={preferredTime}
              type="time"
              onKeyDown={(e) => e.preventDefault()}
              onIonChange={(e) => {
                setPreferredTime(e.detail.value!); 
                updatePreferredNotificationHour(e.detail.value!);
              }}
            />
          </div>
        </div>
      </div>

      <div className="settings">
        <div className="grid-item">
          <IonButton
            onClick={() => setShowPopoverAllergies(true)}
            className="green-button-gradient"
            style={{ flex: 1, margin: "0" }}
          >
            Allergies
          </IonButton>

          <IonPopover
            key={showPopoverAllergies ? "open" : "closed"}
            isOpen={showPopoverAllergies}
            onDidDismiss={() => {
              setShowPopoverAllergies(false);
              updateAllergies(allergies);
             }}
            className="custom-popover"
          >
            <IonHeader>
              <IonToolbar>
                <IonTitle className="label-dark-mode">
                  Select Allergies
                </IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <IonList>
                {allergyOptions.map((option) => (
                  <IonItem
                    key={option.value}
                    onClick={() => toggleAllergy(option.value)}
                  >
                    <IonCheckbox
                      slot="start"
                      checked={allergies.includes(option.value)}
                      onIonChange={() => toggleAllergy(option.value)}
                    />
                    <IonLabel className="label-dark-mode">
                      {option.label}
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
            </IonContent>
          </IonPopover>
        </div>

        <div className="grid-item">
          <IonButton
            onClick={() => setShowPopoverPreferences(true)}
            className="green-button-gradient"
            style={{ flex: 1, margin: "0" }}
          >
            Preferences
          </IonButton>

          <IonPopover
            key={showPopoverPreferences ? "open" : "closed"}
            isOpen={showPopoverPreferences}
            onDidDismiss={() => {
              setShowPopoverPreferences(false);
              updatePreferences(preferences);
             }}
            className="custom-popover"
          >
            <IonHeader>
              <IonToolbar>
                <IonTitle className="label-dark-mode">
                  Select Preferences
                </IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <IonList>
                {preferenceOptions.map((option) => (
                  <IonItem
                    key={option.value}
                    onClick={() => togglePreference(option.value)}
                  >
                    <IonCheckbox
                      slot="start"
                      checked={preferences.includes(option.value)}
                      onIonChange={() => togglePreference(option.value)}
                    />
                    <IonLabel className="label-dark-mode">
                      {option.label}
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
            </IonContent>
          </IonPopover>
        </div>
      </div>

      <div className="dark-mode-toggle">
        <IonLabel>Dark Mode</IonLabel>
        <IonToggle checked={darkMode} onIonChange={toggleDarkMode} />
      </div>
    </div>
  );
};

export default ProfileSettings;
