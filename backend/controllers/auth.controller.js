// Enterprise Authentication Controller
// Redis-first authentication with DB fallback

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
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
    console.log(`🔐 Login attempt: email=${email || 'N/A'} ip=${req.ip || req.connection?.remoteAddress || 'unknown'}`);

    // Validate input
    if (!email || !password) {
      console.warn('⛔ Login failed: missing email or password');
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
        console.warn(`❌ Login failed (super-admin): email=${email}`);
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
        console.warn(`❌ Login failed (user not found): email=${email}`);
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        console.warn(`❌ Login failed (invalid password): email=${email}`);
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
    console.log(`✅ Session created in DB: sessionId=${sessionId} role=${actualRole}`);

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
    console.log(`⚡ Session cached in Redis: sessionId=${sessionId} ttl=900s`);

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

    console.log(`✅ Login successful: email=${actualUser.email} role=${actualRole} sessionId=${sessionId}`);
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
    console.error('💥 Login error:', error);
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
      console.warn('↪️ Logout: no token provided');
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
      console.warn('↪️ Logout: token already invalid');
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
      console.log(`🚪 Session invalidated in DB: sessionId=${sessionId}`);

      // Update super admin status to offline
      if (session?.superAdmin) {
        await prisma.superAdmin.update({
          where: { id: session.superAdmin.id },
          data: { status: 'offline' }
        });
      }

      // Step 2: Delete session from Redis
      await SessionCache.del(sessionId);
      console.log(`🗑️ Session removed from Redis: sessionId=${sessionId}`);
    }

    console.log('✅ Logout successful');
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('💥 Logout error:', error);
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
    console.log(`📝 Registration attempt: email=${email || 'N/A'}`);

    // Validate input
    if (!email || !password || !name) {
      console.warn('⛔ Registration failed: missing fields');
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
      console.warn(`⛔ Registration failed: user exists email=${email}`);
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
    console.log(`✅ User created: id=${user.id} email=${user.email}`);

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
    console.log(`✅ Registration session created for userId=${user.id}`);

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
    console.log(`⚡ Registration session cached in Redis: sessionId=${sessionId}`);

    console.log(`🎉 Registration successful: email=${user.email} userId=${user.id}`);
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
    console.error('💥 Registration error:', error);
    
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

    // Verify token using JWT first
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
      // Fallback to Auth.js token verification
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
    // Check if it's a token expiration error
    if (error.name === 'TokenExpiredError' || error.message?.includes('jwt expired')) {
      console.log('🔑 Token Expired');
    } else {
      console.error('Token verification error:', error);
    }
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Passport handlers removed

// Auth.js login handler
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

      // Generate Auth.js token
      const authjsToken = generateAuthjsToken(user);

      const session = require('../config/authjs.config').createAuthjsSession(user, authjsToken);

      return res.status(200).json({
        success: true,
        message: 'Auth.js login successful',
        data: {
          ...session
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

// ----- OAuth without Passport: GitHub -----
const oauthGithubStart = async (req, res) => {
  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    // Use BACKEND_URL if set, otherwise construct from request (for development)
    const redirectBase = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
    const redirectUri = `${redirectBase}/api/auth/oauth/github/callback`;

    if (!clientId) return res.status(500).send('GitHub OAuth not configured');

    const state = crypto.randomBytes(16).toString('hex');
    // Check if this is a "connect" flow from dashboard (has sessionToken in query or Authorization header)
    const isConnectFlow = req.query.connect === 'true' || req.headers.authorization;
    const sessionToken = req.query.sessionToken || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);
    
    res.cookie('oauth_github_state', state, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 10 * 60 * 1000,
    });
    
    // Store connect flow and session token info in cookie
    if (isConnectFlow) {
      // Mark that this was initiated as a connect flow from dashboard
      res.cookie('oauth_github_connect', 'true', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 10 * 60 * 1000,
      });
      // Only persist the session token cookie if provided
      if (sessionToken) {
        res.cookie('oauth_github_session_token', sessionToken, {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 10 * 60 * 1000,
        });
      }
    }

    const scope = 'read:user user:email';
    const url = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${encodeURIComponent(state)}`;
    return res.redirect(url);
  } catch (e) {
    return res.status(500).send('Failed to start GitHub OAuth');
  }
};

const oauthGithubCallback = async (req, res) => {
  try {
    const code = req.query.code;
    const state = req.query.state;
    const savedState = req.cookies?.oauth_github_state;
    const isConnectFlow = req.cookies?.oauth_github_connect === 'true';
    const sessionToken = req.cookies?.oauth_github_session_token;
    
    res.clearCookie('oauth_github_state');
    res.clearCookie('oauth_github_connect');
    res.clearCookie('oauth_github_session_token');

    if (!code || !state || !savedState || state !== savedState) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=github_oauth_state`);
    }

    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=github_oauth_config`);
    }

    // Exchange code for access token
    const tokenResp = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const tokenJson = await tokenResp.json();
    const accessToken = tokenJson.access_token;
    if (!accessToken) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=github_oauth_token`);
    }

    // Fetch user profile
    const profileResp = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}`, 'User-Agent': 'skyber-app' },
    });
    const profile = await profileResp.json();

    // Fetch emails to get primary email if needed
    let email = null;
    try {
      const emailResp = await fetch('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${accessToken}`, 'User-Agent': 'skyber-app' },
      });
      const emails = await emailResp.json();
      const primary = Array.isArray(emails) ? emails.find((e) => e.primary && e.verified) || emails.find((e) => e.verified) : null;
      email = primary?.email || profile?.email || null;
    } catch (_) {
      email = profile?.email || null;
    }

    // If connecting from dashboard, update the authenticated account directly (no email dependency)
    if (isConnectFlow) {
      // Require a session token to associate provider to the currently authenticated account
      if (!sessionToken) {
        // No token available to identify the current user → send back to profile with a helpful error
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/dashboards/user/super-admin/profile?error=connect_session_missing`);
      }

      // Try primary path: verify JWT session token
      let authUserId = null;
      let authIsSuper = false;
      try {
        const decoded = jwt.verify(sessionToken, process.env.JWT_SECRET || 'your-super-secret-jwt-key');
        authUserId = decoded.superAdminId || decoded.userId;
        authIsSuper = !!decoded.superAdminId;
      } catch (e) {
        // Fallback: look up session directly in DB by token (in case the JWT is expired but session still exists)
        try {
          const dbSession = await prisma.session.findFirst({
            where: { token: sessionToken, isValid: true },
            include: { user: { select: { id: true } }, superAdmin: { select: { id: true } } }
          });
          if (dbSession) {
            authIsSuper = !!dbSession.superAdmin;
            authUserId = authIsSuper ? dbSession.superAdmin?.id : dbSession.user?.id;
          }
        } catch (_) {}
      }

      if (authUserId) {
        if (authIsSuper) {
          await prisma.superAdmin.update({ where: { id: authUserId }, data: { githubId: profile?.id ? String(profile.id) : null, provider: 'github' } });
        } else {
          await prisma.user.update({ where: { id: authUserId }, data: { githubId: profile?.id ? String(profile.id) : null, provider: 'github' } });
        }
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/dashboards/user/super-admin/profile?connected=github`);
      }
      // Could not resolve current user → send back to profile with an error instead of falling through to login flow
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/dashboards/user/super-admin/profile?error=connect_session_invalid`);
    }

    if (!email) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=github_email_required`);
    }

    // Check if account exists - NO NEW ACCOUNT CREATION
    let isSuperAdmin = false;
    let actualUser = null;
    let actualRole = 'user';

    // 1) Prefer matching by connected provider ID (handles email mismatches)
    const providerGithubId = profile?.id ? String(profile.id) : null;
    if (providerGithubId) {
      const superByProvider = await prisma.superAdmin.findFirst({ where: { githubId: providerGithubId, isActive: true } });
      if (superByProvider) {
        isSuperAdmin = true;
        actualUser = superByProvider;
        actualRole = 'super-admin';
      } else {
        const userByProvider = await prisma.user.findFirst({ where: { githubId: providerGithubId } });
        if (userByProvider) {
          actualUser = userByProvider;
          actualRole = userByProvider.role;
        }
      }
    }

    // 2) If not found by provider ID, fall back to email-based check (requires connection)
    if (!actualUser) {
      const existingSuper = email ? await prisma.superAdmin.findUnique({ where: { email: email.toLowerCase() } }) : null;
      if (existingSuper && existingSuper.isActive) {
        // Login flow: Check if GitHub is connected (must have githubId)
        if (!existingSuper.githubId) {
          return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=github_not_connected&message=Please connect your GitHub account from the dashboard first`);
        }
        isSuperAdmin = true;
        actualUser = existingSuper;
        actualRole = 'super-admin';
      } else {
        if (!email) {
          return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=github_email_required`);
        }
        const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
        if (!user) {
          // Account not found - deny access
          return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=account_not_found&message=Account not found. Please connect your GitHub account from the dashboard first`);
        }

        // Login flow: Check if GitHub is connected (must have githubId)
        if (!user.githubId) {
          return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=github_not_connected&message=Please connect your GitHub account from the dashboard first`);
        }
        actualUser = user;
        actualRole = user.role;
      }
    }

    // Create session (same as login flow)
    const sessionId = uuidv4();
    const refreshTokenId = uuidv4();
    const newSessionToken = jwt.sign(
      {
        sessionId,
        userId: isSuperAdmin ? null : actualUser.id,
        superAdminId: isSuperAdmin ? actualUser.id : null,
        email: email.toLowerCase(),
        role: actualRole,
        planTier: actualUser.planTier || (isSuperAdmin ? 'enterprise' : 'free'),
        type: 'session',
      },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key',
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign({ refreshId: refreshTokenId, userId: isSuperAdmin ? null : actualUser.id, superAdminId: isSuperAdmin ? actualUser.id : null, type: 'refresh' }, process.env.JWT_SECRET || 'your-super-secret-jwt-key', { expiresIn: '7d' });
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.session.create({
      data: {
        id: sessionId,
        userId: isSuperAdmin ? null : actualUser.id,
        superAdminId: isSuperAdmin ? actualUser.id : null,
        token: newSessionToken,
        refreshToken,
        expiresAt,
        refreshExpiresAt,
        userAgent: req.headers['user-agent'] || null,
        ipAddress: req.ip || req.connection?.remoteAddress || null,
        isValid: true,
      },
    });
    await SessionCache.set(sessionId, {
      sessionId,
      userId: isSuperAdmin ? null : actualUser.id,
      superAdminId: isSuperAdmin ? actualUser.id : null,
      email: email.toLowerCase(),
      role: actualRole,
      planTier: actualUser.planTier || (isSuperAdmin ? 'enterprise' : 'free'),
      name: actualUser.name,
      isSuperAdmin,
      createdAt: new Date().toISOString(),
    }, 900);

    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?sessionToken=${encodeURIComponent(newSessionToken)}&refreshToken=${encodeURIComponent(refreshToken)}&role=${encodeURIComponent(actualRole)}`;
    return res.redirect(redirectUrl);
  } catch (e) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=github_oauth_failed`);
  }
};

