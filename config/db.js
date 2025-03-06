const mongoose = require('mongoose');
const { Category } = require('../models/category');
const { Product } = require('../models/product');
const { OrderItem } = require('../models/order_item');
const { Order } = require('../models/order');

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

