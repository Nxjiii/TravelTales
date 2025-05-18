import { updateNavbar } from "./navbar.js";
import { clearToken } from "./authMiddleware.js";
const API_BASE_URL = "http://127.0.0.1:5000/api";

// --------------------------------LOGIN FUNCTION------------------------------------
export async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const responseText = await response.text();

    if (!responseText.trim()) {
      throw new Error("Server returned empty response");
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      throw new Error("Server returned invalid JSON response");
    }

    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    if (!data.token) {
      throw new Error("Authentication failed: No token received");
    }

    localStorage.setItem("token", data.token);
    document.cookie = `token=${data.token}; path=/; max-age=${
      60 * 60 * 24 * 7
    }`;
    if (data.api_key) {
      localStorage.setItem("api_key", data.api_key);
    }

    updateNavbar(); // Call updateNavbar to update ui
    window.location.href = "/";
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
}

// -------------------------------REGISTER FUNCTION----------------------------------
export async function registerUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const responseText = await response.text();

    if (!responseText.trim()) {
      throw new Error("Server returned empty response");
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      throw new Error("Server returned invalid JSON response");
    }

    if (!response.ok) {
      throw new Error(data.error || "Registration failed");
    }

    if (!data.token) {
      throw new Error("Registration failed: No token received");
    }

    localStorage.setItem("token", data.token);
    document.cookie = `token=${data.token}; path=/; max-age=${
      60 * 60 * 24 * 7
    }`;

    if (data.api_key) {
      localStorage.setItem("api_key", data.api_key);
    }

    window.location.href = "/setup";
  } catch (err) {
    console.error("Registration error:", err);
    throw err;
  }
}

// ----------------------------------- Auth utls and logout -------------------------------------------
export function getToken() {
  const localToken = localStorage.getItem("token");
  if (localToken) return localToken;
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
  return match ? match[1] : null;
}

export async function logoutUser() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("http://127.0.0.1:5000/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Logout failed:", errorData.error || response.statusText);
    }
  } catch (err) {
    console.error("Network error during logout:", err);
  }

  // Clear token and api key from localStorage and cookies
  clearToken();

  updateNavbar();

  //delay to render the updated navbar
  setTimeout(() => {
    window.location.href = "/login";
  }, 50);
}

export function authHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}
