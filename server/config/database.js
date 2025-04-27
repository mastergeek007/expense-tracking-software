const mongoose = require('mongoose');
require('dotenv').config();

// const MONGO_URI = `mongodb://localhost:27017/${process.env.DATABASE}`; //localhost
const MONGO_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jqheb6c.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`; //live server

const connectToDatabase  = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('Connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
