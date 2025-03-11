// modules/order/index.js
const OrderRepository = require('./order.repository');
const OrderService = require('./order.service');
const OrderAdminController = require('../admin/controllers/order.admin.controller');

const orderRepository = new OrderRepository();
const orderService = new OrderService(orderRepository);
const orderAdminController = new OrderAdminController(orderService);

module.exports = {
  orderRepository,
  orderService,
  orderAdminController,
};
