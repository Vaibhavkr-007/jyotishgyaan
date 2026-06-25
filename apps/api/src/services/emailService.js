import 'dotenv/config';
import logger from '../utils/logger.js';

const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER;
const EMAIL_API_KEY = process.env.EMAIL_API_KEY;
const ADMIN_EMAIL_ADDRESS = process.env.ADMIN_EMAIL_ADDRESS;

if (!EMAIL_PROVIDER || !EMAIL_API_KEY) {
  logger.warn('Email service not configured - emails will not be sent');
}

const emailService = {
  /**
   * Send booking confirmation email to customer
   * @param {string} customerEmail - Customer email
   * @param {Object} bookingDetails - Booking details
   * @returns {Promise<{sent: boolean}>}
   */
  async sendBookingConfirmation(customerEmail, bookingDetails) {
    try {
      const subject = 'Booking Confirmation - Astrology Consultation';
      const html = `
        <h2>Booking Confirmed!</h2>
        <p>Dear ${bookingDetails.customerName},</p>
        <p>Your consultation has been confirmed.</p>
        <ul>
          <li><strong>Type:</strong> ${bookingDetails.consultationType}</li>
          <li><strong>Date & Time:</strong> ${bookingDetails.scheduledDateTime}</li>
          <li><strong>Amount:</strong> ₹${bookingDetails.amount}</li>
        </ul>
        <p>Thank you for booking with us!</p>
      `;

      await this._sendEmail(customerEmail, subject, html);
      logger.info(`Booking confirmation email sent to ${customerEmail}`);

      return { sent: true };
    } catch (error) {
      logger.error('Error sending booking confirmation:', error.message);
      throw error;
    }
  },

  /**
   * Send payment confirmation email to customer
   * @param {string} customerEmail - Customer email
   * @param {Object} paymentDetails - Payment details
   * @returns {Promise<{sent: boolean}>}
   */
  async sendPaymentConfirmation(customerEmail, paymentDetails) {
    try {
      const subject = 'Payment Confirmation - Astrology Consultation';
      const html = `
        <h2>Payment Received!</h2>
        <p>Dear ${paymentDetails.customerName},</p>
        <p>Your payment has been successfully processed.</p>
        <ul>
          <li><strong>Amount:</strong> ₹${paymentDetails.amount}</li>
          <li><strong>Payment ID:</strong> ${paymentDetails.razorpayPaymentId}</li>
          <li><strong>Date:</strong> ${paymentDetails.createdAt}</li>
        </ul>
        <p>Thank you!</p>
      `;

      await this._sendEmail(customerEmail, subject, html);
      logger.info(`Payment confirmation email sent to ${customerEmail}`);

      return { sent: true };
    } catch (error) {
      logger.error('Error sending payment confirmation:', error.message);
      throw error;
    }
  },

  /**
   * Send cancellation email to customer
   * @param {string} customerEmail - Customer email
   * @param {Object} bookingDetails - Booking details
   * @returns {Promise<{sent: boolean}>}
   */
  async sendCancellationEmail(customerEmail, bookingDetails) {
    try {
      const subject = 'Booking Cancelled - Astrology Consultation';
      const html = `
        <h2>Booking Cancelled</h2>
        <p>Dear ${bookingDetails.customerName},</p>
        <p>Your consultation booking has been cancelled.</p>
        <ul>
          <li><strong>Booking ID:</strong> ${bookingDetails.id}</li>
          <li><strong>Type:</strong> ${bookingDetails.consultationType}</li>
        </ul>
        <p>If you have any questions, please contact us.</p>
      `;

      await this._sendEmail(customerEmail, subject, html);
      logger.info(`Cancellation email sent to ${customerEmail}`);

      return { sent: true };
    } catch (error) {
      logger.error('Error sending cancellation email:', error.message);
      throw error;
    }
  },

  /**
   * Send refund confirmation email to customer
   * @param {string} customerEmail - Customer email
   * @param {Object} refundDetails - Refund details
   * @returns {Promise<{sent: boolean}>}
   */
  async sendRefundConfirmation(customerEmail, refundDetails) {
    try {
      const subject = 'Refund Processed - Astrology Consultation';
      const html = `
        <h2>Refund Processed</h2>
        <p>Dear ${refundDetails.customerName},</p>
        <p>Your refund has been successfully processed.</p>
        <ul>
          <li><strong>Refund Amount:</strong> ₹${refundDetails.refundAmount}</li>
          <li><strong>Refund ID:</strong> ${refundDetails.refundId}</li>
          <li><strong>Status:</strong> ${refundDetails.status}</li>
        </ul>
        <p>The amount will be credited to your account within 3-5 business days.</p>
      `;

      await this._sendEmail(customerEmail, subject, html);
      logger.info(`Refund confirmation email sent to ${customerEmail}`);

      return { sent: true };
    } catch (error) {
      logger.error('Error sending refund confirmation:', error.message);
      throw error;
    }
  },

  /**
   * Send reminder email to customer (1 hour before consultation)
   * @param {string} customerEmail - Customer email
   * @param {Object} bookingDetails - Booking details
   * @returns {Promise<{sent: boolean}>}
   */
  async sendReminderEmail(customerEmail, bookingDetails) {
    try {
      const subject = 'Reminder: Your Consultation is in 1 Hour';
      const html = `
        <h2>Consultation Reminder</h2>
        <p>Dear ${bookingDetails.customerName},</p>
        <p>Your consultation is scheduled in 1 hour!</p>
        <ul>
          <li><strong>Type:</strong> ${bookingDetails.consultationType}</li>
          <li><strong>Time:</strong> ${bookingDetails.scheduledDateTime}</li>
          ${bookingDetails.zoomLink ? `<li><strong>Join Link:</strong> <a href="${bookingDetails.zoomLink}">Click here to join</a></li>` : ''}
        </ul>
        <p>Please be ready a few minutes before the scheduled time.</p>
      `;

      await this._sendEmail(customerEmail, subject, html);
      logger.info(`Reminder email sent to ${customerEmail}`);

      return { sent: true };
    } catch (error) {
      logger.error('Error sending reminder email:', error.message);
      throw error;
    }
  },

  /**
   * Send new booking alert to admin
   * @param {Object} bookingDetails - Booking details
   * @returns {Promise<{sent: boolean}>}
   */
  async sendNewBookingAlert(bookingDetails) {
    try {
      const subject = 'New Booking Alert';
      const html = `
        <h2>New Booking Received</h2>
        <ul>
          <li><strong>Customer:</strong> ${bookingDetails.customerName}</li>
          <li><strong>Email:</strong> ${bookingDetails.customerEmail}</li>
          <li><strong>Type:</strong> ${bookingDetails.consultationType}</li>
          <li><strong>Date & Time:</strong> ${bookingDetails.scheduledDateTime}</li>
          <li><strong>Amount:</strong> ₹${bookingDetails.amount}</li>
        </ul>
      `;

      await this._sendEmail(ADMIN_EMAIL_ADDRESS, subject, html);
      logger.info('New booking alert sent to admin');

      return { sent: true };
    } catch (error) {
      logger.error('Error sending new booking alert:', error.message);
      throw error;
    }
  },

  /**
   * Send cancellation alert to admin
   * @param {Object} bookingDetails - Booking details
   * @returns {Promise<{sent: boolean}>}
   */
  async sendCancellationAlert(bookingDetails) {
    try {
      const subject = 'Booking Cancellation Alert';
      const html = `
        <h2>Booking Cancelled</h2>
        <ul>
          <li><strong>Customer:</strong> ${bookingDetails.customerName}</li>
          <li><strong>Booking ID:</strong> ${bookingDetails.id}</li>
          <li><strong>Type:</strong> ${bookingDetails.consultationType}</li>
        </ul>
      `;

      await this._sendEmail(ADMIN_EMAIL_ADDRESS, subject, html);
      logger.info('Cancellation alert sent to admin');

      return { sent: true };
    } catch (error) {
      logger.error('Error sending cancellation alert:', error.message);
      throw error;
    }
  },

  /**
   * Send payment received alert to admin
   * @param {Object} paymentDetails - Payment details
   * @returns {Promise<{sent: boolean}>}
   */
  async sendPaymentReceivedAlert(paymentDetails) {
    try {
      const subject = 'Payment Received Alert';
      const html = `
        <h2>Payment Received</h2>
        <ul>
          <li><strong>Amount:</strong> ₹${paymentDetails.amount}</li>
          <li><strong>Payment ID:</strong> ${paymentDetails.razorpayPaymentId}</li>
          <li><strong>Booking ID:</strong> ${paymentDetails.bookingId}</li>
        </ul>
      `;

      await this._sendEmail(ADMIN_EMAIL_ADDRESS, subject, html);
      logger.info('Payment received alert sent to admin');

      return { sent: true };
    } catch (error) {
      logger.error('Error sending payment received alert:', error.message);
      throw error;
    }
  },

  /**
   * Send refund processed alert to admin
   * @param {Object} refundDetails - Refund details
   * @returns {Promise<{sent: boolean}>}
   */
  async sendRefundProcessedAlert(refundDetails) {
    try {
      const subject = 'Refund Processed Alert';
      const html = `
        <h2>Refund Processed</h2>
        <ul>
          <li><strong>Refund Amount:</strong> ₹${refundDetails.refundAmount}</li>
          <li><strong>Refund ID:</strong> ${refundDetails.refundId}</li>
          <li><strong>Payment ID:</strong> ${refundDetails.razorpayPaymentId}</li>
        </ul>
      `;

      await this._sendEmail(ADMIN_EMAIL_ADDRESS, subject, html);
      logger.info('Refund processed alert sent to admin');

      return { sent: true };
    } catch (error) {
      logger.error('Error sending refund processed alert:', error.message);
      throw error;
    }
  },

  /**
   * Internal method to send email via provider
   * @private
   */
  async _sendEmail(to, subject, html) {
    if (!EMAIL_PROVIDER || !EMAIL_API_KEY) {
      logger.warn(`Email not sent (provider not configured): ${to}`);
      return;
    }

    if (EMAIL_PROVIDER === 'sendgrid') {
      // SendGrid implementation
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${EMAIL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: to }],
            },
          ],
          from: { email: ADMIN_EMAIL_ADDRESS },
          subject,
          content: [
            {
              type: 'text/html',
              value: html,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`SendGrid API error: ${response.status}`);
      }
    } else if (EMAIL_PROVIDER === 'mailgun') {
      // Mailgun implementation
      const formData = new URLSearchParams();
      formData.append('from', ADMIN_EMAIL_ADDRESS);
      formData.append('to', to);
      formData.append('subject', subject);
      formData.append('html', html);

      const response = await fetch('https://api.mailgun.net/v3/YOUR_DOMAIN/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`api:${EMAIL_API_KEY}`).toString('base64')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Mailgun API error: ${response.status}`);
      }
    }
  },
};

export default emailService;
export { emailService };
