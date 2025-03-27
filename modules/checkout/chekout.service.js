class CheckoutService {
  constructor(
    userRepository,
    productRepository,
    paymentRepository,
    orderRepository
  ) {
    this.userRepository = userRepository;
    this.productRepository = productRepository;
    this.paymentRepository = paymentRepository;
    this.orderRepository = orderRepository;
  }

  async checkout(userId, cartItems, successUrl, cancelUrl) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found!', { cause: { status: 404 } });
  
    const enrichedCartItems = [];
    for (const cartItem of cartItems) {
      const product = await this.productRepository.getProductById(
        cartItem.product
      );
      if (!product) {
        throw new Error('Product not found!', { cause: { status: 404 } });
      } else if (
        !cartItem.reserved &&
        product.countInStock < cartItem.quantity
      ) {
        const message = `${product.name}\n Order for ${cartItem.quantity}, but only ${product.countInStock} left in stock.`;
        throw new Error(message, { cause: { status: 400 } });
      }
      enrichedCartItems.push({
        ...cartItem,
        name: product.name,
        price: product.price,
        images: product.images || [],
      });
    }
  
    let customerId = user.paymentCustomerId;
  
    if (!customerId) {
      customerId = await this.paymentRepository.createCustomer({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        id: userId,
      });
      user.paymentCustomerId = customerId;
      await this.userRepository.update(userId, {
        paymentCustomerId: customerId,
      });
    }
  
    const checkoutUrl = await this.paymentRepository.createCheckoutSession(
      customerId,
      enrichedCartItems,
      successUrl,
      cancelUrl
    );
    return { url: checkoutUrl };
  }
  
  async handleWebhook(rawBody, signature) {
    try {
      const event = this.paymentRepository.constructEvent(rawBody, signature);

      console.log('webhook event :' ,event.type);
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutCompleted(event.data.object);
          break;
        case 'payment_intent.succeeded':
          await this.handlePaymentSucceeded(event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return event;
    } catch (error) {
      console.error('Webhook Error:', error.message);
      throw new Error(`Webhook Error: ${error.message}`, {
        cause: { status: 400 },
      });
    }
  }

  async handleCheckoutCompleted(session) {
    try {
      // 1. Retrieve customer information
      const customer = await this.paymentRepository.retrieveCustomer(session.customer);
      
      // 2. Retrieve order items
      const lineItemsResponse = await this.paymentRepository.listLineItems(
        session.id, 
        { expand: ['data.price.product'] }
      );
      
      const lineItems = lineItemsResponse.data;
      
      // 3. Create OrderItems 
      const orderItems = await Promise.all(lineItems.map(async (item) => {
        // Fetch the product from the database to get all its information
        const productId = item.price.product.metadata.productId;
        const product = await this.productRepository.getProductById(productId);
        
        if (!product) {
          throw new Error(`Product not found: ${productId}`);
        }
        
        // Create OrderItem
        const orderItem = {
          product: productId,
          productName: product.name,
          productImage: product.image,
          productPrice: item.price.unit_amount / 100,
          quantity: item.quantity,
          selectedSize: item.price.product.metadata.selectedSize || '',
          selectedColour: item.price.product.metadata.selectedColour || 'black'
        };
        
        // Save the OrderItem
        return await this.orderRepository.createOrderItem(orderItem);
      }));
      
      // Separate the IDs of the OrderItems
      const orderItemIds = orderItems.map(item => item._id);
      
      // 4. Retrieve shipping address
      const address = session.shipping_details?.address || session.customer_details.address || {};
      
      // 5. Create a new order
      const userId = customer.metadata?.userId;
      
      if (!userId) {
        throw new Error('User ID not found in customer metadata');
      }
      
      const orderData = {
        orderItems: orderItemIds,
        shippingAddress: address.line1 === 'N/A' ? address.line2 : address.line1,
        city: address.city,
        postalCode: address.postal_code,
        country: address.country,
        phone: session.customer_details?.phone || '',
        totalPrice: session.amount_total / 100,
        user: userId,
        paymentId: session.payment_intent,
       
      };
      
      // Create Order
      const order = await this.orderRepository.createOrder(orderData);
      
      
      // 6. Update the user if necessary
      const user = await this.userRepository.findById(userId);
      
      if (user && !user.paymentCustomerId) {
        await this.userRepository.update(userId, {
          paymentCustomerId: customer.id
        });
      }
      
      // 7. Update product stock
      for (const item of orderItems) {
        const product = await this.productRepository.getProductById(item.product);
        
        if (product) {
          const newStock = Math.max(0, product.countInStock - item.quantity);
          await this.productRepository.updateProduct(item.product, { 
            countInStock: newStock 
          });
        }
      }
      
      return order;
    } catch (error) {
      console.error('Error processing checkout completion:', error);
      throw error;
    }
  }
 
  
}

module.exports = CheckoutService;
