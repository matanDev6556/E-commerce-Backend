class PaymentInterface {
    async createCustomer(userData) {
      throw new Error('Method "createCustomer" must be implemented');
    }
  
    async processPayment(customerId, amount, currency) {
      throw new Error('Method "processPayment" must be implemented');
    }
  }
  
  module.exports = PaymentInterface;