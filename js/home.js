/* ============================================================
   home.js — Logic for index.html
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  renderNavbar("home");

  const featured = getMovies().slice(0, 4);
  const popular = [...getMovies()].sort((a, b) => b.rating - a.rating).slice(0, 4);

  renderMovieGrid("featured-movies", featured);
  renderMovieGrid("popular-movies", popular);

  const searchForm = document.getElementById("hero-search-form");
  searchForm.addEventListener("submit", e => {
    e.preventDefault();
    const query = document.getElementById("hero-search-input").value.trim();
    window.location.href = "movies.html" + (query ? "?search=" + encodeURIComponent(query) : "");
  });
});

function renderMovieGrid(containerId, movies) {
  const container = document.getElementById(containerId);
  container.innerHTML = movies.map(movieCardTemplate).join("");
}
