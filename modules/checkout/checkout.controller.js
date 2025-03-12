const ErrorHandler = require('../../helpers/handle_controllers_error');

class CheckoutController {
  constructor(checkoutService, jwtService) {
    this.checkoutService = checkoutService;
    this.jwtService = jwtService;
  }

  checkout = async (req, res) => {
    const accessToken = req
      .header('Authorization')
      .replace('Bearer', '')
      .trim();
    const tokenData = this.jwtService.decodeToken(accessToken);
    const userId = tokenData.id;
    try {
      const result = await this.checkoutService.checkout(
        userId,
        req.body.cartItems
      );
      return res.status(201).json(result).end();
    } catch (error) {
      return ErrorHandler.handleError(error, res, 'Failed checkout');
    }
  };

  handleWebhook = async (req, res) => {
    const signature = req.headers['stripe-signature'];

    try {
      const event = await this.checkoutService.handleWebhook(
        req.body,
        signature
      );
      return res.status(200).json({ received: true, event: event });
    } catch (error) {
      return ErrorHandler.handleError(error, res, 'Failed webhook');
    }
  };
}

module.exports = CheckoutController;
