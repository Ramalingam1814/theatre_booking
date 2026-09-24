/* ============================================================
   checkout.js — Logic for checkout.html
   ============================================================ */

let selectedPayment = null;

document.addEventListener("DOMContentLoaded", () => {
  renderNavbar("movies");

  const movie = JSON.parse(localStorage.getItem("selectedMovie") || "null");
  const theatre = JSON.parse(localStorage.getItem("selectedTheatre") || "null");
  const date = localStorage.getItem("selectedDate");
  const show = localStorage.getItem("selectedShow");
  const seats = JSON.parse(localStorage.getItem("selectedSeats") || "[]");

  if (!movie || !theatre || !date || !show || seats.length === 0) {
    document.getElementById("checkout-content").innerHTML = `
      <div class="empty-state">
        <h3>Nothing to check out</h3>
        <p>Please select a movie, show and seats before checking out.</p>
        <a class="btn btn-primary" href="movies.html">Browse Movies</a>
      </div>`;
    return;
  }

  const user = getCurrentUser();
  if (user) {
    document.getElementById("full-name").value = user.name;
    document.getElementById("email").value = user.email;
  }

  renderOrderSummary(movie, theatre, date, show, seats);
  setupPaymentOptions();
  setupFormValidation(movie, theatre, date, show, seats);
});

function renderOrderSummary(movie, theatre, date, show, seats) {
  const price = theatre.ticketPrice;
  const subtotal = seats.length * price;
  const fee = CONVENIENCE_FEE;
  const total = subtotal + fee;
  const dateLabel = new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  document.getElementById("order-summary").innerHTML = `
    <h3>${escapeHtml(movie.title)}</h3>
    <p style="color:#64748B;margin-top:-6px;">${escapeHtml(theatre.name)}, ${escapeHtml(theatre.location)}</p>
    <div class="summary-row"><span>Date</span><span>${dateLabel}</span></div>
    <div class="summary-row"><span>Show Time</span><span>${show}</span></div>
    <div class="summary-row"><span>Seats (${seats.length})</span><span>${seats.sort().join(", ")}</span></div>
    <div class="summary-row"><span>Ticket Price</span><span>${formatCurrency(price)} × ${seats.length} = ${formatCurrency(subtotal)}</span></div>
    <div class="summary-row"><span>Convenience Fee</span><span>${formatCurrency(fee)}</span></div>
    <div class="summary-row total"><span>Total Amount</span><span>${formatCurrency(total)}</span></div>`;
}

function setupPaymentOptions() {
  const options = document.querySelectorAll(".payment-option");
  options.forEach(opt => {
    opt.addEventListener("click", () => {
      options.forEach(o => o.classList.remove("selected"));
      opt.classList.add("selected");
      selectedPayment = opt.dataset.method;
    });
  });
}

function setupFormValidation(movie, theatre, date, show, seats) {
  const form = document.getElementById("checkout-form");
  form.addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("full-name");
    const email = document.getElementById("email");
    const mobile = document.getElementById("mobile");

    let valid = true;
    valid = validateField(name, name.value.trim().length >= 3, "Please enter your full name.") && valid;
    valid = validateField(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()), "Please enter a valid email address.") && valid;
    valid = validateField(mobile, /^[6-9]\d{9}$/.test(mobile.value.trim()), "Please enter a valid 10-digit mobile number.") && valid;

    if (!selectedPayment) {
      showNotification("Please select a payment method.", "error");
      valid = false;
    }

    if (!valid) return;

    const price = theatre.ticketPrice;
    const subtotal = seats.length * price;
    const total = subtotal + CONVENIENCE_FEE;

    const booking = {
      bookingId: generateBookingId(),
      movieTitle: movie.title,
      moviePoster: movie.poster,
      theatreName: theatre.name,
      theatreLocation: theatre.location,
      date: date,
      show: show,
      seats: seats.sort(),
      customerName: name.value.trim(),
      customerEmail: email.value.trim(),
      customerMobile: mobile.value.trim(),
      paymentMethod: selectedPayment,
      subtotal: subtotal,
      convenienceFee: CONVENIENCE_FEE,
      total: total,
      status: "Confirmed",
      bookedAt: new Date().toISOString()
    };

    saveBooking(booking);
    localStorage.setItem("lastBookingId", booking.bookingId);
    ["selectedMovie", "selectedTheatre", "selectedDate", "selectedShow", "selectedSeats"].forEach(k => localStorage.removeItem(k));

    showNotification("Booking confirmed successfully!", "success");
    setTimeout(() => (window.location.href = "booking-confirmation.html"), 700);
  });
}

function validateField(input, isValid, message) {
  const group = input.closest(".form-group");
  const errorEl = group.querySelector(".error-text");
  if (!isValid) {
    group.classList.add("has-error");
    errorEl.textContent = message;
  } else {
    group.classList.remove("has-error");
  }
  return isValid;
}
