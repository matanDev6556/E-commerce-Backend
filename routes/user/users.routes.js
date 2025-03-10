const express = require('express');
const { userController, wishListController, cartController } = require('../../config/di');
const router = express.Router();

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);

// wishList
router.get('/:id/wishlist', wishListController.getUserWishList);
router.post('/:id/wishlist', wishListController.addToWishList);
router.delete('/:id/wishlist/:productId', wishListController.removeFromWishList);

//cart
router.get('/:id/cart', cartController.getUserCart);
router.get('/:id/cart/count', cartController.getUserCartCount);
router.get('/:id/cart/:cardProductId', cartController.gerCartProductById);
router.post('/:id/cart/', cartController.addTocart);
router.put('/:id/cart/cartProductId', cartController.modifyProductQuantity);
router.delete('/:id/cart/cartProductId', cartController.removeFromCart);

module.exports = router;
