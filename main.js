// Import necessary modules
const express = require('express');
const app = express();

// const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@deep-dark-dev-174bb6b0.mongo.ondigitalocean.com/${process.env.DATABASE}`;

// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB...'))
//   .catch(err => console.error('Could not connect to MongoDB...', err));

// Middleware to parse JSON bodies
app.use(express.json());

// Database setup for first time run
const setupRouter = require('./routes/setup'); // adjust the path to match your file structure
app.use('/setup', setupRouter);

// Users route
const usersRouter = require('./routes/users'); // adjust the path to match your file structure
app.use('/users', usersRouter);

// Maps route
// app.use('/maps', require('./routes/maps'));

// Items route
// app.use('/items', require('./routes/items'));

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));