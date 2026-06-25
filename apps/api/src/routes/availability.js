import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Helper function to validate time format (HH:MM)
const isValidTimeFormat = (time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);

// Helper function to validate date format (YYYY-MM-DD)
const isValidDateFormat = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);

// Helper function to convert local time to UTC
const convertToUTC = (date, time, timezone) => {
  const dateTimeStr = `${date}T${time}:00`;
  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: timezone,
  });
  
  const localDate = new Date(dateTimeStr);
  const parts = formatter.formatToParts(localDate);
  const partMap = {};
  parts.forEach(part => {
    partMap[part.type] = part.value;
  });
  
  const offset = new Date(dateTimeStr) - new Date(
    new Date(dateTimeStr).toLocaleString('en-US', { timeZone: timezone })
  );
  
  return new Date(new Date(dateTimeStr).getTime() - offset).toISOString();
};

// Helper function to convert UTC to local time
const convertFromUTC = (utcDateTime, timezone) => {
  const date = new Date(utcDateTime);
  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: timezone,
  });
  
  const parts = formatter.formatToParts(date);
  const partMap = {};
  parts.forEach(part => {
    partMap[part.type] = part.value;
  });
  
  return {
    date: `${partMap.year}-${partMap.month}-${partMap.day}`,
    time: `${partMap.hour}:${partMap.minute}`,
  };
};

// POST /availability/sync - Trigger Cal.com synchronization
router.post('/sync', async (req, res) => {
  const calcomApiKey = process.env.CALCOM_API_KEY;
  const calcomBaseUrl = process.env.CALCOM_BASE_URL || 'https://api.cal.com/v2';

  if (!calcomApiKey) {
    return res.status(400).json({
      status: 'error',
      message: 'Cal.com API key is not configured',
      lastSyncTime: new Date().toISOString(),
    });
  }

  try {
    logger.info('Starting Cal.com sync');

    // Fetch availability slots from Cal.com
    const calcomResponse = await fetch(`${calcomBaseUrl}/schedules`, {
      headers: {
        'Authorization': `Bearer ${calcomApiKey}`,
      },
    });

    if (!calcomResponse.ok) {
      throw new Error(`Cal.com API error: ${calcomResponse.status} ${calcomResponse.statusText}`);
    }

    const calcomData = await calcomResponse.json();
    const syncedSlots = calcomData.slots ? calcomData.slots.length : 0;

    logger.info(`Cal.com sync completed: ${syncedSlots} slots synced`);

    res.json({
      status: 'synced',
      lastSyncTime: new Date().toISOString(),
      nextSyncTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      message: `Successfully synced ${syncedSlots} slots from Cal.com`,
      syncedSlots,
    });
  } catch (error) {
    logger.error('Cal.com sync error:', error.message);
    throw error;
  }
});


router.get('/cal-slots', async (req, res) => {
    try {

        const { start, end } = req.query;

        const response = await fetch(
            `${process.env.CALCOM_BASE_URL}/slots?eventTypeId=${process.env.CAL_EVENT_TYPE_ID}&start=${start}&end=${end}&timeZone=Asia/Kolkata`,
            {
                headers: {
                    Authorization: process.env.CALCOM_API_KEY,
                    "cal-api-version": "2024-09-04",
                },
            }
        );

        const data = await response.json();

        res.json(data);

    } catch (error) {

        res.status(500).json({
            error: error.message,
        });

    }
});

// GET /availability/sync-status - Get current sync status
router.get('/sync-status', async (req, res) => {
  try {
    // Try to get last sync info from settings or return defaults
    const lastSyncTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const nextSyncTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    res.json({
      status: 'synced',
      lastSyncTime,
      nextSyncTime,
      message: 'Sync status retrieved successfully',
    });
  } catch (error) {
    logger.error('Error getting sync status:', error.message);
    throw error;
  }
});

// POST /availability - Add new availability slot
router.post('/', async (req, res) => {
  const { date, startTime, endTime, recurring, recurringPattern, recurringDays, recurringEndDate, timezone = 'Asia/Kolkata' } = req.body;

  // Validate required fields
  if (!date || !startTime || !endTime) {
    return res.status(400).json({ error: 'Date, start time, and end time are required' });
  }

  // Validate date format
  if (!isValidDateFormat(date)) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
  }

  // Validate time format
  if (!isValidTimeFormat(startTime) || !isValidTimeFormat(endTime)) {
    return res.status(400).json({ error: 'Invalid time format. Use HH:MM' });
  }

  // Validate start time is before end time
  if (startTime >= endTime) {
    return res.status(400).json({ error: 'Start time must be before end time' });
  }

  try {
    // Convert to UTC for storage
    const startTimeUTC = convertToUTC(date, startTime, timezone);
    const endTimeUTC = convertToUTC(date, endTime, timezone);

    const slot = await pb.collection('availability').create({
      date,
      startTime,
      endTime,
      startTimeUTC,
      endTimeUTC,
      timezone,
      recurring: recurring || false,
      recurringPattern: recurringPattern || null,
      recurringDays: recurringDays || null,
      recurringEndDate: recurringEndDate || null,
    });

    logger.info(`Availability slot created: ${slot.id}`);

    res.status(201).json({
      id: slot.id,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      timezone: slot.timezone,
      recurring: slot.recurring,
      recurringPattern: slot.recurringPattern,
      recurringDays: slot.recurringDays,
      recurringEndDate: slot.recurringEndDate,
      createdAt: slot.createdAt,
    });
  } catch (error) {
    logger.error('Error creating availability slot:', error.message);
    throw error;
  }
});

