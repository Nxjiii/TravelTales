const API_BASE_URL = "http://127.0.0.1:5000/api";

export async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      credentials: "include", // Include cookies in the request
    });

    // Get the response as text first
    const responseText = await response.text();

    // Don't try to parse if response is empty
    if (!responseText.trim()) {
      throw new Error("Server returned empty response");
    }

    // Try to parse the response as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      throw new Error("Server returned invalid JSON response");
    }

    // Handle errors
    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    // Check if we got a token
    if (!data.token) {
      throw new Error("Authentication failed: No token received");
    }

    // Store the token and API key in localStorage
    localStorage.setItem("token", data.token);
    if (data.api_key) {
      localStorage.setItem("api_key", data.api_key);
    }

    // Redirect to homepage
    window.location.href = "/";
  } catch (err) {
    console.error("Login error:", err);
    throw err; // Re-throw the error to be handled by the form submit handler
  }
}

export function getToken() {
  return localStorage.getItem("token");
}

export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("api_key");
  window.location.href = "/login";
}

export function authHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}
