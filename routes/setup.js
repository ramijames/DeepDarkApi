const express = require('express');
const router = express.Router();
require('dotenv').config();
const nano = require('nano')(`http://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:5984`);

const dbUsers = 'deep-dark-' + process.env.ENVIRONMENT + '-users';

// Get all users
router.get('/first-time', async (req, res) => {
  // Fetch users from database here
  nano.db.create(dbUsers)
    .then(() => console.log('Database created'))
    .catch(err => console.error(err));
  res.status(200).json({ message: 'Database created' });
});

// // Import your User model
// const User = require('../models/User');

// // Create a test user
// router.get('/createtestuser', async (req, res) => {
//   const user = new User({
//     username: 'testuser',
//     password: 'testpassword',
//     email: 'test@example.com'
//   });
  
//   user.save()
//     .then(() => console.log('User created'))
//     .catch(err => console.error(err));

//     res.json(user);
// });


// // Get all users
// router.get('/', async (req, res) => {
//   // Fetch users from database here
//   const users = await User.find();
//   res.json(users);
// });

// // Add a new user
// router.post('/', async (req, res) => {
//   // Extract user data from request body
//   const { name, email } = req.body;

//   // Create a new user
//   const user = new User({ name, email });

//   // Save the user to the database
//   try {
//     const newUser = await user.save();
//     res.json(newUser);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

module.exports = router;