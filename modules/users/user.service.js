class UserService {
  constructor(userRepository, tokenRepository, orderRepository,paymentRepository) {
    this.userRepository = userRepository;
    this.tokenRepository = tokenRepository;
    this.orderRepository = orderRepository;
    this.paymentRepository = paymentRepository;
  }
  async getUsers() {
    const users = await this.userRepository.getUsers();
    console.log('Fetching all users...');
    return users;
  }

  async getUserById(userId, selectedFields) {
    const user = await this.userRepository.findById(userId, selectedFields);
    if (!user) throw new Error('User not found', { cause: { status: 404 } });
    return user;
  }

  async getPaymentProfile(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found', { cause: { status: 404 } });
    else if (!user.paymentCustomerId) {
      throw new Error('User has no payment profile', { cause: { status: 404 } });
    }

    const session = await this.paymentRepository.getPaymentProfile(user.paymentCustomerId); 
    return { url: session.url };
  }

  async updateUser(id, userData) {
    const user = await this.userRepository.update(id, userData);
    if (!user) throw new Error('User not found', { cause: { status: 404 } });
    return user;
  }

  async getUserCount() {
    return await this.userRepository.getUsersCount();
  }
  async deleteUser(userId) {
    console.log(`🔍 Checking if user ${userId} exists`);
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found', { cause: { status: 404 } });

    // find the orders of user
    const orders = await this.orderRepository.findOrdersByUser(userId);

    // delete all the order items of spetsific order
    for (const order of orders) {
      console.log(`🗑 Deleting order ${order._id} for user ${userId}`);
      for (const orderItemId of order.orderItems) {
        console.log(
          `🚮 Deleting order item ${orderItemId} from order ${order._id}`
        );
        await this.orderRepository.deleteItemOrders(orderItemId);
      }
    }

    // delete all the orders of the user
    console.log(`🗑 Deleting orders for user ${userId}`);
    await this.orderRepository.deleteOrdersByUser(userId);

    console.log(`🗑 Deleting cart products for user ${userId}`);
    for (const cartId of user.cart) {
      console.log(`🗑 Deleting cart product ${cartId} for user ${userId}`);
      await this.cartRepository.removeCartProduct(cartId);
    }

    console.log(`🗑 Deleting user token for user ${userId}`);
    await this.tokenRepository.deleteByUserId(userId);

    console.log(`🗑 Deleting user ${userId}`);
    await this.userRepository.deleteUser(userId);

    return { message: 'User deleted successfully' };
  }
}

module.exports = UserService;
