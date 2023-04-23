import React, { useEffect, useState } from "react";
import { useGetUserID } from "../elements/useGetUserId";
import axios from "axios";

export const Profile = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const userID = useGetUserID();

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/profile/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSavedRecipes();
  }, []);
  return (
    <div>
      <h1>Saved Recipes</h1>
      <ul className="recipe-bullets">
        {savedRecipes.map((recipe) => (
          <li className="recipe-single-bullet" key={recipe._id}>
            <div>
              <h2>{recipe.name}</h2>
            </div>
            <div className="ingredients-list">
              <ul className="ingredients-bullets">
                {recipe.ingredients.map((ingredient) => (
                  <li className="ingredient-single-bullet">{ingredient}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="instructions">{recipe.instructions}</p>
            </div>
            <img src={recipe.imageUrl} alt={recipe.name} />
          </li>
        ))}
      </ul>
    </div>
  );
};