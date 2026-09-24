/* ============================================================
   seat-selection.js — Logic for seat-selection.html
   ============================================================ */

const ROWS = ["A", "B", "C", "D"];
const SEATS_PER_ROW = 8;
const MAX_SEATS = 6;

let occupiedSeats = [];
let selectedSeats = [];
let currentMovie, currentTheatre, currentDate, currentShow;

document.addEventListener("DOMContentLoaded", () => {
  renderNavbar("movies");

  currentMovie = JSON.parse(localStorage.getItem("selectedMovie") || "null");
  currentTheatre = JSON.parse(localStorage.getItem("selectedTheatre") || "null");
  currentDate = localStorage.getItem("selectedDate");
  currentShow = localStorage.getItem("selectedShow");

  if (!currentMovie || !currentTheatre || !currentDate || !currentShow) {
    document.getElementById("seat-page-content").innerHTML = `
      <div class="empty-state">
        <h3>No show selected</h3>
        <p>Please select a movie, theatre, date and show time first.</p>
        <a class="btn btn-primary" href="movies.html">Browse Movies</a>
      </div>`;
    return;
  }

  occupiedSeats = getOccupiedSeatsFor(currentMovie.id, currentTheatre.id, currentDate, currentShow);
  selectedSeats = [];

  renderShowSummary();
  renderSeatMap();
  updatePriceSummary();

  document.getElementById("proceed-checkout-btn").addEventListener("click", () => {
    if (selectedSeats.length === 0) {
      showNotification("Please select at least one seat.", "error");
      return;
    }
    localStorage.setItem("selectedSeats", JSON.stringify(selectedSeats));
    window.location.href = "checkout.html";
  });
});

function renderShowSummary() {
  const dateLabel = new Date(currentDate).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  document.getElementById("show-summary").innerHTML = `
    <h2>${escapeHtml(currentMovie.title)}</h2>
    <div class="movie-meta">
      <span class="badge">${escapeHtml(currentTheatre.name)}, ${escapeHtml(currentTheatre.location)}</span>
      <span class="badge">${dateLabel}</span>
      <span class="badge">${currentShow}</span>
    </div>`;
}

function renderSeatMap() {
  const container = document.getElementById("seat-map");
  let html = "";
  ROWS.forEach(row => {
    html += `<div class="seat-row"><div class="row-label">${row}</div>`;
    for (let i = 1; i <= SEATS_PER_ROW; i++) {
      const seatId = row + i;
      const isOccupied = occupiedSeats.includes(seatId);
      html += `<div class="seat ${isOccupied ? "occupied" : ""}" data-seat="${seatId}" role="button" tabindex="${isOccupied ? -1 : 0}" aria-label="Seat ${seatId}${isOccupied ? " (occupied)" : ""}">${i}</div>`;
    }
    html += `</div>`;
  });
  container.innerHTML = html;

  container.querySelectorAll(".seat:not(.occupied)").forEach(el => {
    el.addEventListener("click", () => toggleSeat(el));
    el.addEventListener("keypress", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleSeat(el); }
    });
  });
}

function toggleSeat(el) {
  const seatId = el.dataset.seat;
  if (selectedSeats.includes(seatId)) {
    selectedSeats = selectedSeats.filter(s => s !== seatId);
    el.classList.remove("selected");
  } else {
    if (selectedSeats.length >= MAX_SEATS) {
      showNotification(`You can select up to ${MAX_SEATS} seats.`, "error");
      return;
    }
    selectedSeats.push(seatId);
    el.classList.add("selected");
    showNotification(`Seat ${seatId} selected successfully`, "success");
  }
  updatePriceSummary();
}

function updatePriceSummary() {
  const count = selectedSeats.length;
  const price = currentTheatre.ticketPrice;
  const subtotal = count * price;
  const fee = count > 0 ? CONVENIENCE_FEE : 0;
  const total = subtotal + fee;

  document.getElementById("selected-seats-label").textContent =
    count > 0 ? selectedSeats.sort().join(", ") : "No seats selected yet";
  document.getElementById("seat-count").textContent = count;
  document.getElementById("price-line").textContent = `${formatCurrency(price)} × ${count} = ${formatCurrency(subtotal)}`;
  document.getElementById("fee-line").textContent = formatCurrency(fee);
  document.getElementById("total-line").textContent = formatCurrency(total);

  document.getElementById("proceed-checkout-btn").disabled = count === 0;
}