// ----- OAuth without Passport: Google -----
const oauthGoogleStart = async (req, res) => {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    // Use BACKEND_URL if set, otherwise construct from request (for development)
    const redirectBase = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
    const redirectUri = `${redirectBase}/api/auth/oauth/google/callback`;
    if (!clientId) return res.status(500).send('Google OAuth not configured');

    const state = crypto.randomBytes(16).toString('hex');
    // Check if this is a "connect" flow from dashboard (has sessionToken in query or Authorization header)
    const isConnectFlow = req.query.connect === 'true' || req.headers.authorization;
    const sessionToken = req.query.sessionToken || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);
    
    res.cookie('oauth_google_state', state, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 10 * 60 * 1000,
    });
    
    // Store connect flow and session token info in cookie
    if (isConnectFlow) {
      // Mark that this was initiated as a connect flow from dashboard
      res.cookie('oauth_google_connect', 'true', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 10 * 60 * 1000,
      });
      // Only persist the session token cookie if provided
      if (sessionToken) {
        res.cookie('oauth_google_session_token', sessionToken, {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 10 * 60 * 1000,
        });
      }
    }

    const scope = [
      'openid',
      'email',
      'profile',
    ].join(' ');

    const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${encodeURIComponent(state)}&access_type=offline&prompt=consent`;
    return res.redirect(url);
  } catch (e) {
    return res.status(500).send('Failed to start Google OAuth');
  }
};

const oauthGoogleCallback = async (req, res) => {
  try {
    const code = req.query.code;
    const state = req.query.state;
    const savedState = req.cookies?.oauth_google_state;
    const isConnectFlow = req.cookies?.oauth_google_connect === 'true';
    const sessionToken = req.cookies?.oauth_google_session_token;
    
    res.clearCookie('oauth_google_state');
    res.clearCookie('oauth_google_connect');
    res.clearCookie('oauth_google_session_token');
    
    if (!code || !state || !savedState || state !== savedState) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=google_oauth_state`);
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    // Use BACKEND_URL if set, otherwise construct from request (for development)
    const redirectBase = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
    const redirectUri = `${redirectBase}/api/auth/oauth/google/callback`;
    if (!clientId || !clientSecret) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=google_oauth_config`);
    }

    // Exchange code for tokens
    const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: String(code),
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }).toString(),
    });
    const tokenJson = await tokenResp.json();
    const idToken = tokenJson.id_token;
    const accessToken = tokenJson.access_token;
    if (!accessToken) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=google_oauth_token`);
    }

    // Get userinfo
    const userInfoResp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const userInfo = await userInfoResp.json();
    const email = userInfo?.email;

    // Connect flow: update current authenticated account directly
    if (isConnectFlow) {
      // Require a session token to associate provider to the currently authenticated account
      if (!sessionToken) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/dashboards/user/super-admin/profile?error=connect_session_missing`);
      }

      let authUserId = null;
      let authIsSuper = false;
      try {
        const decoded = jwt.verify(sessionToken, process.env.JWT_SECRET || 'your-super-secret-jwt-key');
        authUserId = decoded.superAdminId || decoded.userId;
        authIsSuper = !!decoded.superAdminId;
      } catch (e) {
        // Fallback: look up session directly in DB by token (in case JWT is expired but session still exists)
        try {
          const dbSession = await prisma.session.findFirst({
            where: { token: sessionToken, isValid: true },
            include: { user: { select: { id: true } }, superAdmin: { select: { id: true } } }
          });
          if (dbSession) {
            authIsSuper = !!dbSession.superAdmin;
            authUserId = authIsSuper ? dbSession.superAdmin?.id : dbSession.user?.id;
          }
        } catch (_) {}
      }

      if (authUserId) {
        if (authIsSuper) {
          await prisma.superAdmin.update({ where: { id: authUserId }, data: { googleId: userInfo?.sub ? String(userInfo.sub) : null, provider: 'google' } });
        } else {
          await prisma.user.update({ where: { id: authUserId }, data: { googleId: userInfo?.sub ? String(userInfo.sub) : null, provider: 'google' } });
        }
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/dashboards/user/super-admin/profile?connected=google`);
      }
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/dashboards/user/super-admin/profile?error=connect_session_invalid`);
    }

    if (!email) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=google_email_required`);
    }

    // Check if account exists - NO NEW ACCOUNT CREATION
    let isSuperAdmin = false;
    let actualUser = null;
    let actualRole = 'user';

    // 1) Prefer matching by connected provider ID (handles email mismatches)
    const providerGoogleId = userInfo?.sub ? String(userInfo.sub) : null;
    if (providerGoogleId) {
      const superByProvider = await prisma.superAdmin.findFirst({ where: { googleId: providerGoogleId, isActive: true } });
      if (superByProvider) {
        isSuperAdmin = true;
        actualUser = superByProvider;
        actualRole = 'super-admin';
      } else {
        const userByProvider = await prisma.user.findFirst({ where: { googleId: providerGoogleId } });
        if (userByProvider) {
          actualUser = userByProvider;
          actualRole = userByProvider.role;
        }
      }
    }

    // 2) If not found by provider ID, fall back to email-based check (requires connection)
    if (!actualUser) {
      const existingSuper = email ? await prisma.superAdmin.findUnique({ where: { email: email.toLowerCase() } }) : null;
      if (existingSuper && existingSuper.isActive) {
        // Login flow: Check if Google is connected (must have googleId)
        if (!existingSuper.googleId) {
          return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=google_not_connected&message=Please connect your Google account from the dashboard first`);
        }
        isSuperAdmin = true;
        actualUser = existingSuper;
        actualRole = 'super-admin';
      } else {
        if (!email) {
          return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=google_email_required`);
        }
        const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
        if (!user) {
          // Account not found - deny access
          return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=account_not_found&message=Account not found. Please connect your Google account from the dashboard first`);
        }

        // Login flow: Check if Google is connected (must have googleId)
        if (!user.googleId) {
          return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=google_not_connected&message=Please connect your Google account from the dashboard first`);
        }
        actualUser = user;
        actualRole = user.role;
      }
    }

    // Create session
    const sessionId = uuidv4();
    const refreshTokenId = uuidv4();
    const newSessionToken = jwt.sign(
      {
        sessionId,
        userId: isSuperAdmin ? null : actualUser.id,
        superAdminId: isSuperAdmin ? actualUser.id : null,
        email: email.toLowerCase(),
        role: actualRole,
        planTier: actualUser.planTier || (isSuperAdmin ? 'enterprise' : 'free'),
        type: 'session',
      },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key',
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign({ refreshId: refreshTokenId, userId: isSuperAdmin ? null : actualUser.id, superAdminId: isSuperAdmin ? actualUser.id : null, type: 'refresh' }, process.env.JWT_SECRET || 'your-super-secret-jwt-key', { expiresIn: '7d' });
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.session.create({
      data: {
        id: sessionId,
        userId: isSuperAdmin ? null : actualUser.id,
        superAdminId: isSuperAdmin ? actualUser.id : null,
        token: newSessionToken,
        refreshToken,
        expiresAt,
        refreshExpiresAt,
        userAgent: req.headers['user-agent'] || null,
        ipAddress: req.ip || req.connection?.remoteAddress || null,
        isValid: true,
      },
    });
    await SessionCache.set(sessionId, {
      sessionId,
      userId: isSuperAdmin ? null : actualUser.id,
      superAdminId: isSuperAdmin ? actualUser.id : null,
      email: email.toLowerCase(),
      role: actualRole,
      planTier: actualUser.planTier || (isSuperAdmin ? 'enterprise' : 'free'),
      name: actualUser.name,
      isSuperAdmin,
      createdAt: new Date().toISOString(),
    }, 900);

    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?sessionToken=${encodeURIComponent(newSessionToken)}&refreshToken=${encodeURIComponent(refreshToken)}&role=${encodeURIComponent(actualRole)}`;
    return res.redirect(redirectUrl);
  } catch (e) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=google_oauth_failed`);
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
  authjsLogin,
  getAuthjsSession,
  oauthGithubStart,
  oauthGithubCallback,
  oauthGoogleStart,
  oauthGoogleCallback
};

