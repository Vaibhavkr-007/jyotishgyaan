import express from 'express';
import adminAuth from '../../middleware/adminAuth.js';
import pb from '../../utils/pocketbaseClient.js';
import logger from '../../utils/logger.js';

const router = express.Router();

// Apply admin authentication middleware to all routes in this file
router.use(adminAuth);

// GET /admin/dashboard - Get dashboard summary data (protected)
router.get('/', async (req, res) => {
  console.log('[DASHBOARD] ========== GET /admin/dashboard Request Received ==========');
  console.log(`[DASHBOARD] User ID: ${req.userId}`);

  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    console.log('[DASHBOARD] Fetching all bookings...');
    const allBookings = await pb.collection('bookings').getFullList({
      expand: 'customerId',
    });
    console.log(`[DASHBOARD] Total bookings fetched: ${allBookings.length}`);

    console.log('[DASHBOARD] Fetching all customers...');
    const allCustomers = await pb.collection('customers').getFullList();
    console.log(`[DASHBOARD] Total customers fetched: ${allCustomers.length}`);

    console.log('[DASHBOARD] Fetching all payments...');
    const allPayments = await pb.collection('payments').getFullList();
    console.log(`[DASHBOARD] Total payments fetched: ${allPayments.length}`);

    // Get bookings for this month
    const monthBookings = allBookings.filter(b => new Date(b.createdAt) >= startOfMonth);
    console.log(`[DASHBOARD] Month bookings: ${monthBookings.length}`);

    // Get completed bookings
    const completedBookings = allBookings.filter(b => b.status === 'completed');
    console.log(`[DASHBOARD] Completed bookings: ${completedBookings.length}`);

    // Get cancelled bookings
    const cancelledBookings = allBookings.filter(b => b.status === 'cancelled');
    console.log(`[DASHBOARD] Cancelled bookings: ${cancelledBookings.length}`);

    // Get pending bookings
    const pendingBookings = allBookings.filter(b => b.status === 'pending');
    console.log(`[DASHBOARD] Pending bookings: ${pendingBookings.length}`);

    // Get upcoming bookings (next 7 days)
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcomingBookings = allBookings.filter(b => {
      const bookingDate = new Date(b.scheduledDateTime);
      return bookingDate >= now && bookingDate <= sevenDaysFromNow && b.status !== 'cancelled';
    });
    console.log(`[DASHBOARD] Upcoming bookings (next 7 days): ${upcomingBookings.length}`);

    // Calculate total revenue
    const totalRevenue = allPayments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    console.log(`[DASHBOARD] Total revenue: ₹${totalRevenue}`);

    // Get recent bookings (last 5)
    const recentBookings = allBookings
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(b => ({
        id: b.id,
        customerName: b.expand?.customerId?.name || 'N/A',
        consultationType: b.consultationType,
        amount: b.amount,
        status: b.status,
        createdAt: b.createdAt,
      }));
    console.log(`[DASHBOARD] Recent bookings: ${recentBookings.length}`);

    // Get revenue by month (last 12 months)
    const revenueByMonth = {};
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().substring(0, 7); // YYYY-MM
      revenueByMonth[monthKey] = 0;
    }

    allPayments
      .filter(p => p.status === 'completed')
      .forEach(p => {
        const monthKey = new Date(p.createdAt).toISOString().substring(0, 7);
        if (revenueByMonth[monthKey] !== undefined) {
          revenueByMonth[monthKey] += p.amount || 0;
        }
      });
    console.log(`[DASHBOARD] Revenue by month calculated for ${Object.keys(revenueByMonth).length} months`);

    // Get customer growth (last 12 months)
    const customerGrowth = {};
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().substring(0, 7); // YYYY-MM
      customerGrowth[monthKey] = 0;
    }

    allCustomers.forEach(c => {
      const monthKey = new Date(c.createdAt).toISOString().substring(0, 7);
      if (customerGrowth[monthKey] !== undefined) {
        customerGrowth[monthKey] += 1;
      }
    });
    console.log(`[DASHBOARD] Customer growth calculated for ${Object.keys(customerGrowth).length} months`);

    console.log('[DASHBOARD] ========== Returning Dashboard Data ==========');

    res.json({
      success: true,
      data: {
        totalBookings: allBookings.length,
        totalRevenue,
        totalCustomers: allCustomers.length,
        upcomingBookings: upcomingBookings.length,
        completedBookings: completedBookings.length,
        cancelledBookings: cancelledBookings.length,
        pendingBookings: pendingBookings.length,
        recentBookings,
        revenueByMonth: Object.entries(revenueByMonth).map(([month, amount]) => ({
          month,
          amount,
        })),
        customerGrowth: Object.entries(customerGrowth).map(([month, count]) => ({
          month,
          count,
        })),
      },
    });
  } catch (error) {
    console.log(`[DASHBOARD] Error: ${error.message}`);
    logger.error('GET /admin/dashboard error:', error.message);
    throw error;
  }
});

