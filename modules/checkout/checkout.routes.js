const express = require('express');
const { checkoutController } = require('../../config/di');
const router = express.Router();


router.post('/',checkoutController.checkout);
router.post('/webhook',checkoutController.handleWebhook);


module.exports = router;