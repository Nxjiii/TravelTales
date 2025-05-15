// Check if the user is logged in
export function isUserLoggedIn() {
  // Check localStorage first
  if (localStorage.getItem("token")) return true;
  // Fallback: check cookie
  return document.cookie.match(/(?:^|;\s*)token=([^;]*)/) !== null;
}

// Middleware to check if the user is authenticated
// Returns true if logged in, otherwise shows alert and returns false
export function authMiddleware() {
  checkTokenExpiry();
  if (!isUserLoggedIn()) {
    alert("You need to log in to complete this action.");
    return false;
  }
  return true;
}

// Page protection - redirects
export function protectPage() {
  checkTokenExpiry();
  if (!isUserLoggedIn()) {
    console.log("Unauthorized access attempt - redirecting to login");
    window.location.href = "/login";
    return false;
  }
  return true;
}

//util to make it easier to remove from both localStorage and cookies
export function clearToken() {
  localStorage.removeItem("token");
  localStorage.removeItem("api_key");
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

// Create auth headers with the Bearer token
export function authHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// handles 401 (unauthorised) responses
export async function fetchWithAuth(url, options = {}) {
  const token = getToken();
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    alert("Session expired. Please log in again.");
    logoutUser(); // Clear token and redirect
    throw new Error("Unauthorised");
  }

  return response;
}

// listener to update UI on token changes across tabs
export function registerAuthSync(callback) {
  window.addEventListener("storage", (event) => {
    if (event.key === "token") {
      callback();
    }
  });
}

// Function to log out the users with expired tokens
export function checkTokenExpiry() {
  // Get token from localStorage
  const localToken = localStorage.getItem("token");
  if (!localToken) return;

  // Get token from cookie
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
  const cookieToken = match ? match[1] : null;

  // Only proceed if tokens match (or only localStorage is present)
  if (!cookieToken || localToken === cookieToken) {
    try {
      const payloadBase64 = localToken.split(".")[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);

      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && currentTime >= payload.exp) {
        console.log("Token expired - removing from storage and cookie");
        clearToken();
      }
    } catch (e) {
      console.error("Invalid token format", e);
      clearToken();
    }
  }
}
