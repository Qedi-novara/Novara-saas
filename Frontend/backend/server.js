const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const { analyzeNode } = require("./aiEngine");

const app = express();
app.use(cors());
app.use(express.json());
app.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const existing = users.find(u => u.email === email);

  if (existing) {
    return res.status(400).json({ error: "User already exists" });
  }

  users.push({ email, password });

  res.json({ message: "User created successfully" });
});
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// 🔐 LOGIN (SaaS CORE)
app.post("/login", (req, res) => {

  const { email } = req.body;

  const token = jwt.sign(
    { email },
    "NOVARA_SECRET",
    { expiresIn: "1h" }
  );

  res.json({ token });
});

// 🧠 DATA (LEVEL 8 API)
let nodes = [
  { id: "HARARE", load: 60 },
  { id: "BULAWAYO", load: 50 },
  { id: "MUTARE", load: 70 }
];

// ⚡ REAL TIME ENGINE (LEVEL 7)
wss.on("connection", (ws) => {

  setInterval(() => {

    nodes = nodes.map(n => ({
      ...n,
      load: Math.floor(Math.random() * 100)
    }));

    ws.send(JSON.stringify(nodes.map(analyzeNode)));

  }, 3000);

});

server.listen(3001, () => {
  console.log("NOVARA RUNNING");
});
