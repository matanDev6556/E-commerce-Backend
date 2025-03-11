const express = require('express');
const router = express.Router();
const userAdminRoutes = require('./user.admin.routes');
const categoryAdminRoutes = require('./category.admin.routes');
const orderAdminRoutes = require('./order.admin.routes');
const productAdminRoutes = require('./product.admin.routes');
const {
  userAdminController,
  categoryAdminController,
  orderAdminController,
  productAdminController,
} = require('../../../config/di/di'); 

// Users
router.use('/users', userAdminRoutes(userAdminController));

// Categories
router.use('/categories', categoryAdminRoutes(categoryAdminController));

// Orders
router.use('/orders', orderAdminRoutes(orderAdminController));

// Products
router.use('/products', productAdminRoutes(productAdminController));

module.exports = router;
