const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Registration endpoint
router.post("/register", async (req, res) => {
  try {
    const { username, password, fullName, designation } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const user = new User({ fullName, designation, username, password });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
});

// Login endpoint
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await user.isValidPassword(password))) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const userId = user._id;

    const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, userId });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

module.exports = router;
