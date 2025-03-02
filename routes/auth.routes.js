const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
  return res.json({ massage: 'hi' });
});
router.post('/login');
router.post('/forgot-password');
router.post('/reset-password');

module.exports = router;
