const UserRepository = require('../repositories/user.repository');
const TokenRepository = require('../repositories/token.repository');
const CategoryRepository = require('../repositories/category.repository');
const OrderRepossitory = require('../repositories/order.repository');

const AuthService = require('../services/auth.service');
const UserService = require('../services/user.service');
const TokenService = require('../services/token.service');
const CategoryService = require('../services/category.service');
const OrderService = require('../services/order.service');

const AuthController = require('../controllers/auth.controller');
const UserController = require('../controllers/user.controller');
const UserAdminController = require('../controllers/admin/user.admin.controller');
const CategoryAdminController = require('../controllers/admin/category.admin.controller');
const OrderAdminController = require('../controllers/admin/order.admin.controller');

// repos
const userRepository = new UserRepository();
const tokenRepository = new TokenRepository();
const categoryRepository = new CategoryRepository();
const orderRepository = new OrderRepossitory();

// services

const tokenService = new TokenService(tokenRepository, userRepository);
const categoryService = new CategoryService(categoryRepository);
const orderService = new OrderService(orderRepository);
const authService = new AuthService(userRepository, tokenRepository);
const userService = new UserService(userRepository, tokenRepository,orderRepository);
// controllers
const authController = new AuthController(authService);
const userController = new UserController(userService);
//controllers - admin
const userAdminController = new UserAdminController(userService);
const categoryAdminController = new CategoryAdminController(categoryService);
const orderAdminController = new OrderAdminController(orderService);

const dependencies = {
  authController,
  userController,
  userAdminController,
  categoryAdminController,
  orderAdminController,
};

module.exports = dependencies;
