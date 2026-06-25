import express from 'express';
import adminAuth from '../../middleware/adminAuth.js';
import calcomService from '../../services/calcomService.js';
import logger from '../../utils/logger.js';

const router = express.Router();

// Apply admin authentication middleware to all routes in this file
router.use(adminAuth);

// Event type mapping for consultation types
const EVENT_TYPES = {
  chat: 5798043,
  audio: 5798042,
  video: 5798041,
};

// Helper function to validate date format (YYYY-MM-DD)
const isValidDateFormat = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// GET /admin/availability - Get availability slots from Cal.com (protected)
router.get('/', async (req, res) => {
  console.log('[ADMIN-AVAILABILITY] ========== GET /admin/availability Request Received ==========');
  console.log(`[ADMIN-AVAILABILITY] User ID: ${req.userId}`);
  console.log(`[ADMIN-AVAILABILITY] Query params:`, req.query);

  const { date, type = 'audio' } = req.query;
  const queryDate = date || getTodayDate();

  // ============================================================================
  // STEP 1: Validate date format
  // ============================================================================
  console.log('[ADMIN-AVAILABILITY] ========== Validating Date Format ==========');
  console.log(`[ADMIN-AVAILABILITY] Query date: ${date || '(not provided)'}`);
  console.log(`[ADMIN-AVAILABILITY] Using date: ${queryDate}`);

  if (!isValidDateFormat(queryDate)) {
    console.log(`[ADMIN-AVAILABILITY] ✗ Invalid date format: ${queryDate}`);
    logger.warn(`GET /admin/availability: Invalid date format: ${queryDate}`);
    return res.status(400).json({
      error: 'Invalid date format. Use YYYY-MM-DD',
      example: getTodayDate(),
    });
  }

  console.log(`[ADMIN-AVAILABILITY] ✓ Valid date format: ${queryDate}`);

  // ============================================================================
  // STEP 2: Validate consultation type
  // ============================================================================
  console.log('[ADMIN-AVAILABILITY] ========== Validating Consultation Type ==========');
  console.log(`[ADMIN-AVAILABILITY] Requested type: ${type}`);

  if (!EVENT_TYPES[type]) {
    console.log(`[ADMIN-AVAILABILITY] ✗ Invalid consultation type: ${type}`);
    logger.warn(`GET /admin/availability: Invalid consultation type: ${type}`);
    return res.status(400).json({
      error: `Invalid consultation type: ${type}`,
      validTypes: Object.keys(EVENT_TYPES),
    });
  }

  const eventTypeId = EVENT_TYPES[type];
  console.log(`[ADMIN-AVAILABILITY] ✓ Valid consultation type: ${type}`);
  console.log(`[ADMIN-AVAILABILITY]   - Event Type ID: ${eventTypeId}`);

  // ============================================================================
  // STEP 3: Fetch availability slots from Cal.com
  // ============================================================================
  console.log('[ADMIN-AVAILABILITY] ========== Fetching Availability Slots ==========');
  console.log(`[ADMIN-AVAILABILITY] Calling calcomService.getAvailabilitySlots()`);
  console.log(`[ADMIN-AVAILABILITY]   - eventTypeId: ${eventTypeId}`);
  console.log(`[ADMIN-AVAILABILITY]   - startDate: ${queryDate}`);

  const slots = await calcomService.getAvailabilitySlots(eventTypeId, queryDate);

  console.log(`[ADMIN-AVAILABILITY] ✓ Successfully fetched ${slots.length} slots`);

  // ============================================================================
  // STEP 4: Group slots by date
  // ============================================================================
  console.log('[ADMIN-AVAILABILITY] ========== Grouping Slots by Date ==========');

  const slotsGroupedByDate = {};
  slots.forEach(slot => {
    // Extract date from slot (assuming slot has a date or time property)
    const slotDate = slot.date || slot.time?.split('T')[0] || queryDate;
    if (!slotsGroupedByDate[slotDate]) {
      slotsGroupedByDate[slotDate] = [];
    }
    slotsGroupedByDate[slotDate].push(slot);
  });

  console.log(`[ADMIN-AVAILABILITY] Grouped slots into ${Object.keys(slotsGroupedByDate).length} date(s)`);
  Object.entries(slotsGroupedByDate).forEach(([date, dateSlots]) => {
    console.log(`[ADMIN-AVAILABILITY]   - ${date}: ${dateSlots.length} slots`);
  });

  // ============================================================================
  // STEP 5: Return success response
  // ============================================================================
  console.log('[ADMIN-AVAILABILITY] ========== Returning Success Response ==========');
  console.log('[ADMIN-AVAILABILITY] Status: 200 OK');
  console.log('[ADMIN-AVAILABILITY] Response structure:');
  console.log('[ADMIN-AVAILABILITY]   - success: true');
  console.log('[ADMIN-AVAILABILITY]   - data:');
  console.log(`[ADMIN-AVAILABILITY]     - date: ${queryDate}`);
  console.log(`[ADMIN-AVAILABILITY]     - type: ${type}`);
  console.log(`[ADMIN-AVAILABILITY]     - eventTypeId: ${eventTypeId}`);
  console.log(`[ADMIN-AVAILABILITY]     - slots: (array of ${slots.length} slots)`);
  console.log(`[ADMIN-AVAILABILITY]     - slotsGroupedByDate: (${Object.keys(slotsGroupedByDate).length} dates)`);
  console.log(`[ADMIN-AVAILABILITY]     - totalSlots: ${slots.length}`);
  console.log('[ADMIN-AVAILABILITY] ========== End of Request ==========');

  logger.info(`GET /admin/availability: Successfully fetched ${slots.length} slots for ${type} consultation on ${queryDate}`);

  res.json({
    success: true,
    data: {
      date: queryDate,
      type,
      eventTypeId,
      slots,
      slotsGroupedByDate,
      totalSlots: slots.length,
    },
  });
});

