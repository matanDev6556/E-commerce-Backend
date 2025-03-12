const OrderRepository = require('./order.repository');
const OrderService = require('./order.service');

const orderRepository = new OrderRepository();
const orderService = new OrderService(orderRepository);

module.exports = {
  orderRepository,
  orderService,
  
};
