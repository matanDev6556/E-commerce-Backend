const express = require('express');
const router = express.Router();

const adminRoutes = require('./modules/admin/routes/admin.routes');
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/users.routes');
const categoryRoutes = require('./modules/category/category.routes');
const orderRoutes = require('./modules/order/order.routes');
const productRoutes = require('./modules/product/product.routes');
const checkoutRoutes = require('./modules/checkout/checkout.routes');

router.post(
  `${process.env.API_URL}/checkout/webhook`,
  express.raw({ type: 'application/json' })
);

router.get('/payment-success', (req, res) => {
  console.log('Payment success endpoint hit');
  res.status(200).json({ message: 'Payment successful' });
});

// Endpoint עבור cancelUrl
router.get('/cart', (req, res) => {
  console.log('Cart endpoint hit');
  res.status(200).json({ message: 'Payment cancelled, redirected to cart' });
});

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
