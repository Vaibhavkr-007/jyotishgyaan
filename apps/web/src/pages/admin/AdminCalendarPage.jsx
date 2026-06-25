
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, RefreshCw, 
  Video, Phone, MessageSquare, Clock 
} from 'lucide-react';
import { getAuthHeaders } from '@/utils/authHeaders.js';
import apiServerClient from '@/lib/apiServerClient';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { toast } from 'sonner';

import DatePicker from '@/components/admin/DatePicker.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const AdminCalendarPageContent = () => {
  // Data States
  const [bookings, setBookings] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [blocked, setBlocked] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // View States
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week'); // week, day
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchData = useCallback(async () => {
    console.log('[AdminCalendar] Fetching calendar data...');
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      const start = format(startOfWeek(currentDate, { weekStartsOn: 0 }), 'yyyy-MM-dd');
      const end = format(endOfWeek(currentDate, { weekStartsOn: 0 }), 'yyyy-MM-dd');

      console.log(`[AdminCalendar] Date range: ${start} to ${end}`);

      const [bookRes, availRes, blockRes] = await Promise.all([
        apiServerClient.fetch(`/admin/calendar/bookings?startDate=${start}&endDate=${end}`, { method: 'GET', headers }).catch(() => ({ ok: false })),
        apiServerClient.fetch(`/admin/calendar/availability?startDate=${start}&endDate=${end}`, { method: 'GET', headers }).catch(() => ({ ok: false })),
        apiServerClient.fetch(`/admin/calendar/blocked?startDate=${start}&endDate=${end}`, { method: 'GET', headers }).catch(() => ({ ok: false }))
      ]);

      // Validate and process bookings response
      console.log(`[AdminCalendar] Bookings response status: ${bookRes.status}`);
      if (bookRes.ok) {
        const bookData = await bookRes.json();
        console.log('[AdminCalendar] Bookings response data:', bookData);
        
        // Validate response format
        if (!bookData || typeof bookData !== 'object') {
          console.warn('[AdminCalendar] Invalid bookings response format');
          setBookings([]);
        } else {
          // Extract data from { data: [...] } or use directly if [...]
          const bookingsArray = Array.isArray(bookData) ? bookData : (bookData.data || []);
          
          if (!Array.isArray(bookingsArray)) {
            console.warn('[AdminCalendar] Bookings data is not an array:', bookingsArray);
            setBookings([]);
          } else {
            console.log(`[AdminCalendar] Successfully validated ${bookingsArray.length} bookings`);
            setBookings(bookingsArray);
          }
        }
      } else {
        console.warn(`[AdminCalendar] Bookings fetch failed with status ${bookRes.status}`);
        setBookings([]);
      }

      // Validate and process availability response
      console.log(`[AdminCalendar] Availability response status: ${availRes.status}`);
      if (availRes.ok) {
        const availData = await availRes.json();
        console.log('[AdminCalendar] Availability response data:', availData);
        
        // Validate response format
        if (!availData || typeof availData !== 'object') {
          console.warn('[AdminCalendar] Invalid availability response format');
          setAvailability([]);
        } else {
          // Extract data from { data: [...] } or use directly if [...]
          const availArray = Array.isArray(availData) ? availData : (availData.data || []);
          
          if (!Array.isArray(availArray)) {
            console.warn('[AdminCalendar] Availability data is not an array:', availArray);
            setAvailability([]);
          } else {
            console.log(`[AdminCalendar] Successfully validated ${availArray.length} availability slots`);
            setAvailability(availArray);
          }
        }
      } else {
        console.warn(`[AdminCalendar] Availability fetch failed with status ${availRes.status}`);
        setAvailability([]);
      }

      // Validate and process blocked response
      console.log(`[AdminCalendar] Blocked response status: ${blockRes.status}`);
      if (blockRes.ok) {
        const blockData = await blockRes.json();
        console.log('[AdminCalendar] Blocked response data:', blockData);
        
        // Validate response format
        if (!blockData || typeof blockData !== 'object') {
          console.warn('[AdminCalendar] Invalid blocked response format');
          setBlocked([]);
        } else {
          // Extract data from { data: [...] } or use directly if [...]
          const blockedArray = Array.isArray(blockData) ? blockData : (blockData.data || []);
          
          if (!Array.isArray(blockedArray)) {
            console.warn('[AdminCalendar] Blocked data is not an array:', blockedArray);
            setBlocked([]);
          } else {
            console.log(`[AdminCalendar] Successfully validated ${blockedArray.length} blocked dates`);
            setBlocked(blockedArray);
          }
        }
      } else {
        console.warn(`[AdminCalendar] Blocked fetch failed with status ${blockRes.status}`);
        setBlocked([]);
      }

      console.log('[AdminCalendar] Data loaded successfully');
    } catch (err) {
      console.error('[AdminCalendar] Calendar fetch error:', err);
      toast.error('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // View Navigation
  const navigatePrev = () => setCurrentDate(view === 'week' ? subDays(currentDate, 7) : subDays(currentDate, 1));
  const navigateNext = () => setCurrentDate(view === 'week' ? addDays(currentDate, 7) : addDays(currentDate, 1));
  const navigateToday = () => setCurrentDate(new Date());

  const getDaysArray = () => {
    if (view === 'day') return [currentDate];
    return eachDayOfInterval({ 
      start: startOfWeek(currentDate, { weekStartsOn: 0 }), 
      end: endOfWeek(currentDate, { weekStartsOn: 0 }) 
    });
  };

  const days = getDaysArray();
  const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8 AM to 9 PM

  const getEventsForHourAndDay = (hour, date) => {
    const dayBookings = bookings.filter(b => isSameDay(parseISO(b.date || b.startDateTime), date) && parseInt(b.startTime?.split(':')[0]) === hour);
    const dayAvail = availability.filter(a => isSameDay(parseISO(a.date), date) && parseInt(a.startTime?.split(':')[0]) === hour);
    const dayBlocked = blocked.filter(blk => isSameDay(parseISO(blk.date), date) && (blk.startTime ? parseInt(blk.startTime.split(':')[0]) === hour : true));
    
    return { dayBookings, dayAvail, dayBlocked };
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'bg-admin-success text-white border-admin-success shadow-sm';
      case 'pending': return 'bg-admin-warning text-admin-foreground border-admin-warning/50 shadow-sm';
      case 'cancelled': return 'bg-admin-danger text-white border-admin-danger shadow-sm';
      case 'completed': return 'bg-admin-info text-white border-admin-info shadow-sm';
      default: return 'bg-admin-muted text-admin-foreground border-admin-border';
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'video': return <Video className="w-3 h-3 mr-1" />;
      case 'audio': return <Phone className="w-3 h-3 mr-1" />;
      case 'chat': return <MessageSquare className="w-3 h-3 mr-1" />;
      default: return <Clock className="w-3 h-3 mr-1" />;
    }
  };

  return (
    <div className="space-y-4 h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-admin-foreground">Calendar View</h1>
          <Button variant="outline" size="sm" onClick={fetchData} className="bg-admin-card border-admin-border">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <div className="flex gap-1 bg-admin-card border border-admin-border rounded-md p-1 shrink-0">
            <Button variant="ghost" size="icon" onClick={navigatePrev} className="h-8 w-8"><ChevronLeft className="w-4 h-4" /></Button>
            <Button variant="ghost" size="sm" onClick={navigateToday} className="h-8">Today</Button>
            <Button variant="ghost" size="icon" onClick={navigateNext} className="h-8 w-8"><ChevronRight className="w-4 h-4" /></Button>
          </div>
          
          <div className="w-48 shrink-0">
            <DatePicker date={currentDate} setDate={setCurrentDate} />
          </div>

          <Tabs value={view} onValueChange={setView} className="shrink-0">
            <TabsList className="bg-admin-muted h-10 border border-admin-border">
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="day">Day</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 shrink-0 py-2 border-y border-admin-border bg-admin-card px-4 rounded-md shadow-sm">
        <span className="text-xs font-medium text-admin-muted-foreground mr-2">Legend:</span>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-admin-success"></div><span className="text-xs text-admin-foreground">Confirmed</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-admin-warning"></div><span className="text-xs text-admin-foreground">Pending</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-admin-danger"></div><span className="text-xs text-admin-foreground">Blocked/Cancelled</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-admin-primary opacity-20"></div><span className="text-xs text-admin-foreground">Available Slots</span></div>
      </div>

      {/* Calendar Grid */}
      <Card className="bg-admin-card border-admin-border shadow-sm flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="flex-1 overflow-auto custom-scrollbar flex">
          
          {/* Time Sidebar */}
          <div className="w-16 sm:w-20 border-r border-admin-border shrink-0 bg-admin-background/50">
            <div className="h-14 border-b border-admin-border sticky top-0 bg-admin-card z-20"></div>
            {hours.map(hour => (
              <div key={hour} className="h-24 border-b border-admin-border relative text-right pr-2">
                <span className="text-xs text-admin-muted-foreground absolute -top-3 right-2 bg-admin-card px-1">
                  {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                </span>
              </div>
            ))}
          </div>

          {/* Days Columns */}
          <div className="flex-1 flex min-w-[600px]">
            {days.map((day, idx) => (
              <div key={idx} className="flex-1 border-r border-admin-border last:border-r-0 min-w-[120px]">
                {/* Day Header */}
                <div className={`h-14 border-b border-admin-border sticky top-0 z-20 bg-admin-card/95 backdrop-blur flex flex-col items-center justify-center
                  ${isSameDay(day, new Date()) ? 'text-admin-primary' : 'text-admin-foreground'}
                `}>
                  <span className="text-xs font-medium uppercase tracking-wider">{format(day, 'EEE')}</span>
                  <span className={`text-lg font-bold ${isSameDay(day, new Date()) ? 'bg-admin-primary text-admin-primary-foreground rounded-full w-7 h-7 flex items-center justify-center' : ''}`}>
                    {format(day, 'd')}
                  </span>
                </div>

                {/* Day Grid */}
                {hours.map(hour => {
                  const { dayBookings, dayAvail, dayBlocked } = getEventsForHourAndDay(hour, day);
                  
                  return (
                    <div key={`${day}-${hour}`} className="h-24 border-b border-admin-border relative group hover:bg-admin-muted/30 transition-colors p-1">
                      
                      {/* Render Blocked */}
                      {dayBlocked.length > 0 && (
                        <div className="absolute inset-1 bg-[hsl(var(--cal-blocked)/0.1)] border border-[hsl(var(--cal-blocked)/0.3)] rounded-md opacity-80 pointer-events-none flex items-center justify-center">
                          <span className="text-[10px] text-admin-danger font-medium rotate-[-15deg]">BLOCKED</span>
                        </div>
                      )}

                      {/* Render Available background */}
                      {dayAvail.length > 0 && dayBlocked.length === 0 && (
                        <div className="absolute inset-1 bg-[hsl(var(--cal-today)/0.05)] border border-[hsl(var(--cal-today)/0.1)] rounded-md pointer-events-none" />
                      )}

                      {/* Render Bookings */}
                      <div className="relative z-10 space-y-1 h-full overflow-hidden">
                        {dayBookings.map(booking => (
                          <div 
                            key={booking.id}
                            onClick={() => setSelectedBooking(booking)}
                            className={`p-1.5 rounded text-xs border cursor-pointer hover:brightness-110 transition-all ${getStatusColor(booking.status)}`}
                          >
                            <div className="font-semibold truncate flex items-center">
                              {getTypeIcon(booking.type || booking.consultationType)}
                              {booking.customerName || 'Customer'}
                            </div>
                            <div className="opacity-90 truncate mt-0.5">
                              {booking.startTime} - {booking.endTime || '30m'}
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Booking Details Modal */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="bg-admin-card border-admin-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-admin-foreground flex items-center gap-2">
              Booking Details
              <Badge variant="outline" className={getStatusColor(selectedBooking?.status)}>{selectedBooking?.status}</Badge>
            </DialogTitle>
            <DialogDescription className="text-admin-muted-foreground">
              Full information for this appointment.
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-admin-muted-foreground mb-1">Customer</p>
                  <p className="text-sm font-medium text-admin-foreground">{selectedBooking.customerName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-admin-muted-foreground mb-1">Type</p>
                  <p className="text-sm font-medium text-admin-foreground capitalize flex items-center">
                    {getTypeIcon(selectedBooking.type || selectedBooking.consultationType)}
                    {selectedBooking.type || selectedBooking.consultationType || 'Consultation'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-admin-muted-foreground mb-1">Date</p>
                  <p className="text-sm font-medium text-admin-foreground">
                    {selectedBooking.date ? format(new Date(selectedBooking.date), 'MMMM d, yyyy') : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-admin-muted-foreground mb-1">Time</p>
                  <p className="text-sm font-medium text-admin-foreground">
                    {selectedBooking.startTime} - {selectedBooking.endTime || '30 mins'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-admin-muted-foreground mb-1">Payment</p>
                  <Badge variant="outline" className={selectedBooking.paymentStatus === 'completed' ? 'text-admin-success border-admin-success' : 'text-admin-warning border-admin-warning'}>
                    {selectedBooking.paymentStatus || 'Pending'}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-admin-muted-foreground mb-1">Booking ID</p>
                  <p className="text-xs font-mono text-admin-muted-foreground bg-admin-background p-1 rounded">{selectedBooking.id}</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4 border-t border-admin-border mt-4">
                <Button variant="outline" onClick={() => setSelectedBooking(null)} className="border-admin-border bg-transparent text-admin-foreground">Close</Button>
                <Button className="bg-admin-primary text-admin-primary-foreground hover:bg-admin-primary/90">View Full Profile</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const AdminCalendarPage = () => {
  return (
      <AdminCalendarPageContent />
  );
};

export default AdminCalendarPage;
