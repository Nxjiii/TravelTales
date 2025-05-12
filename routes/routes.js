import express from "express";
import { login, logout } from "../controllers/authController.js";
import { getUserProfile } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.get("/profile", authMiddleware, getUserProfile);

router.get("/", (req, res) => {
  res.render("homepage", { title: "Home" });
});

export default router;
