/* ============================================================
   common.js — Shared helper functions used across every page:
   data access, localStorage helpers, navbar rendering, toast
   notifications. Loaded on every page after data.js.
   ============================================================ */

/* ---------- Movie helpers ---------- */
function getMovies() {
  return MOVIES;
}

function getMovieById(id) {
  return MOVIES.find(m => m.id === Number(id));
}

function getTheatreById(id) {
  return THEATRES.find(t => t.id === Number(id));
}

/* ---------- Auth helpers ---------- */
function getRegisteredUsers() {
  return JSON.parse(localStorage.getItem("registeredUsers") || "[]");
}

function saveRegisteredUsers(users) {
  localStorage.setItem("registeredUsers", JSON.stringify(users));
}

function getCurrentUser() {
  const u = localStorage.getItem("currentUser");
  return u ? JSON.parse(u) : null;
}

function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function logoutUser() {
  localStorage.removeItem("currentUser");
  showNotification("You have been logged out.", "success");
  setTimeout(() => (window.location.href = "index.html"), 700);
}

/* ---------- Booking helpers ---------- */
function getBookings() {
  return JSON.parse(localStorage.getItem("bookingHistory") || "[]");
}

function saveBooking(booking) {
  const bookings = getBookings();
  bookings.unshift(booking);
  localStorage.setItem("bookingHistory", JSON.stringify(bookings));
}

function cancelBooking(bookingId) {
  const bookings = getBookings();
  const idx = bookings.findIndex(b => b.bookingId === bookingId);
  if (idx > -1) {
    bookings[idx].status = "Cancelled";
    localStorage.setItem("bookingHistory", JSON.stringify(bookings));
    return true;
  }
  return false;
}

function generateBookingId() {
  const now = new Date();
  const pad = n => String(n).padStart(2, "0");
  const stamp =
    now.getFullYear().toString() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds());
  return "TB" + stamp;
}

/* ---------- Toast notifications ---------- */
function showNotification(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = "toast toast-" + type;
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

/* ---------- Navbar rendering (consistent on every page) ---------- */
function renderNavbar(activePage) {
  const navContainer = document.getElementById("site-navbar");
  if (!navContainer) return;

  const user = getCurrentUser();
  const authLink = user
    ? `<a href="#" id="logout-link" class="nav-link">Logout (${escapeHtml(user.name.split(" ")[0])})</a>`
    : `<a href="login.html" class="nav-link ${activePage === "login" ? "active" : ""}">Login/Register</a>`;

  navContainer.innerHTML = `
    <div class="navbar">
      <a href="index.html" class="nav-logo">
        <img src="assets/images/logo.svg" alt="CineBook logo" width="140" height="42">
      </a>
      <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <nav class="nav-menu" id="nav-menu">
        <a href="index.html" class="nav-link ${activePage === "home" ? "active" : ""}">Home</a>
        <a href="movies.html" class="nav-link ${activePage === "movies" ? "active" : ""}">Movies</a>
        <a href="my-bookings.html" class="nav-link ${activePage === "bookings" ? "active" : ""}">My Bookings</a>
        <a href="about.html" class="nav-link ${activePage === "about" ? "active" : ""}">About</a>
        ${authLink}
      </nav>
    </div>`;

  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-menu");
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  const logoutLink = document.getElementById("logout-link");
  if (logoutLink) {
    logoutLink.addEventListener("click", e => {
      e.preventDefault();
      logoutUser();
    });
  }
}

function renderFooter() {
  const footerContainer = document.getElementById("site-footer");
  if (!footerContainer) return;
  footerContainer.innerHTML = `
    <footer class="footer">
      <div class="footer-inner">
        <div>
          <img src="assets/images/logo.svg" alt="CineBook logo" width="130" height="40">
          <p class="footer-tagline">Book your favourite movies in a few clicks.</p>
        </div>
        <div class="footer-col">
          <h4>Quick Links</h4>
          <a href="index.html">Home</a>
          <a href="movies.html">Movies</a>
          <a href="my-bookings.html">My Bookings</a>
          <a href="about.html">About</a>
        </div>
        <div class="footer-col">
          <h4>Support</h4>
          <a href="about.html">Contact Us</a>
          <a href="login.html">Login / Register</a>
        </div>
        <div class="footer-col">
          <h4>Project</h4>
          <p>Frontend-only academic project built with HTML, CSS &amp; JavaScript.</p>
        </div>
      </div>
      <div class="footer-bottom">&copy; 2026 CineBook Theatre Ticket Booking System. Built for academic demonstration.</div>
    </footer>`;
}

/* ---------- Movie card template (shared by index.html & movies.html) ---------- */
function movieCardTemplate(movie) {
  return `
    <div class="movie-card">
      <a href="movie-details.html?id=${movie.id}">
        <img src="${movie.poster}" alt="${escapeHtml(movie.title)} poster" loading="lazy">
      </a>
      <div class="movie-card-body">
        <h3>${escapeHtml(movie.title)}</h3>
        <div class="movie-meta">
          <span class="badge rating-badge">★ ${movie.rating}</span>
          <span class="badge">${escapeHtml(movie.genre)}</span>
          <span class="badge">${escapeHtml(movie.language)}</span>
        </div>
        <p class="movie-meta" style="margin:0;">${movie.duration}</p>
        <div class="movie-card-actions">
          <a class="btn btn-outline" href="movie-details.html?id=${movie.id}">Details</a>
          <a class="btn btn-primary" href="movie-details.html?id=${movie.id}#booking">Book Now</a>
        </div>
      </div>
    </div>`;
}

/* ---------- Misc utilities ---------- */
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function formatCurrency(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function requireLogin(redirectTo) {
  if (!getCurrentUser()) {
    showNotification("Please login to continue.", "error");
    setTimeout(() => {
      window.location.href = "login.html?redirect=" + encodeURIComponent(redirectTo || window.location.pathname);
    }, 900);
    return false;
  }
  return true;
}

/* Runs on every page load */
document.addEventListener("DOMContentLoaded", () => {
  renderFooter();
});
