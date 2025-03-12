
const CartService = require('./cart.service');
const CartController = require('./cart.controller');
const CartProductRepository = require('./cart_product.repository');

const cartProductRepository = new CartProductRepository();

const createCartService = (userRepository, productRepository) => {
  return new CartService(cartProductRepository, userRepository, productRepository);
};

const createCartController = (cartService) => {
  return new CartController(cartService);
};

module.exports = {
  cartProductRepository,
  createCartService,
  createCartController
};