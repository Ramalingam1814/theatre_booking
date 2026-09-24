/* ============================================================
   bookings.js — Logic for my-bookings.html
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  renderNavbar("bookings");
  renderBookings();
});

function renderBookings() {
  const bookings = getBookings();
  const container = document.getElementById("bookings-list");

  if (bookings.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>No bookings yet</h3>
        <p>Your booked tickets will appear here once you make a reservation.</p>
        <a class="btn btn-primary" href="movies.html">Browse Movies</a>
      </div>`;
    return;
  }

  container.innerHTML = bookings.map(bookingItemTemplate).join("");

  container.querySelectorAll(".cancel-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      if (confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
        cancelBooking(id);
        showNotification("Booking cancelled successfully.", "success");
        renderBookings();
      }
    });
  });

  container.querySelectorAll(".view-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const booking = bookings.find(b => b.bookingId === id);
      alert(
        `Booking ${booking.bookingId}\n` +
        `Movie: ${booking.movieTitle}\n` +
        `Theatre: ${booking.theatreName}\n` +
        `Seats: ${booking.seats.join(", ")}\n` +
        `Total: ₹${booking.total}\n` +
        `Status: ${booking.status}`
      );
    });
  });
}

function bookingItemTemplate(b) {
  const dateLabel = new Date(b.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const statusClass = b.status === "Cancelled" ? "status-cancelled" : "status-confirmed";
  return `
    <div class="booking-item">
      <div class="booking-head">
        <div>
          <strong>${escapeHtml(b.movieTitle)}</strong>
          <div style="font-size:0.82rem;color:#64748B;">Booking ID: ${b.bookingId}</div>
        </div>
        <span class="status-tag ${statusClass}">${b.status}</span>
      </div>
      <div class="booking-grid">
        <div><strong>Theatre</strong>${escapeHtml(b.theatreName)}</div>
        <div><strong>Date</strong>${dateLabel}</div>
        <div><strong>Time</strong>${b.show}</div>
        <div><strong>Seats</strong>${b.seats.join(", ")}</div>
        <div><strong>Amount</strong>${formatCurrency(b.total)}</div>
      </div>
      <div class="booking-actions">
        <button class="btn btn-outline btn-sm view-btn" data-id="${b.bookingId}" type="button">View Ticket</button>
        ${b.status !== "Cancelled"
          ? `<button class="btn btn-danger btn-sm cancel-btn" data-id="${b.bookingId}" type="button">Cancel Booking</button>`
          : ""}
      </div>
    </div>`;
}
