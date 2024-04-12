import { RecipeModel } from "../models/recipes.js";
import express from "express";
import mongoose from "mongoose";
import { UserModel } from "../models/User.js";

const router = express.Router();

router.get("/", async(req , res)=>{
try{
const response = await RecipeModel.find({});
res.json(response);
}catch(err){
res.json(err);
}
});
router.post("/", async(req , res)=>{
      const recipe = new RecipeModel(req.body);
      try{
      const response = await recipe.save();
      res.json(response);
      }catch(err){
      res.json(err);
      }
      });
router.get("/:recipeId", async (req, res) => {
      try {
      const result = await RecipeModel.findById(req.params.recipeId);
      res.status(200).json(result);
      } catch (err) {
      res.status(500).json(err);}
});
router.put("/", async(req , res)=>{
      try{
      const recipe = await RecipeModel.findById(req.body.recipeID);
      const user = await UserModel.findById(req.body.userID);
      user.savedRecipes.push(recipe);
      await user.save();
      res.json({savedRecipes: user.savedRecipes});
      }catch(err){
      res.json(err);
      }
      });
router.get("/savedRecipes/ids/:userId", async (req, res) => {
      try {
      const user = await UserModel.findById(req.params.userId);
      res.status(201).json({ savedRecipes: user?.savedRecipes });
      } catch (err) {
      console.log(err);
      res.status(500).json(err);}
});
router.get("/savedRecipes/:userId", async (req, res) => {
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
    // In your server's route handling
router.delete("/savedRecipes/:userId/:recipeId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    // Remove the recipe ID from the user's savedRecipes array
    user.savedRecipes = user.savedRecipes.filter(id => id.toString() !== req.params.recipeId);
    await user.save();
    res.status(204).send(); // Successfully deleted
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export { router as recipesRouter };