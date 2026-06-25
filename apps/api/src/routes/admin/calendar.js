import express from 'express';
import adminAuth from '../../middleware/adminAuth.js';
import pb from '../../utils/pocketbaseClient.js';
import logger from '../../utils/logger.js';

const router = express.Router();

// Apply admin authentication middleware to all routes in this file
router.use(adminAuth);

// Helper function to validate date format (YYYY-MM-DD)
const isValidDateFormat = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);

// GET /admin/calendar - Get calendar data (protected)
router.get('/', async (req, res) => {
  console.log('[CALENDAR] ========== GET /admin/calendar Request Received ==========');
  console.log(`[CALENDAR] User ID: ${req.userId}`);
  console.log(`[CALENDAR] Query params:`, req.query);

  const { startDate, endDate } = req.query;

  try {
    // Validate date format if provided
    if (startDate && !isValidDateFormat(startDate)) {
      console.log('[CALENDAR] Invalid startDate format');
      return res.status(400).json({ error: 'Invalid startDate format. Use YYYY-MM-DD' });
    }

    if (endDate && !isValidDateFormat(endDate)) {
      console.log('[CALENDAR] Invalid endDate format');
      return res.status(400).json({ error: 'Invalid endDate format. Use YYYY-MM-DD' });
    }

    // Validate date range
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) {
        console.log('[CALENDAR] Invalid date range');
        return res.status(400).json({ error: 'startDate must be before or equal to endDate' });
      }
    }

    const filters = [];

    // Filter by date range
    if (startDate) {
      filters.push(`scheduledDateTime >= "${startDate}"`);
      console.log(`[CALENDAR] Filter by startDate: ${startDate}`);
    }
    if (endDate) {
      // Add one day to include the entire end date
      const endDateObj = new Date(endDate);
      endDateObj.setDate(endDateObj.getDate() + 1);
      const nextDay = endDateObj.toISOString().split('T')[0];
      filters.push(`scheduledDateTime < "${nextDay}"`);
      console.log(`[CALENDAR] Filter by endDate: ${endDate}`);
    }

    const filterString = filters.length > 0 ? filters.join(' && ') : '';

    console.log('[CALENDAR] Fetching bookings for calendar...');
    const bookings = await pb.collection('bookings').getFullList({
      filter: filterString,
      expand: 'customerId',
      sort: 'scheduledDateTime',
    });

    console.log(`[CALENDAR] Fetched ${bookings.length} bookings`);

    console.log('[CALENDAR] Fetching availability slots...');
    const slots = await pb.collection('availability').getFullList({
      sort: 'date,startTime',
    });

    console.log(`[CALENDAR] Fetched ${slots.length} availability slots`);

    console.log('[CALENDAR] Fetching blocked dates...');
    const blockedDates = await pb.collection('blockedDates').getFullList({
      sort: 'date',
    });

    console.log(`[CALENDAR] Fetched ${blockedDates.length} blocked dates`);

    res.json({
      success: true,
      data: {
        bookings: bookings.map(b => {
          const startTime = new Date(b.scheduledDateTime);
          const endTime = new Date(startTime.getTime() + (b.duration || 30) * 60000);

          return {
            id: b.id,
            customerId: b.customerId,
            customerName: b.expand?.customerId?.name || 'N/A',
            consultationType: b.consultationType,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            status: b.status || 'pending',
            paymentStatus: b.paymentStatus,
            duration: b.duration || 30,
            createdAt: b.createdAt,
          };
        }),
        availability: slots.map(s => {
          const startDateTime = new Date(`${s.date}T${s.startTime}:00`);
          const endDateTime = new Date(`${s.date}T${s.endTime}:00`);

          return {
            id: s.id,
            date: s.date,
            startTime: s.startTime,
            endTime: s.endTime,
            startDateTime: startDateTime.toISOString(),
            endDateTime: endDateTime.toISOString(),
            available: true,
            recurring: s.recurring || false,
            timezone: s.timezone,
            createdAt: s.createdAt,
          };
        }),
        blockedDates: blockedDates.map(b => {
          const startDateTime = b.startTime
            ? new Date(`${b.date}T${b.startTime}:00`).toISOString()
            : new Date(`${b.date}T00:00:00`).toISOString();
          const endDateTime = b.endTime
            ? new Date(`${b.date}T${b.endTime}:00`).toISOString()
            : new Date(`${b.date}T23:59:59`).toISOString();

          return {
            id: b.id,
            date: b.date,
            startTime: b.startTime,
            endTime: b.endTime,
            startDateTime,
            endDateTime,
            reason: b.reason,
            blocked: true,
            timezone: b.timezone,
            createdAt: b.createdAt,
          };
        }),
      },
    });
  } catch (error) {
    console.log(`[CALENDAR] Error fetching calendar data: ${error.message}`);
    logger.error('GET /admin/calendar error:', error.message);
    throw error;
  }
});

// GET /admin/calendar/:id - Get specific calendar event (protected)
router.get('/:id', async (req, res) => {
  console.log('[CALENDAR] ========== GET /admin/calendar/:id Request Received ==========');
  console.log(`[CALENDAR] User ID: ${req.userId}`);
  console.log(`[CALENDAR] Event ID: ${req.params.id}`);

  try {
    console.log(`[CALENDAR] Fetching booking ${req.params.id}...`);
    const booking = await pb.collection('bookings').getOne(req.params.id, {
      expand: 'customerId',
    });

    console.log(`[CALENDAR] Booking found: ${booking.id}`);

    const startTime = new Date(booking.scheduledDateTime);
    const endTime = new Date(startTime.getTime() + (booking.duration || 30) * 60000);

    res.json({
      success: true,
      data: {
        id: booking.id,
        customerId: booking.customerId,
        customerName: booking.expand?.customerId?.name || 'N/A',
        consultationType: booking.consultationType,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        status: booking.status || 'pending',
        paymentStatus: booking.paymentStatus,
        duration: booking.duration || 30,
        amount: booking.amount,
        zoomLink: booking.zoomLink,
        notes: booking.notes,
        createdAt: booking.createdAt,
      },
    });
  } catch (error) {
    console.log(`[CALENDAR] Error fetching calendar event ${req.params.id}: ${error.message}`);
    logger.error(`GET /admin/calendar/:id error:`, error.message);
    throw error;
  }
});

export default router;