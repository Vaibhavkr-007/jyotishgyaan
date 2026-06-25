import express from 'express';
import auth from '../middleware/auth.js';
import pb from '../utils/pocketbaseAdminClient.js';
import calcomService from '../services/calcomService.js';
import razorpayService from '../services/razorpayService.js';

const router = express.Router();

router.get('/my-bookings', auth, async (req, res) => {

    try {

        const customerId = req.user.id;

        const bookings =
            await pb.collection(
                'bookings'
            ).getFullList({
                filter:
                    `customerId="${customerId}"`,
                $autoCancel: false
            });

        return res.json({

            success: true,

            data: bookings,

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            error: 'Failed to fetch bookings',

        });

    }

});


router.post('/:id/reschedule', auth, async (req, res) => {

    try {

        const customerId = req.user.id;

        const bookingId = req.params.id;

        const {
            slotStart,
            reason,
        } = req.body;

        const booking =
            await pb.collection('bookings')
                .getOne(bookingId);

        if (
            booking.customerId !== customerId
        ) {

            return res.status(403).json({

                success: false,

                error: 'Unauthorized',

            });

        }

        if (
            booking.status !== 'confirmed'
        ) {

            return res.status(400).json({

                success: false,

                error:
                    'Only confirmed bookings can be rescheduled',

            });

        }

        const oldDate =
            booking.scheduledDateTime;

        console.log(
            'Booking UID:',
            booking.calBookingUid
        );

        const calResponse =
            await calcomService.rescheduleBooking(

                booking.calBookingUid,

                slotStart,

                booking.customerEmail,

                reason ||

                'Customer requested reschedule'

            );

        console.log(
            'CAL RESPONSE:',
            JSON.stringify(calResponse, null, 2)
        );

        const meetingUrl =
            calResponse?.data?.meetingUrl ||

            calResponse?.data?.location ||

            '';

        const isValidUrl =
            /^https?:\/\//.test(meetingUrl);

        const newCalUid =
            calResponse?.data?.rescheduledToUid ||
            calResponse?.data?.uid ||
            booking.calBookingUid;

        const updatedBooking =
            await pb.collection('bookings')
                .update(

                    bookingId,

                    {

                        scheduledDateTime:
                            slotStart,

                        zoomLink:
                            isValidUrl
                                ? meetingUrl
                                : booking.zoomLink,

                        calBookingUid:
                            calResponse?.data?.rescheduledToUid ||

                            calResponse?.data?.uid ||

                            booking.calBookingUid,

                        rescheduledFromUid:
                            booking.calBookingUid,

                        rescheduledToUid:
                            newCalUid,

                        calBookingId:
                            calResponse?.data?.id,

                        calBookingResponse:
                            JSON.stringify(
                                calResponse
                            ),

                        rescheduledAt:
                            new Date()
                                .toISOString(),

                        rescheduledFrom:
                            oldDate,

                        reschedulingReason:
                            reason || '',

                        rescheduledCount:
                            (
                                booking
                                    .rescheduledCount || 0
                            ) + 1,

                    }

                );

        return res.json({

            success: true,

            data: updatedBooking,

        });

    } catch (error) {

        console.error(error);

        console.error(
            "PocketBase response:",
            error.response?.data
        );

        return res.status(500).json({

            success: false,

            error:
                error.response?.data ||
                error.message,

        });

    }

});

router.post('/:id/cancel', auth, async (req, res) => {

    try {

        const customerId =
            req.user.id;

        const bookingId =
            req.params.id;

        const {
            reason,
        } = req.body;

        const booking =
            await pb.collection('bookings')
                .getOne(bookingId);

        if (
            booking.customerId !== customerId
        ) {

            return res.status(403).json({

                success: false,

                error: 'Unauthorized',

            });

        }

        if (
            booking.status !== 'confirmed'
        ) {

            return res.status(400).json({

                success: false,

                error:
                    'Only confirmed bookings can be cancelled',

            });

        }

        const bookingStart =
            new Date(
                booking.scheduledDateTime
            );

        const now =
            new Date();

        const hoursRemaining =
            (
                bookingStart - now
            ) /
            (
                1000 * 60 * 60
            );

        if (
            hoursRemaining < 5
        ) {

            return res.status(400).json({

                success: false,

                error:
                    'Bookings can only be cancelled at least 5 hours before the consultation.',

            });

        }

        const calResponse =
            await calcomService.cancelBooking(

                booking.calBookingUid,

                reason ||

                'Cancelled by customer'

            );

        const refundResponse =
            await razorpayService.processRefund(
                booking.razorpayPaymentId
            );

        console.log(
            'REFUND RESPONSE:',
            JSON.stringify(
                refundResponse,
                null,
                2
            )
        );

        const updatedBooking =
            await pb.collection('bookings')
                .update(

                    bookingId,

                    {

                        status:
                            'cancelled',

                        cancelledAt:
                            new Date()
                                .toISOString(),

                        cancellationReason:
                            reason || '',

                        cancelledBy:
                            'customer',

                        cancelledCalBookingUid:
                            booking.calBookingUid,

                        refundStatus:
                            'refunded',

                        refundId:
                            refundResponse.refundId,

                        refundAmount:
                            refundResponse.amount / 100,

                        refundedAt:
                            new Date()
                                .toISOString(),

                        calBookingResponse:
                            JSON.stringify(
                                calResponse
                            ),

                    }

                );

        return res.json({

            success: true,

            data: updatedBooking,

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            error:
                error.message,

        });

    }

});

export default router;