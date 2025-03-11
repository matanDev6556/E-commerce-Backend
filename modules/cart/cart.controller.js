const ErrorHandler = require('../../helpers/handle_controllers_error');

class CartController {
  constructor(cartService) {
    this.cartService = cartService;
  }

  getUserCart = async (req, res) => {
    try {
      const userId = req.params.id;
      const userCart = await this.cartService.getUserCart(userId);
      return res.json(userCart);
    } catch (error) {
      return ErrorHandler.handleError(error, res, 'Failed to getUserCart');
    }
  };

  getUserCartCount = async (req, res) => {
    try {
      const userId = req.params.id;
      const cartCount = await this.cartService.getUserCartCount(userId);
      return res.json(cartCount);
    } catch (error) {
      return ErrorHandler.handleError(error, res, 'Failed to getUserCartCount');
    }
  };

  getCartProductById = async (req, res) => {
    try {
      const cartProductId = req.params.cartProductId;
      const cartProduct = await this.cartService.getCartProductById(
        cartProductId
      );
      return res.json(cartProduct);
    } catch (error) {
      return ErrorHandler.handleError(
        error,
        res,
        'Failed to gerCartProductById'
      );
    }
  };

  addTocart = async (req, res) => {
    try {
      const userId = req.params.id;
      const cartItem = req.body;

      const updatedCart = await this.cartService.addTocart(userId, cartItem);
      return res.status(200).json(updatedCart);
    } catch (error) {
      return ErrorHandler.handleError(error, res, 'Failed to addTocart');
    }
  };

  modifyProductQuantity = async (req, res) => {
    try {
      const userId = req.params.id;
      const cartProductId = req.params.cartProductId;
      const { quantity } = req.body;

      const updatedProduct = await this.cartService.modifyProductQuantity(
        userId,
        cartProductId,
        quantity
      );
      return res.json(updatedProduct);
    } catch (error) {
      return ErrorHandler.handleError(
        error,
        res,
        'Failed to modifyProductQuantity'
      );
    }
  };

  removeFromCart = async (req, res) => {
    try {
      const userId = req.params.id;
      const cartProductId = req.params.cartProductId;
      await this.cartService.removeFromCart(userId, cartProductId);
      return res.status(204).end();
    } catch (error) {
      return ErrorHandler.handleError(error, res, 'Failed to removeFromCart');
    }
  };
}

module.exports = CartController;
