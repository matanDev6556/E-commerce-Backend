class ReviewService {
  constructor(reviewRepository, productRepository, userRepository) {
    this.reviewRepository = reviewRepository;
    this.productRepository = productRepository;
    this.userRepository = userRepository;
  }

  async leaveReview(productId, reviewData) {
    // get the user that add review for the product
    const user = await this.userRepository.findById(reviewData.user);
    if (!user) throw new Error('Invaild user!', { cause: { status: 404 } });

    // add the new review to db
    const review = await this.reviewRepository.addReview({
      ...reviewData,
      userName: user.name,
    });

    if (!review)
      throw new Error('Failed to add review!', { cause: { status: 400 } });

    // get the product and add the new review id to his reviews list
    let product = await this.productRepository.getProductById(productId);
    if (!product)
      throw new Error('Invaild product!', { cause: { status: 404 } });

    product.reviews.push(review.id);
    product.numberOfReviews++;
    const updatedProduct =  await this.productRepository.updateProduct(productId,product);
    if (!updatedProduct)
        throw new Error('Internal Server Error!', { cause: { status: 500 } });

    return {updatedProduct,review};
  }

  async getProductReviews(productId){
    let product = await this.productRepository.getProductById(productId);
    if (!product)
        throw new Error('Invaild product!', { cause: { status: 404 } });

    // get all the reviews for the product
    const reviews = await this.reviewRepository.getReviewsByIds(product.reviews);
    if (!reviews)
        throw new Error('Failed to get reviews!', { cause: { status: 400 } });
    
    return reviews;
  }
}

module.exports = ReviewService;
