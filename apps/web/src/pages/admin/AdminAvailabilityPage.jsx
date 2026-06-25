
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, Clock, ShieldBan, RefreshCw, Plus, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { getAuthHeaders } from '@/utils/authHeaders.js';
import apiServerClient from '@/lib/apiServerClient';
import { format, parseISO, isSameDay } from 'date-fns';
import { toast } from 'sonner';

import DatePicker from '@/components/admin/DatePicker.jsx';
import TimePicker from '@/components/admin/TimePicker.jsx';
import ConfirmModal from '@/components/admin/ConfirmModal.jsx';
import Calendar from '@/components/admin/Calendar.jsx';
import AvailabilityCard from '@/components/admin/AvailabilityCard.jsx';
import SyncStatusBadge from '@/components/admin/SyncStatusBadge.jsx';

const AdminAvailabilityPageContent = () => {
  // Data States
  const [slots, setSlots] = useState([]);
  const [totalSlots, setTotalSlots] = useState(0);
  const [blockedDates, setBlockedDates] = useState([]);
  const [syncStatus, setSyncStatus] = useState({ status: 'idle', lastSyncTime: null, error: null });
  
  // UI States
  const [loading, setLoading] = useState(true);
  const [loadingOther, setLoadingOther] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [isAddingAvailability, setIsAddingAvailability] = useState(false);
  
  // Selected View States
  const [selectedDate, setSelectedDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [selectedType, setSelectedType] = useState('audio');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Form States - Blocked Dates
  const [blockedDateRange, setBlockedDateRange] = useState(null);
  const [blockedReason, setBlockedReason] = useState('');
  const [blockedStart, setBlockedStart] = useState('');
  const [blockedEnd, setBlockedEnd] = useState('');
  
  // Form States - Add Availability
  const [availDate, setAvailDate] = useState(new Date());
  const [availStart, setAvailStart] = useState('09:00');
  const [availEnd, setAvailEnd] = useState('17:00');
  
  // Modal States
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, type: null });

  // 1. Fetch Availability for specific date and type
  const fetchAvailability = useCallback(async () => {
    console.log('[AdminAvailability] ========== Fetching Availability ==========');
    console.log(`[AdminAvailability] Parameters -> Date: ${selectedDate}, Type: ${selectedType}`);
    setLoading(true);
    
    try {
      const endpoint = `/admin/availability?date=${selectedDate}&type=${selectedType}`;
      console.log(`[AdminAvailability] Request URL: /hcgi/api${endpoint}`);

      const headers = getAuthHeaders();
      const res = await apiServerClient.fetch(endpoint, { method: 'GET', headers });
      
      console.log(`[AdminAvailability] Response Status: ${res.status}`);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch slots. Status: ${res.status}`);
      }

      const responseData = await res.json();
      console.log('[AdminAvailability] Raw Response Data:', responseData);
      
      let parsedSlots = [];
      let count = 0;

      // Validate response structure and extract slots
      if (responseData && typeof responseData === 'object') {
        if (responseData.data && Array.isArray(responseData.data.slots)) {
          parsedSlots = responseData.data.slots;
          count = responseData.data.totalSlots ?? parsedSlots.length;
        } else if (Array.isArray(responseData.slots)) {
          parsedSlots = responseData.slots;
          count = responseData.totalSlots ?? parsedSlots.length;
        } else if (Array.isArray(responseData)) {
          parsedSlots = responseData;
          count = parsedSlots.length;
        }
      }

      if (parsedSlots.length === 0) {
        console.warn('[AdminAvailability] No slots found or invalid response structure:', responseData);
      } else {
        console.log('[AdminAvailability] Successfully parsed slots:', parsedSlots);
      }
      
      console.log(`[AdminAvailability] Total Count: ${count}`);
      
      setSlots(parsedSlots);
      setTotalSlots(count);
    } catch (err) {
      console.error('[AdminAvailability] Fetch Error:', err);
      toast.error('Failed to load availability slots', { description: err.message });
      setSlots([]);
      setTotalSlots(0);
    } finally {
      setLoading(false);
      console.log('[AdminAvailability] ========== Fetch Complete ==========');
    }
  }, [selectedDate, selectedType]);

  // 2. Fetch other page data (Blocked dates, Sync Status)
  const fetchOtherData = useCallback(async () => {
    setLoadingOther(true);
    try {
      const headers = getAuthHeaders();
      const [blockedRes, syncRes] = await Promise.all([
        apiServerClient.fetch('/admin/availability/blocked', { method: 'GET', headers }),
        apiServerClient.fetch('/admin/availability/sync-status', { method: 'GET', headers })
      ]);

      if (blockedRes.ok) {
        const blockedData = await blockedRes.json();
        const blockedArray = Array.isArray(blockedData) ? blockedData : (blockedData.data || []);
        if (Array.isArray(blockedArray)) setBlockedDates(blockedArray);
      }

      if (syncRes.ok) {
        const syncData = await syncRes.json();
        const syncObj = syncData.data || syncData;
        if (typeof syncObj === 'object') setSyncStatus(prev => ({ ...prev, ...syncObj, error: null }));
      }
    } catch (err) {
      console.error('[AdminAvailability] Error fetching other data:', err);
    } finally {
      setLoadingOther(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  useEffect(() => {
    fetchOtherData();
  }, [fetchOtherData]);

  const handleSync = async () => {
    setSyncing(true);
    console.log('[AdminAvailability] Starting Cal.com sync...');
    try {
      const res = await apiServerClient.fetch('/admin/availability/cal-sync', { 
        method: 'POST',
        headers: getAuthHeaders() 
      });
      const data = await res.json();
      
      console.log('[AdminAvailability] API Response (Sync):', data);

      if (!res.ok) {
        throw new Error(data.error || 'Sync failed');
      }
      
      toast.success('Calendar synced successfully', {
        description: data.message || `Synced ${data.synced} slots`
      });
      setSyncStatus({ status: 'synced', lastSyncTime: new Date().toISOString(), error: null });
      fetchAvailability();
      fetchOtherData();
    } catch (err) {
      console.error('[AdminAvailability] Sync error:', err);
      toast.error('Sync failed', { description: err.message });
      setSyncStatus({ status: 'error', lastSyncTime: new Date().toISOString(), error: err.message });
    } finally {
      setSyncing(false);
    }
  };

  const handleAddBlockedDate = async () => {
    if (!blockedDateRange) {
      toast.error('Please select a date');
      return;
    }
    
    try {
      const headers = { ...getAuthHeaders(), 'Content-Type': 'application/json' };
      const body = {
        dateFrom: format(blockedDateRange, 'yyyy-MM-dd'),
        dateTo: format(blockedDateRange, 'yyyy-MM-dd'),
        reason: blockedReason,
        timeFrom: blockedStart || undefined,
        timeTo: blockedEnd || undefined,
      };

      console.log('[AdminAvailability] Sending blocked date data:', body);

      const res = await apiServerClient.fetch('/admin/availability/block', {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to block date');
      }
      
      toast.success('Date blocked successfully');
      setBlockedDateRange(null);
      setBlockedReason('');
      setBlockedStart('');
      setBlockedEnd('');
      fetchOtherData();
    } catch (err) {
      console.error('[AdminAvailability] Error blocking date:', err);
      toast.error('Failed to block date', { description: err.message });
    }
  };

  const handleAddAvailability = async () => {
    if (!availDate || !availStart || !availEnd) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setIsAddingAvailability(true);
    try {
      const headers = { ...getAuthHeaders(), 'Content-Type': 'application/json' };
      const body = {
        date: format(availDate, 'yyyy-MM-dd'),
        startTime: availStart,
        endTime: availEnd,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };

      console.log('[AdminAvailability] Sending availability data:', body);

      const res = await apiServerClient.fetch('/admin/availability', {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add availability');
      }
      
      toast.success('Availability added successfully');
      
      setAvailStart('09:00');
      setAvailEnd('17:00');
      setAvailDate(new Date());
      fetchAvailability();
    } catch (err) {
      console.error('[AdminAvailability] Error adding availability:', err);
      toast.error('Failed to add availability', { description: err.message });
    } finally {
      setIsAddingAvailability(false);
    }
  };

  const handleDelete = async () => {
    const { id, type } = deleteModal;
    if (!id || !type) return;

    try {
      const endpoint = type === 'blocked' 
        ? `/admin/availability/blocked/${id}` 
        : `/admin/availability/${id}`;
        
      console.log(`[AdminAvailability] Deleting ${type} ${id} at ${endpoint}`);
      const res = await apiServerClient.fetch(endpoint, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Delete failed');
      }
      
      toast.success('Deleted successfully');
      fetchAvailability();
      fetchOtherData();
    } catch (err) {
      console.error('[AdminAvailability] Error deleting:', err);
      toast.error('Failed to delete', { description: err.message });
    } finally {
      setDeleteModal({ isOpen: false, id: null, type: null });
    }
  };

  // Prepare events for the left side calendar
  const calendarEvents = [
    ...slots.map(a => ({ date: a.date || a.time?.split('T')[0] || selectedDate, type: 'available', id: a.id || a.uid })),
    ...blockedDates.map(b => ({ date: b.dateFrom || b.date, type: 'blocked', id: b.id }))
  ];

  const selectedDateObj = parseISO(selectedDate);
  const selectedDateBlocked = blockedDates.filter(b => isSameDay(parseISO(b.dateFrom || b.date), selectedDateObj));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-admin-foreground">Availability & Schedule</h1>
          <p className="text-admin-muted-foreground mt-1 text-sm">Manage working hours, block dates, and sync with Cal.com.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <SyncStatusBadge 
              status={syncStatus.status} 
              lastSyncTime={syncStatus.lastSyncTime} 
              isLoading={syncing} 
              onSync={handleSync}
            />
            <Button onClick={handleSync} disabled={syncing} variant="outline" className="bg-admin-card border-admin-border">
              <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} /> 
              {syncStatus.status === 'error' ? 'Retry Sync' : 'Sync Now'}
            </Button>
          </div>
          {syncStatus.status === 'error' && syncStatus.error && (
            <p className="text-xs text-admin-danger max-w-xs text-right flex items-start justify-end gap-1">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>{syncStatus.error}</span>
            </p>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AvailabilityCard title="Available Slots Today" value={totalSlots} icon={Clock} colorClass="text-admin-success bg-admin-success/10" isLoading={loading} />
        <AvailabilityCard title="Blocked Dates" value={blockedDates.length} icon={ShieldBan} colorClass="text-admin-danger bg-admin-danger/10" isLoading={loadingOther} />
        <AvailabilityCard title="Current Date" value={format(selectedDateObj, 'MMM d, yyyy')} icon={CalendarIcon} colorClass="text-admin-primary bg-admin-primary/10" isLoading={false} />
        <AvailabilityCard title="Timezone" value={Intl.DateTimeFormat().resolvedOptions().timeZone} icon={Clock} colorClass="text-admin-info bg-admin-info/10" isLoading={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Calendar & Slots */}
        <div className="lg:col-span-5 space-y-6">
          <Calendar 
            currentDate={currentMonth}
            setCurrentDate={setCurrentMonth}
            events={calendarEvents}
            selectedDate={selectedDateObj}
            onDateClick={(d) => setSelectedDate(format(d, 'yyyy-MM-dd'))}
          />
          
          <Card className="bg-admin-card border-admin-border shadow-sm">
            <CardHeader className="py-4 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold">
                Slots on {format(selectedDateObj, 'MMM d, yyyy')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Filter Controls (Date and Type) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-admin-muted/50 p-3 rounded-lg border border-admin-border mb-4">
                <div className="space-y-1">
                  <label htmlFor="slot-date-picker" className="text-sm font-medium text-admin-foreground whitespace-nowrap">
                    Check Date:
                  </label>
                  <Input
                    id="slot-date-picker"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-admin-background border-admin-border h-9"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-admin-foreground whitespace-nowrap">
                    Consultation Type:
                  </label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-full bg-admin-background border-admin-border h-9">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="chat">Chat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedDateBlocked.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-admin-danger flex items-center"><ShieldBan className="w-4 h-4 mr-1" /> Blocked</h4>
                  {selectedDateBlocked.map(b => (
                    <div key={b.id} className="flex justify-between items-center bg-admin-danger/5 border border-admin-danger/20 p-2 rounded-md">
                      <div>
                        <p className="text-sm font-medium text-admin-foreground">{b.reason || 'No reason specified'}</p>
                        <p className="text-xs text-admin-muted-foreground">{b.timeFrom && b.timeTo ? `${b.timeFrom} - ${b.timeTo}` : 'All day'}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteModal({ isOpen: true, id: b.id, type: 'blocked' })}>
                        <Trash2 className="w-4 h-4 text-admin-danger" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-admin-success flex items-center">
                    <Clock className="w-4 h-4 mr-1" /> Available ({selectedType})
                  </h4>
                  <Badge variant="secondary" className="bg-admin-muted text-admin-foreground border-admin-border">
                    Total: {totalSlots}
                  </Badge>
                </div>
                
                {loading ? (
                  <div className="flex items-center justify-center p-6 text-admin-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading slots...
                  </div>
                ) : slots.length > 0 ? (
                  <div className="grid gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {slots.map((slot, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-admin-success/5 border border-admin-success/20 p-2.5 rounded-md hover:bg-admin-success/10 transition-colors">
                        <p className="text-sm font-medium text-admin-foreground">
                          {slot.time ? format(new Date(slot.time), 'h:mm a') : slot.startTime || 'Unknown Time'}
                        </p>
                        <Badge variant="outline" className="text-admin-success border-admin-success/30 bg-transparent capitalize">
                          {selectedType}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-admin-muted-foreground text-center py-6 bg-admin-background/50 rounded-md border border-admin-border border-dashed">
                    No {selectedType} slots available for this date.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Editing Tabs */}
        <div className="lg:col-span-7">
          <Card className="bg-admin-card border-admin-border shadow-sm h-full">
            <Tabs defaultValue="availability" className="w-full">
              <CardHeader className="pb-0 border-b border-admin-border">
                <TabsList className="bg-admin-muted w-full justify-start h-auto p-1 mb-0 pb-0 rounded-b-none rounded-t-md">
                  <TabsTrigger value="availability" className="data-[state=active]:bg-admin-card data-[state=active]:text-admin-primary px-6 py-2.5">
                    Add Availability
                  </TabsTrigger>
                  <TabsTrigger value="blocked" className="data-[state=active]:bg-admin-card data-[state=active]:text-admin-danger px-6 py-2.5">
                    Block Dates
                  </TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="pt-6">
                
                <TabsContent value="availability" className="space-y-4 m-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-admin-foreground">Date *</label>
                      <DatePicker date={availDate} setDate={setAvailDate} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-admin-foreground">Timezone</label>
                      <Input disabled value={Intl.DateTimeFormat().resolvedOptions().timeZone} className="bg-admin-muted text-admin-muted-foreground border-admin-border" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-admin-foreground">Start Time *</label>
                      <TimePicker value={availStart} onChange={setAvailStart} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-admin-foreground">End Time *</label>
                      <TimePicker value={availEnd} onChange={setAvailEnd} />
                    </div>
                  </div>
                  <Button 
                    onClick={handleAddAvailability} 
                    disabled={isAddingAvailability}
                    className="w-full bg-admin-primary text-admin-primary-foreground hover:bg-admin-primary/90 mt-2"
                  >
                    {isAddingAvailability ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding Slot...</>
                    ) : (
                      <><Plus className="w-4 h-4 mr-2" /> Add Time Slot</>
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="blocked" className="space-y-4 m-0">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-admin-foreground">Date to Block *</label>
                    <DatePicker date={blockedDateRange} setDate={setBlockedDateRange} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-admin-foreground">Reason</label>
                    <Input 
                      placeholder="e.g. Public Holiday, Vacation" 
                      value={blockedReason}
                      onChange={(e) => setBlockedReason(e.target.value)}
                      className="bg-admin-background border-admin-border text-admin-foreground"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-admin-foreground">Start Time (Optional)</label>
                      <TimePicker value={blockedStart} onChange={setBlockedStart} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-admin-foreground">End Time (Optional)</label>
                      <TimePicker value={blockedEnd} onChange={setBlockedEnd} />
                    </div>
                  </div>
                  <p className="text-xs text-admin-muted-foreground mt-1">Leave times empty to block the entire day.</p>
                  <Button onClick={handleAddBlockedDate} className="w-full bg-admin-danger text-white hover:bg-admin-danger/90 mt-2">
                    <ShieldBan className="w-4 h-4 mr-2" /> Block Date
                  </Button>
                </TabsContent>

              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>

      <ConfirmModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null, type: null })}
        onConfirm={handleDelete}
        title="Delete Item"
        message="Are you sure you want to delete this? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

const AdminAvailabilityPage = () => {
  return (
      <AdminAvailabilityPageContent />
  );
};

export default AdminAvailabilityPage;
