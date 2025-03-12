const CheckoutController = require('./checkout.controller');
const CheckoutService = require('./chekout.service');
const StripePaymentRepository = require('./stripePayment.repository');

const stripeRepository = new StripePaymentRepository();

// service
const createCheckoutService = (userRepository, productRepository,orderRepository) => {
  return new CheckoutService(userRepository, productRepository, stripeRepository,orderRepository);
};

//controller
const createCheckoutController = (checkoutService, jwtService) => {
  return new CheckoutController(checkoutService, jwtService);
};

module.exports = {
  stripeRepository,
  createCheckoutService,
  createCheckoutController,
};
