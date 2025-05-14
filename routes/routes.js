import express from "express";

const router = express.Router();

// Homepage route
router.get("/", (req, res) => {
  res.render("homepage", { title: "Home" });
});

// Login page
router.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

// Register page
router.get("/register", (req, res) => {
  res.render("register", { title: "register" });
});

// Setup page
router.get("/setup", (req, res) => {
  res.render("setup", { title: "setup" });
});

// Profile page (handled by frontend calling the microservice with token from localStorage)
router.get("/profile", (req, res) => {
  res.render("profile", { title: "User Profile" });
});

// Logout redirects (frontend should remove token from localStorage)
router.post("/logout", (req, res) => {
  res.redirect("/login");
});

export default router;
