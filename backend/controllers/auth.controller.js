// Enterprise Authentication Controller
// Redis-first authentication with DB fallback

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { prisma } = require('../config/database');
const { SessionCache } = require('../lib/redis');
const { generateAuthjsToken, formatUserForAuthjs } = require('../config/authjs.config');

/**
 * Enterprise Login Flow:
 * 1. Validate credentials from DB via Prisma
 * 2. Generate session + refresh tokens
 * 3. Write session to DB
 * 4. Mirror session into Redis with TTL (fast lookup)
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Step 1: Check super_admins table first (standalone table)
    let superAdmin = await prisma.superAdmin.findUnique({
      where: { email: email.toLowerCase() }
    });

    let user = null;
    let isSuperAdmin = false;
    let actualUser = null;
    let actualRole = 'user';

    if (superAdmin && superAdmin.isActive) {
      // Super admin login
      isSuperAdmin = true;
      actualUser = superAdmin;
      actualRole = 'super-admin';

      // Verify password
      const isValidPassword = await bcrypt.compare(password, superAdmin.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }
    } else {
      // Regular user login - check users table
      user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      actualUser = user;
      actualRole = user.role;
    }

    // Step 2: Generate session + refresh tokens
    const sessionId = uuidv4();
    const refreshTokenId = uuidv4();
    
    // Session token (15 minutes)
    const sessionToken = jwt.sign(
      {
        sessionId: sessionId,
        userId: isSuperAdmin ? null : actualUser.id,
        superAdminId: isSuperAdmin ? actualUser.id : null,
        email: actualUser.email,
        role: actualRole,
        planTier: actualUser.planTier || (isSuperAdmin ? 'enterprise' : 'free'),
        type: 'session'
      },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key',
      { expiresIn: '15m' }
    );

    // Refresh token (7 days)
    const refreshToken = jwt.sign(
      {
        refreshId: refreshTokenId,
        userId: isSuperAdmin ? null : actualUser.id,
        superAdminId: isSuperAdmin ? actualUser.id : null,
        type: 'refresh'
      },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key',
      { expiresIn: '7d' }
    );

    // Token expiration times
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Step 3: Write session to DB
    const session = await prisma.session.create({
      data: {
        id: sessionId,
        userId: isSuperAdmin ? null : actualUser.id,
        superAdminId: isSuperAdmin ? actualUser.id : null,
        token: sessionToken,
        refreshToken: refreshToken,
        expiresAt: expiresAt,
        refreshExpiresAt: refreshExpiresAt,
        userAgent: req.headers['user-agent'] || null,
        ipAddress: req.ip || req.connection.remoteAddress || null,
        isValid: true
      }
    });

    // Step 4: Mirror session into Redis with TTL (15 minutes = 900 seconds)
    const sessionData = {
      sessionId: sessionId,
      userId: isSuperAdmin ? null : actualUser.id,
      superAdminId: isSuperAdmin ? actualUser.id : null,
      email: actualUser.email,
      role: actualRole,
      planTier: actualUser.planTier || (isSuperAdmin ? 'enterprise' : 'free'),
      name: actualUser.name,
      isSuperAdmin: isSuperAdmin,
      createdAt: new Date().toISOString()
    };

    // Store in Redis (15 minutes TTL)
    await SessionCache.set(sessionId, sessionData, 900);

    // Get client IP address (normalized)
    const { getClientIp } = require('../utils/ip-helper');
    const clientIp = getClientIp(req);

    // Update last login and IP tracking
    if (isSuperAdmin) {
      // Get current IP to store as last IP
      const currentSuperAdmin = await prisma.superAdmin.findUnique({
        where: { id: actualUser.id },
        select: { currentIp: true }
      });

      await prisma.superAdmin.update({
        where: { id: actualUser.id },
        data: { 
          lastLogin: new Date(),
          lastIp: currentSuperAdmin?.currentIp || null, // Move current IP to last IP
          currentIp: clientIp, // Set new current IP
          status: 'online' // Set status to online
        }
      });
    } else {
      await prisma.user.update({
        where: { id: actualUser.id },
        data: { lastLogin: new Date() }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        sessionToken: sessionToken,
        refreshToken: refreshToken,
        expiresAt: expiresAt.toISOString(),
        user: {
          id: actualUser.id,
          email: actualUser.email,
          name: actualUser.name,
          role: actualRole,
          planTier: actualUser.planTier || (isSuperAdmin ? 'enterprise' : 'free'),
          isSuperAdmin: isSuperAdmin
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Enterprise Logout Flow:
 * 1. Invalidate session in DB
 * 2. Delete session from Redis
 * 3. Log the logout event
 */
