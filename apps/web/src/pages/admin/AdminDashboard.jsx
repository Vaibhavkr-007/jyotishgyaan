
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import apiServerClient from '@/lib/apiServerClient';
import { getAuthHeaders } from '@/utils/authHeaders.js';
import { 
  CalendarDays, IndianRupee, Users, Clock, 
  CheckCircle2, XCircle, ArrowUpRight 
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import ErrorBoundary from '@/components/admin/ErrorBoundary.jsx';
import { StatCardSkeleton, ChartSkeleton } from '@/components/admin/LoadingSkeleton.jsx';
import { Button } from '@/components/ui/button';

const AdminDashboardContent = () => {
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    console.log('[AdminDashboard] Fetching dashboard data...');
    setLoading(true);
    setError(null);
    try {
      const headers = getAuthHeaders();
      
      // Fetch stats
      const statsRes = await apiServerClient.fetch('/admin/dashboard/stats', { method: 'GET', headers });
      console.log(`[AdminDashboard] Stats response status: ${statsRes.status}`);
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        console.log('[AdminDashboard] Stats response data:', statsData);
        
        // Validate response format
        if (!statsData || typeof statsData !== 'object') {
          console.warn('[AdminDashboard] Invalid stats response format');
          setStats(null);
        } else {
          // Extract data from { data: {...} } or use directly if {...}
          const statsObj = statsData.data || statsData;
          
          if (typeof statsObj !== 'object') {
            console.warn('[AdminDashboard] Stats data is not an object:', statsObj);
            setStats(null);
          } else {
            console.log('[AdminDashboard] Successfully validated stats data');
            setStats(statsObj);
          }
        }
      } else {
        console.warn(`[AdminDashboard] Stats fetch failed with status ${statsRes.status}`);
        setStats(null);
      }

      // Fetch revenue
      const revRes = await apiServerClient.fetch('/admin/dashboard/revenue', { method: 'GET', headers });
      console.log(`[AdminDashboard] Revenue response status: ${revRes.status}`);
      if (revRes.ok) {
        const revData = await revRes.json();
        console.log('[AdminDashboard] Revenue response data:', revData);
        
        // Validate response format
        if (!revData || typeof revData !== 'object') {
          console.warn('[AdminDashboard] Invalid revenue response format');
          setRevenueData([]);
        } else {
          // Extract data from { data: [...] } or use directly if [...]
          const revArray = Array.isArray(revData) ? revData : (revData.data || []);
          
          if (!Array.isArray(revArray)) {
            console.warn('[AdminDashboard] Revenue data is not an array:', revArray);
            setRevenueData([]);
          } else {
            console.log(`[AdminDashboard] Successfully validated ${revArray.length} revenue data points`);
            setRevenueData(revArray);
          }
        }
      } else {
        console.warn(`[AdminDashboard] Revenue fetch failed with status ${revRes.status}`);
        setRevenueData([]);
      }

      // Fetch upcoming
      const upRes = await apiServerClient.fetch('/admin/dashboard/upcoming', { method: 'GET', headers });
      console.log(`[AdminDashboard] Upcoming response status: ${upRes.status}`);
      if (upRes.ok) {
        const upData = await upRes.json();
        console.log('[AdminDashboard] Upcoming response data:', upData);
        
        // Validate response format
        if (!upData || typeof upData !== 'object') {
          console.warn('[AdminDashboard] Invalid upcoming response format');
          setUpcoming([]);
        } else {
          // Extract data from { data: [...] } or use directly if [...]
          const upArray = Array.isArray(upData) ? upData : (upData.data || []);
          
          if (!Array.isArray(upArray)) {
            console.warn('[AdminDashboard] Upcoming data is not an array:', upArray);
            setUpcoming([]);
          } else {
            console.log(`[AdminDashboard] Successfully validated ${upArray.length} upcoming items`);
            setUpcoming(upArray);
          }
        }
      } else {
        console.warn(`[AdminDashboard] Upcoming fetch failed with status ${upRes.status}`);
        setUpcoming([]);
      }
    } catch (err) {
      console.error('[AdminDashboard] Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    { title: 'Total Revenue', value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`, icon: IndianRupee, color: 'text-admin-success' },
    { title: 'Total Bookings', value: stats?.totalBookings || 0, icon: CalendarDays, color: 'text-admin-primary' },
    { title: 'Upcoming (7 Days)', value: stats?.upcomingBookings || 0, icon: Clock, color: 'text-admin-warning' },
    { title: 'Completed', value: stats?.completedBookings || 0, icon: CheckCircle2, color: 'text-admin-info' },
    { title: 'Pending Payments', value: stats?.pendingPayments || 0, icon: Users, color: 'text-admin-danger' },
    { title: 'Cancellation Rate', value: stats?.cancellationRate || '0%', icon: XCircle, color: 'text-admin-muted-foreground' },
  ];

  if (error) {
    return (
      <div className="p-6 text-center text-admin-danger bg-admin-danger/5 rounded-lg border border-admin-danger/20">
        <p className="mb-4">{error}</p>
        <Button onClick={fetchDashboardData} variant="outline">Retry Loading Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-admin-foreground">Dashboard Overview</h1>
        <p className="text-admin-muted-foreground mt-1 text-sm sm:text-base">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          statCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} className="bg-admin-card border-admin-border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6 flex items-center justify-between">
                  <div className="min-w-0 pr-4">
                    <p className="text-sm font-medium text-admin-muted-foreground mb-1 truncate">{stat.title}</p>
                    <h3 className="text-xl sm:text-2xl font-bold text-admin-foreground truncate">{stat.value}</h3>
                  </div>
                  <div className={`p-3 rounded-xl bg-admin-muted shrink-0 ${stat.color}`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          {loading ? (
            <ChartSkeleton />
          ) : (
            <Card className="bg-admin-card border-admin-border shadow-sm h-full">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] sm:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--admin-border))" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--admin-muted-foreground))', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--admin-muted-foreground))', fontSize: 12 }} tickFormatter={(val) => `₹${val}`} />
                      <Tooltip 
                        cursor={{ fill: 'hsl(var(--admin-muted))' }}
                        contentStyle={{ backgroundColor: 'hsl(var(--admin-card))', borderColor: 'hsl(var(--admin-border))', color: 'hsl(var(--admin-foreground))', borderRadius: '8px' }}
                      />
                      <Bar dataKey="amount" fill="hsl(var(--admin-primary))" radius={[4, 4, 0, 0]} maxBarSize={50} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Upcoming Consultations */}
        <div>
          {loading ? (
            <ChartSkeleton />
          ) : (
            <Card className="bg-admin-card border-admin-border shadow-sm h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
                <CardTitle className="text-lg font-semibold">Upcoming</CardTitle>
                <ArrowUpRight className="w-4 h-4 text-admin-muted-foreground" />
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="space-y-4 mt-2">
                  {upcoming.length > 0 ? (
                    upcoming.map((booking) => (
                      <div key={booking.id} className="flex items-start justify-between border-b border-admin-border pb-4 last:border-0 last:pb-0">
                        <div className="min-w-0 pr-2">
                          <p className="font-medium text-admin-foreground text-sm truncate">{booking.customerName}</p>
                          <p className="text-xs text-admin-muted-foreground mt-0.5 truncate">{booking.type}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-medium text-admin-foreground">
                            {booking.date ? format(new Date(booking.date), 'MMM d') : 'N/A'}
                          </p>
                          <p className="text-xs text-admin-muted-foreground mt-0.5">
                            {booking.date ? format(new Date(booking.date), 'h:mm a') : 'N/A'}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-8 text-admin-muted-foreground">
                      <Clock className="w-8 h-8 mb-2 opacity-20" />
                      <p className="text-sm">No upcoming consultations.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Raw Data Debug View */}
      {!loading && stats && (
        <Card className="bg-admin-card border-admin-border shadow-sm mt-8 opacity-50 hover:opacity-100 transition-opacity">
          <CardHeader>
            <CardTitle className="text-sm font-mono text-admin-muted-foreground">Raw Data View (Debug)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-admin-background p-4 rounded-md overflow-x-auto text-admin-foreground border border-admin-border custom-scrollbar">
              {JSON.stringify({ stats, upcoming: upcoming.length, revenueDays: revenueData.length }, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const AdminDashboard = () => (
    <ErrorBoundary>
        <AdminDashboardContent />
    </ErrorBoundary>
);

export default AdminDashboard;
