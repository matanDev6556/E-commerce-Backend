class OrderService {
  constructor(orderRepository, orderItemRepository) {
    this.orderRepository = orderRepository;
  }

  async getOrders() {
    return await this.orderRepository.getOrders('-statusHistory', 'name email');
  }

  async getOrdersCount() {
    const count = await this.orderRepository.getOrdersCount();

    return count;
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

    try {
      const updatedOrder = await this.orderRepository.updateOrder(orderId, {
        status: newStatus,
        statusHistory: order.statusHistory,
      });

      return updatedOrder;
    } catch (error) {
      throw error;
    }
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
}

module.exports = OrderService;
