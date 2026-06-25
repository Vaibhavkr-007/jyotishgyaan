import express from 'express';
import adminAuth from '../../middleware/adminAuth.js';
import pb from '../../utils/pocketbaseAdminClient.js';
import logger from '../../utils/logger.js';

const router = express.Router();

// Apply admin authentication middleware to all routes in this file
router.use(adminAuth);

// GET /admin/bookings - Get all bookings with advanced filtering (protected)
import pbAdmin from '../../utils/pocketbaseAdminClient.js';

router.get('/', async (req, res) => {
  try {

    const consultationBookings = await pbAdmin
      .collection('bookings')
      .getFullList({
        sort: '-scheduledDateTime'
      });

    const courseSessions = await pbAdmin
      .collection('course_sessions')
      .getFullList({
        sort: '-scheduledDateTime'
      });

    const enrollments = await pbAdmin
      .collection('course_enrollments')
      .getFullList({
        $autoCancel: false
      });

    const users = await pbAdmin
      .collection('users')
      .getFullList();

    const enrollmentMap = {};
    enrollments.forEach(e => {
        enrollmentMap[e.id] = e;
    });

    const userMap = {};
    users.forEach(u => {
        userMap[u.id] = u;
    });

    const consultations = consultationBookings.map(b => ({
      id: b.id,

      bookingType:
        b.consultationType === 'chat'
          ? 'Chat Consultation'
          : b.consultationType === 'audio'
          ? 'Audio Consultation'
          : 'Video Consultation',

      service: b.consultationCategory || '-',

      customerId: b.customerId,
      customerName: b.customerName,
      customerEmail: b.customerEmail,
      scheduledDateTime: b.scheduledDateTime,
      sessionLabel: '-',

      status: b.status,
      paymentStatus: b.paymentStatus,

      amount: b.amount,

      source: 'consultation',

      zoomLink: b.zoomLink,
    }));

    console.log(
      JSON.stringify(courseSessions[0], null, 2)
    );
    
    const sessions = courseSessions.map(s => {

        const enrollment =
            enrollmentMap[s.enrollmentId];

        const user =
            userMap[s.customerId];

        // console.log('SESSION ID:', s.id);
        // console.log('CUSTOMER ID:', s.customerId);
        // console.log('USER:', user);

        return {
            id: s.id,

            bookingType: 'Course Session',

            service: enrollment
                ? `${enrollment.courseName} (${s.sessionNumber}/${enrollment.totalSessions})`
                : `Session ${s.sessionNumber}`,

            sessionLabel: `Session #${s.sessionNumber}`,

            customerId: s.customerId,

            customerName:
                user?.name || 'N/A',

            customerEmail:
                user?.email || 'N/A',

            customerPhone:
                user?.phone || 'N/A',

            scheduledDateTime: s.scheduledDateTime,

            status: s.status,

            paymentStatus: 'N/A',

            amount: 0,

            sessionNumber: s.sessionNumber,

            source: 'course',

            zoomLink: s.zoomLink,
        };
    });

    let combined = [...consultations, ...sessions]
      .sort(
        (a, b) =>
          new Date(b.scheduledDateTime) -
          new Date(a.scheduledDateTime)
      );

    function getBookingState(record) {

        const now = new Date();

        const bookingDate =
            new Date(record.scheduledDateTime);

        if (record.status === 'cancelled') {
            return 'Cancelled';
        }

        if (bookingDate < now) {
            return 'Completed';
        }

        return 'Upcoming';
    }

    combined = combined.map(item => ({
        ...item,
        derivedStatus: getBookingState(item)
    }));

    combined.sort(
        (a, b) =>
            new Date(b.scheduledDateTime) -
            new Date(a.scheduledDateTime)
    );

    console.log(
        JSON.stringify(
            combined[0],
            null,
            2
        )
    );

    return res.json({
      success: true,
      data: combined
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /admin/bookings/:id - Get booking details (protected)
router.get('/:id', async (req, res) => {
  console.log('[BOOKINGS] ========== GET /admin/bookings/:id Request Received ==========');
  console.log(`[BOOKINGS] User ID: ${req.userId}`);
  console.log(`[BOOKINGS] Booking ID: ${req.params.id}`);

  try {
    console.log(`[BOOKINGS] Fetching booking ${req.params.id}...`);
    const booking = await pb.collection('bookings').getOne(req.params.id, {
      expand: 'customerId',
    });

    console.log(`[BOOKINGS] Booking found: ${booking.id}`);

    res.json({
      success: true,
      data: {
        id: booking.id,
        customerId: booking.customerId,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone,
        consultationType: booking.consultationType,
        consultationCategory: booking.consultationCategory,
        scheduledDateTime: booking.scheduledDateTime,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        amount: booking.amount,
        razorpayPaymentId: booking.razorpayPaymentId,
        razorpayOrderId: booking.razorpayOrderId,
        zoomLink: booking.zoomLink,
        whatsappLink: booking.whatsappLink,
        notes: booking.notes,
        internalNotes: booking.internalNotes,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      },
    });
  } catch (error) {
    console.log(`[BOOKINGS] Error fetching booking ${req.params.id}: ${error.message}`);
    logger.error(`GET /admin/bookings/:id error:`, error.message);
    throw error;
  }
});

// POST /admin/bookings - Create new booking (protected)
router.post('/', async (req, res) => {
  console.log('[BOOKINGS] ========== POST /admin/bookings Request Received ==========');
  console.log(`[BOOKINGS] User ID: ${req.userId}`);
  console.log('[BOOKINGS] Request body:', req.body);

  const {
    customerId,
    consultationType,
    consultationCategory,
    scheduledDateTime,
    amount,
    notes,
  } = req.body;

  // Validate required fields
  if (!customerId || !consultationType || !scheduledDateTime || !amount) {
    console.log('[BOOKINGS] Missing required fields');
    return res.status(400).json({ error: 'customerId, consultationType, scheduledDateTime, and amount are required' });
  }

  try {
    console.log('[BOOKINGS] Creating new booking...');
    const booking = await pb.collection('bookings').create({
      customerId,
      consultationType,
      consultationCategory: consultationCategory || null,
      scheduledDateTime,
      amount,
      notes: notes || '',
      status: 'pending',
      paymentStatus: 'pending',
    });

    console.log(`[BOOKINGS] Booking created: ${booking.id}`);

    res.status(201).json({
      success: true,
      data: {
        id: booking.id,
        customerId: booking.customerId,
        consultationType: booking.consultationType,
        consultationCategory: booking.consultationCategory,
        scheduledDateTime: booking.scheduledDateTime,
        amount: booking.amount,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        createdAt: booking.createdAt,
      },
    });
  } catch (error) {
    console.log(`[BOOKINGS] Error creating booking: ${error.message}`);
    logger.error('POST /admin/bookings error:', error.message);
    throw error;
  }
});

export default router;