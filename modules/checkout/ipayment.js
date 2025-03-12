class PaymentInterface {
  async createCustomer(userData) {}
  async createCheckoutSession(customerId, cartItems) {}
  constructEvent(payload, signature) {}
  async retrieveCustomer(customerId) {}
  async listLineItems(sessionId, options) {}
  async retrieveSession(sessionId) {}
  async getPaymentProfile(customerId) {} // הוספה
}

module.exports = PaymentInterface;
