import express from 'express';
import auth from '../middleware/auth.js';
import pb from '../utils/pocketbaseAdminClient.js';
import calcomService from '../services/calcomService.js';
import razorpayService
    from '../services/razorpayService.js';
import {
    sendCourseCancellationEmail
} from "../utils/sendCourseCancellationEmail.js";
import { COURSE_CONFIG } from "../data/courseConfig.js";

const router = express.Router();

const COURSE_EVENT_TYPE_ID = 6060886;


router.get(
    '/my-enrollments',
    auth,
    async (req, res) => {

        try {

            const customerId =
                req.user.id;

            console.log('Fetching enrollment...');

            const enrollments =
                await pb.collection(
                    'course_enrollments'
                ).getFullList({

                    filter:
                        `customerId="${customerId}"`,

                    $autoCancel: false

                });

            for (
                const enrollment
                of enrollments
            ) {

                const sessions =
                    await pb.collection(
                        'course_sessions'
                    ).getFullList({

                        filter:
                            `enrollmentId="${enrollment.id}"`,

                        sort:
                            'sessionNumber',

                        $autoCancel: false

                    });

                enrollment.sessions =
                    sessions;

                enrollment.nextSession =
                    sessions.length + 1;
            }

            return res.json({

                success: true,

                data:
                    enrollments,

            });

        } catch (error) {

            console.error(error);

            return res.status(500)
                .json({

                    success: false,

                    error:
                        error.message,

                });

        }

    }
);


router.post(
    '/book-session',
    auth,
    async (req, res) => {

        try {

            const customerId =
                req.user.id;

            const {

                enrollmentId,

                sessionNumber,

                slotStart,

            } = req.body;
                        const enrollment =
                await pb.collection(
                    'course_enrollments'
                ).getOne(
                    enrollmentId
                );

            if (
                enrollment.customerId
                !== customerId
            ) {

                return res.status(403)
                    .json({

                        success: false,

                        error:
                            'Unauthorized',

                    });

            }

                
                console.log('customerId:', customerId);
                console.log('enrollmentId:', enrollmentId);
                console.log('sessionNumber:', sessionNumber);
                console.log('slotStart:', slotStart);

                const existingSessions =
                    await pb.collection(
                        'course_sessions'
                    ).getFullList({

                        filter:
                            `enrollmentId="${enrollmentId}" && sessionNumber=${sessionNumber}`,

                        $autoCancel: false

                    });

                if (existingSessions.length > 0) {

                    return res.status(400).json({

                        success: false,

                        error:
                            'This session has already been booked.'

                    });

                }
                
                if (
                sessionNumber >
                enrollment.totalSessions
            ) {

                return res.status(400)
                    .json({

                        success: false,

                        error:
                            'Course already completed',

                    });

            }
            console.log('Fetching user...');
                const user =
                await pb.collection(
                    'users'
                ).getOne(
                    customerId
                );

                const existingBooking =
                    await pb.collection(
                        'course_sessions'
                    ).getFullList({

                        filter:
                            `customerId="${customerId}" && scheduledDateTime="${slotStart}"`,

                        $autoCancel: false

                    });

                if (existingBooking.length > 0) {

                    return res.status(400).json({

                        success: false,

                        error:
                            'You already have a session booked for this time.'

                    });

                }
                let calBooking;

                try {

                    calBooking =
                        await calcomService.createBooking(

                            COURSE_EVENT_TYPE_ID,

                            new Date(
                                slotStart
                            ).toISOString(),

                            user.email,

                            user.name

                        );

                } catch (error) {

                    if (
                        error.message.includes(
                            'already has booking'
                        )
                    ) {

                        return res.status(400).json({

                            success: false,

                            error:
                                'Selected slot is no longer available. Please choose another slot.'

                        });

                    }

                    throw error;
                }
                const meetingUrl =
                calBooking?.data?.meetingUrl ||

                calBooking?.data?.location ||

                '';

            const isValidUrl =
                /^https?:\/\//.test(
                    meetingUrl
                );
                            const session =
                await pb.collection(
                    'course_sessions'
                ).create({

                    enrollmentId,

                    customerId,

                    sessionNumber,

                    scheduledDateTime:
                        slotStart,

                    status:
                        'scheduled',

                    zoomLink:
                        isValidUrl
                            ? meetingUrl
                            : '',

                    calBookingUid:
                        calBooking?.data?.uid,

                    completed:
                        'false',

                });
                            const completedSessions =
                existingSessions.length + 1;

            const status =
                completedSessions >=
                enrollment.totalSessions

                ? 'completed'

                : 'active';

            await pb.collection(
                'course_enrollments'
            ).update(

                enrollmentId,

                {

                    completedSessions,

                    status,

                }

            );
                        return res.json({

                success: true,

                data:
                    session,

            });

        } catch (error) {

            console.error(error);

            return res.status(500)
                .json({

                    success: false,

                    error:
                        error.message,

                });

        }

    }
);

