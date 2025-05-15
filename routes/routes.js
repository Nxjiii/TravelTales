import express from "express";

const router = express.Router();

function requireAuth(req, res, next) {
  if (!req.cookies.token) {
    return res.redirect("/login");
  }
  next();
}

// Homepage route
router.get("/", (req, res) => {
  res.render("homepage", { title: "Home" });
});

// Login page
router.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

router.get("/search", requireAuth, (req, res) => {
  res.render("search", { title: "search" });
});
// Register page
router.get("/register", (req, res) => {
  res.render("register", { title: "register" });
});

// Setup page
router.get("/setup", (req, res) => {
  res.render("setup", { title: "setup" });
});

router.get("/profile", requireAuth, (req, res) => {
  res.render("profile", { title: "User Profile" });
});

router.post("/logout", (req, res) => {
  res.redirect("/login");
});

export default router;
