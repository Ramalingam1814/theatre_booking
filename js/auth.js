/* ============================================================
   auth.js — Logic for login.html (frontend-only simulated auth)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  renderNavbar("login");

  const existingUser = getCurrentUser();
  if (existingUser) {
    document.getElementById("auth-content").innerHTML = `
      <div class="card" style="text-align:center;">
        <h2>You're already logged in</h2>
        <p>Signed in as <strong>${escapeHtml(existingUser.name)}</strong> (${escapeHtml(existingUser.email)})</p>
        <div class="movie-card-actions" style="justify-content:center;gap:12px;">
          <a class="btn btn-primary" href="my-bookings.html">My Bookings</a>
          <button class="btn btn-outline" id="inline-logout-btn" type="button">Logout</button>
        </div>
      </div>`;
    document.getElementById("inline-logout-btn").addEventListener("click", logoutUser);
    return;
  }

  setupTabs();
  setupLoginForm();
  setupRegisterForm();
});

function setupTabs() {
  const tabs = document.querySelectorAll(".auth-tab");
  const panels = document.querySelectorAll(".auth-panel");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.target).classList.add("active");
    });
  });
}

function setupLoginForm() {
  const form = document.getElementById("login-form");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("login-email");
    const password = document.getElementById("login-password");

    let valid = true;
    valid = validateField(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()), "Please enter a valid email address.") && valid;
    valid = validateField(password, password.value.length >= 6, "Password must be at least 6 characters.") && valid;
    if (!valid) return;

    const users = getRegisteredUsers();
    const user = users.find(u => u.email.toLowerCase() === email.value.trim().toLowerCase() && u.password === password.value);

    if (!user) {
      showNotification("Invalid email or password.", "error");
      validateField(password, false, "Invalid email or password.");
      return;
    }

    setCurrentUser({ name: user.name, email: user.email });
    showNotification(`Welcome back, ${user.name}!`, "success");

    const redirect = getQueryParam("redirect");
    setTimeout(() => (window.location.href = redirect || "my-bookings.html"), 700);
  });
}

function setupRegisterForm() {
  const form = document.getElementById("register-form");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("register-name");
    const email = document.getElementById("register-email");
    const password = document.getElementById("register-password");
    const confirm = document.getElementById("register-confirm");

    let valid = true;
    valid = validateField(name, name.value.trim().length >= 3, "Please enter your full name.") && valid;
    valid = validateField(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()), "Please enter a valid email address.") && valid;
    valid = validateField(password, password.value.length >= 6, "Password must be at least 6 characters.") && valid;
    valid = validateField(confirm, confirm.value === password.value && confirm.value.length > 0, "Passwords do not match.") && valid;
    if (!valid) return;

    const users = getRegisteredUsers();
    if (users.some(u => u.email.toLowerCase() === email.value.trim().toLowerCase())) {
      validateField(email, false, "An account with this email already exists.");
      return;
    }

    const newUser = { name: name.value.trim(), email: email.value.trim(), password: password.value };
    users.push(newUser);
    saveRegisteredUsers(users);
    setCurrentUser({ name: newUser.name, email: newUser.email });

    showNotification("Registration successful! You are now logged in.", "success");
    const redirect = getQueryParam("redirect");
    setTimeout(() => (window.location.href = redirect || "my-bookings.html"), 700);
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
