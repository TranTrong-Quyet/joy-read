import express from "express";
const router = express.Router();

import prisma from "../../lib/prisma.js";
import { loginUser } from "../controllers/Auth/AuthController.js";
import { createNewUser } from "../controllers/Auth/RegisterController.js";

router.post("/login", loginUser);
router.post("/create", createNewUser);
router.get("/profile", async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: req.user,
      },
    });
    console.log(`form profile route: User: ${user}`);

    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.json("Error: getting user profile");
  }
});

export default router;
