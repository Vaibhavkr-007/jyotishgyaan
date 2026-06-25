
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Calendar, Clock, Settings, LogOut, Heart, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth.js';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';

import { format } from 'date-fns';

import { toast } from 'sonner';

import {
    Progress
} from '@/components/ui/progress';

import {
    BookOpen,
    CheckCircle,
    PlayCircle
} from 'lucide-react';


const DashboardPage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const upcomingBookings = bookings.filter(
        booking =>
            booking.status !== 'cancelled' &&
            new Date(booking.scheduledDateTime) >= new Date()
    );

    const historyBookings = bookings.filter(
        booking =>
            booking.status === 'cancelled' ||
            new Date(booking.scheduledDateTime) < new Date()
    );

  const [
        rescheduleBooking,
        setRescheduleBooking,
    ] = useState(null);

    const [
        selectedDate,
        setSelectedDate,
    ] = useState();

    const [
        selectedSlot,
        setSelectedSlot,
    ] = useState('');

    const [
        availableSlots,
        setAvailableSlots,
    ] = useState([]);

    const [
        loadingSlots,
        setLoadingSlots,
    ] = useState(false);

    const [
        rescheduling,
        setRescheduling,
    ] = useState(false);

    const [

        cancelBooking,

        setCancelBooking,

    ] = useState(null);

    const [

        cancellationReason,

        setCancellationReason,

    ] = useState('');

    const [cancelling, setCancelling] =
        useState(false);

    const [isCancelling, setIsCancelling] = useState(false);

    const [
        enrollments,
        setEnrollments,
    ] = useState([]);

    const [
        loadingEnrollments,
        setLoadingEnrollments,
    ] = useState(true);

    const [
        selectedEnrollment,
        setSelectedEnrollment,
    ] = useState(null);

    const [
        courseSessionDate,
        setCourseSessionDate,
    ] = useState();

    const [
        courseSessionSlot,
        setCourseSessionSlot,
    ] = useState('');

    const [
        courseSlots,
        setCourseSlots,
    ] = useState([]);

    const [
        bookingCourseSession,
        setBookingCourseSession,
    ] = useState(false);

    const [rescheduleSession, setRescheduleSession] =
        useState(null);

    const [rescheduleDate, setRescheduleDate] =
        useState();

    const [rescheduleSlots, setRescheduleSlots] =
        useState([]);

    const [selectedRescheduleSlot, setSelectedRescheduleSlot] =
        useState('');

    const [reschedulingSession, setReschedulingSession] =
        useState(false);

    const [rescheduleMinDate, setRescheduleMinDate] =
        useState(null);

    const [rescheduleMaxDate, setRescheduleMaxDate] =
        useState(null);

    const [cancelEnrollment, setCancelEnrollment] =
        useState(null);

    const [isCancellingEnrollment, setIsCancellingEnrollment] =
        useState(false);

    const activeEnrollments =
        enrollments.filter(

            enrollment =>

                enrollment.status === 'active'

        );

    const historyEnrollments =
        enrollments.filter(

            enrollment =>

                enrollment.status === 'completed' ||

                enrollment.status === 'cancelled'

        );

    

    const handleLogout = () => {
        logout();
        navigate('/');
    };

  const handleReschedule =
    async () => {

        try {

            setRescheduling(true);

            const token =
                localStorage.getItem(
                    'customerToken'
                );

            const response =
                await fetch(

                    `http://localhost:3001/bookings/${rescheduleBooking.id}/reschedule`,

                    {

                        method: 'POST',

                        headers: {

                            Authorization:
                                `Bearer ${token}`,

                            'Content-Type':
                                'application/json',

                        },

                        body: JSON.stringify({

                            slotStart:
                                selectedSlot,

                            reason:
                                'Requested by customer',

                        }),

                    }

                );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(

                    data.error

                );

            }

            toast.success(

                'Consultation rescheduled'

            );

            fetchBookings();

            setRescheduleBooking(
                null
            );

        } catch (error) {

            toast.error(

                error.message

            );

        } finally {

            setRescheduling(false);

        }

    };

    const fetchEnrollments =
    async () => {

        try {

            console.log(
                "COURSE TOKEN:",
                localStorage.getItem(
                    "customerToken"
                )
            );

            const token =
                localStorage.getItem(
                    'customerToken'
                );

            const response =
                await fetch(

                    'http://localhost:3001/courses/my-enrollments',

                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }

                );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.error
                );

            }

            setEnrollments(
                data.data
            );

        } catch (error) {

            console.error(error);

        } finally {

            setLoadingEnrollments(
                false
            );

        }

    };  useEffect(() => {

        if (currentUser) {

            fetchBookings();

            fetchEnrollments();

        }

    }, [currentUser]);

  const fetchBookings = async () => {

            try {

                const token =
                    localStorage.getItem('customerToken');

                const response =
                    await fetch(
                        'http://localhost:3001/bookings/my-bookings',
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.error
                    );

                }

                setBookings(data.data);

            } catch (error) {

                console.error(error);

            } finally {

                setLoadingBookings(false);

            }

        };

      useEffect(() => {

            if (currentUser) {

                fetchBookings();

            }

        }, [currentUser]);

  useEffect(() => {

        if (
            !selectedDate ||
            !rescheduleBooking
        ) {
            return;
        }

        const fetchSlots =
            async () => {

                setLoadingSlots(true);

                try {

                    const dateStr =
                        format(
                            selectedDate,
                            'yyyy-MM-dd'
                        );

                    const response =
                        await fetch(

                            `http://localhost:3001/consultations/slots?type=${rescheduleBooking.consultationType}&startDate=${dateStr}&endDate=${dateStr}`

                        );

                    const data =
                        await response.json();

                    setAvailableSlots(
                        data.data.slots || []
                    );

                } catch (error) {

                    toast.error(
                        'Failed to load slots'
                    );

                } finally {

                    setLoadingSlots(false);

                }

            };

        fetchSlots();

    }, [

        selectedDate,

        rescheduleBooking,

    ]);

    useEffect(() => {

    if (
        !courseSessionDate ||
        !selectedEnrollment
    ) {
        return;
    }

    const fetchCourseSlots =
        async () => {

            try {

                const token =
                    localStorage.getItem(
                        'customerToken'
                    );

                const dateStr =
                    format(
                        courseSessionDate,
                        'yyyy-MM-dd'
                    );

                const response =
                    await fetch(

                        `http://localhost:3001/courses/slots?startDate=${dateStr}&endDate=${dateStr}`,

                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }

                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.error
                    );

                }

                setCourseSlots(
                    data.data.slots || []
                );

            } catch (error) {

                toast.error(
                    error.message
                );

            }

        };

        fetchCourseSlots();

    }, [

        courseSessionDate,

        selectedEnrollment,

    ]);

    const handleBookCourseSession =
    async () => {

        try {

            setBookingCourseSession(
                true
            );

            const token =
                localStorage.getItem(
                    'customerToken'
                );

            const response =
                await fetch(

                    'http://localhost:3001/courses/book-session',

                    {

                        method: 'POST',

                        headers: {

                            Authorization:
                                `Bearer ${token}`,

                            'Content-Type':
                                'application/json',

                        },

                        body: JSON.stringify({

                            enrollmentId:
                                selectedEnrollment.id,

                            sessionNumber:
                                selectedEnrollment.nextSession,

                            slotStart:
                                courseSessionSlot,

                        }),

                    }

                );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.error
                );

            }

            toast.success(
                'Session booked'
            );

            setSelectedEnrollment(
                null
            );

            fetchEnrollments();

        } catch (error) {

            toast.error(
                error.message
            );

        } finally {

            setBookingCourseSession(
                false
            );

        }

    };

    const handleCancellation =
        async () => {

        if (isCancelling) return;

        try {

            setIsCancelling(true);

            const token =
                localStorage.getItem(
                    'customerToken'
                );

            const response =
                await fetch(

                    `http://localhost:3001/bookings/${cancelBooking.id}/cancel`,

                    {

                        method: 'POST',

                        headers: {

                            Authorization:
                                `Bearer ${token}`,

                            'Content-Type':
                                'application/json',

                        },

                        body: JSON.stringify({

                            reason:
                                cancellationReason,

                        }),

                    }

                );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.error
                );

            }

            toast.success(
                'Consultation cancelled'
            );

            fetchBookings();

            setCancelBooking(null);

            setCancellationReason('');

        } catch (error) {

            toast.error(
                error.message
            );

        } finally {

            setIsCancelling(false);

        }

    };

    useEffect(() => {

        if (
            !rescheduleSession ||
            !rescheduleDate
        ) {
            return;
        }

        const fetchSlots =
            async () => {

                try {

                    const token =
                        localStorage.getItem(
                            'customerToken'
                        );

                    const dateStr =
                        format(
                            rescheduleDate,
                            'yyyy-MM-dd'
                        );

                    const response =
                        await fetch(

                            `http://localhost:3001/courses/reschedule-slots?sessionId=${rescheduleSession.id}&startDate=${dateStr}&endDate=${dateStr}`,

                            {

                                headers: {

                                    Authorization:
                                        `Bearer ${token}`,

                                },

                            }

                        );

                    const data =
                        await response.json();

                    setRescheduleSlots(
                        data.data.slots || []
                    );

                    setRescheduleSlots(
                        data.data.slots || []
                    );

                    setRescheduleMinDate(
                        data.data.minDate
                    );

                    setRescheduleMaxDate(
                        data.data.maxDate
                    );

                    

                } catch {

                    toast.error(
                        'Failed to load slots'
                    );

                }

            };

        fetchSlots();

    }, [

        rescheduleSession,

        rescheduleDate

    ]);

    const handleRescheduleSession =
    async () => {

        try {

            setReschedulingSession(
                true
            );

            const token =
                localStorage.getItem(
                    'customerToken'
                );

            const response =
                await fetch(

                    'http://localhost:3001/courses/reschedule-session',

                    {

                        method: 'POST',

                        headers: {

                            Authorization:
                                `Bearer ${token}`,

                            'Content-Type':
                                'application/json',

                        },

                        body: JSON.stringify({

                            sessionId:
                                rescheduleSession.id,

                            newSlot:
                                selectedRescheduleSlot,

                        }),

                    }

                );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.error
                );

            }

            toast.success(
                'Session rescheduled'
            );

            setRescheduleSession(
                null
            );

            fetchEnrollments();

        } catch (error) {

            toast.error(
                error.message
            );

        } finally {

            setReschedulingSession(
                false
            );

        }

    };

    const handleCancelEnrollment =
    async (
        enrollmentId
    ) => {

        try {

            const token =
                localStorage.getItem(
                    'customerToken'
                );

            const response =
                await fetch(

                    'http://localhost:3001/courses/cancel-enrollment',

                    {

                        method: 'POST',

                        headers: {

                            Authorization:
                                `Bearer ${token}`,

                            'Content-Type':
                                'application/json',

                        },

                        body: JSON.stringify({

                            enrollmentId,

                        }),

                    }

                );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.error
                );

            }

            toast.success(
                'Course cancelled successfully'
            );

            fetchEnrollments();

        } catch (error) {

            toast.error(
                error.message
            );

        }

    };

    const confirmCancelEnrollment = async () => {

        if (!cancelEnrollment) {
            return;
        }

        try {

            setIsCancellingEnrollment(true);

            await handleCancelEnrollment(
                cancelEnrollment.id
            );

            setCancelEnrollment(null);

        } catch (error) {

            console.error(error);

        } finally {

            setIsCancellingEnrollment(false);

        }

    };

  return (
    <>
      <Helmet>
        <title>Dashboard - Jyotish Gyan</title>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background/50">
        <Header />

        <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div>
                <h1 className="text-3xl font-bold text-foreground">Welcome, {currentUser?.name}</h1>
                <p className="text-muted-foreground">Manage your profile and spiritual journey</p>
              </div>
              <Button variant="outline" onClick={handleLogout} className="border-border text-foreground hover:bg-accent/10">
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </Button>
            </motion.div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Profile Overview (col-span-1) */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="h-full bg-card border-border/40 shadow-sm flex flex-col">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-card-foreground">
                      <User className="w-5 h-5 text-primary" />
                      Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col items-center text-center space-y-4 pt-2">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-3xl font-bold text-primary">
                      {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-lg text-card-foreground">{currentUser?.name}</p>
                      <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
                    </div>
                    <div className="mt-auto pt-6 w-full">
                      <Button asChild variant="outline" className="w-full">
                        <Link to="/profile">Edit Profile</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Bookings & Appointments (col-span-2) */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="md:col-span-2 space-y-6">
                
                <Card className="bg-card border-border/40 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-card-foreground">
                        <Calendar className="w-5 h-5 text-primary" />
                        Upcoming Bookings
                      </CardTitle>
                      <CardDescription>Your scheduled consultations</CardDescription>
                    </div>
                    {/* <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
                      <Link to="/bookings">View all <ArrowRight className="w-4 h-4 ml-1" /></Link>
                    </Button> */}
                  </CardHeader>
                  <CardContent>

                    {loadingBookings ? (

                        <div className="py-8 text-center text-muted-foreground">

                            <p>Loading your bookings...</p>

                        </div>

                    ) : upcomingBookings.length > 0 ? (

                        <div className="space-y-4">

                            {upcomingBookings.map((booking) => (

                                <div
                                    key={booking.id}
                                    className="p-4 rounded-xl border border-border bg-muted/30"
                                >

                                    <div className="flex justify-between items-start">

                                        <div>

                                            <p className="font-semibold">

                                                {booking.consultationType
                                                    ?.charAt(0)
                                                    .toUpperCase() +
                                                    booking.consultationType?.slice(1)
                                                } Consultation

                                            </p>

                                            <p className="text-sm text-muted-foreground">

                                                {new Date(
                                                    booking.scheduledDateTime
                                                ).toLocaleString()}

                                            </p>

                                            <p className="text-sm">

                                                Status: {booking.status}

                                            </p>

                                            <p className="text-xs text-muted-foreground mt-1">
                                                Booking ID: {booking.id}
                                            </p>

                                            <p className="text-xs text-muted-foreground">
                                                Payment: {booking.paymentStatus}
                                            </p>

                                        </div>

                                        <div className="text-right">

                                            <p className="font-medium">

                                                ₹{booking.amount}

                                            </p>

                                            <p
                                                className={`text-sm ${
                                                    booking.paymentStatus === 'paid'
                                                        ? 'text-green-600'
                                                        : 'text-yellow-600'
                                                }`}
                                            >

                                                {booking.paymentStatus}

                                            </p>

                                        </div>

                                    </div>

                                    <div className="flex gap-2 mt-4">

                                        {booking.zoomLink && (

                                            <Button asChild>

                                                <a
                                                    href={booking.zoomLink}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >

                                                    Join Consultation

                                                </a>

                                            </Button>

                                        )}

                                        <Button
                                            variant="outline"
                                            onClick={() => {

                                                setRescheduleBooking(
                                                    booking
                                                );

                                                setSelectedDate();

                                                setSelectedSlot('');

                                                setAvailableSlots([]);

                                            }}
                                        >

                                            Reschedule

                                        </Button>

                                        <Button

                                            variant="destructive"

                                            onClick={() =>

                                                setCancelBooking(booking)

                                            }

                                        >

                                            Cancel Consultation

                                        </Button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    ) : (

                        <div className="py-8 text-center text-muted-foreground bg-muted/30 rounded-xl border border-dashed border-border">

                            <Calendar className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />

                            <p>You have no upcoming bookings.</p>

                            <Button
                                asChild
                                variant="link"
                                className="text-primary mt-2"
                            >

                                <Link to="/consultations">

                                    Book a consultation

                                </Link>

                            </Button>

                        </div>

                    )}

                </CardContent>
                </Card>

                <Card className="bg-card border-border/40 shadow-sm">

                    <CardHeader>

                        <CardTitle className="flex items-center gap-2">

                            <BookOpen className="w-5 h-5 text-primary" />

                            My Courses

                        </CardTitle>

                        <CardDescription>

                            Track your learning progress

                        </CardDescription>

                    </CardHeader>

                    <CardContent>

                        {loadingEnrollments ? (

                            <p className="text-muted-foreground">
                                Loading courses...
                            </p>

                        ) : enrollments.length === 0 ? (

                            <div className="text-center py-6">

                                <BookOpen className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />

                                <p className="text-muted-foreground">

                                    No courses enrolled yet.

                                </p>

                            </div>

                        ) : (

                            <div className="space-y-6">

                                {activeEnrollments.map(
                                    enrollment => {
                                        const now =
                                            new Date();

                                        const completedCount =
                                            enrollment.sessions?.filter(

                                                session => {

                                                    const sessionStart =
                                                        new Date(
                                                            session.scheduledDateTime
                                                        );

                                                    const sessionEnd =
                                                        new Date(
                                                            sessionStart.getTime() +
                                                            60 * 60 * 1000
                                                        );

                                                    return sessionEnd < now;

                                                }

                                            ).length || 0;

                                        const progress =
                                            Math.round(

                                                (
                                                    completedCount /
                                                    enrollment.totalSessions
                                                ) * 100

                                            );

                                        const canCancel =
                                            enrollment.sessions?.length === 0;

                                        return (

                                            <div
                                                key={enrollment.id}
                                                className="border rounded-xl p-5"
                                            >

                                                <div className="flex justify-between items-start">

                                                    <div>

                                                        <h3 className="font-semibold text-lg">

                                                            {enrollment.courseName}

                                                        </h3>

                                                        <p className="text-sm text-muted-foreground">

                                                            {completedCount}

                                                            /

                                                            {enrollment.totalSessions}
                                                            {" "}
                                                            Sessions Completed

                                                        </p>

                                                    </div>

                                                    <div>

                                                        {enrollment.status === 'completed' ? (

                                                            <span className="text-green-600 text-sm font-medium">

                                                                Completed

                                                            </span>

                                                        ) : (

                                                            <span className="text-blue-600 text-sm font-medium">

                                                                Active

                                                            </span>

                                                        )}

                                                    </div>

                                                </div>

                                                <div className="mt-4">

                                                    <Progress
                                                        value={progress}
                                                    />

                                                    <p className="text-xs text-muted-foreground mt-2">

                                                        {progress}% Complete

                                                    </p>

                                                </div>

                                                <div className="mt-4 flex justify-between items-center">

                                                    <div>

                                                        {enrollment.status !== 'completed' ? (

                                                            <p className="text-sm">

                                                                Next Session:

                                                                {' '}

                                                                <span className="font-medium">

                                                                    {enrollment.nextSession}

                                                                </span>

                                                            </p>

                                                        ) : (

                                                            <p className="text-green-600 text-sm">

                                                                Course Completed 🎉

                                                            </p>

                                                        )}

                                                    </div>

                                                    {enrollment.status !== 'completed' && (

                                                        <Button

                                                            onClick={() =>
                                                                setSelectedEnrollment(
                                                                    enrollment
                                                                )
                                                            }

                                                        >

                                                            <PlayCircle className="w-4 h-4 mr-2" />

                                                            Book Session

                                                        </Button>

                                                    )}

                                                    {canCancel && (

                                                        <Button
                                                            variant="destructive"
                                                            onClick={() =>
                                                                setCancelEnrollment(
                                                                    enrollment
                                                                )
                                                            }
                                                        >
                                                            Cancel Course
                                                        </Button>

                                                    )}

                                                </div>

                                                <div className="mt-6 space-y-2">

                                                    {enrollment.sessions?.map(
                                                        session => {

                                                            const now =
                                                                new Date();

                                                            const sessionStart =
                                                                new Date(
                                                                    session.scheduledDateTime
                                                                );

                                                            const sessionEnd =
                                                                new Date(
                                                                    sessionStart.getTime() +
                                                                    60 * 60 * 1000
                                                                );

                                                            const isCompleted =
                                                                sessionEnd < now;

                                                            const previousSession =
                                                                enrollment.sessions?.find(

                                                                    s =>

                                                                        s.sessionNumber ===
                                                                        session.sessionNumber - 1

                                                                );

                                                            const previousCompleted =
                                                                !previousSession ||

                                                                (
                                                                    new Date(
                                                                        previousSession.scheduledDateTime
                                                                    ).getTime()

                                                                    +

                                                                    60 * 60 * 1000

                                                                ) < Date.now();
                                                            
                                                            const joinWindowStart =
                                                                new Date(
                                                                    sessionStart.getTime() -
                                                                    15 * 60 * 1000
                                                                );
                                                            
                                                            const canJoin =
                                                                now >= sessionStart &&
                                                                now <= sessionEnd;

                                                            const canReschedule =
                                                                !isCompleted &&
                                                                sessionStart.getTime() - Date.now() >
                                                                60 * 60 * 1000;

                                                            const minutesRemaining =
                                                                Math.ceil(
                                                                    (
                                                                        sessionStart.getTime() -
                                                                        now.getTime()
                                                                    ) / 60000
                                                                );
                                                            
                                                            const remainingMs =
                                                                sessionStart.getTime() -
                                                                now.getTime();

                                                            const totalMinutes =
                                                                Math.max(
                                                                    0,
                                                                    Math.floor(
                                                                        remainingMs / 60000
                                                                    )
                                                                );

                                                            const days =
                                                                Math.floor(
                                                                    totalMinutes /
                                                                    (24 * 60)
                                                                );

                                                            const hours =
                                                                Math.floor(
                                                                    (
                                                                        totalMinutes %
                                                                        (24 * 60)
                                                                    ) / 60
                                                                );

                                                            const minutes =
                                                                totalMinutes % 60;

                                                            const remainingText =
                                                                [
                                                                    days > 0
                                                                        ? `${days}d`
                                                                        : null,

                                                                    hours > 0
                                                                        ? `${hours}h`
                                                                        : null,

                                                                    `${minutes}m`

                                                                ]
                                                                    .filter(Boolean)
                                                                    .join(' ');

                                                            return (

                                                                <div
                                                                    key={session.id}
                                                                    className="flex justify-between items-center border rounded-lg px-3 py-2"
                                                                >

                                                                    <div>

                                                                        <p className="font-medium">

                                                                            Session {session.sessionNumber}

                                                                        </p>

                                                                        <p className="text-xs text-muted-foreground">

                                                                            {new Date(
                                                                                session.scheduledDateTime
                                                                            ).toLocaleString()}

                                                                        </p>

                                                                    </div>

                                                                    <div className="flex gap-2">

                                                                        {isCompleted ? (

                                                                            <Button
                                                                                size="sm"
                                                                                disabled
                                                                                variant="secondary"
                                                                            >

                                                                                Completed

                                                                            </Button>

                                                                        ) : previousCompleted ? (

                                                                            canJoin ? (

                                                                                <Button
                                                                                    size="sm"
                                                                                    asChild
                                                                                >

                                                                                    <a
                                                                                        href={session.zoomLink}
                                                                                        target="_blank"
                                                                                        rel="noreferrer"
                                                                                    >

                                                                                        Join

                                                                                    </a>

                                                                                </Button>

                                                                                

                                                                            ) : (

                                                                                <Button
                                                                                    size="sm"
                                                                                    disabled
                                                                                >
                                                                                    {minutesRemaining > 15
                                                                                        ? `Starts in ${remainingText}`
                                                                                        : 'Upcoming'}
                                                                                </Button>

                                                                            )

                                                                        ) : (

                                                                            <Button
                                                                                size="sm"
                                                                                disabled
                                                                                variant="outline"
                                                                            >

                                                                                Join

                                                                            </Button>

                                                                        )}

                                                                        {canReschedule && (
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                onClick={async () => {

                                                                                    setRescheduleSession(
                                                                                        session
                                                                                    );

                                                                                    setRescheduleDate(null);

                                                                                    setSelectedRescheduleSlot('');

                                                                                    setRescheduleSlots([]);

                                                                                    try {

                                                                                        const token =
                                                                                            localStorage.getItem(
                                                                                                'customerToken'
                                                                                            );

                                                                                        const response =
                                                                                            await fetch(

                                                                                                `http://localhost:3001/courses/reschedule-slots?sessionId=${session.id}`,

                                                                                                {

                                                                                                    headers: {

                                                                                                        Authorization:
                                                                                                            `Bearer ${token}`,

                                                                                                    },

                                                                                                }

                                                                                            );

                                                                                        const data =
                                                                                            await response.json();

                                                                                        if (!response.ok) {

                                                                                            throw new Error(
                                                                                                data.error
                                                                                            );

                                                                                        }

                                                                                        setRescheduleMinDate(
                                                                                            data.data.minDate
                                                                                        );

                                                                                        setRescheduleMaxDate(
                                                                                            data.data.maxDate
                                                                                        );

                                                                                    } catch (error) {

                                                                                        console.error(error);

                                                                                        toast.error(
                                                                                            'Failed to load reschedule limits'
                                                                                        );

                                                                                    }

                                                                                }}
                                                                            >
                                                                                Reschedule
                                                                            </Button>
                                                                        )}

                                                                    </div>

                                                                </div>

                                                            );

                                                        }
                                                    )}

                                                </div>

                                            </div>

                                        );

                                    }
                                )}

                            </div>

                        )}

                    </CardContent>

                </Card>

                <Card>

                    <CardHeader>

                        <CardTitle>

                            Course History

                        </CardTitle>

                    </CardHeader>

                    <CardContent>

                        {

                            historyEnrollments.length === 0

                                ? (

                                    <p className="text-sm text-muted-foreground">

                                        No completed or cancelled courses.

                                    </p>

                                )

                                : (

                                    <div className="space-y-4">

                                        {

                                            historyEnrollments.map(

                                                enrollment => (

                                                    <div

                                                        key={enrollment.id}

                                                        className="border rounded-lg p-4"

                                                    >

                                                        <div className="flex justify-between items-start">

                                                            <div>

                                                                <h4 className="font-medium text-lg">

                                                                    {

                                                                        enrollment.courseName

                                                                    }

                                                                </h4>

                                                                <p className="text-sm text-muted-foreground">

                                                                    {

                                                                        enrollment.level

                                                                    }

                                                                </p>

                                                            </div>

                                                            <div>

                                                                {

                                                                    enrollment.status === 'completed'

                                                                        ? (

                                                                            <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium">

                                                                                Completed

                                                                            </span>

                                                                        )

                                                                        : (

                                                                            <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-medium">

                                                                                Cancelled

                                                                            </span>

                                                                        )

                                                                }

                                                            </div>

                                                        </div>

                                                        <div className="grid grid-cols-2 gap-3 mt-4 text-sm">

                                                            <div>

                                                                <span className="text-muted-foreground">

                                                                    Sessions:

                                                                </span>

                                                                <div>

                                                                    {

                                                                        enrollment.totalSessions

                                                                    }

                                                                </div>

                                                            </div>

                                                            <div>

                                                                <span className="text-muted-foreground">

                                                                    Amount Paid:

                                                                </span>

                                                                <div>

                                                                    ₹{

                                                                        enrollment.amount

                                                                    }

                                                                </div>

                                                            </div>

                                                            {

                                                                enrollment.enrolledAt && (

                                                                    <div>

                                                                        <span className="text-muted-foreground">

                                                                            Enrolled On:

                                                                        </span>

                                                                        <div>

                                                                            {

                                                                                new Date(

                                                                                    enrollment.enrolledAt

                                                                                ).toLocaleDateString()

                                                                            }

                                                                        </div>

                                                                    </div>

                                                                )

                                                            }

                                                            {

                                                                enrollment.status === 'cancelled' && (

                                                                    <div>

                                                                        <span className="text-muted-foreground">

                                                                            Refund Status:

                                                                        </span>

                                                                        <div>

                                                                            {

                                                                                enrollment.refundStatus ||

                                                                                'Pending'

                                                                            }

                                                                        </div>

                                                                    </div>

                                                                )

                                                            }

                                                            {

                                                                enrollment.refundedAt && (

                                                                    <div>

                                                                        <span className="text-muted-foreground">

                                                                            Refunded On:

                                                                        </span>

                                                                        <div>

                                                                            {

                                                                                new Date(

                                                                                    enrollment.refundedAt

                                                                                ).toLocaleDateString()

                                                                            }

                                                                        </div>

                                                                    </div>

                                                                )

                                                            }

                                                        </div>

                                                    </div>

                                                )

                                            )

                                        }

                                    </div>

                                )

                        }

                    </CardContent>

                </Card>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Card className="bg-card border-border/40 shadow-sm">

                      <CardHeader>

                          <CardTitle className="flex items-center gap-2">

                              <Clock className="w-5 h-5 text-primary" />

                              Consultation History

                          </CardTitle>

                          <CardDescription>

                              Your completed consultations

                          </CardDescription>

                      </CardHeader>

                      <CardContent>

                          {historyBookings.length > 0 ? (

                              <div className="space-y-3">

                                  {historyBookings.map((booking) => (

                                      <div
                                          key={booking.id}
                                          className="p-3 rounded-lg border"
                                      >

                                          <div className="flex justify-between">

                                              <div>

                                                  <p className="font-medium">

                                                      {booking.consultationType}

                                                  </p>

                                                  <p className="text-sm text-muted-foreground">

                                                      {new Date(
                                                          booking.scheduledDateTime
                                                      ).toLocaleString()}

                                                  </p>

                                                  <p className="text-xs text-muted-foreground">

                                                      Booking ID: {booking.id}

                                                  </p>

                                              </div>

                                              <div className="text-right">

                                                  <p>

                                                      ₹{booking.amount}

                                                  </p>

                                                  <p className="text-sm">

                                                      {booking.status}
                                                  </p>

                                              </div>

                                          </div>

                                      </div>

                                  ))}

                              </div>

                          ) : (

                              <p className="text-muted-foreground">

                                  No past consultations found.

                              </p>

                          )}

                      </CardContent>

                  </Card>

                  <Card className="bg-card border-border/40 shadow-sm hover:shadow-md transition-all group">
                    <CardContent className="p-6">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Settings className="w-5 h-5 text-accent" />
                      </div>
                      <h3 className="font-semibold text-lg mb-1 text-card-foreground">Settings</h3>
                      <p className="text-sm text-muted-foreground mb-4">Manage your preferences and security.</p>
                      <Button asChild variant="ghost" className="p-0 h-auto hover:bg-transparent text-primary hover:text-primary/80">
                        <Link to="/account-settings" className="flex items-center">
                          Account settings <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>

              </motion.div>
            </div>
          </div>
        </main>


        <Dialog

            open={!!rescheduleBooking}

            onOpenChange={() => {

                setRescheduleBooking(null);

            }}

        >

            <DialogContent>

                <DialogHeader>

                    <DialogTitle>

                        Reschedule Consultation

                    </DialogTitle>

                </DialogHeader>

                {rescheduleBooking && (

                    <div className="space-y-6">

                        <div>

                            <p className="text-sm">

                                Current Appointment

                            </p>

                            <p className="font-medium">

                                {

                                    new Date(

                                        rescheduleBooking
                                            .scheduledDateTime

                                    ).toLocaleString()

                                }

                            </p>

                        </div>

                        <div>

                            <Label>

                                New Date

                            </Label>

                            <Popover>

                                <PopoverTrigger asChild>

                                    <Button
                                        variant="outline"
                                    >

                                        {

                                            selectedDate

                                                ?

                                                format(

                                                    selectedDate,

                                                    'PPP'

                                                )

                                                :

                                                'Pick Date'

                                        }

                                    </Button>

                                </PopoverTrigger>

                                <PopoverContent>

                                    <CalendarPicker

                                        mode="single"

                                        selected={
                                            selectedDate
                                        }

                                        onSelect={
                                            setSelectedDate
                                        }

                                    />

                                </PopoverContent>

                            </Popover>

                        </div>

                        <div>

                            <Label>

                                New Time

                            </Label>

                            <Select

                                value={
                                    selectedSlot
                                }

                                onValueChange={
                                    setSelectedSlot
                                }

                            >

                                <SelectTrigger>

                                    <SelectValue

                                        placeholder="Select slot"

                                    />

                                </SelectTrigger>

                                <SelectContent>

                                    {

                                        availableSlots
                                            .map(

                                                slot => (

                                                    <SelectItem

                                                        key={
                                                            slot.start
                                                        }

                                                        value={
                                                            slot.start
                                                        }

                                                    >

                                                        {

                                                            new Date(

                                                                slot.start

                                                            ).toLocaleTimeString(

                                                                [],

                                                                {

                                                                    hour:

                                                                    '2-digit',

                                                                    minute:

                                                                    '2-digit',

                                                                }

                                                            )

                                                        }

                                                    </SelectItem>

                                                )

                                            )

                                    }

                                </SelectContent>

                            </Select>

                        </div>

                        {

                            selectedSlot && (

                                <div
                                    className="rounded border p-4"
                                >

                                    <p>

                                        Are you sure you want to reschedule?

                                    </p>

                                    <p
                                        className="mt-2 text-sm"
                                    >

                                        Current:

                                        {

                                            new Date(

                                                rescheduleBooking
                                                    .scheduledDateTime

                                            ).toLocaleString()

                                        }

                                    </p>

                                    <p
                                        className="text-sm"
                                    >

                                        New:

                                        {

                                            new Date(

                                                selectedSlot

                                            ).toLocaleString()

                                        }

                                    </p>

                                </div>

                            )

                        }

                    </div>

                )}

                <DialogFooter>

                    <Button

                        variant="outline"

                        onClick={() => {

                            setRescheduleBooking(
                                null
                            );

                        }}

                    >

                        Cancel

                    </Button>

                    <Button

                        disabled={

                            !selectedSlot ||

                            rescheduling

                        }

                        onClick={

                            handleReschedule

                        }

                    >

                        Confirm Reschedule

                    </Button>

                </DialogFooter>

            </DialogContent>

        </Dialog>

        <Dialog

            open={!!cancelBooking}

            onOpenChange={() =>

                setCancelBooking(null)

            }

        >

            <DialogContent>

                <DialogHeader>

                    <DialogTitle>

                        Cancel Consultation?

                    </DialogTitle>

                </DialogHeader>

                <p>

                    This action cannot be undone.

                </p>

                <Textarea

                    placeholder="Reason (optional)"

                    value={cancellationReason}

                    onChange={(e) =>

                        setCancellationReason(

                            e.target.value

                        )

                    }

                />

                <div className="flex gap-2">

                    <Button

                        variant="outline"

                        onClick={() =>

                            setCancelBooking(null)

                        }

                    >

                        Keep Booking

                    </Button>

                    <Button
                        onClick={handleCancellation}
                        disabled={isCancelling}
                    >
                        {isCancelling
                            ? 'Cancelling...'
                            : 'Confirm Cancellation'}
                    </Button>

                </div>

            </DialogContent>

        </Dialog>

        <Dialog

            open={
                !!selectedEnrollment
            }

            onOpenChange={() =>
                setSelectedEnrollment(
                    null
                )
            }

        >

            <DialogContent>

                <DialogHeader>

                    <DialogTitle>

                        Book Course Session

                    </DialogTitle>

                </DialogHeader>

                <Popover>

                    <PopoverTrigger
                        asChild
                    >

                        <Button>

                            {

                                courseSessionDate

                                ? format(
                                    courseSessionDate,
                                    'PPP'
                                )

                                : 'Select Date'

                            }

                        </Button>

                    </PopoverTrigger>

                    <PopoverContent>

                        <CalendarPicker

                            mode="single"

                            selected={
                                courseSessionDate
                            }

                            onSelect={
                                setCourseSessionDate
                            }

                        />

                    </PopoverContent>

                </Popover>

                <Select

                    value={
                        courseSessionSlot
                    }

                    onValueChange={
                        setCourseSessionSlot
                    }

                >

                    <SelectTrigger>

                        <SelectValue />

                    </SelectTrigger>

                    <SelectContent>

                        {

                            courseSlots.map(
                                slot => (

                                    <SelectItem

                                        key={
                                            slot.start
                                        }

                                        value={
                                            slot.start
                                        }

                                    >

                                        {

                                            new Date(
                                                slot.start
                                            ).toLocaleTimeString()

                                        }

                                    </SelectItem>

                                )
                            )

                        }

                    </SelectContent>

                </Select>

                <DialogFooter>

                    <Button

                        onClick={
                            handleBookCourseSession
                        }

                        disabled={
                            bookingCourseSession
                        }

                    >

                        Confirm

                    </Button>

                </DialogFooter>

            </DialogContent>

        </Dialog>

        <Dialog
            open={!!rescheduleSession}
            onOpenChange={() => {

                setRescheduleSession(null);

            }}
        >

            <DialogContent>

                <DialogHeader>

                    <DialogTitle>

                        Reschedule Course Session

                    </DialogTitle>

                </DialogHeader>

                {rescheduleSession && (

                    <div className="space-y-6">

                        <div>

                            <p className="text-sm">

                                Current Session Time

                            </p>

                            <p className="font-medium">

                                {
                                    new Date(
                                        rescheduleSession.scheduledDateTime
                                    ).toLocaleString()
                                }

                            </p>

                        </div>

                        <div>

                            <p className="text-sm text-muted-foreground mb-2">

                                Pick a date between

                                {' '}

                                <span className="font-medium">

                                    {

                                        rescheduleMinDate

                                            ?

                                            new Date(
                                                rescheduleMinDate
                                            ).toLocaleDateString()

                                            :

                                            'today'

                                    }

                                </span>

                                {' '}and{' '}

                                <span className="font-medium">

                                    {

                                        rescheduleMaxDate

                                            ?

                                            new Date(
                                                rescheduleMaxDate
                                            ).toLocaleDateString()

                                            :

                                            'any future date'

                                    }

                                </span>

                            </p>

                            <Label>

                                New Date

                            </Label>

                            <Popover>

                                <PopoverTrigger asChild>

                                    <Button
                                        variant="outline"
                                    >

                                        {

                                            rescheduleDate

                                                ?

                                                format(

                                                    rescheduleDate,

                                                    'PPP'

                                                )

                                                :

                                                'Pick Date'

                                        }

                                    </Button>

                                </PopoverTrigger>

                                <PopoverContent>

                                    <CalendarPicker

                                        mode="single"

                                        selected={rescheduleDate}

                                        onSelect={setRescheduleDate}

                                        disabled={(date) => {

                                            if (
                                                rescheduleMinDate &&
                                                date < new Date(rescheduleMinDate)
                                            ) {
                                                return true;
                                            }

                                            if (
                                                rescheduleMaxDate &&
                                                date > new Date(rescheduleMaxDate)
                                            ) {
                                                return true;
                                            }

                                            return false;

                                        }}

                                    />

                                </PopoverContent>

                            </Popover>

                        </div>

                        <div>

                            <Label>

                                New Time

                            </Label>

                            <Select

                                value={
                                    selectedRescheduleSlot
                                }

                                onValueChange={
                                    setSelectedRescheduleSlot
                                }

                            >

                                <SelectTrigger>

                                    <SelectValue
                                        placeholder="Select slot"
                                    />

                                </SelectTrigger>

                                <SelectContent>

                                    {

                                        rescheduleSlots.map(

                                            slot => (

                                                <SelectItem

                                                    key={
                                                        slot.start
                                                    }

                                                    value={
                                                        slot.start
                                                    }

                                                >

                                                    {

                                                        new Date(

                                                            slot.start

                                                        ).toLocaleTimeString(

                                                            [],

                                                            {

                                                                hour: '2-digit',

                                                                minute: '2-digit',

                                                            }

                                                        )

                                                    }

                                                </SelectItem>

                                            )

                                        )

                                    }

                                </SelectContent>

                            </Select>

                        </div>

                        {

                            selectedRescheduleSlot && (

                                <div
                                    className="rounded border p-4"
                                >

                                    <p>

                                        Are you sure you want to reschedule?

                                    </p>

                                    <p
                                        className="mt-2 text-sm"
                                    >

                                        Current:

                                        {

                                            new Date(

                                                rescheduleSession.scheduledDateTime

                                            ).toLocaleString()

                                        }

                                    </p>

                                    <p
                                        className="text-sm"
                                    >

                                        New:

                                        {

                                            new Date(

                                                selectedRescheduleSlot

                                            ).toLocaleString()

                                        }

                                    </p>

                                </div>

                            )

                        }

                    </div>

                )}

                <DialogFooter>

                    <Button

                        variant="outline"

                        onClick={() => {

                            setRescheduleSession(
                                null
                            );

                        }}

                    >

                        Cancel

                    </Button>

                    <Button

                        disabled={

                            !selectedRescheduleSlot ||

                            reschedulingSession

                        }

                        onClick={

                            handleRescheduleSession

                        }

                    >

                        Confirm Reschedule

                    </Button>

                </DialogFooter>

            </DialogContent>

        </Dialog>

        <Dialog
            open={!!cancelEnrollment}
            onOpenChange={() =>
                setCancelEnrollment(null)
            }
        >

            <DialogContent>

                <DialogHeader>

                    <DialogTitle>

                        Cancel Course?

                    </DialogTitle>

                </DialogHeader>

                <p>

                    Are you sure you want to cancel this course?

                </p>

                <p className="text-sm text-muted-foreground">

                    This will cancel your enrollment and
                    any refund process will be handled
                    according to your policy.

                </p>

                {
                    cancelEnrollment && (
                        <div className="rounded border p-3 mt-2">

                            <p className="font-medium">

                                {cancelEnrollment.courseName}

                            </p>

                            <p className="text-sm text-muted-foreground">

                                {cancelEnrollment.completedSessions}
                                /
                                {cancelEnrollment.totalSessions}
                                {' '}
                                sessions completed

                            </p>

                        </div>
                    )
                }

                <div className="flex gap-2">

                    <Button
                        variant="outline"
                        onClick={() =>
                            setCancelEnrollment(null)
                        }
                    >
                        Keep Course
                    </Button>

                    <Button
                        variant="destructive"
                        onClick={
                            confirmCancelEnrollment
                        }
                        disabled={
                            isCancellingEnrollment
                        }
                    >
                        {
                            isCancellingEnrollment
                                ? 'Cancelling...'
                                : 'Confirm Cancellation'
                        }
                    </Button>

                </div>

            </DialogContent>

        </Dialog>

        <Footer />
      </div>
    </>
  );
};

export default DashboardPage;
