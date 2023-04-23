import React, { useEffect, useState } from "react";
import { useGetUserID } from "../elements/useGetUserId";
import axios from "axios";

export const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [keyWord, setKeyWord] = useState("");

  const userID = useGetUserID();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:3001/recipes");
        if ("keyWord" === "") {
          setRecipes(response.data);
        } else {
          setRecipes(response.data.filter(recipe => recipe.name.toLowerCase().includes(keyWord)))
        }
      } catch (err) {
        console.log(err);
      }
    };

    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/profile/ids/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRecipes();
    fetchSavedRecipes();
  }, [recipes, userID, keyWord]);

  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put("http://localhost:3001/recipes", {
        recipeID,
        userID,
      });
      setSavedRecipes(response.data.savedRecipes);
    } catch (err) {
      console.log(err);
    }
  };

  const isRecipeSaved = (id) => savedRecipes.includes(id);

  return (
    <div>
      <h1>Recipes</h1>
      <input id="search-bar" className="search-bar" type="text" placeholder="Input Search Keywords..." 
        onChange={(e) => setKeyWord(e.target.value.toLowerCase())}/>
      <ul className="recipe-bullets">
        {recipes.map((recipe) => (
          <li className="recipe-single-bullet" key={recipe._id}>
            <div>
              <h2>{recipe.name}</h2>
              <button className="save-button" onClick={() => saveRecipe(recipe._id)} disabled={isRecipeSaved(recipe._id)}>
                {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
              </button>
            </div>
            <div className="ingredients-list">
              <ul className="ingredients-bullets">
                {recipe.ingredients.map((ingredient ,index) => (
                  <li className="ingredient-single-bullet" key={index}>{ingredient}</li>
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
