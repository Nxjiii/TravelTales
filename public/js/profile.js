// public/js/profile.js
import { authHeaders } from "./authMiddleware.js";
import { protectPage } from "./authMiddleware.js";

const API_BASE_URL = "http://127.0.0.1:5000/api";

// Check auth first, before setting up any listeners or fetching
if (!protectPage()) {
  // Redirect is already handled inside protectPage
  // No further code should run
  throw new Error("Access denied. Redirecting...");
}

document.addEventListener("DOMContentLoaded", () => {
  const usernameInput = document.getElementById("username");
  const fullNameInput = document.getElementById("fullName");

  // fetch profile
  async function loadProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "GET",
        headers: authHeaders(),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        usernameInput.value = data.username;
        fullNameInput.value = data.full_name;
      } else {
        alert(data.error || "Failed to load profile.");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      alert("Network error. Please try again later.");
    }
  }

  loadProfile();
});
