
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validateEmail, validatePasswordStrength } from '@/utils/validation.js';
import { getIntendedDestination, clearIntendedDestination } from '@/utils/authUtils.js';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', password: '', passwordConfirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerificationDialog,setShowVerificationDialog] = useState(false);
  const [errors, setErrors] = useState({});

  const strength = validatePasswordStrength(formData.password);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (formData.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email address';
    if (strength.score < 3) newErrors.password = 'Password is not strong enough';
    if (formData.password !== formData.passwordConfirm) newErrors.passwordConfirm = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      console.log("Before signup");

      await signup(
        formData.name,
        formData.email,
        formData.password,
        formData.passwordConfirm
      );

      console.log("Signup completed");

      setShowVerificationDialog(true);

      console.log("Dialog state set");
    } catch (err) {
      console.error(err);

      toast.error(
        err.message || "Failed to create account."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign Up - Jyotish Gyan</title>
        <meta name="description" content="Create a new account on Jyotish Gyan to book your spiritual consultations." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-3xl pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="auth-form-card p-8 md:p-10 relative z-10">
            <div className="text-center mb-8">
              <Link to="/" className="inline-block mb-4">
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Jyotish Gyan</span>
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-card-foreground mb-2">Create Account</h1>
              <p className="text-muted-foreground text-sm">Join us for your spiritual journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-card-foreground">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    className="pl-10 text-foreground"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

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
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-card-foreground">Password</Label>
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
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden flex">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div 
                          key={level} 
                          className={`h-full flex-1 border-r border-background last:border-0 ${level <= strength.score ? strength.color : 'bg-transparent'}`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] uppercase font-medium text-muted-foreground w-12 text-right">
                      {strength.text}
                    </span>
                  </div>
                )}
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwordConfirm" className="text-card-foreground">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="passwordConfirm"
                    name="passwordConfirm"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10 text-foreground"
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.passwordConfirm && <p className="text-xs text-destructive">{errors.passwordConfirm}</p>}
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 mt-2" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...</>
                ) : "Create Account"}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
      <Dialog
        open={showVerificationDialog}
        onOpenChange={() => {}}
      >

        <DialogContent
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >

          <DialogHeader>

              <DialogTitle>
                  📧 Verification Email Sent
              </DialogTitle>

              <DialogDescription>
                  Your account has been created successfully.
              </DialogDescription>

          </DialogHeader>

          <div className="mt-6 rounded-xl border bg-muted/40 p-4">

              <p className="text-sm text-muted-foreground">
                  Verification email sent to
              </p>

              <p className="mt-2 font-semibold text-primary break-all">
                  {formData.email}
              </p>

              <p className="mt-4 text-sm text-muted-foreground">
                  Please open your inbox and click the verification link before signing in.
              </p>

          </div>

          <Button
              className="w-full mt-6"
              onClick={() =>
                  navigate('/login', { replace: true })
              }
          >
              Go To Login
          </Button>

        </DialogContent>

      </Dialog>
    </>
  );
};

export default SignupPage;
