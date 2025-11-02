require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Initialize Prisma Database
const { connectDB, disconnectDB } = require('./config/database');

// Initialize Redis
const { initializeRedis, closeRedis } = require('./lib/redis');

// Initialize Passport
const passport = require('./config/passport.config');

const app = express();
const PORT = process.env.PORT || 3001;

// Import routes
const authRoutes = require('./routes/auth.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

// Trust proxy to get real IP (important for production)
// Trust only the first proxy (more secure than trusting all)
app.set('trust proxy', 1);

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(compression()); // Compress responses
app.use(morgan('dev')); // Logging
app.use(cookieParser()); // Parse cookies
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Session configuration for Passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-super-secret-session-key-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    sameSite: 'lax'
  },
  // MongoDB session store (uncomment when MongoDB is configured)
  // store: MongoStore.create({
  //   mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/skyber'
  // })
}));

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Rate limiting with proper trust proxy handling
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Custom key generator that respects trust proxy
  keyGenerator: (req) => {
    // Use the real IP from the request (already handled by trust proxy)
    return req.ip || req.connection?.remoteAddress || 'unknown';
  },
  // Skip successful requests for better accuracy
  skipSuccessfulRequests: false,
  // Skip failed requests (like 401, 404) to avoid penalizing legitimate errors
  skipFailedRequests: false,
});
app.use('/api/', limiter);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'SKYBER Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server with database and Redis connections
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Connect to Redis
    try {
      await initializeRedis();
    } catch (redisError) {
      console.warn('⚠️  Redis connection failed - continuing without Redis cache');
      console.warn('   Authentication will use DB only');
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 SKYBER Backend Server running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`💾 Database: Prisma with PostgreSQL`);
      console.log(`⚡ Redis: ${process.env.REDIS_URL ? 'Connected' : 'Not configured'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await disconnectDB();
  await closeRedis();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await disconnectDB();
  await closeRedis();
  process.exit(0);
});

// Start the server
startServer();

module.exports = app;

