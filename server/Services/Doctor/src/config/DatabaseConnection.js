const mongoose = require('mongoose');
const config = require('./Config');
const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;