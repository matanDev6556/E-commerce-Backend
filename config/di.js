const UserRepository = require('../repositories/user.repository');
const TokenRepository = require('../repositories/token.repository');
const CategoryRepository = require('../repositories/category.repository');
const OrderRepossitory = require('../repositories/order.repository');
const ProductRepository = require('../repositories/product.repository');
const ReviewRepository = require('../repositories/review.repsitory');


const AuthService = require('../services/auth.service');
const UserService = require('../services/user.service');
const TokenService = require('../services/token.service');
const CategoryService = require('../services/category.service');
const OrderService = require('../services/order.service');
const ProductService = require('../services/product.service');


const AuthController = require('../controllers/auth.controller');
const UserController = require('../controllers/user.controller');
const UserAdminController = require('../controllers/admin/user.admin.controller');
const CategoryAdminController = require('../controllers/admin/category.admin.controller');
const OrderAdminController = require('../controllers/admin/order.admin.controller');
const ProductAdminController = require('../controllers/admin/product.admin.controller');
const CategoryController = require('../controllers/category.controller');



// repos
const userRepository = new UserRepository();
const tokenRepository = new TokenRepository();
const categoryRepository = new CategoryRepository();
const orderRepository = new OrderRepossitory();
const productRepository = new ProductRepository();
const reviewRepository = new ReviewRepository();


// services
const categoryService = new CategoryService(categoryRepository);
const orderService = new OrderService(orderRepository);
const authService = new AuthService(userRepository, tokenRepository);
const userService = new UserService(userRepository, tokenRepository,orderRepository);
const productService = new ProductService(productRepository,categoryRepository,reviewRepository);


// controllers
const authController = new AuthController(authService);
const userController = new UserController(userService);
const categoryController = new CategoryController(categoryService);
//controllers - admin
const userAdminController = new UserAdminController(userService);
const categoryAdminController = new CategoryAdminController(categoryService);
const orderAdminController = new OrderAdminController(orderService);
const productAdminController = new ProductAdminController(productService);

const dependencies = {
  authController,
  userController,
  categoryController,
  //admin controllers
  userAdminController,
  categoryAdminController,
  orderAdminController,
  productAdminController,
};

module.exports = dependencies;
