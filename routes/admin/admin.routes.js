const express = require('express');
const router = express.Router();
const userAdminRoutes = require('./user.admin.routes');
const categoryAdminRoutes = require('./category.admin.routes');
const productAdminRoutes = require('./product.admin.routes');
const orderAdminRoutes = require('./order.admin.routes');

module.exports = (
  userAdminController,
  categoryAdminController,
  orderAdminController,

  productAdminController
) => {
  // Users
  router.use('/users', userAdminRoutes(userAdminController));

  // Categories
  router.use('/categories', categoryAdminRoutes(categoryAdminController));

  // Orders
  router.use('/orders', orderAdminRoutes(orderAdminController));

  // Products
  //router.use('/products', productAdminRoutes(productAdminController));

  return router;
};
