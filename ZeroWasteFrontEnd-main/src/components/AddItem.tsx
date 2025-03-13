// AddItem.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  IonInput,
  IonButton,
  IonLabel,
  IonItem,
  IonList,
  IonText,
} from "@ionic/react";
import "../theme/addItem.css";
import { useTheme } from "./ThemeContext";
import { useProductList } from "../services/ProductListProvider";

interface AddItemProps {
  selectedItem: {
    id: number;
    name: string;
    best_before: string;
    opened: string;
    consumption_days: string;
  } | null; 
  onCancelEdit: () => void;
  setSelectedItem: (item: any) => void;
}

const AddItem: React.FC<AddItemProps> = ({ selectedItem, onCancelEdit, setSelectedItem }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [productName, setProductName] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [openingDate, setOpeningDate] = useState("");
  const [recommendedDays, setRecommendedDays] = useState("");
  const [error, setError] = useState("");
  const { darkMode } = useTheme();
  const { addProduct, updateProduct } = useProductList();

  const addItemRef = useRef<HTMLDivElement>(null);

  const convertDateFormat = (date: string) => {
    const parts = date.split(".");
    return `${parts[2]}-${parts[1]}-${parts[0]}`; // "YYYY-MM-DD"
  };

  useEffect(() => {
    if (selectedItem) {
      setProductName(selectedItem.name);
      setExpirationDate(selectedItem.best_before?  convertDateFormat(selectedItem.best_before) : "");
      setOpeningDate(selectedItem.opened ? convertDateFormat(selectedItem.opened) : "");
      setRecommendedDays(selectedItem.consumption_days);
      setIsExpanded(true);
    } else {
      resetForm();
    }
  }, [selectedItem]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        addItemRef.current &&
        !addItemRef.current.contains(event.target as Node)
      ) {
        resetForm();
        onCancelEdit(); 
      }
    };


    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const resetForm = () => {
    setProductName("");
    setExpirationDate("");
    setOpeningDate("");
    setRecommendedDays("");
    setError("");
    setIsExpanded(false);
  };

  const handleSave = () => {
    if (!productName) {
      setError("Product name is required.");
      return; 
    }


    if (selectedItem){
      updateProduct(
        selectedItem.id,
        productName,
        expirationDate,
        openingDate,
        recommendedDays
      );
      setSelectedItem(null);
    }
    else{
      addProduct(productName, expirationDate, openingDate, recommendedDays);
  }
    resetForm();
  };

  return (
    <div
      ref={addItemRef}
      style={{ padding: "16px" }}
      className={darkMode ? "dark-mode" : ""}
    >
      <IonItem>
        <IonInput
          placeholder="Add a product"
          onFocus={() => setIsExpanded(true)}
          value={productName}
          onIonInput={(e) => setProductName(e.detail.value!)}
          style={{ flex: 1 }}
        />
        <IonButton
          className="green-button-gradient"
          onClick={() => setIsExpanded(true)}
        >
          +
        </IonButton>
      </IonItem>

      {isExpanded && (
        <IonList style={{ marginTop: "10px" }}>
          <IonItem>
            <IonLabel position="stacked" className="label-dark-mode">
              Expiration Date
            </IonLabel>
            <IonInput
              type="date"
              value={expirationDate}
              onIonInput={(e) => setExpirationDate(e.detail.value!)}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked" className="label-dark-mode">
              Opening Date
            </IonLabel>
            <IonInput
              className="label-dark-mode"
              type="date"
              value={openingDate}
              onIonInput={(e) => setOpeningDate(e.detail.value!)}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked" className="label-dark-mode">
              Days to Consume
            </IonLabel>
            <IonInput
              type="number"
              value={recommendedDays}
              onIonInput={(e) => setRecommendedDays(e.detail.value!)}
            />
          </IonItem>

          {error && (
            <IonText color="danger" style={{ marginTop: "10px" }}>
              {error}
            </IonText>
          )}
          <IonButton
            expand="full"
            className="green-button-gradient"
            onClick={handleSave}
            style={{ marginTop: "10px" }}
          >
            Save
          </IonButton>
        </IonList>
      )}
    </div>
  );
};

export default AddItem;
