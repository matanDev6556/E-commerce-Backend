const express = require('express');
const { orderController } = require('./di.order');
const router = express.Router();

router.get('/user/:userId',orderController.getUserOrders);
router.get('/:id',orderController.getOrderById);



module.exports = router;