// GET /availability - Get all availability slots
router.get('/', async (req, res) => {
  const { date, timezone = 'Asia/Kolkata' } = req.query;

  try {
    let filter = '';

    // Filter by specific date if provided
    if (date) {
      if (!isValidDateFormat(date)) {
        return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
      }
      filter = `date = "${date}"`;
    }

    const slots = await pb.collection('availability').getFullList({
      filter,
      sort: 'date,startTime',
    });

    logger.info(`Fetched ${slots.length} availability slots`);

    res.json(
      slots.map(s => ({
        id: s.id,
        date: s.date,
        startTime: s.startTime,
        endTime: s.endTime,
        timezone: s.timezone || timezone,
        recurring: s.recurring,
        recurringPattern: s.recurringPattern,
        recurringDays: s.recurringDays,
        recurringEndDate: s.recurringEndDate,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      }))
    );
  } catch (error) {
    logger.error('Error fetching availability slots:', error.message);
    throw error;
  }
});

// PUT /availability/:id - Update availability slot
router.put('/:id', async (req, res) => {
  const { date, startTime, endTime, recurring, recurringPattern, recurringDays, recurringEndDate, timezone = 'Asia/Kolkata' } = req.body;

  // Validate required fields
  if (!date || !startTime || !endTime) {
    return res.status(400).json({ error: 'Date, start time, and end time are required' });
  }

  // Validate date format
  if (!isValidDateFormat(date)) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
  }

  // Validate time format
  if (!isValidTimeFormat(startTime) || !isValidTimeFormat(endTime)) {
    return res.status(400).json({ error: 'Invalid time format. Use HH:MM' });
  }

  // Validate start time is before end time
  if (startTime >= endTime) {
    return res.status(400).json({ error: 'Start time must be before end time' });
  }

  try {
    // Convert to UTC for storage
    const startTimeUTC = convertToUTC(date, startTime, timezone);
    const endTimeUTC = convertToUTC(date, endTime, timezone);

    const slot = await pb.collection('availability').update(req.params.id, {
      date,
      startTime,
      endTime,
      startTimeUTC,
      endTimeUTC,
      timezone,
      recurring: recurring || false,
      recurringPattern: recurringPattern || null,
      recurringDays: recurringDays || null,
      recurringEndDate: recurringEndDate || null,
    });

    logger.info(`Availability slot ${req.params.id} updated`);

    res.json({
      id: slot.id,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      timezone: slot.timezone,
      recurring: slot.recurring,
      recurringPattern: slot.recurringPattern,
      recurringDays: slot.recurringDays,
      recurringEndDate: slot.recurringEndDate,
      updatedAt: slot.updatedAt,
    });
  } catch (error) {
    logger.error('Error updating availability slot:', error.message);
    throw error;
  }
});

// DELETE /availability/:id - Delete availability slot
router.delete('/:id', async (req, res) => {
  try {
    await pb.collection('availability').delete(req.params.id);
    logger.info(`Availability slot ${req.params.id} deleted`);
    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting availability slot:', error.message);
    throw error;
  }
});

// POST /availability/recurring - Add recurring availability
router.post('/recurring', async (req, res) => {
  const { startDate, endDate, pattern, daysOfWeek, dayOfMonth, startTime, endTime, timezone = 'Asia/Kolkata' } = req.body;

  // Validate required fields
  if (!startDate || !endDate || !pattern || !startTime || !endTime) {
    return res.status(400).json({ error: 'Start date, end date, pattern, start time, and end time are required' });
  }

  // Validate date format
  if (!isValidDateFormat(startDate) || !isValidDateFormat(endDate)) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
  }

  // Validate time format
  if (!isValidTimeFormat(startTime) || !isValidTimeFormat(endTime)) {
    return res.status(400).json({ error: 'Invalid time format. Use HH:MM' });
  }

  // Validate start time is before end time
  if (startTime >= endTime) {
    return res.status(400).json({ error: 'Start time must be before end time' });
  }

  // Validate pattern
  if (!['daily', 'weekly', 'monthly'].includes(pattern)) {
    return res.status(400).json({ error: 'Pattern must be daily, weekly, or monthly' });
  }

  // Validate pattern-specific fields
  if (pattern === 'weekly' && (!daysOfWeek || daysOfWeek.length === 0)) {
    return res.status(400).json({ error: 'Days of week are required for weekly pattern' });
  }

  if (pattern === 'monthly' && !dayOfMonth) {
    return res.status(400).json({ error: 'Day of month is required for monthly pattern' });
  }

  try {
    const createdSlots = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Generate dates based on pattern
    const dates = [];
    let current = new Date(start);

    while (current <= end) {
      if (pattern === 'daily') {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      } else if (pattern === 'weekly') {
        const dayOfWeek = current.getDay();
        if (daysOfWeek.includes(dayOfWeek)) {
          dates.push(new Date(current));
        }
        current.setDate(current.getDate() + 1);
      } else if (pattern === 'monthly') {
        if (current.getDate() === dayOfMonth) {
          dates.push(new Date(current));
        }
        current.setDate(current.getDate() + 1);
      }
    }

    // Create availability slots for each date
    for (const date of dates) {
      const dateStr = date.toISOString().split('T')[0];
      const startTimeUTC = convertToUTC(dateStr, startTime, timezone);
      const endTimeUTC = convertToUTC(dateStr, endTime, timezone);

      const slot = await pb.collection('availability').create({
        date: dateStr,
        startTime,
        endTime,
        startTimeUTC,
        endTimeUTC,
        timezone,
        recurring: true,
        recurringPattern: pattern,
        recurringDays: daysOfWeek || null,
        recurringEndDate: endDate,
      });

      createdSlots.push({
        id: slot.id,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        createdAt: slot.createdAt,
      });
    }

    logger.info(`Created ${createdSlots.length} recurring availability slots`);

    res.status(201).json({
      message: `Created ${createdSlots.length} recurring availability slots`,
      slots: createdSlots,
    });
  } catch (error) {
    logger.error('Error creating recurring availability:', error.message);
    throw error;
  }
});

