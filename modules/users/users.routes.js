const express = require('express');
const router = express.Router();
const {
  userController,
  wishListController,
  cartController,
} = require('../../config/di');

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.get('/:id/paymentProfile', userController.getPaymentProfile);

// wishList
router.get('/:id/wishlist', wishListController.getUserWishList);
router.post('/:id/wishlist', wishListController.addToWishList);
router.delete(
  '/:id/wishlist/:productId',
  wishListController.removeFromWishList
);

//cart
router.get('/:id/cart', cartController.getUserCart);
router.get('/:id/cart/count', cartController.getUserCartCount);
router.get('/:id/cart/:cartProductId', cartController.getCartProductById);
router.post('/:id/cart', cartController.addTocart);
router.put('/:id/cart/:cartProductId', cartController.modifyProductQuantity);
router.delete('/:id/cart/:cartProductId', cartController.removeFromCart);
router.delete('/:id/cart-clear', cartController.clearCart);

module.exports = router;
