
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarPlus as CalendarIcon, Clock, Sparkles, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { useBooking } from '@/hooks/useBooking';
import { useAuth } from '@/hooks/useAuth';
import apiServerClient from '@/lib/apiServerClient';
import pb from '@/lib/pocketbaseClient.js';
import { getValidToken } from '@/lib/tokenUtils.js';

const BookingPage = () => {
  const navigate = useNavigate();
  const { formData, errors, isSubmitting, handleChange, handleSubmit, resetForm } = useBooking();
  const { isAuthenticated } = useAuth();

  // Dynamic Availability States
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotCache, setSlotCache] = useState({});

  const services = [
    { value: 'Astrology Reading', label: 'Astrology Reading', price: 127 },
    { value: 'Meditation Guidance', label: 'Meditation Guidance', price: 89 },
    { value: 'Reiki Healing', label: 'Reiki Healing', price: 167 },
    { value: 'Tarot Reading', label: 'Tarot Reading', price: 119 }
  ];

  const durations = [
    { value: '30', label: '30 minutes' },
    { value: '60', label: '60 minutes' },
    { value: '90', label: '90 minutes' }
  ];

  const selectedService = services.find(s => s.value === formData.service);

  // Fetch available slots when date changes
  useEffect(() => {
    if (formData.date) {
      if (!pb.authStore.isValid) {
        toast.error('Authentication required', { description: 'Please log in to book a consultation.' });
        navigate('/login');
        return;
      }

      const dateStr = format(formData.date, 'yyyy-MM-dd');
      
      // Use cached slots if available
      if (slotCache[dateStr]) {
        setAvailableSlots(slotCache[dateStr]);
        return;
      }

      const fetchSlots = async () => {
        setIsLoadingSlots(true);
        handleChange('time', ''); // Reset time selection on date change
        
        try {
          const token = await getValidToken();
          
          if (!token) {
            pb.authStore.clear();
            localStorage.removeItem('adminToken');
            toast.error('Your session has expired. Please log in again.');
            navigate('/login');
            return;
          }

          const res = await apiServerClient.fetch(`/admin/availability?date=${dateStr}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (res.status === 401) {
            pb.authStore.clear();
            localStorage.removeItem('adminToken');
            toast.error('Your session has expired. Please log in again.');
            navigate('/login');
            return;
          }

          if (res.status === 403) {
            toast.error('Access denied', { description: 'You do not have permission to view available slots.' });
            setAvailableSlots([]);
            return;
          }

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || 'Failed to fetch available slots');
          }
          
          const data = await res.json();
          setAvailableSlots(data || []);
          
          // Cache the results for this date
          setSlotCache(prev => ({ ...prev, [dateStr]: data || [] }));
        } catch (err) {
          console.error('Error fetching availability:', err);
          toast.error('Failed to load available times', {
            description: err.message || 'Please try another date'
          });
          setAvailableSlots([]);
        } finally {
          setIsLoadingSlots(false);
        }
      };

      fetchSlots();
    } else {
      setAvailableSlots([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.date, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {

        toast.error(
            'Authentication required',
            {
                description:
                    'Please log in to book a consultation.',
            }
        );

        navigate('/login');

        return;
    }

    const success = await handleSubmit(() => {
      toast.success('Booking confirmed', {
        description: 'You will receive a confirmation email shortly.'
      });
      resetForm();
    });
  };

  return (
    <>
      <Helmet>
        <title>Book a Consultation - Divya Khaneja</title>
        <meta name="description" content="Schedule your personalized consultation with Divya Khaneja. Choose from astrology readings, meditation guidance, reiki healing, or tarot readings." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow">
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mx-auto text-center mb-16"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-sm border border-border mb-6">
                  <Sparkles className="w-4 h-4 text-foreground" />
                  <span className="text-sm font-bold text-foreground uppercase tracking-wider">Personalized Guidance</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-foreground" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
                  Book Your Consultation
                </h1>
                <p className="text-lg text-foreground/80 font-medium leading-relaxed">
                  Schedule a one-on-one session with Divya Khaneja for personalized spiritual guidance
                </p>
              </motion.div>

              <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <div className="lg:col-span-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <Card className="border-border/50 shadow-md">
                      <CardHeader>
                        <CardTitle className="text-2xl text-card-foreground">Consultation Details</CardTitle>
                        <CardDescription className="text-card-foreground/70">
                          Fill in your information to schedule your session
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={onSubmit} className="space-y-6">
                          <div className="space-y-2">
                            <Label htmlFor="service">Service *</Label>
                            <Select
                              value={formData.service}
                              onValueChange={(value) => handleChange('service', value)}
                            >
                              <SelectTrigger id="service" className={errors.service ? 'border-destructive' : ''}>
                                <SelectValue placeholder="Select a service" />
                              </SelectTrigger>
                              <SelectContent>
                                {services.map((service) => (
                                  <SelectItem key={service.value} value={service.value}>
                                    {service.label} - ${service.price}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors.service && (
                              <p className="text-sm text-destructive">{errors.service}</p>
                            )}
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Date *</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={`w-full justify-start text-left font-normal ${errors.date ? 'border-destructive' : ''}`}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {formData.date ? format(formData.date, 'PPP') : <span>Pick a date</span>}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={formData.date}
                                    onSelect={(date) => handleChange('date', date)}
                                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              {errors.date && (
                                <p className="text-sm text-destructive">{errors.date}</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="time">Time *</Label>
                              <Select
                                value={formData.time}
                                onValueChange={(value) => handleChange('time', value)}
                                disabled={!formData.date || isLoadingSlots || availableSlots.length === 0}
                              >
                                <SelectTrigger id="time" className={errors.time ? 'border-destructive' : ''}>
                                  <SelectValue placeholder={
                                    !formData.date ? "Select date first" :
                                    isLoadingSlots ? "Loading slots..." :
                                    availableSlots.length === 0 ? "No available slots" :
                                    "Select time"
                                  } />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableSlots.map((slot) => {
                                    const timeDisplay = new Date(`2000-01-01T${slot.startTime}`).toLocaleTimeString('en-US', { 
                                      hour: 'numeric', 
                                      minute: '2-digit', 
                                      hour12: true 
                                    });
                                    return (
                                      <SelectItem key={slot.id} value={slot.startTime}>
                                        {timeDisplay}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                              {isLoadingSlots && (
                                <p className="text-xs text-muted-foreground flex items-center mt-1">
                                  <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Fetching times...
                                </p>
                              )}
                              {!isLoadingSlots && formData.date && availableSlots.length === 0 && (
                                <p className="text-xs text-destructive mt-1">No slots available for this date.</p>
                              )}
                              {errors.time && (
                                <p className="text-sm text-destructive">{errors.time}</p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="duration">Duration</Label>
                            <Select
                              value={formData.duration}
                              onValueChange={(value) => handleChange('duration', value)}
                            >
                              <SelectTrigger id="duration">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {durations.map((duration) => (
                                  <SelectItem key={duration.value} value={duration.value}>
                                    {duration.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Name *</Label>
                              <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="Your full name"
                                className={errors.name ? 'border-destructive' : ''}
                              />
                              {errors.name && (
                                <p className="text-sm text-destructive">{errors.name}</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="email">Email *</Label>
                              <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                placeholder="your.email@example.com"
                                className={errors.email ? 'border-destructive' : ''}
                              />
                              {errors.email && (
                                <p className="text-sm text-destructive">{errors.email}</p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone *</Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => handleChange('phone', e.target.value)}
                              placeholder="+1 (555) 123-4567"
                              className={errors.phone ? 'border-destructive' : ''}
                            />
                            {errors.phone && (
                              <p className="text-sm text-destructive">{errors.phone}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="requests">Special Requests</Label>
                            <Textarea
                              id="requests"
                              value={formData.specialRequests}
                              onChange={(e) => handleChange('specialRequests', e.target.value)}
                              placeholder="Any specific topics or questions you'd like to discuss..."
                              rows={4}
                            />
                          </div>

                          <Button
                            type="submit"
                            size="lg"
                            className="w-full text-primary-foreground bg-primary hover:bg-primary/90"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Confirming Booking...</>
                            ) : 'Confirm Booking'}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Card className="border-border/50 shadow-md">
                      <CardHeader>
                        <CardTitle className="text-xl text-card-foreground">Booking Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {selectedService && (
                          <div className="pb-4 border-b border-border">
                            <p className="text-sm text-card-foreground/70 mb-1">Service</p>
                            <p className="font-bold text-card-foreground">{selectedService.label}</p>
                            <p className="text-2xl font-bold text-primary mt-2">${selectedService.price}</p>
                          </div>
                        )}

                        {formData.date && (
                          <div className="pb-4 border-b border-border">
                            <p className="text-sm text-card-foreground/70 mb-1">Date & Time</p>
                            <div className="flex items-center gap-2 text-sm text-card-foreground">
                              <CalendarIcon className="w-4 h-4" />
                              <span>{format(formData.date, 'PPP')}</span>
                            </div>
                            {formData.time && (
                              <div className="flex items-center gap-2 text-sm mt-1 text-card-foreground">
                                <Clock className="w-4 h-4" />
                                <span>{formData.time}</span>
                              </div>
                            )}
                          </div>
                        )}

                        <div>
                          <p className="text-sm text-card-foreground/70 mb-1">Duration</p>
                          <p className="font-bold text-card-foreground">{formData.duration} minutes</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Card className="border-border/50 bg-primary text-primary-foreground shadow-md">
                      <CardContent className="pt-6">
                        <h3 className="font-bold mb-3 text-lg">What to Expect</h3>
                        <ul className="space-y-2 text-sm opacity-90 font-medium">
                          <li>• Confirmation email within 24 hours</li>
                          <li>• Zoom link sent before session</li>
                          <li>• Personalized guidance and insights</li>
                          <li>• Recording available upon request</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default BookingPage;
