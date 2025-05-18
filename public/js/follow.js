import { authHeaders } from "./authMiddleware.js";
const API_BASE_URL = "http://127.0.0.1:5000/api";

// --------------------  Follow a User --------------------
export async function followUser(username) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/follow/${encodeURIComponent(username)}`,
      {
        method: "POST",
        headers: authHeaders(),
        credentials: "include",
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to follow user.");
    return data.message;
  } catch (err) {
    throw err;
  }
}

// -------------------- Unfollow a User --------------------
export async function unfollowUser(username) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/unfollow/${encodeURIComponent(username)}`,
      {
        method: "DELETE",
        headers: authHeaders(),
        credentials: "include",
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to unfollow user.");
    return data.message;
  } catch (err) {
    throw err;
  }
}

// -------------------- Get Followers --------------------
export async function getFollowers(username) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/followers/${encodeURIComponent(username)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.error || "Failed to fetch followers.");
    return data.followers;
  } catch (err) {
    throw err;
  }
}

// -------------------- Get Following --------------------
export async function getFollowing(username) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/following/${encodeURIComponent(username)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.error || "Failed to fetch following.");
    return data.following;
  } catch (err) {
    throw err;
  }
}

// --------------------  UI  --------------------
export function setupFollowButton({
  buttonId,
  username,
  isFollowing,
  onStatusChange = () => {},
}) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  function updateBtn(following) {
    btn.textContent = following ? "Unfollow" : "Follow";
    btn.classList.toggle("following", following);
  }

  updateBtn(isFollowing);

  btn.onclick = async () => {
    btn.disabled = true;
    try {
      if (btn.classList.contains("following")) {
        await unfollowUser(username);
        updateBtn(false);
        onStatusChange(false);
      } else {
        await followUser(username);
        updateBtn(true);
        onStatusChange(true);
      }
    } catch (err) {
      alert(err.message);
    }
    btn.disabled = false;
  };
}


// --------------------  Load Followers and Following with names --------------------