import { Router } from 'express';
import authRouter from './auth.js';
import healthCheck from './health-check.js';
import adminAuthRouter from './admin/auth.js';
import adminDashboardRouter from './admin/dashboard.js';
import adminBookingsRouter from './admin/bookings.js';
import adminPaymentsRouter from './admin/payments.js';
import adminCustomersRouter from './admin/customers.js';
import adminAvailabilityRouter from './admin/availability.js';
import adminCalendarRouter from './admin/calendar.js';
import adminSettingsRouter from './admin/settings.js';
import consultationsRouter from './consultations.js';
import paymentsRouter from './payments.js';
import bookingsRouter from './bookings.js';
import coursesRouter from './courses.js';
import profileRouter from "./profile.js";

const router = Router();

export default () => {
  router.get('/health', healthCheck);

  router.use('/auth', authRouter);

  // Consultations routes (public)
  router.use('/consultations', consultationsRouter);

  // Admin authentication routes (no auth required for login/verify-session)
  router.use('/admin/auth', adminAuthRouter);

  // Admin protected routes
  router.use('/admin/dashboard', adminDashboardRouter);
  router.use('/admin/bookings', adminBookingsRouter);
  router.use('/admin/payments', adminPaymentsRouter);
  router.use('/admin/customers', adminCustomersRouter);
  router.use('/admin/availability', adminAvailabilityRouter);
  router.use('/admin/calendar', adminCalendarRouter);
  router.use('/admin/settings', adminSettingsRouter);
  router.use('/payments', paymentsRouter);
  router.use('/bookings', bookingsRouter);
  router.use('/courses', coursesRouter);
  router.use("/profile", profileRouter);

  return router;
};


console.log('[STARTUP] ✓ Consultations routes registered: /consultations');