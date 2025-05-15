// public/js/profile.js
import { authHeaders } from "./authMiddleware.js";

const API_BASE_URL = "http://127.0.0.1:5000/api";

document.addEventListener("DOMContentLoaded", () => {
  const usernameSpan = document.getElementById("profileUsername");
  const fullNameSpan = document.getElementById("profileFullName");

  async function loadProfile() {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        // Inject profile info into the page
        document.getElementById("username").textContent = data.username;
        document.getElementById("profileUsername").textContent = data.username;
        document.getElementById("profileFullName").textContent = data.full_name;
      } else {
        alert(data.error || "Failed to load profile.");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      alert("Network error. Please try again later.");
    }
  }

  // Call the function to load the profile data when the page loads
  loadProfile();
});
