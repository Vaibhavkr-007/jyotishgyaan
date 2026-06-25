import express from 'express';
import jwt from 'jsonwebtoken';
import logger from '../../utils/logger.js';
import adminAuth from '../../middleware/adminAuth.js';

const router = express.Router();

const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
const JWT_ALGORITHM = process.env.JWT_ALGORITHM || 'HS256';

logger.info('[AUTH] Admin auth module loaded');

// POST /admin/auth/login - Admin login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // ============================================================================
  // STEP 1: Log incoming request details
  // ============================================================================
  console.log('[AUTH] ========== POST /admin/auth/login Request Received ==========');
  console.log(`[AUTH] Incoming email: ${email || '(empty)'}`)
  console.log(`[AUTH] Incoming password length: ${password ? password.length : 0} characters`);
  console.log(`[AUTH] Incoming password preview: ${password ? password.substring(0, 3) + '***' : '(empty)'}`)

  // ============================================================================
  // STEP 2: Log environment variable status
  // ============================================================================
  console.log('[AUTH] ========== Environment Variable Status ==========');

  const JWT_SECRET = process.env.JWT_SECRET;
  if (JWT_SECRET) {
    console.log(`[AUTH] ✓ JWT_SECRET exists (length: ${JWT_SECRET.length} characters)`);
  } else {
    console.log('[AUTH] ✗ JWT_SECRET is MISSING');
  }

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  if (ADMIN_EMAIL) {
    console.log(`[AUTH] ✓ ADMIN_EMAIL exists: ${ADMIN_EMAIL}`);
  } else {
    console.log('[AUTH] ✗ ADMIN_EMAIL is MISSING');
  }

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  if (ADMIN_PASSWORD) {
    console.log(`[AUTH] ✓ ADMIN_PASSWORD exists (length: ${ADMIN_PASSWORD.length} characters)`);
  } else {
    console.log('[AUTH] ✗ ADMIN_PASSWORD is MISSING');
  }

  // ============================================================================
  // STEP 3: Validate required fields
  // ============================================================================
  console.log('[AUTH] ========== Validating Required Fields ==========');

  if (!email || !password) {
    console.log('[AUTH] ✗ Validation failed: Missing email or password');
    console.log(`[AUTH]   - email provided: ${!!email}`);
    console.log(`[AUTH]   - password provided: ${!!password}`);
    logger.warn('Login attempt with missing email or password');
    return res.status(400).json({ error: 'Email and password are required' });
  }

  console.log('[AUTH] ✓ Both email and password provided');

  // ============================================================================
  // STEP 4: Check JWT_SECRET at runtime
  // ============================================================================
  console.log('[AUTH] ========== JWT_SECRET Runtime Check ==========');

  if (!JWT_SECRET) {
    console.log('[AUTH] ✗ JWT_SECRET is not configured in environment variables');
    logger.error('POST /admin/auth/login: JWT_SECRET is not configured');
    const error = new Error('Server configuration error: JWT_SECRET not set');
    error.status = 500;
    throw error;
  }

  console.log(`[AUTH] ✓ JWT_SECRET is configured (length: ${JWT_SECRET.length} characters)`);

  // ============================================================================
  // STEP 5: Check ADMIN_EMAIL and ADMIN_PASSWORD at runtime
  // ============================================================================
  console.log('[AUTH] ========== Admin Credentials Runtime Check ==========');

  if (!ADMIN_EMAIL) {
    console.log('[AUTH] ✗ ADMIN_EMAIL is not configured in environment variables');
    logger.error('POST /admin/auth/login: ADMIN_EMAIL is not configured');
    const error = new Error('Server configuration error: ADMIN_EMAIL not set');
    error.status = 500;
    throw error;
  }

  if (!ADMIN_PASSWORD) {
    console.log('[AUTH] ✗ ADMIN_PASSWORD is not configured in environment variables');
    logger.error('POST /admin/auth/login: ADMIN_PASSWORD is not configured');
    const error = new Error('Server configuration error: ADMIN_PASSWORD not set');
    error.status = 500;
    throw error;
  }

  console.log('[AUTH] ✓ ADMIN_EMAIL and ADMIN_PASSWORD are configured');

  // ============================================================================
  // STEP 6: Perform detailed credential comparison
  // ============================================================================
  console.log('[AUTH] ========== Credential Comparison Analysis ==========');

  // Email comparison
  console.log('[AUTH] --- Email Comparison ---');
  console.log(`[AUTH] Incoming email: "${email}"`);
  console.log(`[AUTH] Expected email: "${ADMIN_EMAIL}"`);
  console.log(`[AUTH] Incoming email length: ${email.length}`);
  console.log(`[AUTH] Expected email length: ${ADMIN_EMAIL.length}`);

  const emailTrimmed = email.trim();
  const adminEmailTrimmed = ADMIN_EMAIL.trim();
  console.log(`[AUTH] Incoming email (trimmed): "${emailTrimmed}"`);
  console.log(`[AUTH] Expected email (trimmed): "${adminEmailTrimmed}"`);

  const emailMatch = email === ADMIN_EMAIL;
  const emailMatchTrimmed = emailTrimmed === adminEmailTrimmed;
  console.log(`[AUTH] Email exact match: ${emailMatch}`);
  console.log(`[AUTH] Email trimmed match: ${emailMatchTrimmed}`);

  // Character-by-character email analysis
  if (!emailMatch) {
    console.log('[AUTH] Email character-by-character analysis:');
    const maxLen = Math.max(email.length, ADMIN_EMAIL.length);
    for (let i = 0; i < maxLen; i++) {
      const incomingChar = email[i] || '(missing)';
      const expectedChar = ADMIN_EMAIL[i] || '(missing)';
      const match = incomingChar === expectedChar ? '✓' : '✗';
      console.log(`[AUTH]   Position ${i}: incoming='${incomingChar}' vs expected='${expectedChar}' ${match}`);
    }
  }

  // Password comparison
  console.log('[AUTH] --- Password Comparison ---');
  console.log(`[AUTH] Incoming password length: ${password.length}`);
  console.log(`[AUTH] Expected password length: ${ADMIN_PASSWORD.length}`);
  console.log(`[AUTH] Incoming password preview: ${password.substring(0, 3)}***`);
  console.log(`[AUTH] Expected password preview: ${ADMIN_PASSWORD.substring(0, 3)}***`);

  const passwordTrimmed = password.trim();
  const adminPasswordTrimmed = ADMIN_PASSWORD.trim();
  console.log(`[AUTH] Incoming password (trimmed) length: ${passwordTrimmed.length}`);
  console.log(`[AUTH] Expected password (trimmed) length: ${adminPasswordTrimmed.length}`);

  const passwordMatch = password === ADMIN_PASSWORD;
  const passwordMatchTrimmed = passwordTrimmed === adminPasswordTrimmed;
  console.log(`[AUTH] Password exact match: ${passwordMatch}`);
  console.log(`[AUTH] Password trimmed match: ${passwordMatchTrimmed}`);

  // Character-by-character password analysis
  if (!passwordMatch) {
    console.log('[AUTH] Password character-by-character analysis:');
    const maxLen = Math.max(password.length, ADMIN_PASSWORD.length);
    for (let i = 0; i < maxLen; i++) {
      const incomingChar = password[i] || '(missing)';
      const expectedChar = ADMIN_PASSWORD[i] || '(missing)';
      const match = incomingChar === expectedChar ? '✓' : '✗';
      console.log(`[AUTH]   Position ${i}: incoming='${incomingChar}' vs expected='${expectedChar}' ${match}`);
    }
  }

  // ============================================================================
  // STEP 7: Validate credentials
  // ============================================================================
  console.log('[AUTH] ========== Credential Validation Result ==========');

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    console.log('[AUTH] ✗ Credentials do NOT match');
    console.log(`[AUTH]   - Email match: ${email === ADMIN_EMAIL}`);
    console.log(`[AUTH]   - Password match: ${password === ADMIN_PASSWORD}`);
    logger.warn(`Login failed for ${email}: Invalid credentials`);
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  console.log('[AUTH] ✓ Credentials match successfully');
  console.log('[AUTH]   - Email match: true');
  console.log('[AUTH]   - Password match: true');

  // ============================================================================
  // STEP 8: Generate JWT token
  // ============================================================================
  console.log('[AUTH] ========== JWT Token Generation ==========');
  console.log('[AUTH] Generating JWT token with payload:');
  console.log('[AUTH]   - id: admin-user');
  console.log(`[AUTH]   - email: ${ADMIN_EMAIL}`);
  console.log('[AUTH]   - role: admin');
  console.log('[AUTH] Token options:');
  console.log(`[AUTH]   - expiresIn: ${JWT_EXPIRY}`);
  console.log(`[AUTH]   - algorithm: ${JWT_ALGORITHM}`);

  const token = jwt.sign(
    {
      id: 'admin-user',
      email: ADMIN_EMAIL,
      role: 'admin',
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRY,
      algorithm: JWT_ALGORITHM,
    }
  );

  console.log('[AUTH] ✓ JWT token generated successfully');
  console.log(`[AUTH]   - Token length: ${token.length} characters`);
  console.log(`[AUTH]   - Token preview: ${token.substring(0, 20)}...${token.substring(token.length - 20)}`);

  logger.info(`Login successful for admin user: ${ADMIN_EMAIL}`);

  // ============================================================================
  // STEP 9: Return success response
  // ============================================================================
  console.log('[AUTH] ========== Returning Success Response ==========');
  console.log('[AUTH] Status: 200 OK');
  console.log('[AUTH] Response body:');
  console.log('[AUTH]   - success: true');
  console.log('[AUTH]   - message: Login successful');
  console.log('[AUTH]   - token: (JWT token)');
  console.log('[AUTH]   - user: { id, email, role }');
  console.log('[AUTH] ========== End of Login Request ==========');

  res.json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      id: 'admin-user',
      email: ADMIN_EMAIL,
      role: 'admin',
    },
  });
});

