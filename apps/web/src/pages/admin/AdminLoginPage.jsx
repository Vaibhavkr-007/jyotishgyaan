
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Lock, AlertCircle, Loader2 } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('admin@astrology.com');
  const [password, setPassword] = useState('Admin@123456');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAdminAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log('[AdminLoginPage] User is already authenticated, redirecting to /admin/dashboard');
      navigate('/admin/bookings', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    
    console.log('[AdminLogin] Login attempt initiated');

    try {
      const response = await apiServerClient.fetch('/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      console.log(`[AdminLogin] Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      
      if (data.token) {
        console.log(`[AdminLogin] Login successful. Saving token and redirecting to /admin/dashboard`);
        login(data.token, data.user);
        
        setTimeout(() => {
          navigate('/admin/bookings', { replace: true });
        }, 300);
      } else {
        throw new Error('No token received from server');
      }
    } catch (err) {
      console.error('[AdminLogin] Error:', err.message);
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-admin-background">
        <Loader2 className="w-8 h-8 animate-spin text-admin-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-admin-background p-4">
      <Card className="w-full max-w-md border-admin-border shadow-xl">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="w-12 h-12 bg-admin-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Sparkles className="w-6 h-6 text-admin-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-admin-foreground">Admin Portal</CardTitle>
          <CardDescription className="text-admin-muted-foreground">
            Sign in to manage your astrology platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          
          {errorMsg && (
            <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start text-destructive">
              <AlertCircle className="w-5 h-5 mr-3 mt-0.5 shrink-0" />
              <p className="text-sm font-medium">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@astrology.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-admin-background border-admin-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-admin-background border-admin-border text-foreground"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
