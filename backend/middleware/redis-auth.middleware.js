// Enterprise Redis-First Authentication Middleware
// Checks Redis first (fast), falls back to DB if not found, rehydrates Redis

const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');
const { SessionCache } = require('../lib/redis');

/**
 * Enterprise Authentication Flow:
 * 1. Check Redis first (fast lookup)
 * 2. If not found → fallback DB session check
 * 3. If found in DB → rehydrate Redis
 * 4. If not found anywhere → unauthorized
 */
const authenticateRedis = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token required',
        step: 'missing_token'
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format',
        step: 'invalid_token'
      });
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key');
    } catch (jwtError) {
      // Check if it's a token expiration error
      if (jwtError.name === 'TokenExpiredError' || jwtError.message?.includes('jwt expired')) {
        console.log('🔑 Token Expired');
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        step: 'token_verification_failed'
      });
    }

    // Extract session ID from token
    const sessionId = decoded.sessionId || decoded.sub;
    if (!sessionId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token structure',
        step: 'no_session_id'
      });
    }

    // Step 1: Check Redis first (fast lookup)
    let sessionData = await SessionCache.get(sessionId);

    if (sessionData) {
      // Found in Redis - use it (fast path)
      req.user = {
        id: sessionData.superAdminId || sessionData.userId,
        email: sessionData.email,
        role: sessionData.role,
        planTier: sessionData.planTier,
        name: sessionData.name,
        sessionId: sessionData.sessionId,
        isSuperAdmin: sessionData.isSuperAdmin || false
      };
      req.authMethod = 'redis';
      req.sessionId = sessionId;

      // Refresh TTL on access
      await SessionCache.refresh(sessionId, 900);

      // Update online status for super admin (async, don't wait)
      if (sessionData.isSuperAdmin && sessionData.superAdminId) {
        try {
          const { getClientIp } = require('../utils/ip-helper');
          const clientIp = getClientIp(req);
          
          prisma.superAdmin.update({
            where: { id: sessionData.superAdminId },
            data: { 
              status: 'online',
              currentIp: clientIp
            }
          }).catch(err => console.error('Status update error:', err));
        } catch (error) {
          // Silent fail
        }
      }

      return next();
    }

    // Step 2: Not found in Redis - fallback to DB session check
    const dbSession = await prisma.session.findUnique({
      where: { 
        token: token 
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            planTier: true
          }
        },
        superAdmin: {
          select: {
            id: true,
            email: true,
            name: true,
            planTier: true
          }
        }
      }
    });

    if (!dbSession) {
      return res.status(401).json({
        success: false,
        message: 'Session not found',
        step: 'session_not_found'
      });
    }

    // Check if session is valid
    if (!dbSession.isValid || new Date(dbSession.expiresAt) < new Date()) {
      return res.status(401).json({
        success: false,
        message: 'Session expired or invalid',
        step: 'session_expired'
      });
    }

    // Determine if session belongs to super admin or regular user
    const isSuperAdmin = !!dbSession.superAdmin;
    const userData = isSuperAdmin ? dbSession.superAdmin : dbSession.user;

    if (!userData) {
      return res.status(401).json({
        success: false,
        message: 'User data not found in session',
        step: 'user_data_missing'
      });
    }

    // Step 3: Found in DB - rehydrate Redis
    const redisSessionData = {
      sessionId: dbSession.id,
      userId: isSuperAdmin ? null : userData.id,
      superAdminId: isSuperAdmin ? userData.id : null,
      email: userData.email,
      role: isSuperAdmin ? 'super-admin' : userData.role,
      planTier: userData.planTier || (isSuperAdmin ? 'enterprise' : 'free'),
      name: userData.name,
      isSuperAdmin: isSuperAdmin,
      createdAt: dbSession.createdAt.toISOString()
    };

    // Rehydrate Redis with 15 minutes TTL
    await SessionCache.set(dbSession.id, redisSessionData, 900);

    // Attach user to request
    req.user = {
      id: userData.id,
      email: userData.email,
      role: isSuperAdmin ? 'super-admin' : userData.role,
      planTier: userData.planTier || (isSuperAdmin ? 'enterprise' : 'free'),
      name: userData.name,
      sessionId: dbSession.id,
      isSuperAdmin: isSuperAdmin
    };
    req.authMethod = 'database_rehydrated';
    req.sessionId = dbSession.id;

    // Update online status for super admin
    if (isSuperAdmin && userData.id) {
      try {
        const { getClientIp } = require('../utils/ip-helper');
        const clientIp = getClientIp(req);
        
        await prisma.superAdmin.update({
          where: { id: userData.id },
          data: { 
            status: 'online',
            currentIp: clientIp
          }
        });
      } catch (error) {
        // Don't fail the request if status update fails
        console.error('Failed to update super admin status:', error);
      }
    }

    return next();

  } catch (error) {
    // Check if it's a token expiration error
    if (error.name === 'TokenExpiredError' || error.message?.includes('jwt expired')) {
      console.log('🔑 Token Expired');
    } else {
      console.error('Authentication error:', error);
    }
    return res.status(500).json({
      success: false,
      message: 'Authentication error occurred',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Optional authentication - doesn't fail if no token
 */
const optionalRedisAuth = async (req, res, next) => {
  try {
    await authenticateRedis(req, res, next);
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = {
  authenticateRedis,
  optionalRedisAuth
};

