const express = require('express');
const router = express.Router();

const adminRoutes = require('./admin/admin.routes');
const authRoutes = require('./user/auth.routes');
const userRoutes = require('./user/users.routes');
const categoryRoutes = require('./user/category.routes');
const orderRoutes = require('./user/order.routes');
const productRoutes = require('./user/product.routes');

// auth
router.use('/auth', authRoutes);

//users
router.use('/users', userRoutes);

// category
router.use('/categories', categoryRoutes);

// order
//router.use('/orders', orderRoutes);

//product
router.use('/products', productRoutes);

// admin
router.use('/admin', adminRoutes);

module.exports = router;
