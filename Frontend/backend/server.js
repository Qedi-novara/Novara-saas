app.aapp.use(express.json());
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());

/* =========================
   CONFIG
========================= */

const SECRET = "NOVARA_SECRET_KEY";

/* =========================
   IN-MEMORY DATABASE (TEMP)
   (replace with Supabase later)
========================= */

const users = [];

/* =========================
   REGISTER (SECURE)
========================= */

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const existing = users.find(u => u.email === email);

  if (existing) {
    return res.status(400).json({ error: "User already exists" });
  }

  // HASH PASSWORD (IMPORTANT UPGRADE)
  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({
    email,
    password: hashedPassword
  });

  res.json({ message: "User registered successfully" });
});

/* =========================
   LOGIN (JWT AUTH)
========================= */

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return res.status(401).json({ error: "Invalid password" });
  }

  // CREATE TOKEN
  const token = jwt.sign(
    { email: user.email },
    SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    message: "Login successful",
    token
  });
});

/* =========================
   AUTH MIDDLEWARE (PROTECTED ROUTES)
========================= */

function auth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: "Invalid token" });
  }
}

/* =========================
   PROTECTED TEST ROUTE
========================= */

app.get("/dashboard", auth, (req, res) => {
  res.json({
    message: "Welcome to Novara Dashboard",
    user: req.user
  });
});

/* =========================
   START SERVER
========================= */

app.listen(3000, () => {
  console.log("NOVARA SAAS BACKEND RUNNING");
});
