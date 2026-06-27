
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { validateEmail } from '@/utils/validation.js';
import { getIntendedDestination, clearIntendedDestination } from '@/utils/authUtils.js';
import { toast } from 'sonner';
import { API_URL } from "@/config/api";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [showResendVerification, setShowResendVerification] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Successfully logged in');
      
      const destination = getIntendedDestination() || '/dashboard';
      clearIntendedDestination();
      navigate(destination, { replace: true });
    } catch (err) {

        if (
          err.message.includes(
            'verify your email'
          )
        ) {

          setShowResendVerification(true);

          toast.error(
            'Please verify your email before logging in.'
          );

        } else {

          setShowResendVerification(false);

          toast.error(
            err.message ||
            'Login failed. Check your credentials.'
          );

        }

      } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - Jyotish Gyan</title>
        <meta name="description" content="Login to your Jyotish Gyan account to manage your consultations." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-3xl pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="auth-form-card p-8 md:p-10 relative z-10">
            <div className="text-center mb-8">
              <Link to="/" className="inline-block mb-6">
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Jyotish Gyan</span>
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-card-foreground mb-2">Welcome Back</h1>
              <p className="text-muted-foreground text-sm">Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-card-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10 text-foreground"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-card-foreground">Password</Label>
                  <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                      Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10 text-foreground"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground cursor-pointer">Remember me for 30 days</Label>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</>
                ) : "Sign in"}
              </Button>

              {showResendVerification && (

                <button
                  type="button"
                  className="
                    w-full
                    mt-3
                    text-sm
                    text-primary
                    hover:underline
                  "
                  onClick={async () => {

                    try {

                      const response =
                        await fetch(
                          `${API_URL}/auth/resend-verification`,
                          {
                            method: 'POST',
                            headers: {
                              'Content-Type':
                                'application/json'
                            },
                            body: JSON.stringify({
                              email:
                                formData.email
                            })
                          }
                        );

                      const data =
                        await response.json();

                      if (!response.ok) {
                        throw new Error(
                          data.message
                        );
                      }

                      toast.success(
                        'Verification email sent'
                      );

                    } catch (error) {

                      toast.error(
                        error.message ||
                        'Failed to send email'
                      );

                    }

                  }}
                >
                  Resend verification email
                </button>

              )}
            </form>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;
