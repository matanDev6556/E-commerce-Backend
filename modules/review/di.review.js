const ReviewRepository = require('./review.repsitory');
const ReviewService = require('./review.service');
const ReviewController = require('./review.controller');

const reviewRepository = new ReviewRepository();

const createReviewService = (productRepository, userRepository) => {
  return new ReviewService(reviewRepository, productRepository, userRepository);
};

const createReviewController = (reviewService) => {
  return new ReviewController(reviewService);
};

module.exports = {
  reviewRepository,
  createReviewService,
  createReviewController
};