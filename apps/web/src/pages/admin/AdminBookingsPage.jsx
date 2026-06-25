
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Calendar as CalendarIcon } from 'lucide-react';
import { getAdminAuthHeaders } from '@/utils/adminAuthHeaders.js';
import apiServerClient from '@/lib/apiServerClient';
import { format } from 'date-fns';
import SearchInput from '@/components/admin/SearchInput.jsx';
import FilterBar from '@/components/admin/FilterBar.jsx';
import { TableSkeleton } from '@/components/admin/LoadingSkeleton.jsx';
import ErrorBoundary from '@/components/admin/ErrorBoundary.jsx';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';

const AdminBookingsPageContent = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('Upcoming');
  const [sortOrder, setSortOrder] = useState('earliest');

  const [selectedBooking, setSelectedBooking] =
      useState(null);

  const [detailsOpen, setDetailsOpen] =
      useState(false);

  const fetchBookings = useCallback(async () => {
    console.log('[AdminBookings] Fetching bookings...');
    setLoading(true);
    setError(null);
    try {
      const headers = getAdminAuthHeaders();
      console.log(
          '[AdminBookings] Authorization:',
          headers.Authorization
      );
      const query = new URLSearchParams();
      
      if (searchTerm) query.append('search', searchTerm);
      if (typeFilter !== 'all') query.append('type', typeFilter);
      if (paymentStatusFilter !== 'all') query.append('paymentStatus', paymentStatusFilter);
      if (bookingStatusFilter !== 'all') query.append('bookingStatus', bookingStatusFilter);
      
      const endpoint = `/admin/bookings?${query.toString()}`;
      console.log(`[AdminBookings] GET ${endpoint}`);
      
      const res = await apiServerClient.fetch(endpoint, { method: 'GET', headers });
      console.log(`[AdminBookings] Response status: ${res.status}`);
      
      if (!res.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const data = await res.json();
      console.log('[AdminBookings] Response data:', data);
      
      // Validate response format
      if (!data || typeof data !== 'object') {
        console.warn('[AdminBookings] Invalid response format');
        setBookings([]);
      } else {
        // Extract data from { data: [...] } or use directly if [...]
        const bookingsArray = Array.isArray(data) ? data : (data.data || []);
        
        if (!Array.isArray(bookingsArray)) {
          console.warn('[AdminBookings] Bookings data is not an array:', bookingsArray);
          setBookings([]);
        } else {
          console.log(`[AdminBookings] Successfully validated ${bookingsArray.length} bookings`);
          setBookings(bookingsArray);
        }
      }
    } catch (err) {
      console.error('[AdminBookings] Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, typeFilter, paymentStatusFilter, bookingStatusFilter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setPaymentStatusFilter('all');
    setBookingStatusFilter('Upcoming');
};

  const activeFilterCount = [
    searchTerm ? 1 : 0,
    typeFilter !== 'all' ? 1 : 0,
    paymentStatusFilter !== 'all' ? 1 : 0,
    bookingStatusFilter !== 'all' ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  const getDerivedStatusBadge = (status) => {
    const styles = {
      Upcoming:
        'bg-admin-info/10 text-admin-info border-admin-info/20',
      Completed:
        'bg-admin-success/10 text-admin-success border-admin-success/20',
      Cancelled:
        'bg-admin-danger/10 text-admin-danger border-admin-danger/20',
    };

    return (
      <Badge
        variant="outline"
        className={styles[status] || ''}
      >
        {status || 'UNKNOWN'}
      </Badge>
    );
  };

  const filteredBookings = bookings
    .filter((booking) => {

      if (
          bookingStatusFilter !== 'all' &&
          booking.derivedStatus !== bookingStatusFilter
      ) {
          return false;
      }

      if (
          typeFilter !== 'all' &&
          booking.bookingType !== typeFilter
      ) {
          return false;
      }

      return true;
  })
  .sort((a, b) => {

      if (sortOrder === 'latest') {

          return (
              new Date(b.scheduledDateTime) -
              new Date(a.scheduledDateTime)
          );
      }

      return (
          new Date(a.scheduledDateTime) -
          new Date(b.scheduledDateTime)
      );
  })
  

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-admin-foreground">Bookings</h1>
          <p className="text-admin-muted-foreground mt-1 text-sm sm:text-base">Manage all appointments.</p>
        </div>
      </div>

      <Card className="bg-admin-card border-admin-border shadow-sm">
        <CardHeader className="pb-4 px-4 sm:px-6">
          <FilterBar activeFilterCount={activeFilterCount} onClearFilters={handleClearFilters}>
            <div className="w-full sm:w-72 md:w-80">
              <SearchInput 
                value={searchTerm} 
                onChange={setSearchTerm} 
                placeholder="Search name, email, ID..." 
                isLoading={loading && searchTerm !== ''}
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-admin-background border-admin-border h-10">
                <SelectValue placeholder="Type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>

                <SelectItem value="Chat Consultation">
                  Chat Consultation
                </SelectItem>

                <SelectItem value="Audio Consultation">
                  Audio Consultation
                </SelectItem>

                <SelectItem value="Video Consultation">
                  Video Consultation
                </SelectItem>

                <SelectItem value="Course Session">
                  Course Session
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={bookingStatusFilter} onValueChange={setBookingStatusFilter}>
              <SelectTrigger className="w-full sm:w-[160px] bg-admin-background border-admin-border h-10">
                <SelectValue placeholder="Booking Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Upcoming">Upcoming</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select
                value={sortOrder}
                onValueChange={setSortOrder}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="earliest">
                        Earliest First
                    </SelectItem>

                    <SelectItem value="latest">
                        Latest First
                    </SelectItem>
                </SelectContent>
            </Select>
          </FilterBar>
        </CardHeader>
        <CardContent className="px-0 sm:px-6 pb-6">
          {error ? (
            <div className="p-6 text-center text-admin-danger bg-admin-danger/5 rounded-lg mx-4 sm:mx-0">
              <p>{error}</p>
              <Button onClick={fetchBookings} variant="outline" className="mt-4">Retry</Button>
            </div>
          ) : loading && bookings.length === 0 ? (
            <div className="px-4 sm:px-0"><TableSkeleton columns={6} rows={5} /></div>
          ) : (
            <div className="w-full overflow-x-auto custom-scrollbar">
              <Table className="min-w-[800px]">
                <TableHeader className="bg-admin-muted">
                  <TableRow className="border-admin-border hover:bg-transparent">
                    <TableHead className="text-admin-foreground font-semibold whitespace-nowrap">Booking ID</TableHead>
                    {/* <TableHead className="text-admin-foreground font-semibold whitespace-nowrap">
                        Customer ID
                    </TableHead> */}

                    <TableHead className="text-admin-foreground font-semibold whitespace-nowrap">
                        Name
                    </TableHead>

                    <TableHead className="text-admin-foreground font-semibold whitespace-nowrap">
                        Email
                    </TableHead>

                    {/* <TableHead className="text-admin-foreground font-semibold whitespace-nowrap">
                        Phone
                    </TableHead> */}
                    <TableHead className="text-admin-foreground font-semibold whitespace-nowrap">Type</TableHead>
                    <TableHead className="text-admin-foreground font-semibold whitespace-nowrap">Services</TableHead>
                    {/* <TableHead className="text-admin-foreground font-semibold whitespace-nowrap">Session</TableHead> */}
                    <TableHead className="text-admin-foreground font-semibold whitespace-nowrap">Date & Time</TableHead>
                    <TableHead className="text-admin-foreground font-semibold whitespace-nowrap">Booking Status</TableHead>
                    <TableHead className="text-admin-foreground font-semibold text-right whitespace-nowrap">Amount</TableHead>
                    <TableHead className="text-admin-foreground font-semibold text-center whitespace-nowrap">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="flex flex-col items-center justify-center text-admin-muted-foreground">
                          <CalendarIcon className="w-12 h-12 mb-4 opacity-20" />
                          <p className="text-lg font-medium text-admin-foreground">No bookings found</p>
                          <p className="text-sm mt-1">Try adjusting your filters or search term.</p>
                          {activeFilterCount > 0 && (
                            <Button variant="link" onClick={handleClearFilters} className="mt-2 text-admin-primary">
                              Clear all filters
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBookings.map((booking) => {
                      // console.log(booking);
                      return(
                      <TableRow key={booking.id} className="border-admin-border hover:bg-admin-muted/50 transition-colors">
                        <TableCell className="font-medium text-admin-foreground">{booking.id}</TableCell>
                        {/* <TableCell className="font-mono text-xs">
                            {booking.customerId || '-'}
                        </TableCell> */}

                        <TableCell>
                            {booking.customerName || '-'}
                        </TableCell>

                        <TableCell>
                            {booking.customerEmail || '-'}
                        </TableCell>

                        {/* <TableCell>
                            {booking.customerPhone || '-'}
                        </TableCell> */}
                        <TableCell>
                          {booking.bookingType === 'Course Session' ? (
                            <Badge>Course Session</Badge>
                          ) : (
                            <Badge variant="secondary">
                              {booking.bookingType}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                            {booking.service}
                        </TableCell>
                        {/* <TableCell>
                          {booking.sessionLabel}
                        </TableCell> */}
                        <TableCell>
                          {new Date(
                            booking.scheduledDateTime
                          ).toLocaleString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </TableCell>
                        <TableCell>
                          {getDerivedStatusBadge(booking.derivedStatus)}
                        </TableCell>
                        <TableCell className="text-right font-medium whitespace-nowrap">₹{booking.amount || 0}</TableCell>
                        <TableCell className="text-center">
                          <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                  setSelectedBooking(booking);
                                  setDetailsOpen(true);
                              }}
                          >
                              <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )})
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
      >
          <DialogContent className="max-w-lg">

              <DialogHeader>
                  <DialogTitle>
                      Booking Details
                  </DialogTitle>
              </DialogHeader>

              {selectedBooking && (

                  <div className="space-y-3">

                      <div>
                          <strong>Booking ID:</strong>
                          {' '}
                          {selectedBooking.id}
                      </div>

                      <div>
                          <strong>Customer ID:</strong>
                          {' '}
                          {selectedBooking.customerId}
                      </div>

                      <div>
                          <strong>Name:</strong>
                          {' '}
                          {selectedBooking.customerName}
                      </div>

                      <div>
                          <strong>Email:</strong>
                          {' '}
                          {selectedBooking.customerEmail}
                      </div>

                      <div>
                          <strong>Phone:</strong>
                          {' '}
                          {selectedBooking.customerPhone}
                      </div>

                      <div>
                          <strong>Type:</strong>
                          {' '}
                          {selectedBooking.bookingType}
                      </div>

                      <div>
                          <strong>Session:</strong>
                          {' '}
                          {selectedBooking.sessionLabel}
                      </div>

                      {selectedBooking.source === 'course' && (
                          <div>
                              <p className="text-sm text-muted-foreground">
                                  Session Information
                              </p>

                              <p className="font-medium">
                                  {selectedBooking.service}
                              </p>
                          </div>
                      )}

                      <div>
                          <strong>Status:</strong>
                          {' '}
                          {selectedBooking.derivedStatus}
                      </div>

                      <div>
                          <strong>Amount:</strong>
                          {' '}
                          ₹{selectedBooking.amount}
                      </div>

                      <div>
                          <strong>Created:</strong>
                          {' '}
                          {selectedBooking.createdAt}
                      </div>

                      <div className="flex gap-2 pt-4">
                          <Button
                              disabled={!selectedBooking.zoomLink}
                              asChild={!!selectedBooking.zoomLink}
                          >
                              {selectedBooking.zoomLink ? (
                                  <a
                                      href={selectedBooking.zoomLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                  >
                                      Join Meeting
                                  </a>
                              ) : (
                                  <span>No Meeting Link</span>
                              )}
                          </Button>
                      </div>

                  </div>
              )}

          </DialogContent>
      </Dialog>
    </div>
  );
};

const AdminBookingsPage = () => (
    <ErrorBoundary>
      <AdminBookingsPageContent />
    </ErrorBoundary>
);

export default AdminBookingsPage;
