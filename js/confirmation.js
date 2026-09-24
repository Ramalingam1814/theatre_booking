/* ============================================================
   confirmation.js — Logic for booking-confirmation.html
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  renderNavbar("movies");

  const bookingId = localStorage.getItem("lastBookingId");
  const bookings = getBookings();
  const booking = bookings.find(b => b.bookingId === bookingId);

  if (!booking) {
    document.getElementById("confirmation-content").innerHTML = `
      <div class="empty-state">
        <h3>No recent booking found</h3>
        <p>Book a ticket first to see your confirmation here.</p>
        <a class="btn btn-primary" href="movies.html">Browse Movies</a>
      </div>`;
    return;
  }

  const dateLabel = new Date(booking.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  document.getElementById("confirmation-content").innerHTML = `
    <div class="confirmation-box">
      <img src="assets/images/booking-success.svg" alt="Booking confirmed" width="100" height="100">
      <h1>Booking Confirmed!</h1>
      <p>A confirmation has been generated for your records. Thank you for booking with CineBook.</p>

      <div class="ticket-card">
        <div class="ticket-row"><span>Booking ID</span><strong>${booking.bookingId}</strong></div>
        <div class="ticket-row"><span>Movie</span><strong>${escapeHtml(booking.movieTitle)}</strong></div>
        <div class="ticket-row"><span>Theatre</span><strong>${escapeHtml(booking.theatreName)}, ${escapeHtml(booking.theatreLocation)}</strong></div>
        <div class="ticket-row"><span>Date</span><strong>${dateLabel}</strong></div>
        <div class="ticket-row"><span>Time</span><strong>${booking.show}</strong></div>
        <div class="ticket-row"><span>Seats</span><strong>${booking.seats.join(", ")}</strong></div>
        <div class="ticket-row"><span>Customer Name</span><strong>${escapeHtml(booking.customerName)}</strong></div>
        <div class="ticket-row"><span>Payment Method</span><strong>${escapeHtml(booking.paymentMethod)}</strong></div>
        <div class="ticket-row"><span>Total Amount</span><strong>${formatCurrency(booking.total)}</strong></div>
        <div class="ticket-row"><span>Status</span><span class="status-tag status-confirmed">${booking.status}</span></div>
        <div class="qr-placeholder" title="Simulated QR code — for demonstration only" aria-hidden="true"></div>
      </div>

      <div class="movie-card-actions no-print" style="margin-top:22px;justify-content:center;gap:14px;">
        <button class="btn btn-outline" id="print-btn" type="button">🖨 Print Ticket</button>
        <button class="btn btn-outline" id="download-btn" type="button">⬇ Download Ticket</button>
        <a class="btn btn-primary" href="my-bookings.html">Go to My Bookings</a>
      </div>
    </div>`;

  document.getElementById("print-btn").addEventListener("click", () => window.print());
  document.getElementById("download-btn").addEventListener("click", () => window.print());
});
