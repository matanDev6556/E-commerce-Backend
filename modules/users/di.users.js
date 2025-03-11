const UserRepository = require('./user.repository');
const UserService = require('./user.service');
const UserController = require('./user.controller');

const userRepository = new UserRepository();

const createUserService = (tokenRepository, orderRepository) => {
  return new UserService(userRepository, tokenRepository, orderRepository);
};

const createUserController = (userService) => {
  return new UserController(userService);
};

module.exports = {
  userRepository,
  createUserService,
  createUserController
};