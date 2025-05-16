// ------------------------------------GET Country Info ---------------------------------------------------
export async function fetchCountryInfo(countryName) {
  try {
    const apiKey = localStorage.getItem("api_key");
    if (!apiKey) throw new Error("API key not found.");

    const API_BASE_URL = "http://127.0.0.1:5000/api";
    const response = await fetch(
      `${API_BASE_URL}/countries/${encodeURIComponent(countryName)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error || "Failed to fetch country info.");
    }
  } catch (error) {
    console.error("Country info error:", error);
    throw error;
  }
}

// ----------------------------------POST Blog -------------------------------------------
export async function createBlogPost({
  title,
  content,
  country,
  date_of_visit,
}) {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated.");

    const API_BASE_URL = "http://127.0.0.1:5000/api";
    const response = await fetch(`${API_BASE_URL}/blogpost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content, country, date_of_visit }),
    });

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error || "Failed to create blog post.");
    }
  } catch (error) {
    console.error("Blog post creation error:", error);
    throw error;
  }
}

// ---------------------------dom--------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  const blogForm = document.getElementById("createBlogForm");
  const countryInfoBox = document.getElementById("countryInfoBox");
  const messageBox = document.getElementById("formMessageBox");
  const countrySelect = document.getElementById("country");

  if (!blogForm) return;

  // Populate country dropdown
  async function populateCountryDropdown() {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all");
      const countries = await response.json();
      countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
      countrySelect.innerHTML = countries
        .map(
          (c) => `<option value="${c.name.common}">${c.name.common}</option>`
        )
        .join("");
    } catch (err) {
      countrySelect.innerHTML =
        '<option value="">Failed to load countries</option>';
    }
  }

  await populateCountryDropdown();

  // Fetch country info when a country is selected
  countrySelect.addEventListener("change", async () => {
    const country = countrySelect.value;
    if (!country) {
      countryInfoBox.innerHTML = "<p class='error'>Please select a country</p>";
      countryInfoBox.classList.remove("hidden");
      return;
    }

    countryInfoBox.innerHTML = "<p>Loading country info...</p>";
    countryInfoBox.classList.remove("hidden");

    try {
      const info = await fetchCountryInfo(country);
      countryInfoBox.innerHTML = `
        <h4>${info.name}</h4>
        <img src="${info.flag}" alt="Flag of ${info.name}" width="80" />
        <p><strong>Capital:</strong> ${info.capital}</p>
        <p><strong>Currency:</strong> ${info.currency}</p>
        <p><strong>Languages:</strong> ${info.languages.join(", ")}</p>
      `;
    } catch (err) {
      countryInfoBox.innerHTML = `<p class="error">${err.message}</p>`;
    }
  });

  // Submit blog post
  blogForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(blogForm);
    const blogData = {
      title: formData.get("title"),
      content: formData.get("content"),
      country: formData.get("country"),
      date_of_visit:
        formData.get("date_of_visit") || formData.get("dateOfVisit"),
    };

    messageBox.textContent = "Submitting blog post...";
    messageBox.classList.remove("hidden");

    try {
      const result = await createBlogPost(blogData);
      messageBox.innerHTML = `
        <p>Blog created successfully!</p>
        <button id="goHomeBtn" class="go-home-btn">Go to Homepage</button>
      `;
      messageBox.classList.remove("hidden");
      blogForm.reset();
      countryInfoBox.innerHTML = "";
      countryInfoBox.classList.add("hidden");
      console.log("Blog post:", result);

      document.getElementById("goHomeBtn").addEventListener("click", () => {
        window.location.href = "/";
      });
    } catch (err) {
      messageBox.textContent = `Error: ${err.message}`;
    }
  });
});
