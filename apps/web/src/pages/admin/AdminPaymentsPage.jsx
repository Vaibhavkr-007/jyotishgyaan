
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, IndianRupee, CreditCard } from 'lucide-react';
import { getAuthHeaders } from '@/utils/authHeaders.js';
import apiServerClient from '@/lib/apiServerClient';
import { format } from 'date-fns';
import { toast } from 'sonner';
import SearchInput from '@/components/admin/SearchInput.jsx';
import FilterBar from '@/components/admin/FilterBar.jsx';
import { TableSkeleton } from '@/components/admin/LoadingSkeleton.jsx';
import ErrorBoundary from '@/components/admin/ErrorBoundary.jsx';
import { exportToCSV } from '@/utils/csvExport.js';

const AdminPaymentsPageContent = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchPayments = useCallback(async () => {
    console.log('[AdminPayments] Fetching payments...');
    setLoading(true);
    setError(null);
    try {
      const headers = getAuthHeaders();
      const query = new URLSearchParams();
      
      if (searchTerm) query.append('search', searchTerm);
      if (statusFilter !== 'all') query.append('status', statusFilter);
      
      const endpoint = `/admin/payments?${query.toString()}`;
      console.log(`[AdminPayments] GET ${endpoint}`);
      
      const res = await apiServerClient.fetch(endpoint, { method: 'GET', headers });
      console.log(`[AdminPayments] Response status: ${res.status}`);
      
      if (!res.ok) throw new Error('Failed to fetch payments');
      
      const data = await res.json();
      console.log('[AdminPayments] Response data:', data);
      
      // Validate response format
      if (!data || typeof data !== 'object') {
        console.warn('[AdminPayments] Invalid response format');
        setPayments([]);
      } else {
        // Extract data from { data: [...] } or use directly if [...]
        const paymentsArray = Array.isArray(data) ? data : (data.data || []);
        
        if (!Array.isArray(paymentsArray)) {
          console.warn('[AdminPayments] Payments data is not an array:', paymentsArray);
          setPayments([]);
        } else {
          console.log(`[AdminPayments] Successfully validated ${paymentsArray.length} payments`);
          setPayments(paymentsArray);
        }
      }
    } catch (err) {
      console.error('[AdminPayments] Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleExportCSV = () => {
    if (payments.length === 0) {
      toast.error('No data to export');
      return;
    }
    
    setIsExporting(true);
    try {
      const exportData = payments.map(p => ({
        'Transaction ID': p.id,
        'Booking ID': p.bookingId || '',
        'Customer Name': p.customerName || p.expand?.customer?.name || 'Unknown',
        'Amount': p.amount || 0,
        'Payment Status': p.status || 'unknown',
        'Date & Time': p.date ? format(new Date(p.date), 'yyyy-MM-dd HH:mm:ss') : '',
        'Payment Method': p.method || 'N/A'
      }));

      const filename = `payments_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      const success = exportToCSV(exportData, filename);
      
      if (success) {
        toast.success('Exported successfully');
      } else {
        throw new Error('Export failed');
      }
    } catch (err) {
      toast.error('Failed to export CSV');
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  const activeFilterCount = [
    searchTerm ? 1 : 0,
    statusFilter !== 'all' ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  const getStatusBadge = (status) => {
    const styles = {
      captured: 'bg-admin-success/10 text-admin-success border-admin-success/20',
      completed: 'bg-admin-success/10 text-admin-success border-admin-success/20',
      failed: 'bg-admin-danger/10 text-admin-danger border-admin-danger/20',
      refunded: 'bg-admin-warning/10 text-admin-warning border-admin-warning/20',
      pending: 'bg-admin-info/10 text-admin-info border-admin-info/20',
    };
    return <Badge variant="outline" className={styles[status?.toLowerCase()] || ''}>{status?.toUpperCase() || 'UNKNOWN'}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-admin-foreground">Payments</h1>
          <p className="text-admin-muted-foreground mt-1 text-sm sm:text-base">View and manage transactions.</p>
        </div>
        <Button 
          onClick={handleExportCSV} 
          disabled={isExporting || payments.length === 0}
          className="bg-admin-card border-admin-border text-admin-foreground hover:bg-admin-muted w-full sm:w-auto"
          variant="outline"
        >
          <Download className="w-4 h-4 mr-2" /> 
          {isExporting ? 'Exporting...' : 'Export CSV'}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {['Total Revenue', 'Successful', 'Refunded', 'Failed'].map((title, i) => (
          <Card key={i} className="bg-admin-card border-admin-border shadow-sm">
            <CardContent className="p-4 sm:p-6 flex items-center gap-4">
              <div className="p-3 rounded-full bg-admin-primary/10 text-admin-primary shrink-0">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-admin-muted-foreground truncate">{title}</p>
                <p className="text-xl sm:text-2xl font-bold text-admin-foreground truncate">
                  {i === 0 ? '₹45,000' : i === 1 ? '142' : i === 2 ? '3' : '1'}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-admin-card border-admin-border shadow-sm">
        <CardHeader className="pb-4 px-4 sm:px-6">
          <FilterBar activeFilterCount={activeFilterCount} onClearFilters={handleClearFilters}>
            <div className="w-full sm:w-72 md:w-80">
              <SearchInput 
                value={searchTerm} 
                onChange={setSearchTerm} 
                placeholder="Search Payment ID, Customer..." 
                isLoading={loading && searchTerm !== ''}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[160px] bg-admin-background border-admin-border h-10">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="captured">Captured</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </FilterBar>
        </CardHeader>
        <CardContent className="px-0 sm:px-6 pb-6">
          {error ? (
            <div className="p-6 text-center text-admin-danger bg-admin-danger/5 rounded-lg mx-4 sm:mx-0">
              <p>{error}</p>
              <Button onClick={fetchPayments} variant="outline" className="mt-4">Retry</Button>
            </div>
          ) : loading && payments.length === 0 ? (
            <div className="px-4 sm:px-0"><TableSkeleton columns={7} rows={5} /></div>
          ) : (
            <div className="w-full overflow-x-auto custom-scrollbar">
              <Table className="min-w-[900px]">
                <TableHeader className="bg-admin-muted">
                  <TableRow className="border-admin-border hover:bg-transparent">
                    <TableHead className="text-admin-foreground font-semibold whitespace-nowrap">Payment ID</TableHead>
                    <TableHead className="text-admin-foreground font-semibold whitespace-nowrap">Booking ID</TableHead>
                    <TableHead className="text-admin-foreground font-semibold whitespace-nowrap">Customer</TableHead>
                    <TableHead className="text-admin-foreground font-semibold whitespace-nowrap">Method</TableHead>
                    <TableHead className="text-admin-foreground font-semibold whitespace-nowrap">Date</TableHead>
                    <TableHead className="text-admin-foreground font-semibold whitespace-nowrap">Status</TableHead>
                    <TableHead className="text-admin-foreground font-semibold text-right whitespace-nowrap">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="flex flex-col items-center justify-center text-admin-muted-foreground">
                          <CreditCard className="w-12 h-12 mb-4 opacity-20" />
                          <p className="text-lg font-medium text-admin-foreground">No payments found</p>
                          <p className="text-sm mt-1">Try adjusting your filters or search term.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    payments.map((payment) => (
                      <TableRow key={payment.id} className="border-admin-border hover:bg-admin-muted/50 transition-colors">
                        <TableCell className="font-medium text-admin-foreground">{payment.id}</TableCell>
                        <TableCell className="text-admin-primary">{payment.bookingId || '-'}</TableCell>
                        <TableCell>{payment.customerName || payment.expand?.customer?.name || 'Unknown'}</TableCell>
                        <TableCell>{payment.method || 'N/A'}</TableCell>
                        <TableCell className="whitespace-nowrap">{payment.date ? format(new Date(payment.date), 'MMM dd, yyyy HH:mm') : '-'}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell className="text-right font-medium whitespace-nowrap">₹{payment.amount || 0}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const AdminPaymentsPage = () => (
    <ErrorBoundary>
      <AdminPaymentsPageContent />
    </ErrorBoundary>
);

export default AdminPaymentsPage;
