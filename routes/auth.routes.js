const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middlewares/validation.mid');
const { check } = require('express-validator');


const validateUser = [
  body('name').not().isEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('password')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/)
    .withMessage('Password must be strong'),
  body('phone').isMobilePhone().withMessage('Invalid phone number'),
];

module.exports = (authController) => {
  router.post('/register', validate(validateUser), authController.register);

  router.post('/login', authController.login);

  router.get('/verify-token', authController.verifyToken);

  router.post('/forgot-password', authController.forgotPassword);

  router.post('/verify-otp', authController.verifyPasswordResetOTP);

  router.post(
    '/reset-password',
    [
      check('email').isEmail().normalizeEmail(),
      check('newPassword').isLength({ min: 6 }),
    ],
    authController.resetPassword
  );

  return router;
};
