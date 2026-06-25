
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { MessageCircle, Phone, Video, Save } from 'lucide-react';

const AdminPricingPage = () => {
  const pricingOptions = [
    { id: 'chat', name: 'Chat Consultation', icon: MessageCircle, duration: 10, price: 500, active: true },
    { id: 'audio', name: 'Audio Consultation', icon: Phone, duration: 15, price: 1000, active: true },
    { id: 'video', name: 'Video Consultation', icon: Video, duration: 30, price: 1500, active: true },
  ];

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-admin-foreground">Pricing Configuration</h1>
          <p className="text-admin-muted-foreground mt-1">Manage consultation rates and durations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Card key={option.id} className="bg-admin-card border-admin-border shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="p-3 rounded-xl bg-admin-primary/10 text-admin-primary mb-2">
                      <Icon className="w-6 h-6" />
                    </div>
                    <Switch checked={option.active} />
                  </div>
                  <CardTitle className="text-lg">{option.name}</CardTitle>
                  <CardDescription>Configure base settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Duration (minutes)</Label>
                    <Input type="number" defaultValue={option.duration} className="bg-admin-background border-admin-border" />
                  </div>
                  <div className="space-y-2">
                    <Label>Price (₹)</Label>
                    <Input type="number" defaultValue={option.price} className="bg-admin-background border-admin-border" />
                  </div>
                  <Button className="w-full bg-admin-primary text-admin-primary-foreground hover:bg-admin-primary/90 mt-2">
                    <Save className="w-4 h-4 mr-2" /> Update
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
  );
};

export default AdminPricingPage;
