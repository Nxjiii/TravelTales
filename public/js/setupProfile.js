import { authHeaders } from "./authMiddleware.js";

const API_BASE_URL = "http://127.0.0.1:5000/api";

document.addEventListener("DOMContentLoaded", () => {
  const profileForm = document.getElementById("setupForm");

  if (!profileForm) {
    console.warn("Profile form not found in the DOM.");
    return;
  }

  profileForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const fullName = document.getElementById("fullName").value.trim();

    if (!username || !fullName) {
      alert("Both username and full name are required.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ username, full_name: fullName }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        alert("Profile created successfully!");
        window.location.href = "/";
      } else {
        alert(data.error || "Failed to create profile.");
      }
    } catch (err) {
      console.error("Error creating profile:", err);
      alert("Network error. Please try again later.");
    }
  });
});
