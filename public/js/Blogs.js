const API_BASE_URL = "http://127.0.0.1:5000/api";

// Fetch all blog posts
export async function fetchBlogPosts(page = 1, limit = 15) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/blogposts?page=${page}&limit=${limit}`
    );
    if (!response.ok) throw new Error("Failed to load blog posts");
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    throw error;
  }
}

// Fetch blog posts by country
export async function fetchBlogPostsByCountry(country, page = 1, limit = 15) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/blogposts/country/${encodeURIComponent(
        country
      )}?page=${page}&limit=${limit}`
    );
    if (!response.ok) throw new Error("Failed to load blog posts for country");
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error("Error fetching blog posts by country:", error);
    throw error;
  }
}

// Fetch a single blog post by ID
export async function fetchBlogPostById(postId) {
  try {
    const response = await fetch(`${API_BASE_URL}/blogpost/${postId}`);
    if (!response.ok) throw new Error("Failed to load blog post");
    return await response.json();
  } catch (error) {
    console.error("Error fetching blog post:", error);
    throw error;
  }
}

// Render blog posts to the DOM
export async function renderBlogPosts(posts) {
  const postsList = document.getElementById("blogPostsList");
  postsList.innerHTML = "";

  if (!posts.length) {
    postsList.innerHTML = "<p>No blog posts found.</p>";
    return 0;
  }

  const template = document.getElementById("blog-card-template");

  posts.forEach((post) => {
    const postEl = template.content.cloneNode(true);

    postEl.querySelector(".post-title").textContent = post.title;
    postEl.querySelector(".author-name").textContent = post.username;
    postEl.querySelector(".country-name").textContent = post.country;
    postEl.querySelector(".date").textContent = new Date(
      post.date_of_visit
    ).toLocaleDateString();
    postEl.querySelector(".update-time").textContent = new Date(
      post.updated_at
    ).toLocaleString();

    const readMoreLink = postEl.querySelector(".read-more");
    if (readMoreLink) {
      readMoreLink.href = `/BlogPage?id=${post.id}`;
    }

    postsList.appendChild(postEl);
  });

  return posts.length;
}

// fetch country list
async function fetchCountryList() {
  try {
    const response = await fetch("/data/countries.json");
    return await response.json();
  } catch (e) {
    // fallback
    const response = await fetch("https://restcountries.com/v3.1/all");
    const countries = await response.json();
    return countries.map((c) => c.name.common).sort();
  }
}

// Pagination controls
export function setupPaginationControls(container, onPageChange) {
  let currentPage = 1;
  let pageSize = 15;
  let currentCountry = "";

  let controls = container.querySelector(".pagination-controls");
  if (controls) controls.remove();

  controls = document.createElement("div");
  controls.classList.add("pagination-controls");

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Previous";
  prevBtn.style.display = "none";

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.style.display = "none";

  controls.appendChild(prevBtn);
  controls.appendChild(nextBtn);

  container.appendChild(controls);

  async function handlePageChange(page) {
    let posts;
    if (currentCountry) {
      posts = await fetchBlogPostsByCountry(currentCountry, page, pageSize);
    } else {
      posts = await fetchBlogPosts(page, pageSize);
    }
    const count = await renderBlogPosts(posts);

    // Show/hide Previous button
    prevBtn.style.display = page > 1 && count > 0 ? "" : "none";

    // check next page to see if there are more posts
    let nextPosts;
    if (currentCountry) {
      nextPosts = await fetchBlogPostsByCountry(
        currentCountry,
        page + 1,
        pageSize
      );
    } else {
      nextPosts = await fetchBlogPosts(page + 1, pageSize);
    }
    nextBtn.style.display = nextPosts.length > 0 ? "" : "none";
  }

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      handlePageChange(currentPage);
    }
  });

  nextBtn.addEventListener("click", () => {
    currentPage++;
    handlePageChange(currentPage);
  });

  // Expose a way to set country from outside
  return {
    setCountry(country) {
      currentCountry = country;
      currentPage = 1;
      handlePageChange(currentPage);
    },
    setPage(page) {
      currentPage = page;
      prevBtn.style.display = currentPage > 1 ? "" : "none";
    },
    reload() {
      handlePageChange(currentPage);
    },
  };
}

//  setup country filter and pagination
document.addEventListener("DOMContentLoaded", async () => {
  const blogsContainer = document.getElementById("blogsContainer");
  if (!blogsContainer) return;

  const countryFilter = document.getElementById("countryFilter");
  const pagination = setupPaginationControls(blogsContainer);

  // Populate country dropdown
  if (countryFilter) {
    const countries = await fetchCountryList();
    countryFilter.innerHTML =
      `<option value="">All Countries</option>` +
      countries.map((c) => `<option value="${c}">${c}</option>`).join("");
    countryFilter.addEventListener("change", (e) => {
      pagination.setCountry(e.target.value);
    });
  }

  // Initial load (all countries)
  pagination.setCountry("");
});
