const Stripe = require('stripe');
const PaymentInterface = require('./ipayment');
require('dotenv').config();

class StripePaymentRepository extends PaymentInterface {
  constructor() {
    super();
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  async createCustomer(userData) {
    try {
      const customer = await this.stripe.customers.create({
        email: userData.email,
        name: userData.name,
        metadata: { userId: userData.id },
      });
      return customer.id;
    } catch (error) {
      console.error('Error creating Stripe customer:', error.message);
      throw new Error('Failed to create customer', { cause: { status: 500 } });
    }
  }

  async createCheckoutSession(customerId, cartItems) {
    const successUrl = 'http://0.0.0.0:3000/api/payment-success';
    const cancelUrl = 'http://0.0.0.0:3000/api/cart';
    try {
      const session = await this.stripe.checkout.sessions.create({
        line_items: cartItems.map((item) => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
              images: item.images || [],
              metadata: {
                productId: item.product,
                cartProductId: item.cartProductId || undefined,
                selectedSize: item.selectedSize || undefined,
                selectedColour: item.selectedColour || undefined,
              },
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })),
        payment_method_options: {
          card: { setup_future_usage: 'on_session' },
        },
        billing_address_collection: 'auto',
        shipping_address_collection: {
          allowed_countries: [
            'AC',
            'AD',
            'AE',
            'AF',
            'AG',
            'AI',
            'AL',
            'AM',
            'AO',
            'AQ',
            'AR',
            'AT',
            'AU',
            'AW',
            'AX',
            'AZ',
            'BA',
            'BB',
            'BD',
            'BE',
            'BF',
            'BG',
            'BH',
            'BI',
            'BJ',
            'BL',
            'BM',
            'BN',
            'BO',
            'BQ',
            'BR',
            'BS',
            'BT',
            'BV',
            'BW',
            'BY',
            'BZ',
            'CA',
            'CD',
            'CF',
            'CG',
            'CH',
            'CI',
            'CK',
            'CL',
            'CM',
            'CN',
            'CO',
            'CR',
            'CV',
            'CW',
            'CY',
            'CZ',
            'DE',
            'DJ',
            'DK',
            'DM',
            'DO',
            'DZ',
            'EC',
            'EE',
            'EG',
            'EH',
            'ER',
            'ES',
            'ET',
            'FI',
            'FJ',
            'FK',
            'FO',
            'FR',
            'GA',
            'GB',
            'GD',
            'GE',
            'GF',
            'GG',
            'GH',
            'GI',
            'GL',
            'GM',
            'GN',
            'GP',
            'GQ',
            'GR',
            'GS',
            'GT',
            'GU',
            'GW',
            'GY',
            'HK',
            'HN',
            'HR',
            'HT',
            'HU',
            'ID',
            'IE',
            'IL',
            'IM',
            'IN',
            'IO',
            'IQ',
            'IS',
            'IT',
            'JE',
            'JM',
            'JO',
            'JP',
            'KE',
            'KG',
            'KH',
            'KI',
            'KM',
            'KN',
            'KR',
            'KW',
            'KY',
            'KZ',
            'LA',
            'LB',
            'LC',
            'LI',
            'LK',
            'LR',
            'LS',
            'LT',
            'LU',
            'LV',
            'LY',
            'MA',
            'MC',
            'MD',
            'ME',
            'MF',
            'MG',
            'MK',
            'ML',
            'MM',
            'MN',
            'MO',
            'MQ',
            'MR',
            'MS',
            'MT',
            'MU',
            'MV',
            'MW',
            'MX',
            'MY',
            'MZ',
            'NA',
            'NC',
            'NE',
            'NG',
            'NI',
            'NL',
            'NO',
            'NP',
            'NR',
            'NU',
            'NZ',
            'OM',
            'PA',
            'PE',
            'PF',
            'PG',
            'PH',
            'PK',
            'PL',
            'PM',
            'PN',
            'PR',
            'PS',
            'PT',
            'PY',
            'QA',
            'RE',
            'RO',
            'RS',
            'RU',
            'RW',
            'SA',
            'SB',
            'SC',
            'SE',
            'SG',
            'SH',
            'SI',
            'SJ',
            'SK',
            'SL',
            'SM',
            'SN',
            'SO',
            'SR',
            'SS',
            'ST',
            'SV',
            'SX',
            'SZ',
            'TA',
            'TC',
            'TD',
            'TF',
            'TG',
            'TH',
            'TJ',
            'TK',
            'TL',
            'TM',
            'TN',
            'TO',
            'TR',
            'TT',
            'TV',
            'TW',
            'TZ',
            'UA',
            'UG',
            'US',
            'UY',
            'UZ',
            'VA',
            'VC',
            'VE',
            'VG',
            'VN',
            'VU',
            'WF',
            'WS',
            'XK',
            'YE',
            'YT',
            'ZA',
            'ZM',
            'ZW',
            'ZZ',
          ],
        },
        phone_number_collection: { enabled: true },
        customer: customerId,
        mode: 'payment',

        success_url: successUrl,
        cancel_url: cancelUrl,
      });
      return session.url;
    } catch (error) {
      console.error('Error creating checkout session:', error.message);
      throw new Error('Failed to create checkout session', {
        cause: { status: 500 },
      });
    }
  }

  constructEvent(payload, signature) {
    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      console.error('Error constructing event:', error.message);
      throw error;
    }
  }

  async retrieveCustomer(customerId) {
    try {
      return await this.stripe.customers.retrieve(customerId);
    } catch (error) {
      console.error('Error retrieving Stripe customer:', error.message);
      throw new Error('Failed to retrieve customer', {
        cause: { status: 500 },
      });
    }
  }

  async listLineItems(sessionId, options = {}) {
    try {
      return await this.stripe.checkout.sessions.listLineItems(
        sessionId,
        options
      );
    } catch (error) {
      console.error('Error listing line items:', error.message);
      throw new Error('Failed to list line items', {
        cause: { status: 500 },
      });
    }
  }

  async retrieveSession(sessionId) {
    try {
      return await this.stripe.checkout.sessions.retrieve(sessionId);
    } catch (error) {
      console.error('Error retrieving session:', error.message);
      throw new Error('Failed to retrieve session', {
        cause: { status: 500 },
      });
    }
  }
}

module.exports = StripePaymentRepository;
