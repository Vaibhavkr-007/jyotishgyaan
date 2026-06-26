
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { CalendarPlus as CalendarIcon, Lock, MessageCircle, Phone, Video, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useBooking } from '@/hooks/useBooking.js';
import { useAuth } from '@/hooks/useAuth.js';
import { setIntendedDestination } from '@/utils/authUtils.js';
import { consultationPricingOptions } from '@/data/consultationsData.js';
import { toast } from 'sonner';
import { debugAuth } from '@/lib/authDebug.js';
import authenticatedApiClient from '@/lib/authenticatedApiClient';
import { API_URL } from "@/config/api";

const iconMap = {
  MessageCircle: MessageCircle,
  Phone: Phone,
  Video: Video
};

const BookingModal = ({ trigger, prefilledService }) => {
  const [open, setOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);
  const [modeError, setModeError] = useState('');
  const navigate = useNavigate();
  
  // Dynamic Availability States
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotCache, setSlotCache] = useState({});
  
  const { formData, errors, isSubmitting, handleChange, handleSubmit, resetForm } = useBooking();
  const { isAuthenticated } = useAuth();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { user } = useAuth();

  const services = [
    'Astrology Reading',
    'Meditation Guidance',
    'Reiki Healing',
    'Tarot Reading',
    'Kundli Vishleshan',
    'Personalized Consultancy'
  ];

  // Debug auth on mount
  useEffect(() => {
    if (open) {
      debugAuth();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      if (prefilledService) {
        handleChange('service', prefilledService);
      }
      // Reset mode selection on fresh open
      if (!formData.mode) {
        setSelectedMode(null);
        setModeError('');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, prefilledService]);

  // Fetch available slots when date changes
  useEffect(() => {
    if (formData.date) {

      const dateStr = format(
          formData.date,
          'yyyy-MM-dd'
      );

      const cacheKey = `${dateStr}-${selectedMode?.id}`;
      
      // Use cached slots if available
      if (slotCache[cacheKey]) {
          setAvailableSlots(slotCache[cacheKey]);
          return;
      }


      const fetchSlots = async () => {
        setIsLoadingSlots(true);
        handleChange('time', '');

        console.log(`[BookingModal] Fetching slots for date: ${dateStr}`);

        try {

          if (!selectedMode) {
            setAvailableSlots([]);
            return;
          }

          const consultationType =
            selectedMode.type.toLowerCase().includes('chat')
              ? 'chat'
              : selectedMode.type.toLowerCase().includes('audio')
              ? 'audio'
              : 'video';

          const res = await fetch(
            `${API_URL}/consultations/slots?type=${consultationType}&startDate=${dateStr}&endDate=${dateStr}`
          );

          const data = await res.json();

          console.log('[BookingModal] Cal.com response:', data);

          if (!res.ok) {
            throw new Error(data.error || 'Failed to fetch slots');
          }

          const slots = data?.data?.slots || [];

          setAvailableSlots(slots);

          setSlotCache(prev => ({
            ...prev,
            [cacheKey]: slots,
          }));

        } catch (err) {
          console.error('Error fetching slots:', err);

          toast.error('Failed to load available times', {
            description: err.message || 'Please try another date',
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
  }, [
      formData.date,
      selectedMode,
      isAuthenticated,
      navigate,
  ]);

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
    setModeError('');
    handleChange('mode', mode.type);
    handleChange('duration', mode.duration.toString());
    handleChange('price', mode.price.toString());
    handleChange('time', '');
    setAvailableSlots([]);
  };

  const openRazorpay = (order) => {

    // console.log("AUTH USER:", user);

      const options = {

          key: order.key,

          amount: order.amount,

          currency: order.currency,

          name: "Divya Khaneja",

          description: "Consultation Booking",

          order_id: order.orderId,

          prefill: {
              name: user?.name || '',
              email: user?.email || '',
              contact: user?.phone || '',
          },

          handler: function (response) {

              console.log("PAYMENT SUCCESS:", response);

              setIsProcessingPayment(false);

              verifyPayment(response);

          },

      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {

          console.log("PAYMENT FAILED:", response);

          setIsProcessingPayment(false);

          toast.error(
              response.error?.description ||
              "Payment failed"
          );

      });

      razorpay.on("modal.close", function () {

          console.log("MODAL CLOSED");

          setIsProcessingPayment(false);

      });

      razorpay.open();
  };

  const onSubmit = async (e) => {
      e.preventDefault();

      if (!selectedMode) {
          setModeError('Please select a consultation mode.');
          return;
      }

      try {
          setIsProcessingPayment(true);
          // Create Razorpay order

          const token = localStorage.getItem('customerToken');

          const response = await fetch(
              `${API_URL}/payments/create-order`,
              {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                      amount: selectedMode.price,

                      consultationType:
                        selectedMode.type.toLowerCase().includes('chat')
                            ? 'chat'
                            : selectedMode.type.toLowerCase().includes('audio')
                            ? 'audio'
                            : 'video',

                      slotStart: formData.time,

                      service: formData.service,
                      specialRequests: formData.specialRequests,
                  }),
              }
          );

          const order = await response.json();

          if (!response.ok || !order.success) {
              throw new Error(order.error || 'Failed to create order');
          }

          setOpen(false);

          setTimeout(() => {

              openRazorpay(order);

          }, 500);

      } catch (error) {

          setIsProcessingPayment(false);

          toast.error(
              error.message ||
              'Payment initialization failed'
          );

      }
  };

  const verifyPayment = async (paymentResponse) => {
    
      const token =
            localStorage.getItem('customerToken');

      try {
          const response = await fetch(
              `${API_URL}/payments/verify`,
              {
                  method: 'POST',

                  headers: {

                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`

                  },

                  body: JSON.stringify({

                      ...paymentResponse,

                      consultationType:
                        selectedMode.type.toLowerCase().includes('chat')
                            ? 'chat'
                            : selectedMode.type.toLowerCase().includes('audio')
                            ? 'audio'
                            : 'video',

                      slotStart: formData.time,

                      service: formData.service,

                      specialRequests: formData.specialRequests,

                      amount: selectedMode.price,

                  }),

              }
          );

          const data = await response.json();

          if (!data.success) {
              throw new Error(data.error || "Verification failed");
          }

          toast.success(
              'Booking confirmed! Meeting details have been sent to your registered email.'
          );

          resetForm();

          setSelectedMode(null);

          setOpen(false);

      } catch (err) {
          toast.error(err.message);
      }

  };

  const handleLoginClick = () => {
    setIntendedDestination(window.location.pathname + window.location.search);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Book a Consultation</DialogTitle>
          <DialogDescription>
            Schedule your personalized session with Divya Khaneja
          </DialogDescription>
        </DialogHeader>
        
        {!isAuthenticated ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-2">
              <Lock className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Authentication Required</h3>
            <p className="text-muted-foreground text-sm max-w-xs mb-4">
              Please log in to your account to book a consultation and manage your appointments.
            </p>
            <Button asChild className="w-full max-w-xs">
              <Link to="/login" onClick={handleLoginClick}>Log In to Book</Link>
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Don't have an account? <Link to="/signup" onClick={handleLoginClick} className="text-primary hover:underline">Sign up</Link>
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-6 pt-2">
            
            <div className="space-y-2">
              <Label htmlFor="modal-service">Service Category *</Label>
              <Select
                value={formData.service}
                onValueChange={(value) => handleChange('service', value)}
              >
                <SelectTrigger id="modal-service" className={errors.service ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                  {/* Fallback for prefilled services not in the main list */}
                  {prefilledService && !services.includes(prefilledService) && (
                    <SelectItem value={prefilledService}>{prefilledService}</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.service && (
                <p className="text-sm text-destructive">{errors.service}</p>
              )}
            </div>

            {/* Consultation Mode Selection */}
            <div className="space-y-3">
              <Label>Consultation Mode *</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {consultationPricingOptions.map((option) => {
                  const isSelected = selectedMode?.id === option.id;
                  const Icon = iconMap[option.icon] || MessageCircle;
                  return (
                    <div
                      key={option.id}
                      onClick={() => handleModeSelect(option)}
                      className={`cursor-pointer rounded-xl border p-4 flex flex-col items-center text-center transition-all duration-200 ${
                        isSelected 
                          ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-sm' 
                          : 'border-border/50 hover:border-primary/50 bg-card hover:bg-card/80'
                      }`}
                    >
                      <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div className={`text-sm font-semibold mb-1 ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                        {option.type}
                      </div>
                      <div className="text-xs text-muted-foreground font-medium">
                        {option.duration} mins • ₹{option.price}
                      </div>
                    </div>
                  );
                })}
              </div>
              {modeError && (
                <p className="text-sm text-destructive font-medium">{modeError}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  <PopoverContent className="w-auto p-0">
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
                <Label htmlFor="modal-time">Time *</Label>
                <Select
                  value={formData.time}
                  onValueChange={(value) => handleChange('time', value)}
                  disabled={!formData.date || isLoadingSlots || !Array.isArray(availableSlots) || availableSlots.length === 0}
                >
                  <SelectTrigger id="modal-time" className={errors.time ? 'border-destructive' : ''}>
                    <SelectValue placeholder={
                      !formData.date ? "Select date first" :
                      isLoadingSlots ? "Loading slots..." :
                      (!Array.isArray(availableSlots) || availableSlots.length === 0) ? "No available slots" :
                      "Select time"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(availableSlots) && availableSlots.map((slot) => {
                      const timeDisplay = new Date(slot.start).toLocaleTimeString(
                        'en-US',
                        {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        }
                      );

                      return (
                        <SelectItem key={slot.start} value={slot.start}>
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
                {!isLoadingSlots && formData.date && (!Array.isArray(availableSlots) || availableSlots.length === 0) && (
                  <p className="text-xs text-destructive mt-1">No slots available for this date.</p>
                )}
                {errors.time && (
                  <p className="text-sm text-destructive">{errors.time}</p>
                )}
              </div>
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="modal-name">Name *</Label>
              <Input
                id="modal-name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Your full name"
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div> */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* <div className="space-y-2">
                <Label htmlFor="modal-email">Email *</Label>
                <Input
                  id="modal-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div> */}

              {/* <div className="space-y-2">
                <Label htmlFor="modal-phone">Phone *</Label>
                <Input
                  id="modal-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className={errors.phone ? 'border-destructive' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone}</p>
                )}
              </div> */}
            </div>

            <div className="space-y-2">
              <Label htmlFor="modal-requests">Special Requests</Label>
              <Textarea
                id="modal-requests"
                value={formData.specialRequests}
                onChange={(e) => handleChange('specialRequests', e.target.value)}
                placeholder="Any specific topics or questions you'd like to discuss..."
                rows={2}
              />
            </div>

            {/* Booking Summary */}
            {selectedMode && (
              <div className="bg-muted/30 border border-border/40 rounded-xl p-4 mt-2">
                <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Booking Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-medium text-foreground text-right">{formData.service || 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Mode</span>
                    <span className="font-medium text-foreground">{selectedMode.type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium text-foreground">{selectedMode.duration} minutes</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-border/50 flex justify-between items-center">
                    <span className="font-bold text-foreground">Total Due</span>
                    <span className="font-bold text-primary text-lg">₹{selectedMode.price}</span>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting || isProcessingPayment}
            >
              {isSubmitting || isProcessingPayment ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                'Confirm Booking'
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
