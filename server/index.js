const connectToDatabase = require('./config/database');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());

const port = 5000;
const routes = require('./routes/routes');

app.use(cors({ origin: '*' })); // Enable CORS for all routes
app.use('/', routes);

// Connect to the database
connectToDatabase();

app.get('/', (req, res) => {
  res.send('Welcome to Expense Tracking Software Server!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
