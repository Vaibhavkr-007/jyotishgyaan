import express from 'express';
import adminAuth from '../../middleware/adminAuth.js';
import pb from '../../utils/pocketbaseClient.js';
import logger from '../../utils/logger.js';

const router = express.Router();

// Apply admin authentication middleware to all routes in this file
router.use(adminAuth);

// GET /admin/payments - Get all payments with advanced filtering (protected)
router.get('/', async (req, res) => {
  console.log('[PAYMENTS] ========== GET /admin/payments Request Received ==========');
  console.log(`[PAYMENTS] User ID: ${req.userId}`);
  console.log(`[PAYMENTS] Query params:`, req.query);

  const {
    status,
    startDate,
    endDate,
    search,
    page = 1,
    limit = 20,
  } = req.query;

  // Validate pagination parameters
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  if (isNaN(pageNum) || pageNum < 1) {
    console.log('[PAYMENTS] Invalid page parameter');
    return res.status(400).json({ error: 'Page must be a positive integer' });
  }

  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    console.log('[PAYMENTS] Invalid limit parameter');
    return res.status(400).json({ error: 'Limit must be between 1 and 100' });
  }

  // Validate date format if provided
  if (startDate && !/^\d{4}-\d{2}-\d{2}/.test(startDate)) {
    console.log('[PAYMENTS] Invalid startDate format');
    return res.status(400).json({ error: 'Invalid startDate format. Use YYYY-MM-DD' });
  }

  if (endDate && !/^\d{4}-\d{2}-\d{2}/.test(endDate)) {
    console.log('[PAYMENTS] Invalid endDate format');
    return res.status(400).json({ error: 'Invalid endDate format. Use YYYY-MM-DD' });
  }

  // Validate date range
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      console.log('[PAYMENTS] Invalid date range');
      return res.status(400).json({ error: 'startDate must be before or equal to endDate' });
    }
  }

  const filters = [];

  // Filter by payment status
  if (status) {
    filters.push(`status = "${status}"`);
    console.log(`[PAYMENTS] Filter by status: ${status}`);
  }

  // Filter by date range
  if (startDate) {
    filters.push(`createdAt >= "${startDate}"`);
    console.log(`[PAYMENTS] Filter by startDate: ${startDate}`);
  }
  if (endDate) {
    // Add one day to include the entire end date
    const endDateObj = new Date(endDate);
    endDateObj.setDate(endDateObj.getDate() + 1);
    const nextDay = endDateObj.toISOString().split('T')[0];
    filters.push(`createdAt < "${nextDay}"`);
    console.log(`[PAYMENTS] Filter by endDate: ${endDate}`);
  }

  // Search across payment ID, customer name, email, and booking ID
  if (search) {
    filters.push(`(id ~ "${search}" || razorpayPaymentId ~ "${search}" || bookingId ~ "${search}")`);
    console.log(`[PAYMENTS] Search: ${search}`);
  }

  const filterString = filters.length > 0 ? filters.join(' && ') : '';

  try {
    console.log(`[PAYMENTS] Fetching payments with filter: ${filterString || 'none'}`);
    const payments = await pb.collection('payments').getList(pageNum, limitNum, {
      filter: filterString,
      expand: 'bookingId,bookingId.customerId',
      sort: '-createdAt',
    });

    console.log(`[PAYMENTS] Fetched ${payments.items.length} payments (page ${pageNum}, limit ${limitNum})`);

    res.json({
      success: true,
      data: payments.items.map(p => ({
        id: p.id,
        bookingId: p.bookingId,
        razorpayPaymentId: p.razorpayPaymentId,
        razorpayOrderId: p.razorpayOrderId,
        amount: p.amount,
        paymentMethod: p.paymentMethod,
        status: p.status,
        refundStatus: p.refundStatus,
        refundAmount: p.refundAmount,
        refundId: p.refundId,
        consultationCategory: p.consultationCategory,
        customerName: p.expand?.bookingId?.expand?.customerId?.name || 'N/A',
        customerEmail: p.expand?.bookingId?.expand?.customerId?.email || 'N/A',
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
      pagination: {
        total: payments.totalItems,
        page: payments.page,
        limit: payments.perPage,
        totalPages: Math.ceil(payments.totalItems / payments.perPage),
      },
    });
  } catch (error) {
    console.log(`[PAYMENTS] Error fetching payments: ${error.message}`);
    logger.error('GET /admin/payments error:', error.message);
    throw error;
  }
});

// GET /admin/payments/:id - Get payment details (protected)
router.get('/:id', async (req, res) => {
  console.log('[PAYMENTS] ========== GET /admin/payments/:id Request Received ==========');
  console.log(`[PAYMENTS] User ID: ${req.userId}`);
  console.log(`[PAYMENTS] Payment ID: ${req.params.id}`);

  try {
    console.log(`[PAYMENTS] Fetching payment ${req.params.id}...`);
    const payment = await pb.collection('payments').getOne(req.params.id, {
      expand: 'bookingId,bookingId.customerId',
    });

    console.log(`[PAYMENTS] Payment found: ${payment.id}`);

    res.json({
      success: true,
      data: {
        id: payment.id,
        bookingId: payment.bookingId,
        razorpayPaymentId: payment.razorpayPaymentId,
        razorpayOrderId: payment.razorpayOrderId,
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        status: payment.status,
        refundStatus: payment.refundStatus,
        refundAmount: payment.refundAmount,
        refundId: payment.refundId,
        consultationCategory: payment.consultationCategory,
        customerName: payment.expand?.bookingId?.expand?.customerId?.name,
        customerEmail: payment.expand?.bookingId?.expand?.customerId?.email,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      },
    });
  } catch (error) {
    console.log(`[PAYMENTS] Error fetching payment ${req.params.id}: ${error.message}`);
    logger.error(`GET /admin/payments/:id error:`, error.message);
    throw error;
  }
});

export default router;