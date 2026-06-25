import express from 'express';
import razorpayService from '../services/razorpayService.js';
import calcomService from '../services/calcomService.js';
import pb from '../utils/pocketbaseAdminClient.js';
import logger from '../utils/logger.js';
import auth from '../middleware/auth.js';
import { COURSE_CONFIG } from '../data/courseConfig.js';
import {
    sendCourseEnrollmentEmail
} from "../utils/sendCourseEmail.js";

const router = express.Router();

router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        error: 'Amount is required',
      });
    }

    const order =
      await razorpayService.createOrder(
          amount * 100,
          req.user.id,
          Date.now().toString()
      );

    return res.json({
      success: true,
      ...order,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {

    logger.error(
      'Create order error:',
      error.message
    );

    return res.status(500).json({
      success: false,
      error: error.message,
    });

  }
});

const EVENT_TYPES = {
  chat: 5798043,
  audio: 5798042,
  video: 5798041,
};

const DURATIONS = {
  chat: 10,
  audio: 15,
  video: 30,
};

router.post(
    '/verify-course-payment',
    auth,
    async (req, res) => {

        try {
            const customerId = req.user.id;

            const user = await pb
                .collection('users')
                .getOne(customerId);

            const {

                razorpay_payment_id,

                razorpay_order_id,

                razorpay_signature,

                courseId,

            } = req.body;

            const verification =
                await razorpayService
                    .verifyPaymentSignature(

                        razorpay_payment_id,

                        razorpay_order_id,

                        razorpay_signature

                    );

            if (
                !verification.verified
            ) {

                return res.status(400)
                    .json({

                        success: false,

                        error:
                            'Payment verification failed',

                    });

            }

            const course =
                COURSE_CONFIG[courseId];

            if (!course) {

                return res.status(400)
                    .json({

                        success: false,

                        error:
                            'Invalid course',

                    });

            }

            const existing =
                await pb.collection(
                    'course_enrollments'
                )
                .getFullList({

                    filter:
                        `customerId="${customerId}" && courseId="${courseId}"`

                });

            if (
                existing.length > 0
            ) {

                return res.status(400)
                    .json({

                        success: false,

                        error:
                            'Already enrolled',

                    });

            }

            console.log(
                'courseId:',
                courseId
            );

            console.log(
                'course:',
                course
            );

            console.log(
                'payload:',
                {
                    customerId,

                    courseId,

                    courseName:
                        course?.title,

                    level:
                        course?.level,

                    totalSessions:
                        course?.sessions,

                    completedSessions:
                        0,

                    status:
                        'active',

                    amount:
                        course?.price,
                }
            );

            const enrollmentData = {

                customerId,

                courseId,

                courseName:
                    course.title,

                level:
                    course.level,

                totalSessions:
                    Number(course.sessions),

                completedSessions:
                    Number(0),

                status:
                    'active',

                amount:
                    Number(course.price),

                razorpayPaymentId:
                    razorpay_payment_id,

                razorpayOrderId:
                    razorpay_order_id,

                enrolledAt:
                    new Date()
                        .toISOString(),

            };

            console.log(
                'ENROLLMENT DATA:',
                enrollmentData
            );

            console.log(
                typeof 0,
                0
            );

            console.log({
                customerId,
                courseId,
                totalSessions: course.sessions,
                completedSessions: 0,
            });

            const enrollment =
                await pb.collection(
                    'course_enrollments'
                ).create(
                    enrollmentData
                );

            const customer =
                await pb.collection(
                    "users"
                ).getOne(customerId);

            try {

                await sendCourseEnrollmentEmail(
                    customer.email,
                    customer.name,
                    course
                );

            } catch(err) {

                console.error(err);

            }

            return res.json({

                success: true,

                data:
                    enrollment,

            });

        } catch (error) {

            console.error('FULL ERROR');
            console.dir(error, { depth: null });

            console.error(
                'PB RESPONSE:',
                error.response
            );

            return res.status(500)
                .json({
                    success: false,
                    error: error.message,
                });

        }

    }
);

