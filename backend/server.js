require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
// Session modules removed (no longer using Passport sessions)


// Initialize Prisma Database
const { connectDB, disconnectDB } = require('./config/database');

// Initialize Redis
const { initializeRedis, closeRedis } = require('./lib/redis');

// Passport removed

const app = express();
const PORT = process.env.PORT || 3001;

// Import routes
const authRoutes = require('./routes/auth.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const profileRoutes = require('./routes/profile.routes');
const siteConfigRoutes = require('./routes/site-config.routes');
const smtpRoutes = require('./routes/smtp.routes');
const emailRoutes = require('./routes/email.routes');

// Import email scheduler
const { processScheduledEmails } = require('./controllers/email.controller');

// Logger removed

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
app.use(cookieParser()); // Parse cookies
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies (allow image data URLs)
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies

// Passport session middleware removed

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

// Request logging removed

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
app.use('/api/profile', profileRoutes);
app.use('/api/cards', require('./routes/cards.routes'));
app.use('/api/site-config', siteConfigRoutes);
app.use('/api/smtp', smtpRoutes);
app.use('/api/email', emailRoutes);
// Logs route removed

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  
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
    
    // Start server - bind to all interfaces (0.0.0.0) to accept connections
    app.listen(PORT, '0.0.0.0', () => {
      console.log('🚀 SKYBER Backend API is running');
      console.log(`👉 Listening on http://0.0.0.0:${PORT} (accessible via http://localhost:${PORT})`);
      console.log(`🌐 CORS origin: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
      
      // Start email scheduler - runs every minute to process scheduled emails
      console.log('📧 Email scheduler started (checking every minute)');
      processScheduledEmails(); // Run immediately on startup
      setInterval(() => {
        processScheduledEmails();
      }, 60 * 1000); // Run every 60 seconds (1 minute)
    });
  } catch (error) {
    console.error('❌ Server failed to start:', error?.message || error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await disconnectDB();
  await closeRedis();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDB();
  await closeRedis();
  process.exit(0);
});

// Start the server
startServer();

module.exports = app;

