const { Review } = require('../models/review');

class ReviewRepository {
  async getReviewsById(id) {
    try {
      return await Review.find({ id });
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async updateReview(id, reviewData) {
    try {
      const updatedReview = await Review.findByIdAndUpdate(id, reviewData, { new: true });
      return updatedReview;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async deleteReviews(reviewsIds) {
    try {
      await Review.deleteMany({_id:{$in: reviewsIds}});
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }
}

module.exports = ReviewRepository;
