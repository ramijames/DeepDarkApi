const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');

// Import your User model
const User = require('../models/User');

require('dotenv').config();
const nano = require('nano')(`http://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:5984`);

// Use the users database
const dbUsers = 'deep-dark-' + process.env.ENVIRONMENT + '-users';
const users = nano.use(dbUsers);

// express router
const router = express.Router();

// pull the secret key from the environment
const secretKey = process.env.JWT_SECRET;

// Use express-session as middleware
router.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// User login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    // Fetch all users
    const allUsers = await users.list({ include_docs: true });

    // Find user by username
    const user = allUsers.rows.find(row => row.doc.username === username);

    // Check if user exists
    if (!user || user.doc._deleted) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the password
    if (!bcrypt.compareSync(password, user.doc.password)) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Store the user's ID in the session
    req.session.userId = user.id;

    // Respond with the user
    res.json(user.doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// User logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }

    res.clearCookie('connect.sid'); // Clear the session cookie
    res.json({ message: 'Logged out' });
  });
});

// Get current user
router.get('/current', async (req, res) => {
  // Check if user is logged in
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  // Find user by ID
  const user = await User.findById(req.session.userId);

  // Check if user exists
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Let's not send the user's password in the response
  delete user.password;

  // Respond with user information
  res.json(user);
});

module.exports = router;