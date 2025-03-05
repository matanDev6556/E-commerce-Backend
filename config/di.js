const UserRepository = require('../repositories/user.repository');
const TokenRepository = require('../repositories/token.repository');
const CategoryRepository = require('../repositories/category.repository');

const AuthService = require('../services/auth.service');
const UserService = require('../services/user.service');
const TokenService = require('../services/token.service');
const CategoryService = require('../services/category.service');


const AuthController = require('../controllers/auth.controller');
const UserController = require('../controllers/user.controller');
const UserAdminController = require('../controllers/admin/user.admin.controller');
const CategoryAdminController = require('../controllers/admin/category.admin.controller');

// repos
const userRepository = new UserRepository();
const tokenRepository = new TokenRepository();
const categoryRepository = new CategoryRepository();
// services
const authService = new AuthService(userRepository, tokenRepository);
const userService = new UserService(userRepository, tokenRepository);
const tokenService = new TokenService(tokenRepository, userRepository);
const categoryService = new CategoryService(categoryRepository);
// controllers
const authController = new AuthController(authService);
const userController = new UserController(userService);
//controllers - admin
const userAdminController = new UserAdminController(userService);
const categoryAdminController = new CategoryAdminController(categoryService);

const dependencies = {
  authController,
  userController,
  userAdminController,
  categoryAdminController
};

module.exports = dependencies;