router.post('/verify', auth, async (req, res) => {

    console.log('REQ.USER:', req.user);

    console.log(
        'CUSTOMER ID:',
        req.user?.id
    );
    const customerId = req.user.id;
    const user = await pb
        .collection('users')
        .getOne(customerId);
    const customerName = user.name;
    const customerEmail = user.email;
    const customerPhone = user.phone || '';
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,

      consultationType,
      slotStart,

      service,
      specialRequests,
      amount,
    } = req.body;

    // ============================================================================
    // Validate required fields
    // ============================================================================
    if (
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature ||
      !consultationType ||
      !slotStart ||
      !customerName ||
      !customerEmail
    ) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    // ============================================================================
    // Verify Razorpay Signature
    // ============================================================================
    const verification =
      await razorpayService.verifyPaymentSignature(
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature
      );

    if (!verification.verified) {
      return res.status(400).json({
        success: false,
        error: 'Payment verification failed',
      });
    }

    // ============================================================================
    // Calculate end time
    // ============================================================================
    const type =
        consultationType.toLowerCase().includes('chat')
            ? 'chat'
            : consultationType.toLowerCase().includes('audio')
            ? 'audio'
            : 'video';

    const eventTypeId = EVENT_TYPES[type];

    const start = new Date(slotStart);

    const end = new Date(
        start.getTime() + DURATIONS[type] * 60 * 1000
    );


    const calBooking = await calcomService.createBooking(
        eventTypeId,
        start.toISOString(),
        customerEmail,
        customerName
    );

    // ============================================================================
    // Save booking in PocketBase
    // ============================================================================
    console.log(
        "PocketBase authenticated:",
        pb.authStore.isValid
    );

    console.log(
        "PocketBase token:",
        !!pb.authStore.token
    );

    try {

        const collections =
            await pb.collections.getFullList();

        console.log(
            collections.map(c => c.name)
        );

    } catch (err) {

        console.error(
            "COLLECTION ERROR:",
            err
        );

    }

    console.log("BEFORE CAL");
    console.log("slotStart:", slotStart);
    console.log("type:", type);
    console.log("start:", start.toISOString());
    console.log("end:", end.toISOString());

    console.log("Amount from frontend:", amount);
    console.log("Type of amount:", typeof amount);

    const meetingUrl =
        calBooking?.data?.meetingUrl ||
        calBooking?.data?.location ||
        '';

    const isValidUrl = /^https?:\/\//.test(meetingUrl);

    const booking =
      await pb.collection('bookings').create({
        customerId,
        consultationType: type,

        scheduledDateTime: start.toISOString(),

        status: 'confirmed',

        paymentStatus: 'paid',

        amount: amount || 0,

        razorpayPaymentId: razorpay_payment_id,

        razorpayOrderId: razorpay_order_id,

        customerName,

        customerEmail,

        customerPhone: customerPhone || '',

        notes: specialRequests || '',

        consultationCategory: service || '',

        calBookingId:
          calBooking?.data?.id || null,

        zoomLink: isValidUrl
            ? meetingUrl
            : '',

        calBookingUid:
          calBooking?.data?.uid,

        calBookingResponse:
          JSON.stringify(calBooking),
      });

      console.log("AFTER CAL");

    logger.info(
      `Booking created successfully: ${booking.id}`
    );

    // ============================================================================
    // Return success
    // ============================================================================
    return res.json({
      success: true,

      bookingId: booking.id,

      calBookingId:
        calBooking?.id,

      meetingLink:
        calBooking?.meetingUrl,

      message:
        'Payment verified and booking confirmed',
    });

  } catch (error) {

    console.error(error);

    logger.error(
      'Payment verification error:',
      error.message
    );

    console.error(
      "PocketBase response:",
      error.response?.data
    );

    return res.status(500).json({
      success: false,

      error:
        error.message ||
        'Something went wrong',
    });
  }
});

export default router;