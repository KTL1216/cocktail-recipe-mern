import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();
import { UserModel } from "../data/users.js";

router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
    }
    const newPasswordHashed = await bcrypt.hash(password, 10);
    const saveUsername = new UserModel({ username, password: newPasswordHashed });
    await saveUsername.save();
    res.json({ message: "User registered successfully" });
        //res.json(existingUser);
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const existingUser = await UserModel.findOne({ username });

    if (!existingUser) {
        return res
        .status(400)
        .json({ message: "No such user!" });
    }
    const passwordMatched = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatched) {
        return res
        .status(400)
        .json({ message: "Incorrect password!" });
    }
    const token = jwt.sign({ id: existingUser._id }, "secret");
    res.json({ token, userID: existingUser._id });
});


export const verifyToken = (req, res, next) => {
    const header = req.headers.authorization;
    if (header) {
      jwt.verify(header, "secret", (err) => {
        if (err) {
          return res.sendStatus(403);
        }
        next();
      });
    } else {
      res.sendStatus(401);
    }
};

export { router as userRouter };