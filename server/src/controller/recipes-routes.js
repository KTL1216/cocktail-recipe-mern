import express from "express";
import mongoose from "mongoose";
import { RecipeModel } from "../data/recipes.js";
import { UserModel } from "../data/users.js";
import { verifyToken } from "./users-routes.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const recipeFound = await RecipeModel.find({});
    res.status(200).json(recipeFound);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", verifyToken, async (req, res) => {
  const recipe = new RecipeModel({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    image: req.body.image,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    imageUrl: req.body.imageUrl,
    userOwner: req.body.userOwner,
  });
  console.log(recipe);

  try {
    const recipeFound = await recipe.save();
    res.status(201).json({
      createdRecipe: {
        name: recipeFound.name,
        image: recipeFound.image,
        ingredients: recipeFound.ingredients,
        instructions: recipeFound.instructions,
        _id: recipeFound._id,
      },
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:recipeId", async (req, res) => {
  try {
    const recipeFound = await RecipeModel.findById(req.params.recipeId);
    res.status(200).json(recipeFound);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/", async (req, res) => {
  const recipe = await RecipeModel.findById(req.body.recipeID);
  const user = await UserModel.findById(req.body.userID);
  try {
    user.savedRecipes.push(recipe);
    await user.save();
    res.status(201).json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/profile/ids/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    res.status(201).json({ savedRecipes: user?.savedRecipes });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/profile/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    const savedRecipes = await RecipeModel.find({
      _id: { $in: user.savedRecipes },
    });

    console.log(savedRecipes);
    res.status(201).json({ savedRecipes });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export { router as recipesRouter };