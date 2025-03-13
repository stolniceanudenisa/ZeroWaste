import React, { useEffect, useState } from "react";
import {IonPage, IonHeader,IonContent,IonButton,IonSelect,IonSelectOption,IonIcon,IonInput, IonCol, IonInfiniteScroll, IonInfiniteScrollContent, IonLoading} from "@ionic/react";
import Menu from "../components/Menu";
import RecipeCard from "../components/RecipeCard";
import { search, optionsOutline, flameOutline, restaurantOutline, timerOutline, heartOutline, closeOutline, sync } from "ionicons/icons";
import { useTheme } from "../components/ThemeContext";
import { useRecipes } from "../services/RecipesProvider";
import { Recipe } from "../entities/Recipe";

const Recipes: React.FC = () => {
  const [isFilterPanelVisible, setFilterPanelVisible] = useState(false);
  const { darkMode } = useTheme();
  const { recipes, loadMoreRecipes, hasMore,
    resetRecipes, loadMoreFilteredRecipes, loadMoreSearchRecipes,
    refreshRecipes, isLoading } = useRecipes();
  const [filtered, setFiltered] = useState<boolean>(false);
  const [time, setTime] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<number[] | null>(null);
  const [recipeType, setRecipeType] = useState<string | null>(null);
  const [favourites, setFavourites] = useState<boolean | null>(null);
  const [nothingFound, setNothingFound] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [isRefreshActive, setIsRefreshActive] = useState<boolean>(false);

  const handleInfiniteScroll = async (event: CustomEvent<void>) => {
    setIsRefreshActive(false);
    if (hasMore) {
      if (filtered) {
        await loadMoreFilteredRecipes(time, difficulty, recipeType, favourites, false );
      }
      else if (isSearchActive) {
        await loadMoreSearchRecipes(searchText, false);
      }
      else {
        await loadMoreRecipes();
      }
    }
    (event.target as HTMLIonInfiniteScrollElement).complete();
  };

const handleFilter = async () => {
    try {
      setFilterPanelVisible(false);
      setIsRefreshActive(false);
      setNothingFound(false);
      if ((time === null || time === 0) &&(difficulty?.length === 0 || null) && recipeType === null && favourites === null) {
        setFiltered(false);
        resetRecipes();
      } else {
        setFiltered(true);

        try {
          await loadMoreFilteredRecipes(time, difficulty, recipeType, favourites, true);
        } catch (error: any) {
          setNothingFound(true);
          resetRecipes();
          setFiltered(false);
        }
      }
    } catch (error: any) {
      console.log("Unexpected error", error.detail);
    }
  };

  const handleSearch = async () => {
    setIsSearchActive(true);
    setIsRefreshActive(false);
    setNothingFound(false);
    setFilterPanelVisible(false);
    if (searchText.trim() === "") {
      resetRecipes();
    } else {
      try {
        await loadMoreSearchRecipes(searchText, true);
      } catch (error: any) {
        setNothingFound(true);
        resetRecipes();
      }
    }
  };

  const handleCloseSearch = () => {
    setIsSearchActive(false);
    setSearchText("");
    setNothingFound(false);
    resetRecipes();
    setTime(null);
    setDifficulty(null);
    setRecipeType(null);
    setFavourites(null);
    setFiltered(false);
  };

  const handleFilterContainer = () => {
    setIsSearchActive(false);
    setFilterPanelVisible(!isFilterPanelVisible);
  };

  const handleRefresh = () => {
    refreshRecipes().then(() => {
      setNothingFound(false);
      setTime(null);
      setDifficulty(null);
      setRecipeType(null);
      setFavourites(null);
      setFiltered(false);
      setIsRefreshActive(true);
    });
  };


  useEffect(() => {
    return () =>{
    resetRecipes();}
  }, []);

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
        <div
          style={{
            background: "linear-gradient(135deg, #1b8911 0%, #5cb947 100%)",
            color: "transparent",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            fontWeight: "bold",
            textAlign: "center",
            width: "100%",
          }}
        >
          ZeroWaste Recipes
        </div>
      </IonHeader>

      <IonContent>
        <div className={darkMode ? "dark-mode" : ""}>
          <IonCol size="12" sizeMd="12" className="align-items-center">
            <>
              {!isSearchActive && !isFilterPanelVisible && (
                <span
                  className="search-container"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <IonButton
                    onClick={() => setIsSearchActive(true)}
                    className="green-button-gradient"
                    style={{ width: "30%" }}
                  >
                    <IonIcon icon={search} />
                  </IonButton>
                  <IonButton
                    onClick={handleFilterContainer}
                    className="green-button-gradient"
                    style={{ width: "30%" }}
                  >
                    <IonIcon icon={optionsOutline} />
                  </IonButton>
                  <IonButton
                    onClick={handleRefresh}
                    className="green-button-gradient"
                    style={{ width: "30%" }}
                  >
                    <IonIcon icon={sync} />
                  </IonButton>
                </span>
              )}
              {isSearchActive && (
                <div className="search-container">
                  <IonInput
                    placeholder="Search a recipe"
                    value={searchText}
                    onIonInput={(e) => setSearchText(e.detail.value!)}
                  />
                  <IonButton
                    className="green-button-gradient"
                    onClick={handleSearch}
                  >
                    <IonIcon icon={search} />
                  </IonButton>
                  <IonButton
                    color="danger"
                    onClick={handleCloseSearch}
                    style={{ marginLeft: "5px" }}
                  >
                    <IonIcon icon={closeOutline} />
                  </IonButton>
                </div>
              )}
            </>

            {isFilterPanelVisible && (
              <div id="filter-panel">
                <IonCol size="12" sizeMd="12">
                  <div className="filter-container">
                    {/* dificultate */}
                    <div className="filter-field">
                      <IonIcon icon={flameOutline} size="large" />
                      <IonSelect
                        interface="popover"
                        multiple={false}
                        style={{ padding: 0 }}
                        value={difficulty}
                        placeholder="Difficulty"
                        className="transparent-select"
                        onIonChange={(e) => setDifficulty([e.detail.value])}
                      >
                        <IonSelectOption className="label-dark-mode" value={1}>
                          Easy
                        </IonSelectOption>
                        <IonSelectOption className="label-dark-mode" value={2}>
                          Medium
                        </IonSelectOption>
                        <IonSelectOption className="label-dark-mode" value={3}>
                          Hard
                        </IonSelectOption>
                        <IonSelectOption className="label-dark-mode" value={null}>
                          All difficulties
                        </IonSelectOption>
                      </IonSelect>
                    </div>

                    {/* tip */}
                    <div className="filter-field">
                      <IonIcon icon={restaurantOutline} size="large" />
                      <IonSelect
                        interface="popover"
                        multiple={false}
                        style={{ padding: 0 }}
                        value={recipeType}
                        placeholder="Type"
                        className="transparent-select"
                        onIonChange={(e) => setRecipeType(e.detail.value)}
                      >
                        <IonSelectOption
                          className="label-dark-mode"
                          value="Breakfast"
                        >
                          Breakfast
                        </IonSelectOption>
                        <IonSelectOption
                          className="label-dark-mode"
                          value="Starters"
                        >
                          Starters
                        </IonSelectOption>
                        <IonSelectOption
                          className="label-dark-mode"
                          value="Mains"
                        >
                          Mains
                        </IonSelectOption>
                        <IonSelectOption
                          className="label-dark-mode"
                          value="Sides"
                        >
                          Sides
                        </IonSelectOption>
                        <IonSelectOption
                          className="label-dark-mode"
                          value="Desserts"
                        >
                          Desserts
                        </IonSelectOption>
                        <IonSelectOption
                          className="label-dark-mode"
                          value="Snacks"
                        >
                          Snacks
                        </IonSelectOption>
                        <IonSelectOption
                          className="label-dark-mode"
                          value="Drinks"
                        >
                          Drinks
                        </IonSelectOption>
                        <IonSelectOption
                          className="label-dark-mode"
                          value={null}
                        >
                          All types
                        </IonSelectOption>
                      </IonSelect>
                    </div>
                  </div>
                </IonCol>

                <IonCol size="12" sizeMd="12">
                  <div className="filter-container">
                    {/* timp */}
                    <div className="filter-field">
                      <IonIcon icon={timerOutline} size="large" />
                      <IonSelect
                        interface="popover"
                        multiple={false}
                        placeholder="Total time"
                        value={time}
                        style={{ padding: 0 }}
                        className="transparent-select"
                        onIonChange={(e) => setTime(e.detail.value)}
                      >
                        <IonSelectOption className="label-dark-mode" value={30}>
                          &lt; 30 min
                        </IonSelectOption>
                        <IonSelectOption className="label-dark-mode" value={60}>
                          &lt; 1h
                        </IonSelectOption>
                        <IonSelectOption
                          className="label-dark-mode"
                          value={120}
                        >
                          &lt; 2h
                        </IonSelectOption>
                        <IonSelectOption
                          className="label-dark-mode"
                          value={180}
                        >
                          &lt; 3h
                        </IonSelectOption>
                        <IonSelectOption
                          className="label-dark-mode"
                          value={null}
                        >
                          All recipes
                        </IonSelectOption>
                      </IonSelect>
                    </div>

                    {/* like/dislike */}
                    <div className="filter-field">
                      <IonIcon icon={heartOutline} size="large" />
                      <IonSelect
                        interface="popover"
                        multiple={false}
                        placeholder="Favourites"
                        value={favourites}
                        style={{ padding: 0 }}
                        className="transparent-select"
                        onIonChange={(e) => setFavourites(e.detail.value)}
                      >
                        <IonSelectOption
                          className="label-dark-mode"
                          value={true}
                        >
                          Liked
                        </IonSelectOption>
                        <IonSelectOption
                          className="label-dark-mode"
                          value={false}
                        >
                          Disliked
                        </IonSelectOption>
                        <IonSelectOption
                          className="label-dark-mode"
                          value={null}
                        >
                          All recipes
                        </IonSelectOption>
                      </IonSelect>
                    </div>
                  </div>
                </IonCol>

                <IonCol size="12" sizeMd="12">
                  <IonButton
                    className="filter-container green-button-gradient"
                    style={{ justifyContent: "center", fontSize: "0.75rem" }}
                    onClick={handleFilter}
                  >
                    Apply filters
                  </IonButton>
                </IonCol>
              </div>
            )}
          </IonCol>

          {/* afisam retetele */}
          <div>
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
              recipes.map((recipe: Recipe) => (
                <RecipeCard
                  key={recipe.id}
                  id={recipe.id}
                  name={recipe.name}
                  difficulty_level={recipe.difficulty}
                  time={recipe.time}
                  image={recipe.image}
                  rating={recipe.rating}
                  link={recipe.link}
                />
              ))}
          </div>

          <IonInfiniteScroll
            threshold="100px"
            disabled={!hasMore}
            onIonInfinite={handleInfiniteScroll}
          >
            <IonInfiniteScrollContent
              loadingText="Loading more recipes..."
              loadingSpinner="bubbles"
            ></IonInfiniteScrollContent>
          </IonInfiniteScroll>
        </div>
      </IonContent>
      {isRefreshActive && <IonLoading
        isOpen={isLoading}
        message="Please wait..."
        cssClass={darkMode ? "dark-mode" : ""}
      />}

      <div slot="bottom">
        <Menu />
      </div>
    </IonPage>
  );
};

export default Recipes;
