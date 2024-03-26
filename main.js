// Import necessary modules
const express = require('express');
const app = express();
const cors = require('cors');

// Middleware to parse JSON bodies
app.use(express.json());

// Allowing CORS
app.use(cors());

// Database setup for first time run
const setupRouter = require('./routes/setup'); // adjust the path to match your file structure
app.use('/setup', setupRouter);

// Users route
const usersRouter = require('./routes/users'); // adjust the path to match your file structure
app.use('/users', usersRouter);

// Auth route
const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

// Maps route
// app.use('/maps', require('./routes/maps'));

// Items route
// app.use('/items', require('./routes/items'));

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));