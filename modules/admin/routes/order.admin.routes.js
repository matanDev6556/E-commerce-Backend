const express = require('express');
const router = express.Router();


module.exports = (orderAdminController) => {
  //orders
  router.get('/', orderAdminController.getOrders);
  router.get('/count', orderAdminController.getOrdersCount);
  router.put('/:id', orderAdminController.changeOrderStatus);
  router.delete('/:id', orderAdminController.deleteOrder);
  
  return router;
};

