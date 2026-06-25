import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Helper function to validate date format (YYYY-MM-DD)
const isValidDateFormat = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);

// GET /calendar/bookings - Get all bookings for calendar display
router.get('/bookings', async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    // Validate date format if provided
    if (startDate && !isValidDateFormat(startDate)) {
      return res.status(400).json({ error: 'Invalid startDate format. Use YYYY-MM-DD' });
    }

    if (endDate && !isValidDateFormat(endDate)) {
      return res.status(400).json({ error: 'Invalid endDate format. Use YYYY-MM-DD' });
    }

    // Validate date range
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) {
        return res.status(400).json({ error: 'startDate must be before or equal to endDate' });
      }
    }

    const filters = [];

    // Filter by date range
    if (startDate) {
      filters.push(`scheduledDateTime >= "${startDate}"`);
    }
    if (endDate) {
      // Add one day to include the entire end date
      const endDateObj = new Date(endDate);
      endDateObj.setDate(endDateObj.getDate() + 1);
      const nextDay = endDateObj.toISOString().split('T')[0];
      filters.push(`scheduledDateTime < "${nextDay}"`);
    }

    const filterString = filters.length > 0 ? filters.join(' && ') : '';

    const bookings = await pb.collection('bookings').getFullList({
      filter: filterString,
      expand: 'customerId',
      sort: 'scheduledDateTime',
    });

    logger.info(`Fetched ${bookings.length} bookings for calendar display`);

    res.json(
      bookings.map(b => {
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
      })
    );
  } catch (error) {
    logger.error('Error fetching bookings for calendar:', error.message);
    throw error;
  }
});

// GET /calendar/availability - Get all availability slots for calendar display
router.get('/availability', async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    // Validate date format if provided
    if (startDate && !isValidDateFormat(startDate)) {
      return res.status(400).json({ error: 'Invalid startDate format. Use YYYY-MM-DD' });
    }

    if (endDate && !isValidDateFormat(endDate)) {
      return res.status(400).json({ error: 'Invalid endDate format. Use YYYY-MM-DD' });
    }

    // Validate date range
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) {
        return res.status(400).json({ error: 'startDate must be before or equal to endDate' });
      }
    }

    const filters = [];

    // Filter by date range
    if (startDate) {
      filters.push(`date >= "${startDate}"`);
    }
    if (endDate) {
      filters.push(`date <= "${endDate}"`);
    }

    const filterString = filters.length > 0 ? filters.join(' && ') : '';

    const slots = await pb.collection('availability').getFullList({
      filter: filterString,
      sort: 'date,startTime',
    });

    logger.info(`Fetched ${slots.length} availability slots for calendar display`);

    res.json(
      slots.map(s => {
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
      })
    );
  } catch (error) {
    logger.error('Error fetching availability slots for calendar:', error.message);
    throw error;
  }
});

// GET /calendar/blocked - Get all blocked dates for calendar display
router.get('/blocked', async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    // Validate date format if provided
    if (startDate && !isValidDateFormat(startDate)) {
      return res.status(400).json({ error: 'Invalid startDate format. Use YYYY-MM-DD' });
    }

    if (endDate && !isValidDateFormat(endDate)) {
      return res.status(400).json({ error: 'Invalid endDate format. Use YYYY-MM-DD' });
    }

    // Validate date range
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) {
        return res.status(400).json({ error: 'startDate must be before or equal to endDate' });
      }
    }

    const filters = [];

    // Filter by date range
    if (startDate) {
      filters.push(`date >= "${startDate}"`);
    }
    if (endDate) {
      filters.push(`date <= "${endDate}"`);
    }

    const filterString = filters.length > 0 ? filters.join(' && ') : '';

    const blockedDates = await pb.collection('blockedDates').getFullList({
      filter: filterString,
      sort: 'date',
    });

    logger.info(`Fetched ${blockedDates.length} blocked dates for calendar display`);

    res.json(
      blockedDates.map(b => {
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
      })
    );
  } catch (error) {
    logger.error('Error fetching blocked dates for calendar:', error.message);
    throw error;
  }
});

export default router;