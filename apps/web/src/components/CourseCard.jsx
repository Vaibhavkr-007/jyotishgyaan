
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import ProtectedActionButton from './ProtectedActionButton.jsx';
import { toast } from 'sonner';
import { Loader2 } from "lucide-react";
import { API_URL } from "@/config/api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

const categoryImages = {
    astrology: 'https://images.unsplash.com/photo-1685478237364-381739515f59',
    meditation: 'https://images.unsplash.com/photo-1693921148341-abb9cc11a8ad',
    reiki: 'https://images.unsplash.com/photo-1649434216517-34ed72ca28e9',
    tarot: 'https://images.unsplash.com/photo-1577855019871-0a973ad5ff30'
};

const CourseCard = ({ course, index = 0 }) => {
    const displayImage = categoryImages[course.category?.toLowerCase()] || course.image;

    const [isEnrolled, setIsEnrolled] = React.useState(false);
    const [isProcessingEnrollment, setIsProcessingEnrollment] = React.useState(false);

    const [showEnrollDialog, setShowEnrollDialog] =
        React.useState(false);

    React.useEffect(() => {

        const checkEnrollment =
            async () => {

                try {

                    const token =
                        localStorage.getItem('customerToken');

                    if (!token) {
                        return;
                    }

                    const response =
                        await fetch(
                            `${API_URL}/courses/my-enrollments`,
                            {
                                headers: {
                                    Authorization:
                                        `Bearer ${token}`,
                                },
                            }
                        );

                    const data =
                        await response.json();

                    const enrolled =
                        data.data?.some(

                            enrollment =>
                                enrollment.courseId === course.id &&
                                enrollment.status === 'active' &&
                                enrollment.refundStatus !== 'refunded'

                        );

                    setIsEnrolled(
                        enrolled
                    );

                } catch (error) {

                    console.error(error);

                }

            };

        checkEnrollment();

    }, [course.id]);



    const handleEnroll = async () => {

        if (isProcessingEnrollment || isEnrolled) {
            return;
        }

        setIsProcessingEnrollment(true);

        setShowEnrollDialog(false);

        try {

            const orderToken = localStorage.getItem("customerToken");

            const orderResponse = await fetch(
                "${API_URL}/payments/create-order",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${orderToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        amount: course.price,
                    }),
                }
            );

            const orderData = await orderResponse.json();

            if (!orderResponse.ok) {
                throw new Error(orderData.error);
            }

            const options = {

                key: orderData.key,

                amount: orderData.amount,

                currency: orderData.currency,

                order_id: orderData.orderId,

                name: "Jyotish Gyan",

                description: course.title,

                handler: async (response) => {

                    const verifyToken = localStorage.getItem("customerToken");

                    try {

                        const verifyResponse = await fetch(
                            "${API_URL}/payments/verify-course-payment",
                            {
                                method: "POST",
                                headers: {
                                    Authorization: `Bearer ${verifyToken}`,
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    razorpay_payment_id:
                                        response.razorpay_payment_id,

                                    razorpay_order_id:
                                        response.razorpay_order_id,

                                    razorpay_signature:
                                        response.razorpay_signature,

                                    courseId: course.id,
                                }),
                            }
                        );

                        const verifyData =
                            await verifyResponse.json();

                        if (!verifyResponse.ok) {
                            throw new Error(
                                verifyData.error
                            );
                        }

                        setIsEnrolled(true);

                        setShowEnrollDialog(false);

                        toast.success(
                            "Course enrolled successfully"
                        );

                    } catch (error) {

                        setShowEnrollDialog(false);

                        if (error.message === "Already enrolled") {

                            setIsEnrolled(true);

                        }

                        toast.error(error.message);

                    } finally {

                        setIsProcessingEnrollment(false);

                    }

                },

                modal: {

                    ondismiss: () => {

                        toast.info("Payment cancelled");

                        setIsProcessingEnrollment(false);

                    }

                },

                theme: {
                    color: "#7c3aed",
                },

            };

            const razorpay =
                new window.Razorpay(options);

            razorpay.open();

        } catch (error) {

            setIsProcessingEnrollment(false);

            toast.error(
                error.message
            );

        }

    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="h-full"
        >
            <Dialog
                open={showEnrollDialog}
                onOpenChange={(open) => {

                    if (!isProcessingEnrollment) {
                        setShowEnrollDialog(open);
                    }

                }}
            >
                <Card className="h-full flex flex-col overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50">
                    <div className="relative h-56 overflow-hidden">
                        <img
                            src={displayImage}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 vedic-card-overlay pointer-events-none"></div>
                        <div className="absolute top-4 right-4 z-10">
                            <Badge variant="secondary" className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
                                {course.level}
                            </Badge>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 z-10">
                            <CardTitle className="text-xl leading-tight text-white drop-shadow-md" style={{ textWrap: 'balance' }}>
                                {course.title}
                            </CardTitle>
                        </div>
                    </div>

                    <CardHeader className="pt-4 pb-2">
                        <CardDescription className="text-sm leading-relaxed line-clamp-3">
                            {course.description}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-grow">
                        <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                <span>{course.duration}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <TrendingUp className="w-4 h-4" />
                                <span className="font-medium text-foreground">₹{course.price}</span>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="mt-auto pt-4 border-t border-border/50">
                        <ProtectedActionButton
                            className="w-full"
                            size="lg"
                            disabled={
                                isEnrolled ||
                                isProcessingEnrollment
                            }
                            onClick={() =>
                                setShowEnrollDialog(true)
                            }
                        >
                            {
                                isEnrolled
                                    ? 'Already Enrolled'
                                    : 'Enroll Now'
                            }
                        </ProtectedActionButton>
                    </CardFooter>
                </Card>

                <DialogContent
                    className="max-w-2xl"
                >

                    <DialogHeader>

                        <DialogTitle>

                            Course Enrollment Summary

                        </DialogTitle>

                    </DialogHeader>

                    <div className="space-y-4">

                        <img
                            src={displayImage}
                            alt={course.title}
                            className="w-full h-52 object-cover rounded-lg"
                        />

                        <div>

                            <h3 className="text-xl font-semibold">

                                {course.title}

                            </h3>

                            <p className="text-muted-foreground mt-2">

                                {course.description}

                            </p>

                        </div>

                        <div className="grid grid-cols-2 gap-4">

                            <div>

                                <p className="text-sm text-muted-foreground">

                                    Level

                                </p>

                                <p className="font-medium">

                                    {course.level}

                                </p>

                            </div>

                            <div>

                                <p className="text-sm text-muted-foreground">

                                    Duration

                                </p>

                                <p className="font-medium">

                                    {course.duration}

                                </p>

                            </div>

                            <div>

                                <p className="text-sm text-muted-foreground">

                                    Sessions

                                </p>

                                <p className="font-medium">

                                    {course.sessions}

                                </p>

                            </div>

                            <div>

                                <p className="text-sm text-muted-foreground">

                                    Price

                                </p>

                                <p className="font-medium">

                                    ₹{course.price}

                                </p>

                            </div>

                        </div>

                        <div className="rounded-lg border p-4">

                            <h4 className="font-medium mb-2">

                                What happens after enrollment?

                            </h4>

                            <ul className="list-disc ml-5 space-y-1 text-sm">

                                <li>
                                    Course is added to your dashboard
                                </li>

                                <li>
                                    You can book sessions at your convenience
                                </li>

                                <li>
                                    Sessions are conducted over Zoom
                                </li>

                                <li>
                                    Progress is tracked automatically
                                </li>

                            </ul>

                        </div>

                    </div>

                    <DialogFooter>

                        <Button
                            variant="outline"
                            disabled={isProcessingEnrollment}
                            onClick={() =>
                                setShowEnrollDialog(false)
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={handleEnroll}
                            disabled={
                                isEnrolled ||
                                isProcessingEnrollment
                            }
                        >

                            {

                                isEnrolled

                                    ? "Already Enrolled"

                                    : isProcessingEnrollment ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            "Enroll Now"
                                        )

                            }

                        </Button>

                    </DialogFooter>

                </DialogContent>
            </Dialog>
        </motion.div>
    );
};

export default CourseCard;
