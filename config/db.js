const mongoose = require('mongoose');
const { Category } = require('../modules/category/category');
const { Product } = require('../modules/product/product');
const { OrderItem } = require('../modules/order/order_item');
const { Order } = require('../modules/order/order');

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
