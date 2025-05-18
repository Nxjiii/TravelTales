import { followUser, unfollowUser } from "./follow.js";

const API_BASE_URL = "http://127.0.0.1:5000/api";

// Search for users with partial username matches
export async function searchProfiles(searchQuery) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/search/profiles?q=${encodeURIComponent(searchQuery)}`,
      {
        method: "GET",
      }
    );

    const data = await response.json();

    if (response.ok) {
      return data.profiles || [];
    } else {
      console.error("Search error:", data.error);
      alert(data.error || "Failed to search for users.");
      return [];
    }
  } catch (err) {
    console.error("Search error:", err);
    alert("Something went wrong. Please try again.");
    return [];
  }
}

export async function searchProfile(username) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/profile/${encodeURIComponent(username)}`,
      {
        method: "GET",
      }
    );

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      alert(data.error || "User not found.");
      return null;
    }
  } catch (err) {
    console.error("Search error:", err);
    alert("Something went wrong. Please try again.");
    return null;
  }
}

// Dom
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const resultsContainer = document.getElementById("searchResults");

  // Focus the search input when page loads
  searchInput.focus();

  // Add event listeners
  searchButton.addEventListener("click", performSearch);
  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  });

  // Auto-search after typing
  let debounceTimer;
  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    const query = searchInput.value.trim();

    if (query.length > 2) {
      debounceTimer = setTimeout(() => {
        performSearch();
      }, 500);
    }
  });

  async function performSearch() {
    const searchQuery = searchInput.value.trim();

    if (!searchQuery) {
      showEmptyState();
      return;
    }

    // Show loading state
    showLoadingState();

    try {
      const profiles = await searchProfiles(searchQuery);
      displayResults(profiles);
    } catch (error) {
      showErrorState();
    }
  }

  // Display results
  function displayResults(profiles) {
    if (!profiles || profiles.length === 0) {
      showNoResultsState(searchInput.value.trim());
      return;
    }

    // list of matching profiles
    const profilesList = document.createElement("ul");
    profilesList.className = "profiles-list";

    profiles.forEach((profile) => {
      const listItem = document.createElement("li");
      listItem.className = "profile-item";

      listItem.innerHTML = `
      <div class="profile-username">@${profile.username}</div>
      <div class="profile-fullname">${
        profile.full_name || "No name provided"
      }</div>
      <button class="follow-btn" data-username="${
        profile.username
      }">Follow</button>
    `;

      listItem.addEventListener("click", (e) => {
        if (!e.target.classList.contains("follow-btn")) {
          window.location.href = `/profile/${profile.username}`;
        }
      });

      // Follow button logic
      const followBtn = listItem.querySelector(".follow-btn");
      followBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        followBtn.disabled = true;
        try {
          await followUser(profile.username);
          followBtn.textContent = "Following";
          followBtn.classList.add("following");
        } catch (err) {
          alert(err.message);
        }
        followBtn.disabled = false;
      });

      profilesList.appendChild(listItem);
    });

    // Replace any existing results
    resultsContainer.innerHTML = "";
    resultsContainer.appendChild(profilesList);
  }

  function showEmptyState() {
    resultsContainer.innerHTML = `
      <div class="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <p style="margin-top: 1rem;">Search for users by typing in the search box</p>
      </div>
    `;
  }

  function showLoadingState() {
    resultsContainer.innerHTML = `
      <ul class="profiles-list">
        ${Array(4)
          .fill(0)
          .map(
            () => `
          <div class="skeleton-item">
            <div class="skeleton-loader skeleton-username"></div>
            <div class="skeleton-loader skeleton-fullname"></div>
          </div>
        `
          )
          .join("")}
      </ul>
    `;
  }

  function showNoResultsState(query) {
    resultsContainer.innerHTML = `
      <div class="no-results">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        <p style="margin-top: 1rem;">No users found matching "${query}"</p>
      </div>
    `;
  }

  function showErrorState() {
    resultsContainer.innerHTML = `
      <div class="no-results">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p style="margin-top: 1rem;">Something went wrong. Please try again.</p>
      </div>
    `;
  }
});
