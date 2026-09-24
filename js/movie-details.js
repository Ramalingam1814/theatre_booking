/* ============================================================
   movie-details.js — Logic for movie-details.html
   ============================================================ */

let selectedTheatreId = null;
let selectedDate = null;
let selectedTime = null;

document.addEventListener("DOMContentLoaded", () => {
  renderNavbar("movies");

  const movieId = getQueryParam("id");
  const movie = getMovieById(movieId);

  if (!movie) {
    document.getElementById("movie-details-content").innerHTML = `
      <div class="empty-state">
        <h3>Movie not found</h3>
        <p>The movie you're looking for doesn't exist or has been removed.</p>
        <a class="btn btn-primary" href="movies.html">Browse Movies</a>
      </div>`;
    return;
  }

  renderMovieDetails(movie);
  renderTheatreOptions();
  renderDateOptions();
  renderShowTimes();

  document.getElementById("proceed-btn").addEventListener("click", () => {
    if (!selectedTheatreId || !selectedDate || !selectedTime) {
      showNotification("Please select theatre, date and show time.", "error");
      return;
    }
    localStorage.setItem("selectedMovie", JSON.stringify(movie));
    localStorage.setItem("selectedTheatre", JSON.stringify(getTheatreById(selectedTheatreId)));
    localStorage.setItem("selectedDate", selectedDate);
    localStorage.setItem("selectedShow", selectedTime);
    window.location.href = "seat-selection.html";
  });
});

function renderMovieDetails(movie) {
  document.title = movie.title + " — CineBook";
  document.getElementById("movie-details-content").innerHTML = `
    <div class="details-hero">
      <img src="${movie.poster}" alt="${escapeHtml(movie.title)} poster">
      <div>
        <h1>${escapeHtml(movie.title)}</h1>
        <div class="details-meta">
          <span class="badge rating-badge">★ ${movie.rating}/10</span>
          <span class="badge">${escapeHtml(movie.genre)}</span>
          <span class="badge">${escapeHtml(movie.language)}</span>
          <span class="badge">${movie.duration}</span>
        </div>
        <p>${escapeHtml(movie.description)}</p>
        <ul class="details-list">
          <li><strong>Director:</strong> ${escapeHtml(movie.director)}</li>
          <li><strong>Cast:</strong> ${escapeHtml(movie.cast)}</li>
          <li><strong>Release Date:</strong> ${movie.releaseDate}</li>
        </ul>
        <button class="btn btn-outline" id="trailer-btn" type="button">▶ Watch Trailer</button>
      </div>
    </div>`;

  document.getElementById("trailer-btn").addEventListener("click", () => {
    showNotification("Trailer preview is not available in this demo project.", "success");
  });
}

function renderTheatreOptions() {
  const container = document.getElementById("theatre-options");
  container.innerHTML = THEATRES.map(t => `
    <div class="theatre-option" data-id="${t.id}">
      <div>
        <strong>${escapeHtml(t.name)}</strong>
        <div style="font-size:0.82rem;color:#64748B;">${escapeHtml(t.location)}</div>
      </div>
      <span class="price">₹${t.ticketPrice} / seat</span>
    </div>`).join("");

  container.querySelectorAll(".theatre-option").forEach(el => {
    el.addEventListener("click", () => {
      container.querySelectorAll(".theatre-option").forEach(o => o.classList.remove("selected"));
      el.classList.add("selected");
      selectedTheatreId = Number(el.dataset.id);
    });
  });
}

function renderDateOptions() {
  const container = document.getElementById("date-options");
  const today = new Date();
  const dates = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  container.innerHTML = dates.map(d => {
    const value = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
    return `<div class="pill" data-date="${value}">${label}</div>`;
  }).join("");

  container.querySelectorAll(".pill").forEach(el => {
    el.addEventListener("click", () => {
      container.querySelectorAll(".pill").forEach(o => o.classList.remove("selected"));
      el.classList.add("selected");
      selectedDate = el.dataset.date;
    });
  });
}

function renderShowTimes() {
  const container = document.getElementById("time-options");
  container.innerHTML = SHOW_TIMES.map(t => `<div class="pill" data-time="${t}">${t}</div>`).join("");
  container.querySelectorAll(".pill").forEach(el => {
    el.addEventListener("click", () => {
      container.querySelectorAll(".pill").forEach(o => o.classList.remove("selected"));
      el.classList.add("selected");
      selectedTime = el.dataset.time;
    });
  });
}
