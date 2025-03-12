const ErrorHandler = require('../../helpers/handle_controllers_error');

class ReviewController {
  constructor(reviewService) {
    this.reviewService = reviewService;
  }

  leaveReview = async (req, res) => {
    try {
      const productId = req.params.id;
      const reviewData = req.body;
      const result = await this.reviewService.leaveReview(
        productId,
        reviewData
      );
      return res.status(201).json(result);
    } catch (error) {
      return ErrorHandler.handleError(error, res, 'Failed to leave review');
    }
  };

  getProductReviews = async (req, res) => {
    try {
        const productId = req.params.id;
        const reviews = await this.reviewService.getProductReviews(productId);
        return res.json(reviews);
    } catch (error) {
        return ErrorHandler.handleError(error, res, 'Failed to get reviews of product');
    }
  };


}

module.exports = ReviewController;
