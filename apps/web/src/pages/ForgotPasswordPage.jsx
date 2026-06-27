import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { API_URL } from "@/config/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ForgotPasswordPage = () => {

    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!email) {

            toast.error("Email is required");

            return;

        }

        setLoading(true);

        try {

            const response = await fetch(

                `${API_URL}/auth/forgot-password`,

                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json",

                    },

                    body: JSON.stringify({

                        email,

                    }),

                }

            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(

                    data.message || "Unable to send reset email"

                );

            }

            toast.success(

                "Password reset link sent to your email."

            );

        }

        catch (err) {

            toast.error(

                err.message

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <>

            <Helmet>

                <title>

                    Forgot Password

                </title>

            </Helmet>

            <div className="min-h-screen flex items-center justify-center px-4">

                <motion.div

                    initial={{ opacity: 0, y: 20 }}

                    animate={{ opacity: 1, y: 0 }}

                    className="w-full max-w-md"

                >

                    <div className="auth-form-card p-8">

                        <div className="text-center mb-8">

                            <h1 className="text-3xl font-bold">

                                Forgot Password

                            </h1>

                            <p className="text-muted-foreground mt-2">

                                Enter your email address and we'll send you a password reset link.

                            </p>

                        </div>

                        <form

                            onSubmit={handleSubmit}

                            className="space-y-6"

                        >

                            <div>

                                <Label>

                                    Email

                                </Label>

                                <div className="relative mt-2">

                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                                    <Input

                                        type="email"

                                        value={email}

                                        onChange={(e) =>

                                            setEmail(

                                                e.target.value

                                            )

                                        }

                                        className="pl-10"

                                        placeholder="you@example.com"

                                    />

                                </div>

                            </div>

                            <Button

                                type="submit"

                                className="w-full"

                                disabled={loading}

                            >

                                {

                                    loading ?

                                        <>

                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                                            Sending...

                                        </>

                                        :

                                        "Send Reset Link"

                                }

                            </Button>

                        </form>

                        <div className="text-center mt-6">

                            <Link

                                to="/login"

                                className="text-primary hover:underline"

                            >

                                Back to Login

                            </Link>

                        </div>

                    </div>

                </motion.div>

            </div>

        </>

    );

};

export default ForgotPasswordPage;