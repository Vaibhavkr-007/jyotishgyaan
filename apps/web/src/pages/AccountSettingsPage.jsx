
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Lock, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const AccountSettingsPage = () => {
  return (
    <>
      <Helmet>
        <title>Account Settings - Jyotish Gyan</title>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background/50">
        <Header />

        <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-4xl">
            <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Account Settings</h1>
              <p className="text-muted-foreground">Manage your preferences, notifications, and security.</p>
            </motion.div>

            <div className="space-y-6">
              {/* Notifications */}
              <Card className="bg-card border-border/40 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>Choose what updates you want to receive.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base text-card-foreground">Appointment Reminders</Label>
                      <p className="text-sm text-muted-foreground">Receive emails before your scheduled sessions.</p>
                    </div>
                    <Switch defaultChecked onCheckedChange={() => toast.success("Preference updated")} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base text-card-foreground">Newsletter & Offers</Label>
                      <p className="text-sm text-muted-foreground">Get spiritual insights and exclusive discounts.</p>
                    </div>
                    <Switch onCheckedChange={() => toast.success("Preference updated")} />
                  </div>
                </CardContent>
              </Card>

              {/* Security */}
              <Card className="bg-card border-border/40 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lock className="w-5 h-5 text-primary" />
                    Security
                  </CardTitle>
                  <CardDescription>Keep your account secure.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-border/40">
                    <div>
                      <p className="font-medium text-card-foreground">Password</p>
                      <p className="text-sm text-muted-foreground">Change your password</p>
                    </div>
                    <Button variant="outline" onClick={() => toast.info("Password reset flow coming soon.")}>Change</Button>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-card-foreground">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline" onClick={() => toast.info("2FA setup coming soon.")}>Enable</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="bg-destructive/5 border-destructive/20 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                    <ShieldAlert className="w-5 h-5" />
                    Danger Zone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-card-foreground">Delete Account</p>
                      <p className="text-sm text-muted-foreground max-w-md">Permanently remove your account and all associated data. This action cannot be undone.</p>
                    </div>
                    <Button variant="destructive" onClick={() => toast.error("Account deletion requires admin contact right now.")}>
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AccountSettingsPage;
