import express from 'express';
import jwt from 'jsonwebtoken';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import auth from '../middleware/auth.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

function getJwtSecret() {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error('JWT_SECRET is required');
    }

    return secret;
}

const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

if (!getJwtSecret) {
  logger.error('JWT_SECRET is not configured in environment variables');
  throw new Error('JWT_SECRET is required');
}

/**
 * Helper function to generate JWT token
 * @param {Object} user - User object with id, email, name
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    getJwtSecret(),
    { expiresIn: JWT_EXPIRY }
  );
};

// POST /auth/login - User login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const authData =
    await pb.collection('users')
      .authWithPassword(email, password);

  console.log(
    'LOGIN ATTEMPT:',
    email
  );

  const user =
    authData.record;

  if (!user.verified) {

    return res.status(403).json({
      success: false,
      message:
        'Please verify your email before logging in.'
    });

  }

  const token =
    generateToken(user);

  

  // Validate required fields
  if (!email || !password) {
    logger.warn('Login attempt with missing email or password');
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Authenticate with PocketBase
    const authData = await pb.collection('users').authWithPassword(email, password);

    // Get full user data
    const user = authData.record;

    // Generate JWT token
    const token = generateToken(user);

    logger.info(`User logged in successfully: ${email}`);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    // Check if it's an authentication error (invalid credentials)
    if (error.status === 401 || error.message.includes('Invalid credentials')) {
      logger.warn(`Login failed for ${email}: Invalid credentials`);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if user not found
    if (error.status === 404 || error.message.includes('not found')) {
      logger.warn(`Login failed for ${email}: User not found`);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Other errors
    logger.error(`Login error for ${email}: ${error.message}`);
    throw error;
  }
});

// POST /auth/signup - User registration
router.post('/signup', async (req, res) => {
  const { email, password, passwordConfirm, name } = req.body;

  // Validate required fields
  if (!email || !password || !passwordConfirm) {
    logger.warn('Signup attempt with missing required fields');
    return res.status(400).json({ error: 'Email, password, and password confirmation are required' });
  }

  if (password !== passwordConfirm) {
    logger.warn(`Signup attempt with mismatched passwords for ${email}`);
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  if (password.length < 8) {
    logger.warn(`Signup attempt with weak password for ${email}`);
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  try {
    // Create user in PocketBase
    const newUser = await pb.collection('users').create({
      email,
      password,
      passwordConfirm,
      name: name || email.split('@')[0],
    });

    logger.info(`User created successfully: ${email}`);

    // Authenticate to get full user data
    const authData = await pb.collection('users').authWithPassword(email, password);
    const user = authData.record;

    // Generate JWT token
    const token = generateToken(user);

    logger.info(`User signed up and authenticated: ${email}`);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    // Check if user already exists
    if (error.status === 400 && error.message.includes('duplicate')) {
      logger.warn(`Signup failed for ${email}: User already exists`);
      return res.status(400).json({ error: 'Email already registered' });
    }

    if (error.status === 400) {
      logger.warn(`Signup validation error for ${email}: ${error.message}`);
      return res.status(400).json({ error: error.message || 'Invalid signup data' });
    }

    // Authentication error after user creation
    if (error.status === 401) {
      logger.error(`Signup auth error for ${email}: ${error.message}`);
      return res.status(401).json({ error: 'Authentication failed after user creation' });
    }

    // Other errors
    logger.error(`Signup error for ${email}: ${error.message}`);
    throw error;
  }
});

// POST /auth/refresh - Refresh JWT token
router.post('/refresh', async (req, res) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header exists
  if (!authHeader) {
    logger.warn('Token refresh attempt with missing authorization header');
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  // Check if Authorization header starts with 'Bearer '
  if (!authHeader.startsWith('Bearer ')) {
    logger.warn('Token refresh attempt with invalid authorization header format');
    return res.status(401).json({ error: 'Invalid authorization header format. Expected: Bearer <token>' });
  }

  // Extract token from header
  const token = authHeader.substring(7);

  if (!token) {
    logger.warn('Token refresh attempt with missing token');
    return res.status(401).json({ error: 'Missing token in authorization header' });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, getJwtSecret())
    const userId = decoded.id;

    if (!userId) {
      logger.warn('Token refresh failed: No userId in decoded token');
      return res.status(401).json({ error: 'Invalid token: missing userId' });
    }

    // Get user from PocketBase
    const user = await pb.collection('users').getOne(userId);

    if (!user) {
      logger.warn(`Token refresh failed: User not found (${userId})`);
      return res.status(401).json({ error: 'User not found' });
    }

    // Generate new JWT token
    const newToken = generateToken(user);

    logger.info(`Token refreshed for user: ${userId}`);

    res.json({
      success: true,
      token: newToken,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn(`Token refresh failed: Invalid token - ${error.message}`);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    if (error instanceof jwt.TokenExpiredError) {
      logger.warn(`Token refresh failed: Token expired - ${error.message}`);
      return res.status(401).json({ error: 'Token has expired' });
    }

    logger.error(`Token refresh error: ${error.message}`);
    throw error;
  }
});

router.get(
    '/verify',
    auth,
    async (req, res) => {

        try {

            return res.json({

                success: true,

                user: {

                    id: req.user.id,
                    email: req.user.email,
                    name: req.user.name,

                }

            });

        } catch (error) {

            return res.status(401).json({

                success: false,

                error: 'Invalid token'

            });

        }

    }
);

router.post(
  '/resend-verification',
  async (req, res) => {

    try {

      const { email } = req.body;

      await pb
        .collection('users')
        .requestVerification(email);

      return res.json({

        success: true

      });

    } catch (error) {

      return res.status(400).json({

        success: false,

        message:
          'Unable to send verification email'

      });

    }

  }
);

export default router;