router.get(
    '/slots',
    auth,
    async (req, res) => {

        const {
            enrollmentId,
            startDate,
            endDate
        } = req.query;

        // Find previously booked sessions
        const previousSessions =
            await pb.collection(
                'course_sessions'
            ).getFullList({

                filter:
                    `enrollmentId="${enrollmentId}"`,

                sort:
                    '-sessionNumber',

                $autoCancel: false

            });

        const lastSession =
            previousSessions[0];

        // Get all available slots from Cal.com
        let slots =
            await calcomService.getAvailabilitySlots(
                COURSE_EVENT_TYPE_ID,
                startDate,
                endDate
            );

        // Only allow slots after the last booked session
        if (lastSession) {

            const lastDate =
                new Date(
                    lastSession.scheduledDateTime
                );

            slots =
                slots.filter(

                    slot =>

                        new Date(
                            slot.start
                        ) > lastDate

                );

        }

        return res.json({
            success: true,
            data: {
                slots
            }
        });

    }
);

router.get(
    '/reschedule-slots',
    auth,
    async (req, res) => {

        try {

            const {
                sessionId,
                startDate,
                endDate
            } = req.query;

            const session =
                await pb.collection(
                    'course_sessions'
                ).getOne(sessionId);

            const allSessions =
                await pb.collection(
                    'course_sessions'
                ).getFullList({

                    filter:
                        `enrollmentId="${session.enrollmentId}"`,

                    sort:
                        'sessionNumber',
                    $autoCancel: false

                });

            const previousSession =
                allSessions.find(

                    s =>
                        s.sessionNumber ===
                        session.sessionNumber - 1

                );

            const nextSession =
                allSessions.find(

                    s =>
                        s.sessionNumber ===
                        session.sessionNumber + 1

                );

            if (!startDate) {

                return res.json({

                    success: true,

                    data: {

                        minDate:
                            previousSession
                                ? previousSession.scheduledDateTime
                                : null,

                        maxDate:
                            nextSession
                                ? nextSession.scheduledDateTime
                                : null,

                        slots: [],

                    },

                });

            }

            console.log(
                'Previous session:',
                previousSession
            );

            console.log(
                'Next session:',
                nextSession
            );

            const slots =
                (
                    await calcomService.getAvailabilitySlots(

                        COURSE_EVENT_TYPE_ID,

                        startDate,

                        endDate

                    )

                ).filter(slot => {

                    const slotTime =
                        new Date(slot.start);

                    if (
                        previousSession &&
                        slotTime <=
                        new Date(
                            previousSession.scheduledDateTime
                        )
                    ) {
                        return false;
                    }

                    if (
                        nextSession &&
                        slotTime >=
                        new Date(
                            nextSession.scheduledDateTime
                        )
                    ) {
                        return false;
                    }

                    return true;

                });

            return res.json({

                success: true,

                data: {

                    slots,

                    minDate:
                        previousSession
                            ? previousSession.scheduledDateTime
                            : null,

                    maxDate:
                        nextSession
                            ? nextSession.scheduledDateTime
                            : null,

                },

            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({

                success: false,

                error: error.message,

            });

        }

    }
);

router.post(
    '/reschedule-session',
    auth,
    async (req, res) => {

        try {

            const {

                sessionId,

                newSlot

            } = req.body;

            const session =
                await pb.collection(
                    'course_sessions'
                ).getOne(sessionId);

            const user =
                await pb.collection(
                    'users'
                ).getOne(
                    req.user.id
                );

            const calResponse =
                await calcomService.rescheduleBooking(

                    session.calBookingUid,

                    new Date(
                        newSlot
                    ).toISOString(),

                    user.email,

                    'Customer requested reschedule'

                );

            await pb.collection(
                'course_sessions'
            ).update(

                sessionId,

                {

                    scheduledDateTime:
                        newSlot,

                    zoomLink:
                        calResponse?.data?.meetingUrl ||

                        calResponse?.data?.location ||

                        session.zoomLink,

                    rescheduledCount:
                        (session.rescheduledCount || 0) + 1,

                    rescheduledAt:
                        new Date(),

                    rescheduledFrom:
                        session.scheduledDateTime,

                    rescheduledFromUid:
                        session.calBookingUid,

                    rescheduledToUid:
                        calResponse?.data?.uid ||

                        session.calBookingUid,

                    calBookingUid:
                        calResponse?.data?.uid ||

                        session.calBookingUid,

                }

            );

            return res.json({

                success: true

            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({

                success: false,

                error: error.message

            });

        }

    }
);

router.post(
    '/cancel-enrollment',
    auth,
    async (req, res) => {

        try {

            const customerId =
                req.user.id;

            const {
                enrollmentId
            } = req.body;

            const enrollment =
                await pb.collection(
                    'course_enrollments'
                ).getOne(
                    enrollmentId
                );

            if (
                enrollment.customerId !==
                customerId
            ) {

                return res.status(403)
                    .json({

                        success: false,

                        error:
                            'Unauthorized',

                    });

            }

            const sessions =
                await pb.collection(
                    'course_sessions'
                ).getFullList({

                    filter:
                        `enrollmentId="${enrollmentId}"`,

                    $autoCancel: false

                });

            if (
                sessions.length > 0
            ) {

                return res.status(400)
                    .json({

                        success: false,

                        error:
                            'Cannot cancel after sessions are booked.'

                    });

            }

            let refundResponse =
                null;

            if (
                enrollment.razorpayPaymentId
            ) {

                refundResponse =
                    await razorpayService
                        .processRefund(

                            enrollment
                                .razorpayPaymentId

                        );

                console.log(
                    'COURSE REFUND:',
                    refundResponse
                );

            }

            const updatedEnrollment =
                await pb.collection(
                    'course_enrollments'
                ).update(

                    enrollmentId,

                    {

                        status:
                            'cancelled',

                        cancelledAt:
                            new Date()
                                .toISOString(),

                        refundStatus:
                            refundResponse
                                ? 'refunded'
                                : 'not_applicable',

                        refundId:
                            refundResponse?.refundId,

                        refundedAt:
                            refundResponse
                                ? new Date()
                                    .toISOString()
                                : null,

                    }

                );

            const customer =
                await pb.collection("users")
                    .getOne(enrollment.customerId);

            const course =
                COURSE_CONFIG[
                    enrollment.courseId
                ];

            if (course) {

                try {

                    await sendCourseCancellationEmail(

                        customer.email,

                        customer.name,

                        course

                    );

                } catch (err) {

                    console.error(
                        "Cancellation email failed:",
                        err
                    );

                }

            } else {

                console.warn(
                    `Course ${enrollment.courseId} not found in COURSE_CONFIG`
                );

            }

            return res.json({

                success: true,

                data:
                    updatedEnrollment,

            });

        } catch (error) {

            console.error(error);

            return res.status(500)
                .json({

                    success: false,

                    error:
                        error.message,

                });

        }

    }
);

router.get(
    "/check-enrollment/:courseId",
    auth,
    async (req, res) => {

        const customerId = req.user.id;

        const { courseId } = req.params;

        const enrollment =
            await pb.collection(
                "course_enrollments"
            ).getFullList({

                filter:
                    `customerId="${customerId}" && courseId="${courseId}"`

            });

        return res.json({

            enrolled:
                enrollment.length > 0

        });

    }
);

export default router;