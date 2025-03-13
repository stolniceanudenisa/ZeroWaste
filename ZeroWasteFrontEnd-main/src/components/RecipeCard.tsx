import React, { useEffect, useState } from "react";
import { IonIcon } from "@ionic/react";
import {
  timerOutline,
  flameOutline,
  heartDislikeOutline,
  heartOutline,
  heartDislike,
  heart,
} from "ionicons/icons";
import "../theme/RecipesCard.css";
import { useRecipes } from "../services/RecipesProvider";
import { Browser } from "@capacitor/browser";

export interface RecipeProps {
  id: number;
  name: string;
  difficulty_level: number;
  time: number;
  image: string;
  rating: boolean | null;
  link: string;
}

const RecipeCard: React.FC<RecipeProps> = ({
  id,
  name,
  difficulty_level,
  time,
  image,
  rating,
  link,
}) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const hours = Math.floor(time / 60); 
  const minutes = time % 60; 
  const { rateRecipe } = useRecipes();
  const openLink = async () => {
    await Browser.open({ url: link });
  };

  const timeString = `${hours > 0 ? `${hours}h` : ""}${hours > 0 && minutes > 0 ? " " : ""}${minutes > 0 ? `${minutes} min` : ""}`;

useEffect(() => {
  setLiked(rating === true);
  setDisliked(rating === false);
}, [rating]);


  const handleLikeClick = () => {
    setLiked(!liked);
    if (disliked) {
      setDisliked(false);
    }
    rateRecipe(id, !liked ? !liked : null);
  };

  const handleDislikeClick = () => {
    setDisliked(!disliked);
    if (liked) {
      setLiked(false);
    }
    rateRecipe(id, !disliked ? disliked : null);
  };

  const getDifficultyLabel = (level: number) => {
    switch (level) {
      case 1:
        return "Easy";
      case 2:
        return "Medium";
      case 3:
        return "Hard";
      default:
        return "Unknown";
    }
  };

  return (
   
    <div className="recipe-card">
      <div onClick={() => openLink()}>
      <img src={image} alt={name} className="recipe-photo" />
      </div>
      <div className="recipe-content">
        <div className="recipe-header">
          <div onClick={() => openLink()}>
            <span className="recipe-title">{name}</span>
          </div>
          <div className="recipe-actions">
            <IonIcon
              className="like-dislike-button"
              icon={liked ? heart : heartOutline}
              size="large"
              color="success"
              onClick={handleLikeClick}
            />
            <IonIcon
              className="like-dislike-button"
              icon={disliked ? heartDislike : heartDislikeOutline}
              size="large"
              color="danger"
              onClick={handleDislikeClick}
            />
          </div>
        </div>

        <div className="recipe-attributes">
          <IonIcon icon={timerOutline} className="recipe-icon" />
          {timeString}
          <IonIcon icon={flameOutline} className="recipe-icon" />
          {getDifficultyLabel(difficulty_level)}
        </div>
      </div>
      </div>
  );
};

export default RecipeCard;
