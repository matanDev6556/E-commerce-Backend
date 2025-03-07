const express = require('express');
const router = express.Router();
const {
  authController,
  userController,
  userAdminController,
  categoryAdminController,
  orderAdminController,
  productAdminController,
  categoryController,
} = require('../config/di');
const adminRoutes = require('./admin/admin.routes');
const authRoutes = require('./auth.routes');
const userRoutes = require('./users.routes');
const categoryRoutes = require('./category.routes');


// auth
const authRouter = authRoutes(authController);
router.use('/auth', authRouter);

//users
const userRouter = userRoutes(userController);
router.use('/users', userRouter);

// category
const categoryRouter = categoryRoutes(categoryController);
router.use('/category', categoryRouter);

// admin
const adminRouter = adminRoutes(
  userAdminController,
  categoryAdminController,
  orderAdminController,
  productAdminController
);
router.use('/admin', adminRouter);

module.exports = router;