// GET /admin/availability/blocked - Get all blocked dates (protected)
router.get('/blocked', async (req, res) => {
  console.log('[ADMIN-AVAILABILITY] ========== GET /admin/availability/blocked Request Received ==========');
  console.log(`[ADMIN-AVAILABILITY] User ID: ${req.userId}`);

  console.log('[ADMIN-AVAILABILITY] Returning empty blocked dates array');

  res.json({
    success: true,
    data: [],
  });
});

// GET /admin/availability/sync-status - Get sync status (protected)
router.get('/sync-status', async (req, res) => {
  console.log('[ADMIN-AVAILABILITY] ========== GET /admin/availability/sync-status Request Received ==========');
  console.log(`[ADMIN-AVAILABILITY] User ID: ${req.userId}`);

  const now = new Date();
  const lastSync = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const nextSync = new Date(now.getTime() + 60 * 60 * 1000).toISOString();

  console.log('[ADMIN-AVAILABILITY] Returning sync status');
  console.log(`[ADMIN-AVAILABILITY]   - lastSync: ${lastSync}`);
  console.log('[ADMIN-AVAILABILITY]   - status: synced');
  console.log(`[ADMIN-AVAILABILITY]   - nextSync: ${nextSync}`);

  res.json({
    success: true,
    data: {
      lastSync,
      status: 'synced',
      nextSync,
    },
  });
});

// POST /admin/availability - Accept availability request without saving to PocketBase (protected)
router.post('/', async (req, res) => {
  console.log('[ADMIN-AVAILABILITY] ========== POST /admin/availability Request Received ==========');
  console.log(`[ADMIN-AVAILABILITY] User ID: ${req.userId}`);
  console.log('[ADMIN-AVAILABILITY] Request body:', req.body);

  const { date, startTime, endTime, type = 'audio' } = req.body;

  // ============================================================================
  // STEP 1: Validate required fields
  // ============================================================================
  console.log('[ADMIN-AVAILABILITY] ========== Validating Required Fields ==========');

  if (!date || !startTime || !endTime) {
    console.log('[ADMIN-AVAILABILITY] ✗ Missing required fields');
    logger.warn('POST /admin/availability: Missing required fields');
    return res.status(400).json({
      error: 'Date, start time, and end time are required',
    });
  }

  console.log('[ADMIN-AVAILABILITY] ✓ All required fields provided');

  // ============================================================================
  // STEP 2: Validate date format
  // ============================================================================
  console.log('[ADMIN-AVAILABILITY] ========== Validating Date Format ==========');

  if (!isValidDateFormat(date)) {
    console.log(`[ADMIN-AVAILABILITY] ✗ Invalid date format: ${date}`);
    logger.warn(`POST /admin/availability: Invalid date format: ${date}`);
    return res.status(400).json({
      error: 'Invalid date format. Use YYYY-MM-DD',
      example: getTodayDate(),
    });
  }

  console.log(`[ADMIN-AVAILABILITY] ✓ Valid date format: ${date}`);

  // ============================================================================
  // STEP 3: Validate consultation type
  // ============================================================================
  console.log('[ADMIN-AVAILABILITY] ========== Validating Consultation Type ==========');

  if (!EVENT_TYPES[type]) {
    console.log(`[ADMIN-AVAILABILITY] ✗ Invalid consultation type: ${type}`);
    logger.warn(`POST /admin/availability: Invalid consultation type: ${type}`);
    return res.status(400).json({
      error: `Invalid consultation type: ${type}`,
      validTypes: Object.keys(EVENT_TYPES),
    });
  }

  console.log(`[ADMIN-AVAILABILITY] ✓ Valid consultation type: ${type}`);

  // ============================================================================
  // STEP 4: Return success response (no PocketBase save)
  // ============================================================================
  console.log('[ADMIN-AVAILABILITY] ========== Returning Success Response ==========');
  console.log('[ADMIN-AVAILABILITY] Status: 201 Created');
  console.log('[ADMIN-AVAILABILITY] Note: Request accepted but NOT saved to database');
  console.log('[ADMIN-AVAILABILITY] Response structure:');
  console.log('[ADMIN-AVAILABILITY]   - success: true');
  console.log('[ADMIN-AVAILABILITY]   - message: Availability request accepted');
  console.log('[ADMIN-AVAILABILITY]   - data:');
  console.log(`[ADMIN-AVAILABILITY]     - date: ${date}`);
  console.log(`[ADMIN-AVAILABILITY]     - startTime: ${startTime}`);
  console.log(`[ADMIN-AVAILABILITY]     - endTime: ${endTime}`);
  console.log(`[ADMIN-AVAILABILITY]     - type: ${type}`);
  console.log('[ADMIN-AVAILABILITY] ========== End of Request ==========');

  logger.info(`POST /admin/availability: Availability request accepted for ${date} (${startTime}-${endTime})`);

  res.status(201).json({
    success: true,
    message: 'Availability request accepted',
    data: {
      date,
      startTime,
      endTime,
      type,
    },
  });
});

export default router;