const logout = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token required'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token to get session ID
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key');
    } catch (jwtError) {
      // Token already invalid, but still try to clean up
      return res.status(200).json({
        success: true,
        message: 'Logout successful (token was already invalid)'
      });
    }

    const sessionId = decoded.sessionId || decoded.sub;

    // Step 1: Invalidate session in DB
    if (sessionId) {
      const session = await prisma.session.findUnique({
        where: { id: sessionId },
        include: { superAdmin: true }
      });

      await prisma.session.updateMany({
        where: { 
          id: sessionId,
          isValid: true
        },
        data: { 
          isValid: false,
          updatedAt: new Date()
        }
      });

      // Update super admin status to offline
      if (session?.superAdmin) {
        await prisma.superAdmin.update({
          where: { id: session.superAdmin.id },
          data: { status: 'offline' }
        });
      }

      // Step 2: Delete session from Redis
      await SessionCache.del(sessionId);
    }

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during logout'
    });
  }
};

/**
 * Enterprise Registration Flow:
 * 1. Check if user already exists
 * 2. Hash password
 * 3. Create user in database
 * 4. Generate session tokens (same as login)
 * 5. Store session in DB and Redis
 */
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and name are required'
      });
    }

    // Step 1: Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Step 2: Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 3: Create user in database
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name,
        role: 'user',
        planTier: 'free',
        provider: 'local'
      }
    });

    // Step 4 & 5: Generate session tokens and store (same as login)
    const sessionId = uuidv4();
    const refreshTokenId = uuidv4();
    
    // Session token (15 minutes)
    const sessionToken = jwt.sign(
      {
        sessionId: sessionId,
        userId: user.id,
        email: user.email,
        role: user.role,
        planTier: user.planTier || 'free',
        type: 'session'
      },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key',
      { expiresIn: '15m' }
    );

    // Refresh token (7 days)
    const refreshToken = jwt.sign(
      {
        refreshId: refreshTokenId,
        userId: user.id,
        type: 'refresh'
      },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key',
      { expiresIn: '7d' }
    );

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Create session in DB
    await prisma.session.create({
      data: {
        id: sessionId,
        userId: user.id,
        token: sessionToken,
        refreshToken: refreshToken,
        expiresAt: expiresAt,
        refreshExpiresAt: refreshExpiresAt,
        userAgent: req.headers['user-agent'] || null,
        ipAddress: req.ip || req.connection.remoteAddress || null,
        isValid: true
      }
    });

    // Mirror session into Redis
    const sessionData = {
      sessionId: sessionId,
      userId: user.id,
      email: user.email,
      role: user.role,
      planTier: user.planTier || 'free',
      name: user.name,
      createdAt: new Date().toISOString()
    };

    await SessionCache.set(sessionId, sessionData, 900);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        sessionToken: sessionToken,
        refreshToken: refreshToken,
        expiresAt: expiresAt.toISOString(),
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          planTier: user.planTier || 'free'
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle unique constraint violations
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Try Passport JWT verification first
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-super-secret-jwt-key'
      );

      return res.status(200).json({
        success: true,
        message: 'Token is valid',
        data: {
          user: {
            id: decoded.sub || decoded.id,
            email: decoded.email,
            role: decoded.role
          }
        }
      });
    } catch (jwtError) {
      // Try Auth.js token verification
      const { verifyAuthjsToken } = require('../config/authjs.config');
      const result = verifyAuthjsToken(token);

      if (result.valid) {
        return res.status(200).json({
          success: true,
          message: 'Token is valid',
          data: {
            user: result.user
          }
        });
      }

      throw jwtError; // Re-throw to trigger error handler
    }
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Passport login handler (called after authenticateLocal middleware)
const passportLogin = async (req, res) => {
  try {
    const user = req.user;
    
    // Generate JWT token
    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token: token,
        user: formatUserForAuthjs(user)
      }
    });
  } catch (error) {
    console.error('Passport login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login'
    });
  }
};

