
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Save, CheckCircle2 } from 'lucide-react';

const AdminSettingsPage = () => {
  return (
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold text-admin-foreground">Settings</h1>
          <p className="text-admin-muted-foreground mt-1">Manage platform configurations and integrations.</p>
        </div>

        <div className="grid gap-6">
          <Card className="bg-admin-card border-admin-border shadow-sm">
            <CardHeader>
              <CardTitle>Profile Management</CardTitle>
              <CardDescription>Update your admin credentials.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input defaultValue="Enter admin password" className="bg-admin-background border-admin-border" />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input type="password" placeholder="Enter password" className="bg-admin-background border-admin-border" />
                </div>
              </div>
              <Button className="bg-admin-primary text-admin-primary-foreground hover:bg-admin-primary/90">
                <Save className="w-4 h-4 mr-2" /> Save Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-admin-card border-admin-border shadow-sm">
            <CardHeader>
              <CardTitle>Integrations Status</CardTitle>
              <CardDescription>Monitor third-party service connections.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Cal.com API', status: 'Connected' },
                  { name: 'Razorpay Gateway', status: 'Connected' },
                  { name: 'Email Service (SendGrid)', status: 'Connected' },
                  { name: 'Zoom Integration', status: 'Connected' },
                ].map((integration, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-admin-border rounded-lg bg-admin-background">
                    <span className="font-medium text-admin-foreground">{integration.name}</span>
                    <div className="flex items-center text-admin-success text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      {integration.status}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-admin-card border-admin-border shadow-sm">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure email alerts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'New Bookings', desc: 'Receive an email when a new booking is made.' },
                { label: 'Cancellations', desc: 'Receive an email when a booking is cancelled.' },
                { label: 'Daily Summary', desc: 'Receive a daily summary of upcoming appointments.' },
              ].map((pref, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div>
                    <Label className="text-base">{pref.label}</Label>
                    <p className="text-sm text-admin-muted-foreground">{pref.desc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default AdminSettingsPage;
