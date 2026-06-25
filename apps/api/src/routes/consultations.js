import express from 'express';
import calcomService from '../services/calcomService.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Event type mapping for consultation types
const EVENT_TYPES = {
  chat: 5798043,
  audio: 5798042,
  video: 5798041,
};

// Consultation type details
const CONSULTATION_DETAILS = {
  chat: { duration: 10, name: 'Chat Consultation' },
  audio: { duration: 15, name: 'Audio Consultation' },
  video: { duration: 30, name: 'Video Consultation' },
};

// Helper function to validate date format (YYYY-MM-DD)
const isValidDateFormat = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);

// GET /consultations/slots - Get available consultation slots
router.get('/slots', async (req, res) => {
  console.log('[CONSULTATIONS] ========== GET /consultations/slots Request Received ==========');
  console.log(`[CONSULTATIONS] Query params:`, req.query);

  const { type, startDate, endDate } = req.query;

  // ============================================================================
  // STEP 1: Validate required parameters
  // ============================================================================
  console.log('[CONSULTATIONS] ========== Validating Required Parameters ==========');

  if (!type) {
    console.log('[CONSULTATIONS] ✗ Validation failed: Missing type parameter');
    logger.warn('GET /consultations/slots: Missing type parameter');
    return res.status(400).json({
      error: 'Consultation type is required',
      validTypes: Object.keys(EVENT_TYPES),
    });
  }

  if (!startDate) {
    console.log('[CONSULTATIONS] ✗ Validation failed: Missing startDate parameter');
    logger.warn('GET /consultations/slots: Missing startDate parameter');
    return res.status(400).json({
      error: 'Start date is required',
      format: 'YYYY-MM-DD',
    });
  }

  if (!endDate) {
    console.log('[CONSULTATIONS] ✗ Validation failed: Missing endDate parameter');
    logger.warn('GET /consultations/slots: Missing endDate parameter');
    return res.status(400).json({
      error: 'End date is required',
      format: 'YYYY-MM-DD',
    });
  }

  console.log('[CONSULTATIONS] ✓ All required parameters provided');

  // ============================================================================
  // STEP 2: Validate consultation type
  // ============================================================================
  console.log('[CONSULTATIONS] ========== Validating Consultation Type ==========');
  console.log(`[CONSULTATIONS] Requested type: ${type}`);

  if (!EVENT_TYPES[type]) {
    console.log(`[CONSULTATIONS] ✗ Invalid consultation type: ${type}`);
    logger.warn(`GET /consultations/slots: Invalid consultation type: ${type}`);
    return res.status(400).json({
      error: `Invalid consultation type: ${type}`,
      validTypes: Object.keys(EVENT_TYPES),
    });
  }

  const eventTypeId = EVENT_TYPES[type];
  const consultationDetails = CONSULTATION_DETAILS[type];
  console.log(`[CONSULTATIONS] ✓ Valid consultation type: ${type}`);
  console.log(`[CONSULTATIONS]   - Event Type ID: ${eventTypeId}`);
  console.log(`[CONSULTATIONS]   - Duration: ${consultationDetails.duration} minutes`);

  // ============================================================================
  // STEP 3: Validate date format
  // ============================================================================
  console.log('[CONSULTATIONS] ========== Validating Date Format ==========');
  console.log(`[CONSULTATIONS] Start date: ${startDate}`);
  console.log(`[CONSULTATIONS] End date: ${endDate}`);

  if (!isValidDateFormat(startDate)) {
    console.log(`[CONSULTATIONS] ✗ Invalid startDate format: ${startDate}`);
    logger.warn(`GET /consultations/slots: Invalid startDate format: ${startDate}`);
    return res.status(400).json({
      error: 'Invalid startDate format',
      format: 'YYYY-MM-DD',
      example: '2024-01-15',
    });
  }

  if (!isValidDateFormat(endDate)) {
    console.log(`[CONSULTATIONS] ✗ Invalid endDate format: ${endDate}`);
    logger.warn(`GET /consultations/slots: Invalid endDate format: ${endDate}`);
    return res.status(400).json({
      error: 'Invalid endDate format',
      format: 'YYYY-MM-DD',
      example: '2024-01-20',
    });
  }

  console.log('[CONSULTATIONS] ✓ Date format is valid');

  // ============================================================================
  // STEP 4: Validate date range
  // ============================================================================
  console.log('[CONSULTATIONS] ========== Validating Date Range ==========');

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) {
    console.log(`[CONSULTATIONS] ✗ Invalid date range: startDate (${startDate}) is after endDate (${endDate})`);
    logger.warn(`GET /consultations/slots: Invalid date range - startDate after endDate`);
    return res.status(400).json({
      error: 'Start date must be before or equal to end date',
      startDate,
      endDate,
    });
  }

  console.log('[CONSULTATIONS] ✓ Date range is valid');

  // ============================================================================
  // STEP 5: Fetch available slots from Cal.com
  // ============================================================================
  console.log('[CONSULTATIONS] ========== Fetching Available Slots from Cal.com ==========');
  console.log(`[CONSULTATIONS] Calling calcomService.getAvailableSlots()`);
  console.log(`[CONSULTATIONS]   - eventTypeId: ${eventTypeId}`);
  console.log(`[CONSULTATIONS]   - startDate: ${startDate}`);
  console.log(`[CONSULTATIONS]   - endDate: ${endDate}`);

  const slots = await calcomService.getAvailabilitySlots(eventTypeId, startDate, endDate);

  console.log(`[CONSULTATIONS] ✓ Successfully fetched ${slots.length} available slots`);

  // ============================================================================
  // STEP 6: Return success response
  // ============================================================================
  console.log('[CONSULTATIONS] ========== Returning Success Response ==========');
  console.log('[CONSULTATIONS] Status: 200 OK');
  console.log('[CONSULTATIONS] Response structure:');
  console.log('[CONSULTATIONS]   - success: true');
  console.log('[CONSULTATIONS]   - data:');
  console.log(`[CONSULTATIONS]     - type: ${type}`);
  console.log(`[CONSULTATIONS]     - eventType: ${eventTypeId}`);
  console.log(`[CONSULTATIONS]     - duration: ${consultationDetails.duration}`);
  console.log(`[CONSULTATIONS]     - startDate: ${startDate}`);
  console.log(`[CONSULTATIONS]     - endDate: ${endDate}`);
  console.log(`[CONSULTATIONS]     - slots: (array of ${slots.length} slots)`);
  console.log('[CONSULTATIONS] ========== End of Request ==========');

  logger.info(`GET /consultations/slots: Successfully fetched ${slots.length} slots for ${type} consultation`);

  res.json({
    success: true,
    data: {
      type,
      eventType: eventTypeId,
      duration: consultationDetails.duration,
      startDate,
      endDate,
      slots,
    },
  });
});

export default router;
