const OrderController = require('./order.controller');
const OrderRepository = require('./order.repository');
const OrderService = require('./order.service');

const orderRepository = new OrderRepository();
const orderService = new OrderService(orderRepository);
const orderController = new OrderController(orderService);

module.exports = {
  orderRepository,
  orderService,
  orderController,
};
