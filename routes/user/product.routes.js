const express = require('express');
const router = express.Router();
const { productController, reviewController } = require('../../config/di');

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.get('/:id/reviews', reviewController.getProductReviews);
router.post('/:id/reviews', reviewController.leaveReview);


module.exports = router;
