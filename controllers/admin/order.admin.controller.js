class OrderAdminController {
  constructor(orderService) {
    this.orderService = orderService;
  }

  getOrders = async (req, res) => {
    try {
    } catch (error) {}
  };

  getOrdersCount = async (req, res) => {
    try {
      res.json({ count });
    } catch (error) {}
  };

  changeOrderStatus = async (req, res) => {
    try {
    } catch (error) {}
  };
}

module.exports = OrderAdminController;
