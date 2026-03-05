const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
    
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Missing fields" });

    const exists = await User.findOne({ username });
    if (exists) return res.status(409).json({ message: "User already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ username, passwordHash });

    return res.status(201).json({ message: "Registered" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, username },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({ message: "Login success", token });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;