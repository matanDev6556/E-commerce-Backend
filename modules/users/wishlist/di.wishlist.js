// modules/wishlist/index.js
const WishlistService = require('./wishlist.service');
const WishListController = require('./wishList.controller');

const createWishlistService = (userRepository, productRepository) => {
  return new WishlistService(userRepository, productRepository);
};

const createWishListController = (wishlistService) => {
  return new WishListController(wishlistService);
};

module.exports = {
  createWishlistService,
  createWishListController
};