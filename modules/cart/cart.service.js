class CartService {
  constructor(cartProductRepository, userRepository, productRepository) {
    this.cartProductRepository = cartProductRepository;
    this.userRepository = userRepository;
    this.productRepository = productRepository;
  }

  async getUserCart(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found', { cause: { status: 404 } });

    const userCartProducts =
      await this.cartProductRepository.getCartProductsByUser(user.cart);
    if (!userCartProducts)
      throw new Error('Cart not found', { cause: { status: 404 } });

    userCartProducts.map((cartProduct) => {
      return cartProduct
        ? {
            productName: cartProduct.product.name,
            productImage: cartProduct.product.image,
            productPrice: cartProduct.product.price,
            productName: cartProduct.product.name,
            productExist: true,
            productOutOfStock:
              cartProduct.product.countInStock < cartProduct.quantity,
          }
        : {
            ...cartProduct,
            productExist: false,
            productOutOfStock: false,
          };
    });
    return userCartProducts;
  }

  async getUserCartCount(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found', { cause: { status: 404 } });

    return user.cart.length;
  }

  async getCartProductById(cartProductId) {
    const cartProduct = await this.cartProductRepository.getCartProductById(
      cartProductId
    );
    if (!cartProduct) {
      throw new Error('Cart product not found', { cause: { status: 404 } });
    }

    return {
      ...cartProduct,
      productExist: true,
      productOutOfStock:
        cartProduct.product.countInStock < cartProduct.quantity,
    };
  }

  async addTocart(userId, cartProductData) {
    // Find user and product
    const [user, product] = await Promise.all([
      this.userRepository.findById(userId),
      this.productRepository.getProductById(cartProductData.product),
    ]);

    if (!user) throw new Error('User not found', { cause: { status: 404 } });
    if (!product)
      throw new Error('Product not found', { cause: { status: 404 } });

    // Check if there is enough stock
    if (product.countInStock <= 0) {
      throw new Error('Product out of stock', { cause: { status: 400 } });
    }

    // Get the user's cart products
    const userCartProducts =
      (await this.cartProductRepository.getCartProductsByUser(user.cart)) || [];

    // Search if the product already exists in the cart
    const existingCartItem = userCartProducts.find(
      (item) =>
        item.product.id.toString() === cartProductData.product.toString() &&
        item.selectedSize === cartProductData.selectedSize &&
        item.selectedColour === cartProductData.selectedColour
    );

    let updatedCartItem;
    const newReservationExpiry = new Date(Date.now() + 30 * 60 * 1000);

    if (existingCartItem) {
      // Different stock check logic based on reservation status
      let canAddMore = false;

      if (existingCartItem.reserved) {
        // For reserved items, just check if there's at least one in stock
        canAddMore = product.countInStock >= 1;
      } else {
        // For non-reserved items, check if there's enough stock for all items + 1
        canAddMore = product.countInStock >= existingCartItem.quantity + 1;
      }

      if (!canAddMore) {
        throw new Error('Not enough stock', { cause: { status: 400 } });
      }

      // Update existing item
      existingCartItem.quantity++;
      updatedCartItem = await this.cartProductRepository.updateCartProduct(
        existingCartItem.id,
        {
          quantity: existingCartItem.quantity,
          reserved: true,
          reservationExpiry: newReservationExpiry,
        }
      );
    } else {
      // Add new item
      const newCartItem = {
        product: cartProductData.product,
        selectedSize: cartProductData.selectedSize,
        selectedColour: cartProductData.selectedColour,
        productName: cartProductData.productName || product.name,
        productImage: cartProductData.productImage || product.image,
        productPrice: cartProductData.productPrice || product.price,
        reserved: true,
        reservationExpiry: newReservationExpiry,
      };

      updatedCartItem = await this.cartProductRepository.addProductToCart(
        newCartItem
      );

      // Add to the user's cart list
      user.cart.push(updatedCartItem.id);
      await this.userRepository.update(user.id, { cart: user.cart });
    }

    // Update product stock
    await this.productRepository.updateProduct(product.id, {
      countInStock: product.countInStock - 1,
    });

    return updatedCartItem;
  }

  async modifyProductQuantity(userId, cartProductId, quantity) {
    // Find the user and the cart product
    
    const [user, cartProduct] = await Promise.all([
      this.userRepository.findById(userId),
      this.cartProductRepository.getCartProductById(cartProductId),
    ]);
   

    if (!user) throw new Error('User not found', { cause: { status: 404 } });
    if (!cartProduct)
      throw new Error('Cart product not found', { cause: { status: 404 } });

    // Ensure the product belongs to the user's cart
    if (!user.cart.includes(cartProductId)) {
      throw new Error('Cart product does not belong to user', {
        cause: { status: 403 },
      });
    }

    const product = await this.productRepository.getProductById(
      cartProduct.product._id
    );

    if ( quantity > product.countInStock) {
      throw new Error('Not enough stock', { cause: { status: 400 } });
    }


    // Update the cart product
    const updatedCartProduct =
      await this.cartProductRepository.updateCartProduct(cartProductId, {
        quantity: quantity,
        reservationExpiry: new Date(Date.now() + 30 * 60 * 1000),
      });

    // Update the product stock
    await this.productRepository.updateProduct(product.id, {
      countInStock: product.countInStock - quantity,
    });

    return updatedCartProduct;
  }

  async removeFromCart(userId, cartProductId) {
    // Find the user and the cart product
    const [user, cartProduct] = await Promise.all([
      this.userRepository.findById(userId),
      this.cartProductRepository.getCartProductById(cartProductId),
    ]);

    console.log(cartProduct);

    if (!user) throw new Error('User not found', { cause: { status: 404 } });
    if (!cartProduct)
      throw new Error('Cart product not found', { cause: { status: 404 } });

    // Ensure the product belongs to the user's cart
    if (!user.cart.includes(cartProductId)) {
      throw new Error('Cart product does not belong to user', {
        cause: { status: 403 },
      });
    }

    // Remove the cart product
    const removedCartProduct = await this.cartProductRepository.removeCartProduct(cartProductId);

    // add the quantity of this product to to product stock
    const product = cartProduct.product;
    if(!product)
        throw new Error('product not found', { cause: { status: 404 } });

    console.log(product);

     await this.productRepository.updateProduct(product._id,{
        countInStock : product.countInStock + cartProduct.quantity
    })

    user.cart.pull(cartProductId)
    // Update the user's cart
    await this.userRepository.update(userId, user);

   
  }
}

module.exports = CartService;
