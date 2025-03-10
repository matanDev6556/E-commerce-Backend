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
      return this.handleError(error, res, 'Failed to getUserWishList');
    }
  };

  addToWishList = async (req, res) => {
    try {
      const productId = req.body.productId;
      const userId = req.params.id;
      await this.wishlistService.addToWishList(userId, productId);
      return res.status(200).end();
    } catch (error) {
      return this.handleError(error, res, 'Failed to addToWishList');
    }
  };

  removeFromWishList = async (req, res) => {
    try {
      const userId = req.params.id;
      const productId = req.params.productId;
      
      await this.wishlistService.removeFromWishList(userId, productId);
      return res.status(204).end();
    } catch (error) {
      return this.handleError(error, res, 'Failed to removeFromWishList');
    }
  };

  handleError(error, res, msg) {
    console.error('Error in wish list controller:', error);
    const status = error.cause?.status || 500;
    const message = msg;
    const errorDetails = error.message;

    return res.status(status).json({
      success: false,
      message,
      errorDetails,
    });
  }
}

module.exports = WishListController;