// GET /admin/dashboard/stats - Get dashboard statistics (protected)
router.get('/stats', async (req, res) => {
  console.log('[DASHBOARD] ========== GET /admin/dashboard/stats Request Received ==========');
  console.log(`[DASHBOARD] User ID: ${req.userId}`);

  try {
    const now = new Date();

    console.log('[DASHBOARD] Fetching all bookings...');
    const allBookings = await pb.collection('bookings').getFullList({
      expand: 'customerId',
    });
    console.log(`[DASHBOARD] Total bookings fetched: ${allBookings.length}`);

    console.log('[DASHBOARD] Fetching all customers...');
    const allCustomers = await pb.collection('customers').getFullList();
    console.log(`[DASHBOARD] Total customers fetched: ${allCustomers.length}`);

    console.log('[DASHBOARD] Fetching all payments...');
    const allPayments = await pb.collection('payments').getFullList();
    console.log(`[DASHBOARD] Total payments fetched: ${allPayments.length}`);

    // Get upcoming bookings (next 7 days)
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcomingBookings = allBookings.filter(b => {
      const bookingDate = new Date(b.scheduledDateTime);
      return bookingDate >= now && bookingDate <= sevenDaysFromNow && b.status !== 'cancelled';
    });
    console.log(`[DASHBOARD] Upcoming bookings (next 7 days): ${upcomingBookings.length}`);

    // Get completed bookings
    const completedBookings = allBookings.filter(b => b.status === 'completed');
    console.log(`[DASHBOARD] Completed bookings: ${completedBookings.length}`);

    // Get cancelled bookings
    const cancelledBookings = allBookings.filter(b => b.status === 'cancelled');
    console.log(`[DASHBOARD] Cancelled bookings: ${cancelledBookings.length}`);

    // Get pending bookings
    const pendingBookings = allBookings.filter(b => b.status === 'pending');
    console.log(`[DASHBOARD] Pending bookings: ${pendingBookings.length}`);

    // Calculate total revenue
    const totalRevenue = allPayments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    console.log(`[DASHBOARD] Total revenue: ₹${totalRevenue}`);

    // Get recent bookings (last 5)
    const recentBookings = allBookings
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(b => ({
        id: b.id,
        customerName: b.expand?.customerId?.name || 'N/A',
        consultationType: b.consultationType,
        amount: b.amount,
        status: b.status,
        createdAt: b.createdAt,
      }));
    console.log(`[DASHBOARD] Recent bookings: ${recentBookings.length}`);

    // Get revenue by month (last 12 months)
    const revenueByMonth = {};
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().substring(0, 7); // YYYY-MM
      revenueByMonth[monthKey] = 0;
    }

    allPayments
      .filter(p => p.status === 'completed')
      .forEach(p => {
        const monthKey = new Date(p.createdAt).toISOString().substring(0, 7);
        if (revenueByMonth[monthKey] !== undefined) {
          revenueByMonth[monthKey] += p.amount || 0;
        }
      });
    console.log(`[DASHBOARD] Revenue by month calculated for ${Object.keys(revenueByMonth).length} months`);

    // Get customer growth (last 12 months)
    const customerGrowth = {};
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().substring(0, 7); // YYYY-MM
      customerGrowth[monthKey] = 0;
    }

    allCustomers.forEach(c => {
      const monthKey = new Date(c.createdAt).toISOString().substring(0, 7);
      if (customerGrowth[monthKey] !== undefined) {
        customerGrowth[monthKey] += 1;
      }
    });
    console.log(`[DASHBOARD] Customer growth calculated for ${Object.keys(customerGrowth).length} months`);

    console.log('[DASHBOARD] ========== Returning Dashboard Stats ==========');

    res.json({
      success: true,
      data: {
        totalBookings: allBookings.length,
        totalRevenue,
        totalCustomers: allCustomers.length,
        upcomingBookings: upcomingBookings.length,
        completedBookings: completedBookings.length,
        cancelledBookings: cancelledBookings.length,
        pendingBookings: pendingBookings.length,
        recentBookings,
        revenueByMonth: Object.entries(revenueByMonth).map(([month, amount]) => ({
          month,
          amount,
        })),
        customerGrowth: Object.entries(customerGrowth).map(([month, count]) => ({
          month,
          count,
        })),
      },
    });
  } catch (error) {
    console.log(`[DASHBOARD] Error: ${error.message}`);
    logger.error('GET /admin/dashboard/stats error:', error.message);
    throw error;
  }
});

export default router;