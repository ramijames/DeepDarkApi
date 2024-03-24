// Import necessary modules
const express = require('express');
const app = express();

mongoose.connect('mongodb://localhost/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Middleware to parse JSON bodies
app.use(express.json());

// Users route
app.use('/users', require('./routes/users'));

// Maps route
// app.use('/maps', require('./routes/maps'));

// Items route
// app.use('/items', require('./routes/items'));

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));