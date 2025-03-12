class OrderService {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async getOrders() {
    return await this.orderRepository.getOrders('-statusHistory', 'name email');
  }

  async getOrdersCount() {
    const count = await this.orderRepository.getOrdersCount();

    return count;
  }
  async getUserOrders(userId) {
    const orders = await this.orderRepository.findOrdersByUser(userId);
    if (!orders) {
      throw new Error('Product not found', { cause: { status: 404 } });
    }

    const orderStatus = {
      completed: orders.filter((order) => order.status === 'delivered'),
      active: orders.filter(
        (order) => !['cancelled', 'expired', 'delivered'].includes(order.status)
      ),
      cancelled: orders.filter((order) =>
        ['cancelled', 'expired'].includes(order.status)
      ),
    };

    return { total: orders.length, ...orderStatus };
  }

  async getOrderById(orderId) {
    const order = await this.orderRepository.getOrderById(orderId);
    if (!order) {
      throw new Error('Order not found', { cause: { status: 404 } });
    }
    return order;
  }

  async changeOrderStatus(orderId, newStatus) {
    const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];
    if (!newStatus || !validStatuses.includes(newStatus.toLowerCase())) {
      throw new Error('Invalid status value', { cause: { status: 400 } });
    }

    const order = await this.orderRepository.getOrderById(orderId);
    if (!order.statusHistory.includes(order.status)) {
      order.statusHistory.push(order.status);
    }

    const updatedOrder = await this.orderRepository.updateOrder(orderId, {
      status: newStatus,
      statusHistory: order.statusHistory,
    });

    return updatedOrder;
  }

  async deleteOrder(orderId) {
    const order = await this.orderRepository.deleteOrder(orderId);
    if (!order) {
      throw new Error('Order not found', { cause: { status: 404 } });
    }
    // delete order items for this order
    for (const orderItemId of order.orderItems) {
      await this.orderRepository.deleteItemOrders(orderItemId);
    }
  }

  async findOrdersByUser(userId) {
    return await this.orderRepository.findOrdersByUser(userId);
  }
}

module.exports = OrderService;
