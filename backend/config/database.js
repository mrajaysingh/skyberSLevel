// Database Configuration with Prisma
const prisma = require('../lib/prisma');

/**
 * Connect to database using Prisma
 */
const connectDB = async () => {
  try {
    // Test the connection
    await prisma.$connect();
    console.log('✅ Prisma database connected successfully');
    
    // Test query to ensure database is accessible
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection verified');
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error?.message || error);
    throw error;
  }
};

/**
 * Disconnect from database
 */
const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    console.log('👋 Prisma disconnected');
  } catch (error) {
    console.error('⚠️  Error during Prisma disconnect:', error?.message || error);
    throw error;
  }
};

module.exports = {
  prisma,
  connectDB,
  disconnectDB
};

