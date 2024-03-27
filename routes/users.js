const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// Import your User model
const User = require('../models/User');

require('dotenv').config();
const nano = require('nano')(`http://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:5984`);

// Use the users database
const dbUsers = 'deep-dark-' + process.env.ENVIRONMENT + '-users';
const users = nano.use(dbUsers);

// Get all users
router.get('/', async (req, res) => {
  try {
    const allUsers = await users.list({ include_docs: true });
    console.log(allUsers);
    const userList = allUsers.rows.map(row => row.doc); // Changed variable name to userList
    res.json(userList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Create a new user
router.post('/create', async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Username, password, and email are required' });
  }

  try {
    // Fetch all users
    const allUsers = await users.list({ include_docs: true });

    // Check if username or email already exists
    const userExists = allUsers.rows.some(row => row.doc.username === username || row.doc.email === email);

    if (userExists) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create a new user
    const user = { username, password: hashedPassword, email };

    // Save the user to the database
    const response = await users.insert(user);

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update a user's email
router.put('/update', async (req, res) => {
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({ error: 'Username and email are required' });
  }

  try {
    // Get the user from the database
    const user = await users.get(username);

    // Update the user's email
    user.email = email;

    // Save the updated user back to the database
    const updatedUser = await users.insert(user);

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// TODO: Limit and paging doesn't work with nano (apparently)
// I need a different solution for this
router.get('/users', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10; // Default limit is 10
  const skip = parseInt(req.query.skip) || 0; // Default skip is 0

  try {
    const allUsers = await users.list({ include_docs: true, limit, skip });
    const userList = allUsers.rows.map(row => row.doc);
    res.json(userList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

module.exports = router;