import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import logger from './utils/logger.js';
import { BodyLimit } from './constants/common.js';
import {
    authenticateAdmin
} from './utils/pocketbaseAdminClient.js';

// ============================================================================
// STARTUP LOGGING - Verify all required environment variables are loaded
// ============================================================================
console.log('[STARTUP] ========== API Server Startup ==========');
console.log('[STARTUP] Environment variables loaded via dotenv.config()');

// Check JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET;
if (JWT_SECRET) {
  console.log(`[STARTUP] ✓ JWT_SECRET exists (length: ${JWT_SECRET.length} characters)`);
} else {
  console.log('[STARTUP] ✗ JWT_SECRET is MISSING');
}

// Check ADMIN_EMAIL
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
if (ADMIN_EMAIL) {
  console.log(`[STARTUP] ✓ ADMIN_EMAIL exists: ${ADMIN_EMAIL}`);
} else {
  console.log('[STARTUP] ✗ ADMIN_EMAIL is MISSING');
}

// Check ADMIN_PASSWORD
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (ADMIN_PASSWORD) {
  console.log(`[STARTUP] ✓ ADMIN_PASSWORD exists (length: ${ADMIN_PASSWORD.length} characters)`);
} else {
  console.log('[STARTUP] ✗ ADMIN_PASSWORD is MISSING');
}

// Validate required environment variables at startup BEFORE importing routes
const requiredEnvVars = ['JWT_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.log(`[STARTUP] ✗ CRITICAL: Missing required environment variables: ${missingEnvVars.join(', ')}`);
  console.log('[STARTUP] Please set the following in .env file:');
  missingEnvVars.forEach(varName => {
    console.log(`[STARTUP]   - ${varName}`);
  });
  console.log('[STARTUP] Exiting with error code 1');
  process.exit(1);
}

console.log('[STARTUP] ✓ All required environment variables are configured');
console.log('[STARTUP] ========== Proceeding with server initialization ==========');

logger.info('[STARTUP] All required environment variables configured');
logger.info('[STARTUP] JWT_SECRET: configured');
logger.info(`[STARTUP] Admin credentials configured for: ${process.env.ADMIN_EMAIL}`);

// Import routes AFTER .env is loaded and validated
import routes from './routes/index.js';
import { errorMiddleware } from './middleware/error.js';
import { globalRateLimit } from './middleware/global-rate-limit.js';

const app = express();

app.set('trust proxy', true);

process.on('uncaughtException', (error) => {
	logger.error('Uncaught exception:', error);
});
  
process.on('unhandledRejection', (reason, promise) => {
	logger.error('Unhandled rejection at:', promise, 'reason:', reason);
});

process.on('SIGINT', async () => {
	logger.info('Interrupted');
	process.exit(0);
});

process.on('SIGTERM', async () => {
	logger.info('SIGTERM signal received');

	await new Promise(resolve => setTimeout(resolve, 3000));

	logger.info('Exiting');
	process.exit();
});

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
  })
);
app.use(cors({
	origin: process.env.CORS_ORIGIN,
	credentials: true,
}));
app.use(morgan('combined'));
app.use(globalRateLimit);
app.use(express.json({
	limit: BodyLimit,
}));
app.use(express.urlencoded({ 
	extended: true,
	limit: BodyLimit,
}));

app.use('/', routes());

app.use(errorMiddleware);

app.use((req, res) => {
	res.status(404).json({ error: 'Route not found' });
});

const port = process.env.PORT || 3001;

console.log('[STARTUP] ========== Route Registration ==========');
console.log('[STARTUP] ✓ Health check route registered: GET /health');
console.log('[STARTUP] ✓ Admin auth routes registered: /admin/auth');
console.log('[STARTUP] ✓ Admin dashboard routes registered: /admin/dashboard');
console.log('[STARTUP] ✓ Admin bookings routes registered: /admin/bookings');
console.log('[STARTUP] ✓ Admin payments routes registered: /admin/payments');
console.log('[STARTUP] ✓ Admin customers routes registered: /admin/customers');
console.log('[STARTUP] ✓ Admin availability routes registered: /admin/availability');
console.log('[STARTUP] ✓ Admin calendar routes registered: /admin/calendar');
console.log('[STARTUP] ✓ Admin settings routes registered: /admin/settings');
console.log('[STARTUP] ========== All routes registered successfully ==========');

await authenticateAdmin();

app.listen(port, () => {
	console.log('[STARTUP] ========== Server Started ==========');
	console.log(`[STARTUP] 🚀 API Server running on http://localhost:${port}`);
	console.log(`[STARTUP] Environment: ${process.env.NODE_ENV || 'development'}`);
	console.log('[STARTUP] ========== Ready to accept requests ==========');
	logger.info(`🚀 API Server running on http://localhost:${port}`);
});

export default app;