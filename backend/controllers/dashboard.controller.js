// Dashboard Controller

const getUserDashboard = async (req, res) => {
  try {
    const { userId } = req.params;

    // TODO: Fetch actual user data from database
    // For now, return placeholder data
    res.status(200).json({
      success: true,
      data: {
        userId: userId,
        dashboard: {
          welcomeMessage: 'Welcome to your dashboard',
          stats: {
            totalProjects: 0,
            activeTasks: 0,
            completedTasks: 0
          }
        }
      }
    });
  } catch (error) {
    console.error('Get user dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching dashboard data'
    });
  }
};

const getSuperAdminDashboard = async (req, res) => {
  try {
    const { prisma } = require('../config/database');
    const { getRedisClient } = require('../lib/redis');

    // Get dashboard stats
    const [totalUsers, totalSessions, activeSessions] = await Promise.all([
      prisma.user.count().catch(() => 0),
      prisma.session.count().catch(() => 0),
      prisma.session.count({
        where: {
          isValid: true,
          expiresAt: {
            gt: new Date()
          }
        }
      }).catch(() => 0)
    ]);

    // Get super admin info from Prisma
    let superAdminInfo = null;
    if (req.user?.isSuperAdmin && req.user?.id) {
      superAdminInfo = await prisma.superAdmin.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          banner: true,
          // Profile fields
          firstName: true,
          middleName: true,
          lastName: true,
          designation: true,
          company: true,
          username: true,
          socialFacebook: true,
          socialLinkedIn: true,
          socialInstagram: true,
          // OAuth/plan/status
          googleId: true,
          githubId: true,
          planTier: true,
          isActive: true,
          currentIp: true,
          lastIp: true,
          status: true,
          createdAt: true,
          lastLogin: true
        }
      }).catch(() => null);
    }

    // Get current request IP (normalized)
    let currentRequestIp = 'unknown';
    let displayIp = 'Unknown';
    try {
      const { getClientIp, formatIpForDisplay } = require('../utils/ip-helper');
      currentRequestIp = getClientIp(req);
      displayIp = formatIpForDisplay(currentRequestIp);
    } catch (ipError) {
      console.error('IP helper error:', ipError);
      // Fallback IP extraction
      currentRequestIp = req.ip || 
                        req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
                        req.headers['x-real-ip'] || 
                        req.connection?.remoteAddress || 
                        'unknown';
      displayIp = currentRequestIp === '::1' ? 'Localhost (127.0.0.1)' : currentRequestIp;
    }

    // Check database status (Prisma)
    let dbStatus = 'down';
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = 'active';
    } catch (error) {
      dbStatus = 'down';
    }

    // Check Redis status
    let redisStatus = 'down';
    try {
      const redisClient = await getRedisClient();
      if (redisClient && redisClient.isOpen) {
        await redisClient.ping();
        redisStatus = 'active';
      }
    } catch (error) {
      redisStatus = 'down';
    }

    // Resolve current session from database (if available)
    let currentSession = null;
    try {
      if (req.sessionId) {
        currentSession = await prisma.session.findUnique({
          where: { id: req.sessionId },
          select: { id: true, isValid: true, expiresAt: true }
        });
      }
    } catch (_) {
      currentSession = null;
    }

    res.status(200).json({
      success: true,
      message: 'Super admin dashboard data retrieved successfully',
      data: {
        dashboard: {
          stats: {
            totalUsers: totalUsers,
            totalProjects: 0, // TODO: Add projects count when projects table exists
            activeSessions: activeSessions,
            totalSessions: totalSessions
          },
          systemInfo: {
            systemHealth: dbStatus === 'active' && redisStatus === 'active' ? 'healthy' : 'degraded',
            version: '1.0.0',
            database: {
              status: dbStatus,
              type: 'PostgreSQL (Prisma)'
            },
            redis: {
              status: redisStatus,
              type: 'Redis Cache'
            },
            session: {
              id: currentSession?.id || req.sessionId || null,
              isValid: currentSession?.isValid ?? null,
              expiresAt: currentSession?.expiresAt ?? null
            }
          },
          user: superAdminInfo ? {
            ...superAdminInfo,
            currentRequestIp: currentRequestIp,
            displayIp: displayIp
          } : {
            id: req.user?.id,
            email: req.user?.email,
            name: req.user?.name,
            planTier: req.user?.planTier || 'enterprise',
            isActive: true,
            status: 'online',
            currentIp: currentRequestIp,
            displayIp: displayIp
          }
        }
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    // TODO: Fetch actual statistics from database
    // For now, return placeholder stats
    res.status(200).json({
      success: true,
      data: {
        stats: {
          users: {
            total: 0,
            active: 0,
            new: 0
          },
          projects: {
            total: 0,
            active: 0,
            completed: 0
          },
          system: {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            timestamp: new Date().toISOString()
          }
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching statistics'
    });
  }
};

module.exports = {
  getUserDashboard,
  getSuperAdminDashboard,
  getDashboardStats
};

