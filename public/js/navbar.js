import { isUserLoggedIn } from "./authMiddleware.js";

export function updateNavbar() {
  const authLink = document.getElementById("authLink");
  const authIcon = document.getElementById("authIcon");

  if (!authLink || !authIcon) {
    console.warn("Navbar elements not found in the DOM.");
    return; // Exit the function if elements are missing
  }

  if (isUserLoggedIn()) {
    authIcon.src =
      "https://img.icons8.com/?size=100&id=15263&format=png&color=000000"; // Profile icon
    authLink.href = "/profile";
  } else {
    authIcon.src =
      "https://img.icons8.com/?size=100&id=61050&format=png&color=000000"; // Login icon
    authLink.href = "/login";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateNavbar();

  // Sync across tabs
  window.addEventListener("storage", (e) => {
    if (e.key === "token") {
      updateNavbar();
    }
  });
});
