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
      return this.handleError(error, res, 'Failed to leave review');
    }
  };

  getProductReviews = async (req, res) => {
    try {
        const productId = req.params.id;
        const reviews = await this.reviewService.getProductReviews(productId);
        return res.json(reviews);
    } catch (error) {
        return this.handleError(error, res, 'Failed to get reviews of product');
    }
  };

  handleError(error, res, msg) {
    console.error('Error in review controller:', error);
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

module.exports = ReviewController;
