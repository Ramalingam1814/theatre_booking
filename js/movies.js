/* ============================================================
   movies.js — Logic for movies.html (search + filter + list)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  renderNavbar("movies");
  populateFilterOptions();

  const searchInput = document.getElementById("search-input");
  const genreSelect = document.getElementById("genre-filter");
  const langSelect = document.getElementById("language-filter");
  const sortSelect = document.getElementById("sort-filter");

  const initialSearch = getQueryParam("search");
  if (initialSearch) searchInput.value = initialSearch;

  [searchInput, genreSelect, langSelect, sortSelect].forEach(el =>
    el.addEventListener("input", applyFilters)
  );

  applyFilters();
});

function populateFilterOptions() {
  const genres = [...new Set(getMovies().map(m => m.genre))].sort();
  const langs = [...new Set(getMovies().map(m => m.language))].sort();
  const genreSelect = document.getElementById("genre-filter");
  const langSelect = document.getElementById("language-filter");

  genres.forEach(g => genreSelect.insertAdjacentHTML("beforeend", `<option value="${g}">${g}</option>`));
  langs.forEach(l => langSelect.insertAdjacentHTML("beforeend", `<option value="${l}">${l}</option>`));
}

function applyFilters() {
  const query = document.getElementById("search-input").value.trim().toLowerCase();
  const genre = document.getElementById("genre-filter").value;
  const lang = document.getElementById("language-filter").value;
  const sort = document.getElementById("sort-filter").value;

  let results = getMovies().filter(m => {
    const matchesQuery = !query || m.title.toLowerCase().includes(query) || m.genre.toLowerCase().includes(query);
    const matchesGenre = !genre || m.genre === genre;
    const matchesLang = !lang || m.language === lang;
    return matchesQuery && matchesGenre && matchesLang;
  });

  if (sort === "rating") results.sort((a, b) => b.rating - a.rating);
  else if (sort === "title") results.sort((a, b) => a.title.localeCompare(b.title));

  const container = document.getElementById("movie-results");
  const countLabel = document.getElementById("results-count");
  countLabel.textContent = `${results.length} movie${results.length !== 1 ? "s" : ""} found`;

  if (results.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>No movies match your search</h3>
        <p>Try a different title, genre or language.</p>
      </div>`;
    return;
  }

  container.innerHTML = results.map(movieCardTemplate).join("");
}
