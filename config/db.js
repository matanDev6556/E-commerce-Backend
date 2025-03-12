const mongoose = require('mongoose');
require('dotenv').config();

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECT_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
