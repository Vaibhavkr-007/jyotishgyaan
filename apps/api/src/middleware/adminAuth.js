import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

const adminAuth = async (req, res, next) => {
  try {
    // Check JWT_SECRET at runtime
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      logger.error('adminAuth: JWT_SECRET is not configured in environment variables');
      const error = new Error('Server configuration error: JWT_SECRET not set');
      error.status = 500;
      throw error;
    }

    // Get authorization header (case-insensitive)
    const authHeader = req.headers.authorization || req.headers.Authorization;

    // Check if Authorization header exists
    if (!authHeader) {
      logger.warn('adminAuth: Missing authorization header');
      const error = new Error('Missing authorization header');
      error.status = 401;
      throw error;
    }

    logger.debug(`adminAuth: Authorization header received: ${authHeader.substring(0, 20)}...`);

    // Check if Authorization header starts with 'Bearer ' (case-insensitive)
    const bearerMatch = authHeader.match(/^Bearer\s+(.+)$/i);
    if (!bearerMatch) {
      logger.warn('adminAuth: Invalid authorization header format');
      const error = new Error('Invalid authorization header format. Expected: Bearer <token>');
      error.status = 401;
      throw error;
    }

    // Extract token from header
    const token = bearerMatch[1];

    if (!token) {
      logger.warn('adminAuth: Missing token in authorization header');
      const error = new Error('Missing token in authorization header');
      error.status = 401;
      throw error;
    }

    logger.debug('adminAuth: Token extracted successfully');

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log(
          '[ADMIN AUTH] DECODED TOKEN:',
          decoded
      );
      const roles =
          Array.isArray(decoded.role)
              ? decoded.role
              : [decoded.role];

      const isAdmin =
          roles.includes('admin') ||
          roles.includes('superadmin');

      if (!isAdmin) {

          return res.status(403).json({

              success: false,

              error: 'Admin access required'

          });

      }
      logger.debug('adminAuth: JWT token verified successfully');
    } catch (jwtError) {
      if (jwtError instanceof jwt.TokenExpiredError) {
        logger.warn(`adminAuth: Token expired - ${jwtError.message}`);
        const error = new Error('Token has expired');
        error.status = 401;
        throw error;
      }
      if (jwtError instanceof jwt.JsonWebTokenError) {
        logger.warn(`adminAuth: Invalid token - ${jwtError.message}`);
        const error = new Error('Invalid or expired token');
        error.status = 401;
        throw error;
      }
      throw jwtError;
    }

    // Extract userId from decoded token
    const userId = decoded.id || decoded.sub || decoded.userId;

    if (!userId) {
      logger.warn('adminAuth: No userId found in decoded token');
      logger.debug(`adminAuth: Decoded token payload: ${JSON.stringify(decoded)}`);
      const error = new Error('Invalid token: missing userId');
      error.status = 401;
      throw error;
    }

    logger.debug(`adminAuth: userId extracted from token: ${userId}`);

    // Attach userId, token, and full user data to request
    req.userId = userId;
    req.userEmail = decoded.email;
    req.token = token;
    req.user = decoded;

    logger.info(`adminAuth: Authentication verified for user: ${userId}`);

    // Call next middleware
    next();
  } catch (error) {
    // If error already has a status code, pass it through
    if (error.status) {
      logger.warn(`adminAuth: Authentication failed with status ${error.status}: ${error.message}`);
      return res.status(error.status).json({ error: error.message });
    }

    // For unexpected errors, log and return 401
    logger.error(`adminAuth: Unexpected error: ${error.message}`);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

export default adminAuth;
export { adminAuth };
