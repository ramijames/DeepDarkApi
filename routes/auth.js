const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Assuming you have a User model

const router = express.Router();

const secretKey = process.env.JWT_SECRET;

// User login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  const user = await User.findOne({ username });

  // Check if user exists and password is correct
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // Generate JWT
  const token = jwt.sign({ username: user.username }, secretKey);

  res.json({ token });
});

// User registration would go here

module.exports = router;