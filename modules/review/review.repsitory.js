const { Review } = require('./review');

class ReviewRepository {
  async getReviewsByIds(reviewsIds) {
    try {
      return await Review.find({ _id: { $in: reviewsIds } }).sort({ date: -1 });
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async updateReview(id, reviewData) {
    try {
      const updatedReview = await Review.findByIdAndUpdate(id, reviewData, {
        new: true,
      });
      return updatedReview;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async addReview(reviewData) {
    try {
      const newReview = new Review(reviewData);
      return await newReview.save();
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async deleteReviews(reviewsIds) {
    try {
      await Review.deleteMany({ _id: { $in: reviewsIds } });
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }
}

module.exports = ReviewRepository;