// OAuth callback handler
const oauthCallback = async (req, res) => {
  try {
    const user = req.user;
    
    // Generate JWT token
    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key',
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?token=${token}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_failed`);
  }
};

// Auth.js login handler - Step 1 of 2-step authentication
const authjsLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // TODO: Replace with actual database lookup
    // Placeholder authentication
    if (email === 'demo@skyber.com' && password === 'password') {
      const user = {
        id: '1',
        email: email,
        name: email,
        role: 'super-admin'
      };

      // Step 1: Generate Auth.js token (Primary authentication)
      const authjsToken = generateAuthjsToken(user);

      // Step 2: After Auth.js success, generate Passport.js token (Verification)
      const passportToken = jwt.sign(
        { 
          sub: user.id, 
          email: user.email, 
          role: user.role,
          authjsVerified: true,
          iat: Math.floor(Date.now() / 1000)
        },
        process.env.JWT_SECRET || 'your-super-secret-jwt-key',
        { expiresIn: '7d' }
      );

      const session = require('../config/authjs.config').createAuthjsSession(user, authjsToken);

      return res.status(200).json({
        success: true,
        message: 'Auth.js login successful - Two-step authentication initiated',
        data: {
          ...session,
          // Include Passport token for Step 2 verification
          passportToken: passportToken,
          authenticationFlow: {
            step1: 'Auth.js authentication - COMPLETED',
            step2: 'Passport.js verification token - READY'
          }
        }
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
      step: 1,
      error: 'AUTHJS_AUTHENTICATION_FAILED'
    });
  } catch (error) {
    console.error('Auth.js login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login',
      step: 1
    });
  }
};

// Auth.js session handler
const getAuthjsSession = async (req, res) => {
  try {
    const { authenticateAuthjs } = require('../middleware/authjs.middleware');
    
    // Verify Auth.js token
    authenticateAuthjs(req, res, () => {
      res.status(200).json({
        success: true,
        data: {
          user: formatUserForAuthjs(req.user),
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      });
    });
  } catch (error) {
    console.error('Get Auth.js session error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired session'
    });
  }
};

/**
 * Refresh Token Flow:
 * 1. Verify refresh token
 * 2. Check if refresh token exists in DB
 * 3. Generate new session token
 * 4. Update session in DB
 * 5. Refresh Redis cache
 */
const refreshToken = async (req, res) => {
  try {
    const { refreshToken: refreshTokenValue } = req.body;

    if (!refreshTokenValue) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Step 1: Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshTokenValue, process.env.JWT_SECRET || 'your-super-secret-jwt-key');
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token type'
      });
    }

    // Step 2: Check if refresh token exists in DB
    const dbSession = await prisma.session.findFirst({
      where: {
        refreshToken: refreshTokenValue,
        isValid: true,
        refreshExpiresAt: {
          gt: new Date()
        }
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
        message: 'Refresh token not found or expired'
      });
    }

    // Determine if session belongs to super admin or regular user
    const isSuperAdmin = !!dbSession.superAdmin;
    const userData = isSuperAdmin ? dbSession.superAdmin : dbSession.user;

    // Step 3: Generate new session token
    const newSessionToken = jwt.sign(
      {
        sessionId: dbSession.id,
        userId: isSuperAdmin ? null : userData.id,
        superAdminId: isSuperAdmin ? userData.id : null,
        email: userData.email,
        role: isSuperAdmin ? 'super-admin' : userData.role,
        planTier: userData.planTier || (isSuperAdmin ? 'enterprise' : 'free'),
        type: 'session'
      },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key',
      { expiresIn: '15m' }
    );

    const newExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Step 4: Update session in DB
    await prisma.session.update({
      where: { id: dbSession.id },
      data: {
        token: newSessionToken,
        expiresAt: newExpiresAt,
        updatedAt: new Date()
      }
    });

    // Step 5: Refresh Redis cache
    const sessionData = {
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

    await SessionCache.set(dbSession.id, sessionData, 900);

    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        sessionToken: newSessionToken,
        refreshToken: refreshTokenValue, // Same refresh token
        expiresAt: newExpiresAt.toISOString()
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during token refresh',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Check User Role by Email
 * Public endpoint to check if an email belongs to a super-admin
 * Used by frontend to auto-set role dropdown
 */
const checkUserRole = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if email exists in SuperAdmin table first
    const superAdmin = await prisma.superAdmin.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        isActive: true
      }
    });

    if (superAdmin && superAdmin.isActive) {
      return res.status(200).json({
        success: true,
        data: {
          role: 'super-admin',
          exists: true,
          isSuperAdmin: true
        }
      });
    }

    // Fallback: Check user table for regular users/admins
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        role: true,
        email: true
      }
    });

    if (!user) {
      return res.status(200).json({
        success: true,
        data: {
          role: null,
          exists: false,
          isSuperAdmin: false
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        role: user.role,
        exists: true,
        isSuperAdmin: false
      }
    });
  } catch (error) {
    console.error('Check user role error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while checking user role'
    });
  }
};

module.exports = {
  login,
  logout,
  register,
  refreshToken,
  verifyToken,
  checkUserRole,
  passportLogin,
  oauthCallback,
  authjsLogin,
  getAuthjsSession
};

