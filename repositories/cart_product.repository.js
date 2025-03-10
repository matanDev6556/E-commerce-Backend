const { CartProduct } = require("../models/cart_product");



class CartProductRepository {
  async addProductToCart(productData) {
    try {
      const cartProduct = new CartProduct(productData);
      return await cartProduct.save();
    } catch (error) {
      throw new Error(error);
    }
  }

  async getCartProductById(cartProductId) {
    try {
      console.log(cartProductId);
      return await CartProduct.findById({_id :cartProductId}).populate('product').lean();
    } catch (error) {
      throw new Error('Failed to fetch cart product', { cause: error });
    }
  }

  async getCartProductsByUser(userCartIds) {
    try {
      return await CartProduct.find({ _id: {$in : userCartIds} }).populate('product');
    } catch (error) {
      throw new Error('Failed to fetch user cart products', { cause: error });
    }
  }

  async updateCartProduct(cartProductId, updateData) {
    try {
      return await CartProduct.findByIdAndUpdate(cartProductId, updateData, {
        new: true,
      });
    } catch (error) {
      throw new Error('Failed to update cart product', { cause: error });
    }
  }

  async removeCartProduct(cartProductId) {
    try {
      return await CartProduct.findByIdAndDelete(cartProductId);
    } catch (error) {
      throw new Error('Failed to remove cart product', { cause: error });
    }
  }



  async clearUserCart(userId) {
    try {
      return await CartProduct.deleteMany({ user: userId });
    } catch (error) {
      throw new Error('Failed to clear user cart', { cause: error });
    }
  }
}

module.exports = CartProductRepository;
