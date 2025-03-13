import React, { useState, useEffect } from "react";
import { IonHeader, IonPage, IonContent, IonButton, IonIcon, IonLoading } from "@ionic/react";
import Menu from "../components/Menu";
import AddItem from "../components/AddItem";
import ItemCard from "../components/ItemCard";
import { useTheme } from "../components/ThemeContext";
import { peopleOutline, receiptOutline, closeOutline } from "ionicons/icons";
import CollaboratorsModal from "../components/CollaboratorsModal";
import UploadReceiptModal from "../components/UploadReceiptModal";
import { search } from "ionicons/icons";
import {  IonCol, IonInput } from "@ionic/react";
import { Product } from "../entities/Product";
import { useProductList } from "../services/ProductListProvider";

const Home: React.FC = () => {
  const { darkMode } = useTheme();
  const { filteredProducts, searchProduct, loading } = useProductList();
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [nothingFound, setNothingFound] = useState<boolean>(false);

  const handleCancelEdit = () => {
    setSelectedItem(null);
  };

  const handleSearch = () => {
    setIsSearchActive(searchText.trim() !== "");
    searchProduct(searchText); 
  };

  // monitorizam filteredProducts pentru a seta nothingFound daca e cazul
  useEffect(() => {
    if (isSearchActive) {
      setNothingFound(filteredProducts.length === 0);
    }
  }, [filteredProducts, isSearchActive]);

  const handleCloseSearch = () => {
    setIsSearchActive(false);
    setSearchText("");
    searchProduct("");
  };

  useEffect(() => {
    if (searchText.trim() === "") {
      searchProduct(""); // incarcam lista completa
      setNothingFound(false);
    }
  }, [searchText, searchProduct]);

  const [showUploadModal, setshowUploadModal] = useState(false);
  const [showCollaboratorsModal, setshowCollaboratorsModal] = useState(false);

  const handleEditItem = (
    id: number,
    name: string,
    best_before: string,
    opened: string,
    consumption_days: string
  ) => {
    setSelectedItem({ id, name, best_before, opened, consumption_days });
  };

  // sortare produse dupa data de expirare
  const sortProductsByDate = (products: Product[]) => {
    return products.sort((a, b) => {
      if (!a.best_before && !b.best_before) {
        return 0; // Ambele sunt null
      }
      if (!a.best_before) {
        return 1; // a este null, deci merge la final
      }
      if (!b.best_before) {
        return -1; // b este null, deci merge la final
      }
      // ambele au date, comparam normal
      const dateA = new Date(a.best_before);
      const dateB = new Date(b.best_before);
      return dateA.getTime() - dateB.getTime();
    });
  };

  const sortedProducts = sortProductsByDate(filteredProducts);

  return (
    <IonPage>
      <IonHeader
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
          borderBottom: "1px solid #e5e5e5",
          fontSize: "8vw",
        }}
      >
        <div onClick={() => setshowUploadModal(true)}>
          <IonIcon icon={receiptOutline} style={{ marginRight: "3vw" }} />
        </div>
        <div
          style={{
            background: "linear-gradient(135deg, #1b8911 0%, #5cb947 100%)",
            color: "transparent",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            fontWeight: "bold",
          }}
        >
          ZeroWaste
        </div>
        <div onClick={() => setshowCollaboratorsModal(true)}>
          <IonIcon icon={peopleOutline} />
        </div>
      </IonHeader>

      <UploadReceiptModal
        showUploadModal={showUploadModal}
        setShowUploadModal={setshowUploadModal}
      />
      <CollaboratorsModal
        showCollaboratorsModal={showCollaboratorsModal}
        setShowCollaboratorsModal={setshowCollaboratorsModal}
      />

      <IonContent>
        <div className={darkMode ? "dark-mode" : ""}>
          <IonCol size="12" sizeMd="12" className="align-items-center">
            <div className="search-container">
              <IonInput
                placeholder="Search a product"
                value={searchText}
                onIonInput={(e) => setSearchText(e.detail.value!)}
              />
              <IonButton
                className="green-button-gradient"
                onClick={handleSearch}
              >
                <IonIcon icon={search} />
              </IonButton>
              {isSearchActive && (
                <IonButton
                  className="green-button-gradient"
                  onClick={handleCloseSearch}
                  style={{ marginLeft: "5px" }}
                >
                  <IonIcon icon={closeOutline} />
                </IonButton>
              )}
            </div>
          </IonCol>

          {nothingFound && (
            <div
              style={{
                textAlign: "center",
                fontFamily: "Amaranth",
                fontWeight: "700",
                fontSize: "1.5rem",
                marginTop: "20px",
              }}
            >
              No Recipe Found
            </div>
          )}

          {!nothingFound &&
            filteredProducts.map((product: any) => (
              <ItemCard
                key={product.id}
                id={product.id}
                name={product.name}
                best_before={product.best_before}
                opened={product.opened}
                consumption_days={product.consumption_days}
                onEdit={handleEditItem}
              />
            ))}
        </div>
      </IonContent>

      <div slot="bottom">
        <AddItem
          selectedItem={selectedItem}
          onCancelEdit={handleCancelEdit}
          setSelectedItem={setSelectedItem}
        />
        <Menu />
      </div>
      
      {/* Loading spinner */}
      <IonLoading
        isOpen={loading}
        message="Please wait..."
        cssClass={darkMode ? "dark-mode" : ""}
      />
    </IonPage>
  );
};

export default Home;
