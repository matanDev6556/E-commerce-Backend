const express = require('express');
const router = express.Router();
const {
  authController,
  userController,
  userAdminController,
  categoryAdminController,
  orderAdminController,
  //productAdminController,
} = require('../config/di');
const authRoutes = require('./auth.routes');
const userRoutes = require('./users.routes');
const adminRoutes = require('./admin/admin.routes');

// auth
const authRouter = authRoutes(authController);
router.use('/auth', authRouter);

//users
const userRouter = userRoutes(userController);
router.use('/users', userRouter);

// admin
const adminRouter = adminRoutes(
  userAdminController,
  categoryAdminController,
  orderAdminController
  //productAdminController,
);
router.use('/admin', adminRouter);

module.exports = router;
