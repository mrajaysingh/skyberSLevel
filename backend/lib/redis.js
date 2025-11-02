const { createClient } = require('redis');
require('dotenv').config();

// Redis Client Singleton
let redisClient = null;

/**
 * Initialize Redis connection
 */
const initializeRedis = async () => {
  if (redisClient && redisClient.isOpen) {
    return redisClient;
  }

  try {
    const redisUrl = process.env.REDIS_URL;
    
    if (!redisUrl) {
      throw new Error('REDIS_URL is not set in environment variables');
    }

    redisClient = createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.error('Redis: Max reconnection attempts reached');
            return new Error('Redis: Max reconnection attempts reached');
          }
          return Math.min(retries * 100, 3000);
        }
      }
    });

    // Error handling
    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('🔄 Redis: Connecting...');
    });

    redisClient.on('ready', () => {
      console.log('✅ Redis: Connected and ready');
    });

    redisClient.on('end', () => {
      console.log('🔌 Redis: Connection closed');
    });

    // Connect to Redis
    await redisClient.connect();

    return redisClient;
  } catch (error) {
    console.error('❌ Redis connection error:', error.message);
    throw error;
  }
};

/**
 * Get Redis client instance
 */
const getRedisClient = async () => {
  if (!redisClient || !redisClient.isOpen) {
    await initializeRedis();
  }
  return redisClient;
};

/**
 * Close Redis connection
 */
const closeRedis = async () => {
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit();
    redisClient = null;
    console.log('✅ Redis: Connection closed gracefully');
  }
};

/**
 * Session helper functions
 */
const SessionCache = {
  /**
   * Store session in Redis with TTL (default 15 minutes)
   */
  async set(sessionId, sessionData, ttlSeconds = 900) {
    try {
      const client = await getRedisClient();
      const key = `sess:${sessionId}`;
      await client.setEx(key, ttlSeconds, JSON.stringify(sessionData));
      return true;
    } catch (error) {
      console.error('Redis set error:', error.message);
      return false; // Don't throw, fallback to DB
    }
  },

  /**
   * Get session from Redis
   */
  async get(sessionId) {
    try {
      const client = await getRedisClient();
      const key = `sess:${sessionId}`;
      const data = await client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis get error:', error.message);
      return null; // Fallback to DB
    }
  },

  /**
   * Delete session from Redis
   */
  async del(sessionId) {
    try {
      const client = await getRedisClient();
      const key = `sess:${sessionId}`;
      await client.del(key);
      return true;
    } catch (error) {
      console.error('Redis delete error:', error.message);
      return false;
    }
  },

  /**
   * Refresh TTL for session
   */
  async refresh(sessionId, ttlSeconds = 900) {
    try {
      const client = await getRedisClient();
      const key = `sess:${sessionId}`;
      await client.expire(key, ttlSeconds);
      return true;
    } catch (error) {
      console.error('Redis refresh error:', error.message);
      return false;
    }
  }
};

module.exports = {
  initializeRedis,
  getRedisClient,
  closeRedis,
  SessionCache
};

