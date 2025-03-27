const ErrorHandler = require('../../../helpers/handle_controllers_error');

class CartController {
  constructor(cartService) {
    this.cartService = cartService;
  }

  getUserCart = async (req, res) => {
    try {
      const userId = req.params.id;
      const userCart = await this.cartService.getUserCart(userId);
      return res.json({ data: userCart });
    } catch (error) {
      return ErrorHandler.handleError(error, res, 'Failed to getUserCart');
    }
  };

  getUserCartCount = async (req, res) => {
    try {
      const userId = req.params.id;
      const cartCount = await this.cartService.getUserCartCount(userId);
      return res.json({ data: cartCount });
    } catch (error) {
      return ErrorHandler.handleError(error, res, error.message);
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
      return ErrorHandler.handleError(error, res, error.message);
    }
  };

  addTocart = async (req, res) => {
    try {
      const userId = req.params.id;
      const cartItem = req.body;

      const newlist = await this.cartService.addTocart(userId, cartItem);
      return res.status(200).json({ data: newlist });
    } catch (error) {
      return ErrorHandler.handleError(error, res, error.message);
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
      return ErrorHandler.handleError(error, res, error.message);
    }
  };

  removeFromCart = async (req, res) => {
    try {
      const userId = req.params.id;
      const cartProductId = req.params.cartProductId;
      const newlist = await this.cartService.removeFromCart(
        userId,
        cartProductId
      );
      return res.status(200).json({ data: newlist });
    } catch (error) {
      return ErrorHandler.handleError(error, res, error.message);
    }
  }
  
  clearCart = async (req, res) => {
    try {
      const userId = req.params.id;
       await this.cartService.clearCart(userId);
      return res.status(200).end();
    } catch (error) {
      return ErrorHandler.handleError(error, res, 'Failed to clear cart');
    }
  };
}

module.exports = CartController;
