const { Order } = require('./order');
const { OrderItem } = require('./order_item');

class OrderRepossitory {
  async getOrders(selectedFields = undefined, userFields = '') {
    let query = Order.find()
      .sort({ dateOrdered: -1 })
      .populate('user', userFields);

    if (selectedFields) {
      query = query.select(selectedFields.split(',').join(' '));
    }

    return await query.exec();
  }

  async createOrder(orderData) {
    const order = new Order(orderData);
    return await order.save();
  }

  async getOrderById(id) {
    return await Order.findById(id);
  }

  async getOrdersCount() {
    return await Order.countDocuments();
  }

  async findOrdersByUser(userId) {
    return await Order.find({ user: userId });
  }

  async updateOrder(orderId, updateData) {
    return await Order.findByIdAndUpdate(
      orderId,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  

  async createOrderItem(orderItemData) {
    const orderItem = new OrderItem(orderItemData);
    return await orderItem.save();
  }

  async deleteOrder(orderId) {
    return await Order.findByIdAndDelete(orderId);
  }

  async deleteOrdersByUser(userId) {
    return await Order.deleteMany({ user: userId });
  }

  async deleteItemOrders(orderItemId) {
    return await OrderItem.deleteOne({ _id: orderItemId });
  }
}

module.exports = OrderRepossitory;
