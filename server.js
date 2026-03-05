require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const Message = require("./models/Message");
const authRoutes = require("./routes/auth.routes.js");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// ✅ MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected ✅"))
  .catch((err) => console.log("MongoDB Error ❌", err.message));

// ✅ Auth API
app.use("/api/auth", authRoutes);

// ✅ Get chat history (JWT required)
app.get("/messages", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    const msgs = await Message.find().sort({ createdAt: -1 }).limit(50);
    return res.json(msgs.reverse());
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
});

// ✅ Socket auth middleware
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("No token"));

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = user; // {id, username}
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});

// ✅ Realtime chat (saved in DB)
io.on("connection", (socket) => {
  socket.on("chatMessage", async ({ text }) => {
    const msg = await Message.create({
      username: socket.user.username,
      text
    });

    io.emit("chatMessage", { username: msg.username, text: msg.text });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started ✅ http://localhost:${PORT}`));

module.exports = app; // for tests