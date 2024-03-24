const express = require('express');
const router = express.Router();

// Import your User model
const User = require('../models/User');

// Get all users
router.get('/', async (req, res) => {
  // Fetch users from database here
  const users = await User.find();
  res.json(users);
});

// Add a new user
router.post('/', async (req, res) => {
  // Extract user data from request body
  const { name, email } = req.body;

  // Create a new user
  const user = new User({ name, email });

  // Save the user to the database
  try {
    const newUser = await user.save();
    res.json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;