import { clearToken } from "./authMiddleware.js";
import { getFollowers, getFollowing } from "./follow.js";
const API_BASE_URL = "http://127.0.0.1:5000/api";

document.addEventListener("DOMContentLoaded", () => {
  const usernameSpan = document.getElementById("profileUsername");
  const fullNameSpan = document.getElementById("profileFullName");
  const editBtn = document.getElementById("editProfileBtn");
  const editForm = document.getElementById("editProfileForm");
  const editUsername = document.getElementById("editUsername");
  const editFullName = document.getElementById("editFullName");
  const cancelEditBtn = document.getElementById("cancelEditBtn");
  const editMsg = document.getElementById("editProfileMsg");
  const deleteBtn = document.getElementById("deleteAccountBtn");
  const deleteMsg = document.getElementById("deleteAccountMsg");

  async function loadProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        document.getElementById("username").textContent = data.username;
        usernameSpan.textContent = data.username;
        fullNameSpan.textContent = data.full_name;
        editUsername.value = data.username;
        editFullName.value = data.full_name;
        localStorage.setItem("username", data.username);

        // Load followers/following after username is set
        loadFollowersAndFollowing(data.username);
      } else {
        alert(data.error || "Failed to load profile.");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      alert("Network error. Please try again later.");
    }
  }

  // Delete account
  if (deleteBtn) {
    deleteBtn.addEventListener("click", async () => {
      deleteMsg.textContent = "";
      if (
        !confirm(
          "Are you sure you want to delete your account? This cannot be undone."
        )
      ) {
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/delete`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          deleteMsg.style.color = "var(--secondary-color)";
          deleteMsg.textContent = "Account deleted. Redirecting...";
          clearToken();
          setTimeout(() => {
            window.location.href = "/";
          }, 1500);
        } else {
          deleteMsg.style.color = "var(--accent-color)";
          deleteMsg.textContent = data.error || "Failed to delete account.";
        }
      } catch (err) {
        deleteMsg.style.color = "var(--accent-color)";
        deleteMsg.textContent = "Network error. Please try again.";
      }
    });
  }

  // Edit form
  editBtn.addEventListener("click", () => {
    editForm.classList.remove("hidden");
    editBtn.classList.add("hidden");
    editMsg.textContent = "";
    editUsername.value = usernameSpan.textContent;
    editFullName.value = fullNameSpan.textContent;
  });

  // Cancel edit
  cancelEditBtn.addEventListener("click", () => {
    editForm.classList.add("hidden");
    editBtn.classList.remove("hidden");
    editMsg.textContent = "";
  });

  // Handle form submit
  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    editMsg.textContent = "";

    const username = editUsername.value.trim();
    const fullName = editFullName.value.trim();

    if (!username || !fullName) {
      editMsg.textContent = "Both fields are required.";
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, full_name: fullName }),
      });

      const data = await response.json();

      if (response.ok) {
        editMsg.style.color = "var(--secondary-color)";
        editMsg.textContent = "Profile updated!";
        // Update display
        usernameSpan.textContent = username;
        fullNameSpan.textContent = fullName;
        document.getElementById("username").textContent = username;
        setTimeout(() => {
          editForm.classList.add("hidden");
          editBtn.classList.remove("hidden");
          editMsg.textContent = "";
        }, 1200);

        // Reload followers/following if username changed
        loadFollowersAndFollowing(username);
      } else {
        editMsg.style.color = "var(--accent-color)";
        editMsg.textContent = data.error || "Failed to update profile.";
      }
    } catch (err) {
      editMsg.style.color = "var(--accent-color)";
      editMsg.textContent = "Network error. Please try again.";
    }
  });

  // Initial load
  loadProfile();
});

// Load followers and following lists
async function loadFollowersAndFollowing(username) {
  const followersCount = document.getElementById("followersCount");
  const followingCount = document.getElementById("followingCount");

  try {
    const [followers, following] = await Promise.all([
      getFollowers(username),
      getFollowing(username),
    ]);

    if (followersCount) followersCount.textContent = followers.length;
    if (followingCount) followingCount.textContent = following.length;
  } catch (err) {
    if (followersCount) followersCount.textContent = "0";
    if (followingCount) followingCount.textContent = "0";
  }
}