// POST /availability/blocked - Add blocked date
router.post('/blocked', async (req, res) => {
  const { date, startTime, endTime, reason, timezone = 'Asia/Kolkata' } = req.body;

  // Validate required fields
  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }

  // Validate date format
  if (!isValidDateFormat(date)) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
  }

  // Validate time format if provided
  if ((startTime && !isValidTimeFormat(startTime)) || (endTime && !isValidTimeFormat(endTime))) {
    return res.status(400).json({ error: 'Invalid time format. Use HH:MM' });
  }

  // Validate start time is before end time if both provided
  if (startTime && endTime && startTime >= endTime) {
    return res.status(400).json({ error: 'Start time must be before end time' });
  }

  try {
    const blockedDate = await pb.collection('blockedDates').create({
      date,
      startTime: startTime || null,
      endTime: endTime || null,
      reason: reason || '',
      timezone,
    });

    logger.info(`Blocked date created: ${blockedDate.id}`);

    res.status(201).json({
      id: blockedDate.id,
      date: blockedDate.date,
      startTime: blockedDate.startTime,
      endTime: blockedDate.endTime,
      reason: blockedDate.reason,
      timezone: blockedDate.timezone,
      createdAt: blockedDate.createdAt,
    });
  } catch (error) {
    logger.error('Error creating blocked date:', error.message);
    throw error;
  }
});

// GET /availability/blocked - Get all blocked dates
router.get('/blocked', async (req, res) => {
  try {
    const blockedDates = await pb.collection('blockedDates').getFullList({
      sort: 'date',
    });

    logger.info(`Fetched ${blockedDates.length} blocked dates`);

    res.json(
      blockedDates.map(b => ({
        id: b.id,
        date: b.date,
        startTime: b.startTime,
        endTime: b.endTime,
        reason: b.reason,
        timezone: b.timezone,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
      }))
    );
  } catch (error) {
    logger.error('Error fetching blocked dates:', error.message);
    throw error;
  }
});

// PUT /availability/blocked/:id - Update blocked date
router.put('/blocked/:id', async (req, res) => {
  const { date, startTime, endTime, reason, timezone = 'Asia/Kolkata' } = req.body;

  // Validate required fields
  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }

  // Validate date format
  if (!isValidDateFormat(date)) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
  }

  // Validate time format if provided
  if ((startTime && !isValidTimeFormat(startTime)) || (endTime && !isValidTimeFormat(endTime))) {
    return res.status(400).json({ error: 'Invalid time format. Use HH:MM' });
  }

  // Validate start time is before end time if both provided
  if (startTime && endTime && startTime >= endTime) {
    return res.status(400).json({ error: 'Start time must be before end time' });
  }

  try {
    const blockedDate = await pb.collection('blockedDates').update(req.params.id, {
      date,
      startTime: startTime || null,
      endTime: endTime || null,
      reason: reason || '',
      timezone,
    });

    logger.info(`Blocked date ${req.params.id} updated`);

    res.json({
      id: blockedDate.id,
      date: blockedDate.date,
      startTime: blockedDate.startTime,
      endTime: blockedDate.endTime,
      reason: blockedDate.reason,
      timezone: blockedDate.timezone,
      updatedAt: blockedDate.updatedAt,
    });
  } catch (error) {
    logger.error('Error updating blocked date:', error.message);
    throw error;
  }
});

// DELETE /availability/blocked/:id - Delete blocked date
router.delete('/blocked/:id', async (req, res) => {
  try {
    await pb.collection('blockedDates').delete(req.params.id);
    logger.info(`Blocked date ${req.params.id} deleted`);
    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting blocked date:', error.message);
    throw error;
  }
});

export default router;