import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

const calcomAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header exists
  if (!authHeader) {
    logger.warn('Cal.com auth error: Missing authorization header');
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  // Check if Authorization header starts with 'Bearer '
  if (!authHeader.startsWith('Bearer ')) {
    logger.warn('Cal.com auth error: Invalid authorization header format');
    return res.status(401).json({ error: 'Invalid authorization header format. Expected: Bearer <token>' });
  }

  // Extract token from header
  const token = authHeader.substring(7);

  if (!token) {
    logger.warn('Cal.com auth error: Missing token in authorization header');
    return res.status(401).json({ error: 'Missing token in authorization header' });
  }

  try {
    // Decode JWT token using JWT_SECRET
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      logger.error('Cal.com auth error: JWT_SECRET not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const decoded = jwt.verify(token, jwtSecret);
    const userId = decoded.id || decoded.userId;

    if (!userId) {
      logger.warn('Cal.com auth error: No userId in decoded token');
      return res.status(401).json({ error: 'Invalid token: missing userId' });
    }

    // Attach token and userId to request
    req.token = token;
    req.userId = userId;

    logger.info(`Cal.com auth verified for user: ${userId}`);
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn(`Cal.com auth error: Invalid token - ${error.message}`);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    if (error instanceof jwt.TokenExpiredError) {
      logger.warn(`Cal.com auth error: Token expired - ${error.message}`);
      return res.status(401).json({ error: 'Token has expired' });
    }
    logger.error(`Cal.com auth error: ${error.message}`);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

export default calcomAuth;
export { calcomAuth };
