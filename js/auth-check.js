// js/auth-check.js

// ---- Auth state read (localStorage mock) ----
const user = JSON.parse(localStorage.getItem("loggedInUser") || "null");

// किस पेज पर हैं?
const path = (location.pathname || "").toLowerCase();
const isLoginPage = path.endsWith("/login.html") || path.endsWith("login.html");

// ---- Common auth guard (login page पर नहीं चलना चाहिए) ----
if (!isLoginPage && !user) {
  alert("Please login first.");
  window.location.href = "login.html";
}

// ---- Role-based access helper (protected pages में कॉल करें) ----
// example: requireRole("Admin")
function requireRole(role) {
  if (!user) {
    alert("Please login first.");
    window.location.href = "login.html";
    return;
  }
  if ((user.role || "").toLowerCase() !== (role || "").toLowerCase()) {
    alert(`Access Denied: Only ${role}s allowed.`);
    window.location.href = "login.html";
  }
}

// ---- Login page form handler (guarded: केवल login.html पर) ----
const form = document.getElementById("authForm");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const authType = document.getElementById("authType").value;
    const name = (document.getElementById("name").value || "").trim();
    const email = (document.getElementById("email").value || "").trim();
    const password = (document.getElementById("password").value || "").trim();
    const role = (document.getElementById("role").value || "").trim();
    const msg = document.getElementById("msg");

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const existingUser = users.find(u => (u.email || "").toLowerCase() === email.toLowerCase());

    // ---- LOGIN ----
    if (authType === "login") {
      if (!email || !password) {
        alert("Please fill Email and Password.");
        return;
      }
      if (!existingUser || existingUser.password !== password) {
        alert("Invalid credentials or user not registered.");
        return;
      }

      localStorage.setItem("loggedInUser", JSON.stringify(existingUser));
      if (msg) msg.textContent = "Login successful. Redirecting…";
      // TODO: बाद में role के हिसाब से redirect करेंगे
      window.location.href = "profile.html";
      return;
    }

    // ---- SIGNUP ----
    if (authType === "signup") {
      if (!name) {
        alert("Name is required for Sign Up.");
        return;
      }
      if (!email || !password) {
        alert("Please fill Email and Password.");
        return;
      }
      if (!role) {
        alert("Please select a Role (Client / Freelancer / Admin).");
        return;
      }
      if (existingUser) {
        alert("User already exists. Please login.");
        return;
      }

      const newUser = { name, email, password, role };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("loggedInUser", JSON.stringify(newUser));

      if (msg) msg.textContent = "Signup successful. Redirecting…";
      // TODO: बाद में role के हिसाब से redirect करेंगे
      window.location.href = "profile.html";
    }
  });
}
