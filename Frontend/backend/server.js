const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   CONFIG
========================= */
const SECRET = "NOVARA_SECRET_KEY";

/* =========================
   TEMP DATABASE (IN MEMORY)
========================= */
const users = [];

/* =========================
   REGISTER (ADVANCED + WORKING)
========================= */
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  // check if user exists
  const exists = users.find(u => u.email === email);
  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  try {
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save user
    users.push({
      email,
      password: hashedPassword
    });

    res.json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error registering user" });
  }
});

/* =========================
   LOGIN (JWT AUTH)
========================= */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  try {
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { email: user.email },
      SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
});

/* =========================
   AUTH MIDDLEWARE
========================= */
function auth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
}

/* =========================
   PROTECTED ROUTE (TEST)
========================= */
app.get("/dashboard", auth, (req, res) => {
  res.json({
    message: "Welcome to Novara Dashboard",
    user: req.user
  });
});

/* =========================
   ROOT TEST (OPTIONAL)
========================= */
app.get("/", (req, res) => {
  res.send("Novara backend is running");
});

/* =========================
   START SERVER
========================= */
app.listen(3000, () => {
  console.log("NOVARA ADVANCED BACKEND RUNNING ON PORT 3000");
});
