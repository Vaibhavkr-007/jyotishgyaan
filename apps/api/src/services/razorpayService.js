import 'dotenv/config';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import logger from '../utils/logger.js';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  throw new Error('Razorpay credentials are not set in environment variables');
}

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

const razorpayService = {
  /**
   * Create a Razorpay order
   * @param {number} amount - Amount in paise (e.g., 50000 for ₹500)
   * @param {string} customerId - Customer ID
   * @param {string} bookingId - Booking ID
   * @returns {Promise<{orderId: string, amount: number, currency: string}>}
   */
  async createOrder(amount, customerId, bookingId) {
    try {
      const order = await razorpay.orders.create({
        amount,
        currency: 'INR',
        receipt: `booking_${bookingId}`,
        notes: {
          customerId,
          bookingId,
        },
      });

      logger.info(`Razorpay order created: ${order.id}`);

      return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      };
    }
    catch (error) {

      console.log('\n========== RAZORPAY FULL ERROR ==========');
      console.dir(error, { depth: null });

      console.log('\nMESSAGE:', error.message);
      console.log('STATUS CODE:', error.statusCode);
      console.log('ERROR OBJECT:', error.error);
      console.log('STACK:', error.stack);

      logger.error(
        'Razorpay createOrder error:',
        error.message
      );

      throw error;
    }
  },

  /**
   * Verify payment signature
   * @param {string} razorpayPaymentId - Razorpay payment ID
   * @param {string} razorpayOrderId - Razorpay order ID
   * @param {string} razorpaySignature - Razorpay signature
   * @returns {Promise<{verified: boolean}>}
   */
  async verifyPaymentSignature(razorpayPaymentId, razorpayOrderId, razorpaySignature) {
    try {
      const body = `${razorpayOrderId}|${razorpayPaymentId}`;
      const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');

      const isValid = expectedSignature === razorpaySignature;

      if (isValid) {
        logger.info(`Payment signature verified: ${razorpayPaymentId}`);
      } else {
        logger.warn(`Payment signature verification failed: ${razorpayPaymentId}`);
      }

      return { verified: isValid };
    } catch (error) {
      logger.error('Razorpay verifyPaymentSignature error:', error.message);
      throw error;
    }
  },

  /**
   * Process refund
   * @param {string} razorpayPaymentId - Razorpay payment ID
   * @param {number} refundAmount - Refund amount in paise (optional, full refund if not provided)
   * @returns {Promise<{refundId: string, amount: number, status: string}>}
   */
  async processRefund(razorpayPaymentId, refundAmount) {
    try {
      const refundOptions = {};
      if (refundAmount) {
        refundOptions.amount = refundAmount;
      }

      const refund = await razorpay.payments.refund(razorpayPaymentId, refundOptions);

      logger.info(`Refund processed: ${refund.id}`);

      return {
        refundId: refund.id,
        amount: refund.amount,
        status: refund.status,
      };
    } catch (error) {
      logger.error('Razorpay processRefund error:', error.message);
      throw error;
    }
  },

  /**
   * Get payment details
   * @param {string} razorpayPaymentId - Razorpay payment ID
   * @returns {Promise<{id: string, amount: number, status: string, method: string, email: string, contact: string}>}
   */
  async getPaymentDetails(razorpayPaymentId) {
    try {
      const payment = await razorpay.payments.fetch(razorpayPaymentId);

      return {
        id: payment.id,
        amount: payment.amount,
        status: payment.status,
        method: payment.method,
        email: payment.email,
        contact: payment.contact,
        createdAt: new Date(payment.created_at * 1000).toISOString(),
      };
    } catch (error) {
      logger.error('Razorpay getPaymentDetails error:', error.message);
      throw error;
    }
  },
};

export default razorpayService;
export { razorpayService };
