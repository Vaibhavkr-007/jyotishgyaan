import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import {
    Lock,
    Eye,
    EyeOff,
    Loader2
} from "lucide-react";

import { toast } from "sonner";

import { API_URL } from "@/config/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ResetPasswordPage = () => {

    const { token } = useParams();

    const navigate = useNavigate();

    const [password, setPassword] = useState("");

    const [passwordConfirm, setPasswordConfirm] = useState("");

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!password || !passwordConfirm) {

            toast.error("Please fill all fields");

            return;

        }

        if (password !== passwordConfirm) {

            toast.error("Passwords do not match");

            return;

        }

        if (password.length < 8) {

            toast.error(
                "Password must be at least 8 characters"
            );

            return;

        }

        setLoading(true);

        try {

            const response =
                await fetch(

                    `${API_URL}/auth/reset-password`,

                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body: JSON.stringify({

                            token,

                            password,

                            passwordConfirm

                        })

                    }

                );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(

                    data.message ||

                    "Unable to reset password"

                );

            }

            toast.success(

                "Password updated successfully"

            );

            navigate("/login");

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

                    Reset Password

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

                                Reset Password

                            </h1>

                            <p className="text-muted-foreground mt-2">

                                Enter your new password.

                            </p>

                        </div>

                        <form

                            onSubmit={handleSubmit}

                            className="space-y-5"

                        >

                            <div>

                                <Label>

                                    New Password

                                </Label>

                                <div className="relative mt-2">

                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>

                                    <Input

                                        type={

                                            showPassword

                                            ?

                                            "text"

                                            :

                                            "password"

                                        }

                                        value={password}

                                        onChange={(e)=>

                                            setPassword(

                                                e.target.value

                                            )

                                        }

                                        className="pl-10 pr-10"

                                    />

                                    <button

                                        type="button"

                                        className="absolute right-3 top-1/2 -translate-y-1/2"

                                        onClick={()=>

                                            setShowPassword(

                                                !showPassword

                                            )

                                        }

                                    >

                                        {

                                            showPassword ?

                                            <EyeOff size={18}/>

                                            :

                                            <Eye size={18}/>

                                        }

                                    </button>

                                </div>

                            </div>

                            <div>

                                <Label>

                                    Confirm Password

                                </Label>

                                <div className="relative mt-2">

                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>

                                    <Input

                                        type={

                                            showConfirmPassword

                                            ?

                                            "text"

                                            :

                                            "password"

                                        }

                                        value={passwordConfirm}

                                        onChange={(e)=>

                                            setPasswordConfirm(

                                                e.target.value

                                            )

                                        }

                                        className="pl-10 pr-10"

                                    />

                                    <button

                                        type="button"

                                        className="absolute right-3 top-1/2 -translate-y-1/2"

                                        onClick={()=>

                                            setShowConfirmPassword(

                                                !showConfirmPassword

                                            )

                                        }

                                    >

                                        {

                                            showConfirmPassword ?

                                            <EyeOff size={18}/>

                                            :

                                            <Eye size={18}/>

                                        }

                                    </button>

                                </div>

                            </div>

                            <Button

                                className="w-full"

                                type="submit"

                                disabled={loading}

                            >

                                {

                                    loading ?

                                    <>

                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>

                                        Updating...

                                    </>

                                    :

                                    "Save Password"

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

export default ResetPasswordPage;