/* ============================================================
   data.js — Static "database" for the Theatre Ticket Booking
   System. In a real system this would come from a backend API;
   here it is a plain JS array used as the single source of truth.
   ============================================================ */

const MOVIES = [
  { id: 1, title: "Interstellar", genre: "Sci-Fi", language: "English", rating: 8.9, duration: "2h 49m",
    director: "Christopher Nolan", cast: "Matthew McConaughey, Anne Hathaway, Jessica Chastain",
    releaseDate: "07-11-2014", poster: "assets/images/movie1.svg",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival." },
  { id: 2, title: "The Dark Knight", genre: "Action", language: "English", rating: 9.0, duration: "2h 32m",
    director: "Christopher Nolan", cast: "Christian Bale, Heath Ledger, Aaron Eckhart",
    releaseDate: "18-07-2008", poster: "assets/images/movie2.svg",
    description: "When the Joker wreaks havoc on Gotham, Batman must accept one of the greatest psychological tests of his ability to fight injustice." },
  { id: 3, title: "Kadhalan Returns", genre: "Romance", language: "Tamil", rating: 7.8, duration: "2h 20m",
    director: "S. Meenakshi", cast: "Arjun Kumar, Divya Priya",
    releaseDate: "12-01-2026", poster: "assets/images/movie3.svg",
    description: "A modern retelling of a college romance that turns into a journey of self-discovery." },
  { id: 4, title: "Vikram", genre: "Action", language: "Tamil", rating: 8.4, duration: "2h 55m",
    director: "Lokesh Kanagaraj", cast: "Kamal Haasan, Vijay Sethupathi, Fahadh Faasil",
    releaseDate: "03-06-2022", poster: "assets/images/movie4.svg",
    description: "A special-ops agent investigates a series of murders carried out by a masked gang." },
  { id: 5, title: "Zindagi Na Milegi", genre: "Drama", language: "Hindi", rating: 8.2, duration: "2h 35m",
    director: "Zoya Akhtar", cast: "Hrithik Roshan, Farhan Akhtar, Katrina Kaif",
    releaseDate: "15-07-2011", poster: "assets/images/movie5.svg",
    description: "Three friends embark on a road trip that changes the way they look at life." },
  { id: 6, title: "Baahubali Rising", genre: "Action", language: "Telugu", rating: 8.7, duration: "2h 48m",
    director: "S.S. Rajamouli", cast: "Prabhas, Rana Daggubati, Anushka Shetty",
    releaseDate: "10-07-2015", poster: "assets/images/movie6.svg",
    description: "An epic tale of two brothers fighting for the throne of an ancient kingdom." },
  { id: 7, title: "Toy Story 5", genre: "Animation", language: "English", rating: 8.0, duration: "1h 45m",
    director: "Andrew Stanton", cast: "Tom Hanks, Tim Allen",
    releaseDate: "20-06-2026", poster: "assets/images/movie7.svg",
    description: "Woody, Buzz and the gang return for a brand-new adventure about growing up and letting go." },
  { id: 8, title: "The Pursuit", genre: "Thriller", language: "English", rating: 7.6, duration: "2h 05m",
    director: "Ava Michaels", cast: "Daniel Ford, Priya Sharma",
    releaseDate: "05-03-2026", poster: "assets/images/movie8.svg",
    description: "A detective races against time to stop a heist that could bring down the city's financial system." },
  { id: 9, title: "Arrival Horizon", genre: "Sci-Fi", language: "English", rating: 8.3, duration: "1h 56m",
    director: "Denis Kovac", cast: "Amy Chen, Robert Silva",
    releaseDate: "22-09-2025", poster: "assets/images/movie9.svg",
    description: "A linguist is recruited to communicate with an alien species before global tensions boil over." },
  { id: 10, title: "Comedy Nights", genre: "Comedy", language: "Hindi", rating: 7.2, duration: "2h 10m",
    director: "Rohan Mehta", cast: "Kunal Verma, Sneha Rao",
    releaseDate: "01-02-2026", poster: "assets/images/movie10.svg",
    description: "A stand-up comedian's chaotic week before the biggest show of his career." }
];

const THEATRES = [
  { id: 1, name: "PVR Cinemas", location: "Madurai", ticketPrice: 180 },
  { id: 2, name: "INOX", location: "Chennai", ticketPrice: 200 },
  { id: 3, name: "AGS Cinemas", location: "Chennai", ticketPrice: 160 },
  { id: 4, name: "Rohini Silver Screens", location: "Madurai", ticketPrice: 150 },
  { id: 5, name: "SPI Cinemas", location: "Coimbatore", ticketPrice: 190 }
];

const SHOW_TIMES = ["10:00 AM", "1:00 PM", "4:00 PM", "7:30 PM", "10:30 PM"];

const CONVENIENCE_FEE = 30; // flat fee per booking, in ₹

/* A small, deterministic set of "already booked" seats per
   movie+theatre+date+time combination, purely to demonstrate
   the occupied-seat feature without a backend. */
function getOccupiedSeatsFor(movieId, theatreId, date, time) {
  const seed = (movieId * 31 + theatreId * 17 + date.length + time.length) % 7;
  const rows = ["A", "B", "C", "D"];
  const occupied = [];
  for (let i = 0; i < 4 + seed; i++) {
    const row = rows[(seed + i) % rows.length];
    const col = ((seed * 3 + i * 5) % 8) + 1;
    occupied.push(row + col);
  }
  return [...new Set(occupied)];
}
