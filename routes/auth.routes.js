const express = require('express');
const router = express.Router();

router.post('/login');

router.post('/register', (req, res) => {
  return res.json({ massage: 'hi' });
});

router.post('/forgot-password');

router.post('/verify-otp');

router.post('/reset-password');

module.exports = router;
