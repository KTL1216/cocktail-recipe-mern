import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { userRouter } from "./controller/users-routes.js";
import { recipesRouter } from "./controller/recipes-routes.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);

mongoose.connect(
  "mongodb+srv://ktl1216:KenTL_327!@recipes.2axupj3.mongodb.net/recipes?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.listen(3001, () => console.log("Server has started running"));