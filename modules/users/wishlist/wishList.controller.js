const ErrorHandler = require('../../../helpers/handle_controllers_error');

class WishListController {
  constructor(wishlistService) {
    this.wishlistService = wishlistService;
  }

  getUserWishList = async (req, res) => {
    try {
      const userId = req.params.id;
      const wishlist = await this.wishlistService.getUserWishList(userId);
      return res.json(wishlist);
    } catch (error) {
      return ErrorHandler.handleError(error, res, 'Failed to getUserWishList');
    }
  };

  addToWishList = async (req, res) => {
    try {
      const productId = req.body.productId;
      const userId = req.params.id;
      await this.wishlistService.addToWishList(userId, productId);
      return res.status(200).end();
    } catch (error) {
      return ErrorHandler.handleError(error, res, 'Failed to addToWishList');
    }
  };

  removeFromWishList = async (req, res) => {
    try {
      const userId = req.params.id;
      const productId = req.params.productId;
      
      await this.wishlistService.removeFromWishList(userId, productId);
      return res.status(204).end();
    } catch (error) {
      return ErrorHandler.handleError(error, res, 'Failed to removeFromWishList');
    }
  };


}

module.exports = WishListController;
