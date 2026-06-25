
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, UserPlus, Repeat, UserCircle } from 'lucide-react';
import {
    getAdminAuthHeaders
}
from '@/utils/adminAuthHeaders.js';
import apiServerClient from '@/lib/apiServerClient';
import SearchInput from '@/components/admin/SearchInput.jsx';
import FilterBar from '@/components/admin/FilterBar.jsx';
import { TableSkeleton } from '@/components/admin/LoadingSkeleton.jsx';
import ErrorBoundary from '@/components/admin/ErrorBoundary.jsx';
import { Button } from '@/components/ui/button';

const AdminCustomersPageContent = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCustomers = useCallback(async () => {
    console.log('[AdminCustomers] Fetching customers...');
    setLoading(true);
    setError(null);
    try {
      const headers =
        getAdminAuthHeaders();
      const query = new URLSearchParams();
      
      if (searchTerm) query.append('search', searchTerm);
      
      const endpoint = `/admin/customers?${query.toString()}`;
      console.log(`[AdminCustomers] GET ${endpoint}`);
      
      const res = await apiServerClient.fetch(endpoint, { method: 'GET', headers });
      console.log(`[AdminCustomers] Response status: ${res.status}`);
      
      if (!res.ok) throw new Error('Failed to fetch customers');
      
      const data = await res.json();
      console.log('[AdminCustomers] Response data:', data);
      
      // Validate response format
      if (!data || typeof data !== 'object') {
        console.warn('[AdminCustomers] Invalid response format');
        setCustomers([]);
      } else {
        // Extract data from { data: [...] } or use directly if [...]
        const customersArray = Array.isArray(data) ? data : (data.data || []);
        
        if (!Array.isArray(customersArray)) {
          console.warn('[AdminCustomers] Customers data is not an array:', customersArray);
          setCustomers([]);
        } else {
          console.log(`[AdminCustomers] Successfully validated ${customersArray.length} customers`);
          setCustomers(customersArray);
        }
      }
    } catch (err) {
      console.error('[AdminCustomers] Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleClearFilters = () => {
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-admin-foreground">Customers</h1>
          <p className="text-admin-muted-foreground mt-1 text-sm sm:text-base">Manage your client database.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            title: 'Total Customers',
            value: customers.length,
            icon: Users
          // },
          // {
          //   title: 'New (This Month)',
          //   value: '42',
          //   icon: UserPlus
          // },
          // {
          //   title: 'Repeat Rate',
          //   value: '38%',
          //   icon: Repeat
          },
        ].map((stat, i) => (
          <Card key={i} className="bg-admin-card border-admin-border shadow-sm">
            <CardContent className="p-4 sm:p-6 flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-admin-muted-foreground mb-1 truncate">{stat.title}</p>
                <h3 className="text-xl sm:text-2xl font-bold text-admin-foreground truncate">{stat.value}</h3>
              </div>
              <div className="p-3 rounded-xl bg-admin-primary/10 text-admin-primary shrink-0 ml-4">
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-admin-card border-admin-border shadow-sm">
        <CardHeader className="pb-4 px-4 sm:px-6">
          <FilterBar activeFilterCount={searchTerm ? 1 : 0} onClearFilters={handleClearFilters}>
            <div className="w-full sm:w-80 md:w-96">
              <SearchInput 
                value={searchTerm} 
                onChange={setSearchTerm} 
                placeholder="Search name, email, phone..." 
                isLoading={loading && searchTerm !== ''}
              />
            </div>
            <div className="text-sm text-admin-muted-foreground ml-auto hidden sm:block">
              {customers.length} customer{customers.length !== 1 ? 's' : ''} found
            </div>
          </FilterBar>
        </CardHeader>
        <CardContent className="px-0 sm:px-6 pb-6">
          {error ? (
            <div className="p-6 text-center text-admin-danger bg-admin-danger/5 rounded-lg mx-4 sm:mx-0">
              <p>{error}</p>
              <Button onClick={fetchCustomers} variant="outline" className="mt-4">Retry</Button>
            </div>
          ) : loading && customers.length === 0 ? (
            <div className="px-4 sm:px-0"><TableSkeleton columns={6} rows={5} /></div>
          ) : (
            <div className="w-full overflow-x-auto custom-scrollbar">
              <Table className="min-w-[800px]">
                <TableHeader className="bg-admin-muted">
                  <TableRow className="border-admin-border hover:bg-transparent">
                    <TableHead className="text-admin-foreground font-semibold whitespace-nowrap">Customer ID</TableHead>
                    <TableHead className="text-admin-foreground font-semibold whitespace-nowrap">Name</TableHead>
                    <TableHead className="text-admin-foreground font-semibold whitespace-nowrap">Email</TableHead>
                    <TableHead className="text-admin-foreground font-semibold whitespace-nowrap">Phone</TableHead>
                    <TableHead className="text-admin-foreground font-semibold text-center whitespace-nowrap">Consultations</TableHead>
                    <TableHead className="text-admin-foreground font-semibold text-right whitespace-nowrap">Total Spent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <div className="flex flex-col items-center justify-center text-admin-muted-foreground">
                          <UserCircle className="w-12 h-12 mb-4 opacity-20" />
                          <p className="text-lg font-medium text-admin-foreground">No customers found</p>
                          <p className="text-sm mt-1">Try adjusting your search term.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    customers.map((customer) => (
                      <TableRow key={customer.id} className="border-admin-border hover:bg-admin-muted/50 transition-colors">
                        <TableCell className="font-medium text-admin-foreground">{customer.id}</TableCell>
                        <TableCell className="font-medium">{customer.name || 'Unknown'}</TableCell>
                        <TableCell>{customer.email || '-'}</TableCell>
                        <TableCell>{customer.phone || '-'}</TableCell>
                        <TableCell className="text-center">{customer.totalConsultations || 0}</TableCell>
                        <TableCell className="text-right font-medium whitespace-nowrap">₹{customer.totalSpent || 0}</TableCell>
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

const AdminCustomersPage = () => (
    <ErrorBoundary>
      <AdminCustomersPageContent />
    </ErrorBoundary>
);

export default AdminCustomersPage;
