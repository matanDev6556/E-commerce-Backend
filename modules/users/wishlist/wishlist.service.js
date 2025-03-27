class WishlistService {
  constructor(userRepository, productRepository) {
    this.userRepository = userRepository;
    this.productRepository = productRepository;
  }

  async getUserWishList(userId) {
    // get the user
    console.log('get iwhs list: ');
    var user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found', { cause: { status: 404 } });

    console.log('userr: ', user);
    // get the wish list products of user
    const products = await Promise.all(
      user.wishlist.map((wishProduct) =>
        this.productRepository.getProductById(wishProduct.productId)
      )
    );

    console.log('products: ', products);

    // update the wish list if nececery
    const updatedWishlist = user.wishlist.map((wishProduct, index) => {
      const product = products[index];

      return product
        ? {
            productId: product._id,
            productImage: product.image,
            productPrice: product.price,
            productName: product.name,
            productExist: true,
            productOutOfStock: product.countInStock < 1,
            availableSizes: product.sizes || [],
            availableColours: product.colours || [],
          }
        : {
            ...wishProduct,
            productExist: false,
            productOutOfStock: false,
          };
    });
    console.log('user wish lsit ', updatedWishlist);

    return updatedWishlist;
  }

  async addToWishList(userId, productId) {
    console.log(userId);
    console.log(productId);
    var user = await this.userRepository.findById(userId);
    console.log(user);
    if (!user) throw new Error('User not found', { cause: { status: 404 } });

    const product = await this.productRepository.getProductById(productId);
    if (!product)
      throw new Error('Product not found', { cause: { status: 404 } });

    console.log('product ', product);
    const productAlreadyExists = user.wishlist.some(
      (item) => item.productId.toString() === productId.toString()
    );
    if (productAlreadyExists)
      throw new Error('Product already in wishlist', {
        cause: { status: 409 },
      });

    

    var wishListProduct = {
      productId,
      productImage: product.image,
      productPrice: product.price,
      productName: product.name,
      productExist: product ? true : false,
      productOutOfStock: product.countInStock < 1,
      availableSizes: product.sizes || [],
      availableColours: product.colours || [],
    };
    const updatedWishlist = [...user.wishlist, wishListProduct];

    console.log(wishListProduct);

    const updatedUser = await this.userRepository.update(userId, {
      wishlist: updatedWishlist,
    });
    console.log('User after DB update:', updatedUser);
    return wishListProduct;
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

    await this.userRepository.update(userId, user);
  }
}

module.exports = WishlistService;