// GET /admin/auth/verify-session - Verify JWT token and return user info
router.get('/verify-session', async (req, res) => {
  console.log('[AUTH] ========== GET /admin/auth/verify-session Request Received ==========');

  // ============================================================================
  // STEP 1: Extract Authorization header
  // ============================================================================
  console.log('[AUTH] ========== Extracting Authorization Header ==========');

  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader) {
    console.log('[AUTH] ✗ Authorization header is missing');
    logger.warn('verify-session: Missing authorization header');
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  console.log('[AUTH] ✓ Authorization header found');
  console.log(`[AUTH]   - Header preview: ${authHeader.substring(0, 30)}...`);

  // ============================================================================
  // STEP 2: Validate Bearer format
  // ============================================================================
  console.log('[AUTH] ========== Validating Bearer Format ==========');

  const bearerMatch = authHeader.match(/^Bearer\s+(.+)$/i);

  if (!bearerMatch) {
    console.log('[AUTH] ✗ Authorization header does not match Bearer format');
    console.log(`[AUTH]   - Header value: ${authHeader}`);
    logger.warn('verify-session: Invalid authorization header format');
    return res.status(401).json({ error: 'Invalid authorization header format. Expected: Bearer <token>' });
  }

  console.log('[AUTH] ✓ Authorization header matches Bearer format');

  // ============================================================================
  // STEP 3: Extract token
  // ============================================================================
  console.log('[AUTH] ========== Extracting Token ==========');

  const token = bearerMatch[1];

  if (!token) {
    console.log('[AUTH] ✗ Token is empty after Bearer extraction');
    logger.warn('verify-session: Missing token in authorization header');
    return res.status(401).json({ error: 'Missing token in authorization header' });
  }

  console.log('[AUTH] ✓ Token extracted successfully');
  console.log(`[AUTH]   - Token length: ${token.length} characters`);
  console.log(`[AUTH]   - Token preview: ${token.substring(0, 20)}...${token.substring(token.length - 20)}`);

  // ============================================================================
  // STEP 4: Check JWT_SECRET
  // ============================================================================
  console.log('[AUTH] ========== JWT_SECRET Runtime Check ==========');

  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    console.log('[AUTH] ✗ JWT_SECRET is not configured in environment variables');
    logger.error('verify-session: JWT_SECRET is not configured');
    const error = new Error('Server configuration error: JWT_SECRET not set');
    error.status = 500;
    throw error;
  }

  console.log(`[AUTH] ✓ JWT_SECRET is configured (length: ${JWT_SECRET.length} characters)`);

  // ============================================================================
  // STEP 5: Verify JWT token
  // ============================================================================
  console.log('[AUTH] ========== Verifying JWT Token ==========');

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
    console.log('[AUTH] ✓ JWT token verified successfully');
    console.log('[AUTH] Decoded token payload:');
    console.log(`[AUTH]   - id: ${decoded.id}`);
    console.log(`[AUTH]   - email: ${decoded.email}`);
    console.log(`[AUTH]   - role: ${decoded.role}`);
    console.log(`[AUTH]   - iat: ${decoded.iat}`);
    console.log(`[AUTH]   - exp: ${decoded.exp}`);
  } catch (jwtError) {
    if (jwtError instanceof jwt.TokenExpiredError) {
      console.log(`[AUTH] ✗ Token has expired`);
      console.log(`[AUTH]   - Expiration time: ${new Date(jwtError.expiredAt).toISOString()}`);
      logger.warn(`verify-session: Token expired - ${jwtError.message}`);
      return res.status(401).json({ error: 'Token has expired' });
    }

    if (jwtError instanceof jwt.JsonWebTokenError) {
      console.log(`[AUTH] ✗ Token verification failed`);
      console.log(`[AUTH]   - Error: ${jwtError.message}`);
      logger.warn(`verify-session: Invalid token - ${jwtError.message}`);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Unexpected JWT error
    console.log(`[AUTH] ✗ Unexpected JWT error: ${jwtError.message}`);
    logger.error(`verify-session: Unexpected JWT error - ${jwtError.message}`);
    throw jwtError;
  }

  // ============================================================================
  // STEP 6: Extract user info from decoded token
  // ============================================================================
  console.log('[AUTH] ========== Extracting User Info ==========');

  const userId = decoded.id || decoded.sub || decoded.userId;
  const userEmail = decoded.email;
  const userRole = decoded.role;

  if (!userId) {
    console.log('[AUTH] ✗ No userId found in decoded token');
    console.log(`[AUTH]   - Decoded payload: ${JSON.stringify(decoded)}`);
    logger.warn('verify-session: No userId in decoded token');
    return res.status(401).json({ error: 'Invalid token: missing userId' });
  }

  console.log('[AUTH] ✓ User info extracted successfully');
  console.log(`[AUTH]   - userId: ${userId}`);
  console.log(`[AUTH]   - email: ${userEmail}`);
  console.log(`[AUTH]   - role: ${userRole}`);

  // ============================================================================
  // STEP 7: Return success response
  // ============================================================================
  console.log('[AUTH] ========== Returning Success Response ==========');
  console.log('[AUTH] Status: 200 OK');
  console.log('[AUTH] Response body:');
  console.log('[AUTH]   - success: true');
  console.log('[AUTH]   - user: { id, email, role }');
  console.log('[AUTH] ========== End of Verify Session Request ==========');

  logger.info(`Session verified for user: ${userId}`);

  res.json({
    success: true,
    user: {
      id: userId,
      email: userEmail,
      role: userRole,
    },
  });
});

router.get(
    '/verify',
    adminAuth,
    async (req, res) => {

        return res.json({

            success: true,

            user: req.user,

        });

    }
);

export default router;
