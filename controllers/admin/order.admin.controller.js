class OrderAdminController {
  constructor(orderService) {
    this.orderService = orderService;
  }

  getOrders = async (_, res) => {
    try {
      const orders = await this.orderService.getOrders();
      return res.json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (error.cause?.status) {
        return res
          .status(error.cause.status)
          .json({ success: false, message: error.message });
      }

      return res.status(500).json({ message: 'Error retrieving orders' });
    }
  };

  getOrdersCount = async (_, res) => {
    try {
      const count = await this.orderService.getOrdersCount();
      return res.json(count);
    } catch (error) {
      console.error('Error fetching orders count:', error);
      if (error.cause?.status) {
        return res
          .status(error.cause.status)
          .json({ success: false, message: error.message });
      }
      return res.status(500).json({ message: 'Error retrieving orders count' });
    }
  };

  changeOrderStatus = async (req, res) => {
    try {
      const id = req.params.id;
      const { status } = req.body;
      const order = await this.orderService.changeOrderStatus(id, status);
      res.json(order);
    } catch (error) {
      console.error('Error changing order status:', error);
      if (error.cause?.status) {
        return res
          .status(error.cause.status)
          .json({ success: false, message: error.message });
      }
      return res.status(500).json({ message: 'Error changing order status' });
    }
  };

  deleteOrder = async (req, res) => {
    try {
      const id = req.params.id;
      await this.orderService.deleteOrder(id);
      return res.json(204).end();
    } catch (error) {
      console.error('Error deleting order:', error);
      if (error.cause?.status) {
        return res
          .status(error.cause.status)
          .json({ success: false, message: error.message });
      }
      return res.status(500).json({ message: 'Error deleting order' });
    }
  };
}

module.exports = OrderAdminController;
