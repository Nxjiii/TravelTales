const api = {
  // Example function for fetching blog posts
  fetchBlogPosts: async () => {
    try {
      const response = await fetch("/api/posts"); //GET /api/posts route in backend
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched blog posts:", data);
        return data;
      } else {
        console.error("Failed to fetch blog posts");
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    }
  },

  // Placeholder for other API interactions (login, logout, etc.)
  login: async (username, password) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        return data;
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  },
};

export default api;
