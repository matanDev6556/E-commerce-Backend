class UserService {
  constructor(userRepository, tokenRepository) {
    this.userRepository = userRepository;
    this.tokenRepository = tokenRepository;
  }

  async getUsers() {
    const users = await this.userRepository.getUsers();
    console.log('Fetching all users...');
    return users;
  }

  async getUserById(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found', { cause: { status: 404 } });
    return user;
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
    console.log('user service - Deleting user..', userId);
    const user = await this.userRepository.findById(userId);
    console.log('user- ', user);
    if (!user) throw new Error('User not found', { cause: { status: 404 } });
    //TODO: delete orders/cart_products of user

    await this.tokenRepository.deleteToken(user.id);
    await this.userRepository.deleteUser(user.id);

    return user;
  }
}

module.exports = UserService;
