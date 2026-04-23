async function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await fetch("https://https://novara-backend.onrender.com/register", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ email, password })
  });

  alert("User created");
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("https://YOUR_BACKEND/login", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  localStorage.setItem("token", data.token);

  window.location.href = "dashboard.html";
}
