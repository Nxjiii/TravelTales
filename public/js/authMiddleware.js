// Check if the user is logged in
export function isUserLoggedIn() {
  return localStorage.getItem("token") !== null;
}

// Middleware to check if the user is authenticated
// Returns true if logged in, otherwise shows alert and returns false
export function authMiddleware() {
  if (!isUserLoggedIn()) {
    alert("You need to log in to complete this action.");
    return false;
  }
  return true;
}

// Page protection - redirects
export function protectPage() {
  if (!isUserLoggedIn()) {
    console.log("Unauthorized access attempt - redirecting to login");
    window.location.href = "/login";
    return false;
  }
  return true;
}

// Get the stored token
export function getToken() {
  return localStorage.getItem("token");
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
