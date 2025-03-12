class WishlistService {
  constructor(userRepository, productRepository) {
    this.userRepository = userRepository;
    this.productRepository = productRepository;
  }

  async getUserWishList(userId) {
    // get the user
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found', { cause: { status: 404 } });

    // get the wish list products of user
    const products = await Promise.all(
      user.wishlist.map((wishProduct) =>
        this.productRepository.getProductById(wishProduct.id)
      )
    );

    // update the wish list if nececery
     user.wishlist.map((wishProduct, index) => {
      const product = products[index];

      return product
        ? {
            productId: product._id,
            productImage: product.image,
            productPrice: product.price,
            productName: product.name,
            productExist: true,
            productOutOfStock: product.countInStock < 1,
          }
        : {
            ...wishProduct,
            productExist: false,
            productOutOfStock: false,
          };
    });
   

      return user.wishlist;
  }

  async addToWishList(userId, productId) {
    console.log(userId);
    console.log(productId);
    const user = await this.userRepository.findById(userId);
    console.log(user);
    if (!user) throw new Error('User not found', { cause: { status: 404 } });

    const product = await this.productRepository.getProductById(productId);
    if (!product)
      throw new Error('Product not found', { cause: { status: 404 } });

    const productAlreadyExists = user.wishlist.some(
      (item) => item.productId.toString() === productId.toString()
    );
    if (productAlreadyExists)
      throw new Error('Product already in wishlist', {
        cause: { status: 409 },
      });

    user.wishlist.push({
      productId,
      productImage: product.image,
      productPrice: product.price,
      productName: product.name,
    });

    await this.userRepository.update(user.id, user);
  }

  async removeFromWishList(userId, productId) {
    let user = await this.userRepository.findById(userId);
    if (!user)
      throw new Error('User not found', {
        cause: { status: 404 },
      });

    const initialLength = user.wishlist.length;
   
    user.wishlist = user.wishlist.filter(
      (item) => item.productId.toString() !== productId.toString()
    );

    if (user.wishlist.length === initialLength)
      throw new Error('Product not found in wishlist', {
        cause: { status: 404 },
      });

    await this.userRepository.update(userId,user);
  }
}

module.exports = WishlistService;
