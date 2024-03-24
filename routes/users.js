const express = require('express');
const router = express.Router();

// Import your User model
const User = require('../models/User');

require('dotenv').config();
const nano = require('nano')(`http://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:5984`);

// Use the users database
const dbUsers = 'deep-dark-' + process.env.ENVIRONMENT + '-users';
const users = nano.use(dbUsers);

// Create a test user
router.get('/createtestuser', async (req, res) => {
  try {
    const user = await users.insert(
      { username: 'testuser1', 
        password: 'testpassword', 
        email: 'test1@example.com' 
      }, 'testuser1');
    console.log('User created');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

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
    const user = await users.insert({ username, password, email }, username);
    res.json(user);
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

module.exports = router;