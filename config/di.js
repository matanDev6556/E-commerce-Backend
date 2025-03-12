// dependencies.js
const users = require('../modules/users/di.users');
const auth = require('../modules/auth/di.auth');
const category = require('../modules/category/di.category');
const order = require('../modules/order/di.order');
const product = require('../modules/product/di.product');
const review = require('../modules/review/di.review');
const wishlist = require('../modules/wishlist/di.wishlist');
const cart = require('../modules/cart/di.cart');
const admin = require('../modules/admin/di.admin');
const checkout = require('../modules/checkout/di.checkout');

// Create services with required dependencies
const userService = users.createUserService(
  auth.tokenRepository,
  order.orderRepository
);

const authService = auth.createAuthService(users.userRepository);

const productService = product.createProductService(
  category.categoryRepository,
  review.reviewRepository
);

const reviewService = review.createReviewService(
  product.productRepository,
  users.userRepository
);

const wishlistService = wishlist.createWishlistService(
  users.userRepository,
  product.productRepository
);

const cartService = cart.createCartService(
  users.userRepository,
  product.productRepository
);

const checkoutService = checkout.createCheckoutService(
  users.userRepository,
  product.productRepository,
  order.orderRepository
);

// Create controllers
const authController = auth.createAuthController(authService);
const userController = users.createUserController(userService);
const productController = product.createProductController(productService);
const reviewController = review.createReviewController(reviewService);
const wishListController = wishlist.createWishListController(wishlistService);
const cartController = cart.createCartController(cartService);
const checkoutController = checkout.createCheckoutController(
  checkoutService,
  auth.jwtService
);

// Create admin controllers
const adminControllers = admin.createAdminControllers(
  userService,
  category.categoryService,
  order.orderService,
  productService
);

// Export all required dependencies
const dependencies = {
  //  Controllers
  authController,
  userController,
  wishListController,
  cartController,
  categoryController: category.categoryController,
  productController,
  reviewController,
  checkoutController,
  // Admin Controllers
  userAdminController: adminControllers.userAdminController,
  categoryAdminController: adminControllers.categoryAdminController,
  orderAdminController: adminControllers.orderAdminController,
  productAdminController: adminControllers.productAdminController,
};

module.exports = dependencies;
