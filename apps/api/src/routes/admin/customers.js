import express from 'express';
import adminAuth from '../../middleware/adminAuth.js';
import pb from '../../utils/pocketbaseAdminClient.js';
import logger from '../../utils/logger.js';

const router = express.Router();

// Apply admin authentication middleware to all routes in this file
router.use(adminAuth);

// GET /admin/customers - Get all customers with search (protected)
router.get('/', async (req, res) => {
  console.log('[CUSTOMERS] ========== GET /admin/customers Request Received ==========');
  console.log(`[CUSTOMERS] User ID: ${req.userId}`);
  console.log(`[CUSTOMERS] Query params:`, req.query);

  const { search, page = 1, limit = 20 } = req.query;

  // Validate pagination parameters
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  if (isNaN(pageNum) || pageNum < 1) {
    console.log('[CUSTOMERS] Invalid page parameter');
    return res.status(400).json({ error: 'Page must be a positive integer' });
  }

  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    console.log('[CUSTOMERS] Invalid limit parameter');
    return res.status(400).json({ error: 'Limit must be between 1 and 100' });
  }

  let filter = '';

  // Search across name, email, phone, and booking ID
  if (search) {
    filter = `(id ~ "${search}" || name ~ "${search}" || email ~ "${search}" || phone ~ "${search}")`;
    console.log(`[CUSTOMERS] Search: ${search}`);
  }

  try {
    console.log(`[CUSTOMERS] Fetching customers with filter: ${filter || 'none'}`);
    const customers = await pb.collection('users').getList(pageNum, limitNum, {
      filter,
      sort: '-created',
    });

    console.log(`[CUSTOMERS] Fetched ${customers.items.length} customers (page ${pageNum}, limit ${limitNum})`);

    res.json({
      success: true,
      data: customers.items.map(c => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        totalConsultations: c.totalConsultations || 0,
        totalSpent: c.totalSpent || 0,
        notes: c.notes,
        createdAt: c.created,
        updatedAt: c.updated,
      })),
      pagination: {
        total: customers.totalItems,
        page: customers.page,
        limit: customers.perPage,
        totalPages: Math.ceil(customers.totalItems / customers.perPage),
      },
    });
  } catch (error) {
    console.log(`[CUSTOMERS] Error fetching customers: ${error.message}`);
    logger.error('GET /admin/customers error:', error.message);
    throw error;
  }
});

// GET /admin/customers/:id - Get customer details (protected)
router.get('/:id', async (req, res) => {
  console.log('[CUSTOMERS] ========== GET /admin/customers/:id Request Received ==========');
  console.log(`[CUSTOMERS] User ID: ${req.userId}`);
  console.log(`[CUSTOMERS] Customer ID: ${req.params.id}`);

  try {
    console.log(`[CUSTOMERS] Fetching customer ${req.params.id}...`);
    const customer = await pb.collection('users').getOne(req.params.id);

    console.log(`[CUSTOMERS] Customer found: ${customer.id}`);

    res.json({
      success: true,
      data: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        totalConsultations: customer.totalConsultations || 0,
        totalSpent: customer.totalSpent || 0,
        notes: customer.notes,
        accountCreationDate: customer.created,
        updatedAt: customer.updated,
      },
    });
  } catch (error) {
    console.log('========== POCKETBASE ERROR ==========');
    console.log(error);
    console.log('ERROR DATA:', error.data);
    console.log('STATUS:', error.status);
    console.log('======================================');

    logger.error('GET /admin/customers error:', error);
    throw error;
  }
});

export default router;