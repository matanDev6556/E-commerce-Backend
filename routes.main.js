const express = require('express');
const router = express.Router();

const adminRoutes = require('./modules/admin/routes/admin.routes');
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/users.routes');
const categoryRoutes = require('./modules/category/category.routes');
const orderRoutes = require('./modules/order/order.routes');
const productRoutes = require('./modules/product/product.routes');
const checkoutRoutes = require('./modules/checkout/checkout.routes');

// admin
router.use('/admin', adminRoutes);

// auth
router.use('/auth', authRoutes);

//users
router.use('/users', userRoutes);

// category
router.use('/categories', categoryRoutes);

//product
router.use('/products', productRoutes);

// order
router.use('/orders', orderRoutes);

// checkout
router.use('/checkout', checkoutRoutes);



module.exports = router;
