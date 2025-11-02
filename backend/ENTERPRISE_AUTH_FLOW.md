# Enterprise Secure Authentication Flow

## Overview

This enterprise authentication system uses **Redis-first caching** with **PostgreSQL persistence** for maximum performance and security.

## Architecture

```
┌─────────────┐
│   Frontend  │
└──────┬──────┘
       │
       │ POST /api/auth/login
       ▼
┌──────────────────────────────────────────────┐
│  Login Request                               │
│  1. Validate credentials from DB (Prisma)    │
│  2. Generate session + refresh tokens        │
│  3. Write session to DB                      │
│  4. Mirror session into Redis (TTL: 15min)   │
└──────────────────────────────────────────────┘
       │
       │ Returns: sessionToken, refreshToken
       ▼
┌─────────────┐
│   Client    │ Stores tokens
└──────┬──────┘
       │
       │ GET /api/dashboard/* + Authorization header
       ▼
┌──────────────────────────────────────────────┐
│  Protected API Request                       │
│  1. Check Redis first (fast - ~1ms)          │
│     ✓ Found → Use it, refresh TTL            │
│     ✗ Not found → Continue to step 2         │
│                                              │
│  2. Fallback to DB (slower - ~10-50ms)       │
│     ✓ Found → Rehydrate Redis, use it       │
│     ✗ Not found → 401 Unauthorized           │
└──────────────────────────────────────────────┘
```

## Login Flow

### Request
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Process

1. **Validate Credentials (DB)**
   ```javascript
   const user = await prisma.user.findUnique({
     where: { email: email.toLowerCase() }
   });
   const isValid = await bcrypt.compare(password, user.password);
   ```

2. **Generate Tokens**
   - **Session Token**: JWT, expires in 15 minutes
   - **Refresh Token**: JWT, expires in 7 days

3. **Store in Database**
   ```javascript
   await prisma.session.create({
     data: {
       id: sessionId,
       userId: user.id,
       token: sessionToken,
       refreshToken: refreshToken,
       expiresAt: expiresAt,
       userAgent: req.headers['user-agent'],
       ipAddress: req.ip,
       isValid: true
     }
   });
   ```

4. **Mirror to Redis**
   ```javascript
   Redis.set(`sess:${sessionId}`, {
     sessionId,
     userId: user.id,
     email: user.email,
     role: user.role,
     planTier: user.planTier || 'free',
     name: user.name
   }, EX=900); // 15 minutes TTL
   ```

### Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "sessionToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci...",
    "expiresAt": "2025-11-02T10:15:00.000Z",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "planTier": "free"
    }
  }
}
```

## Protected Route Flow

### Request
```http
GET /api/dashboard/super-admin
Authorization: Bearer <sessionToken>
```

### Middleware Process

```javascript
// Step 1: Check Redis (FAST - ~1ms)
const sessionData = await Redis.get(`sess:${sessionId}`);

if (sessionData) {
  // ✅ Found in Redis
  req.user = sessionData;
  req.authMethod = 'redis';
  // Refresh TTL
  await Redis.expire(`sess:${sessionId}`, 900);
  return next(); // Continue to controller
}

// Step 2: Fallback to DB (SLOWER - ~10-50ms)
const dbSession = await prisma.session.findUnique({
  where: { token: sessionToken },
  include: { user: true }
});

if (dbSession && dbSession.isValid) {
  // ✅ Found in DB
  // Rehydrate Redis
  await Redis.set(`sess:${sessionId}`, sessionData, 900);
  req.user = dbSession.user;
  req.authMethod = 'database_rehydrated';
  return next();
}

// Step 3: Not found anywhere
return res.status(401).json({
  success: false,
  message: 'Session not found'
});
```

## Redis Cache Structure

### Key Format
```
sess:{sessionId}
```

### Value Structure
```json
{
  "sessionId": "uuid",
  "userId": "uuid",
  "email": "user@example.com",
  "role": "user",
  "planTier": "free",
  "name": "John Doe",
  "createdAt": "2025-11-02T09:00:00.000Z"
}
```

### TTL
- **Default**: 900 seconds (15 minutes)
- **Auto-refresh**: Extended on each access
- **Expiry**: Automatically removed after TTL

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login with Redis + DB
- `POST /api/auth/logout` - Invalidate Redis + DB
- `POST /api/auth/register` - Register user + create session
- `POST /api/auth/refresh` - Refresh session token
- `GET /api/auth/verify` - Verify token validity

### Protected Routes (Redis-First Auth)

- `GET /api/dashboard/user/:userId` - User dashboard
- `GET /api/dashboard/super-admin` - Super admin dashboard
- `GET /api/dashboard/stats` - Dashboard statistics

## Performance Benefits

### Redis Cache (Fast Path)
- **Lookup time**: ~1-5ms
- **Throughput**: 100,000+ requests/second
- **Network**: In-memory, no disk I/O

### Database Fallback (Slow Path)
- **Lookup time**: ~10-50ms
- **Throughput**: Limited by DB connection pool
- **Network**: Disk I/O + network latency

### Cache Hit Ratio
- **Typical**: 80-95% of requests hit Redis
- **Fallback**: 5-20% fall back to DB
- **Rehydration**: Automatic when Redis miss + DB hit

## Security Features

1. **Password Hashing**: bcrypt with salt rounds
2. **JWT Tokens**: Signed with secret key
3. **Session Validation**: DB as source of truth
4. **Token Expiration**: 15min session, 7day refresh
5. **Redis TTL**: Automatic expiry prevents stale sessions
6. **DB Persistence**: All sessions stored in PostgreSQL
7. **Logout**: Invalidates both Redis and DB

## Error Handling

### Redis Failure
- **Graceful degradation**: Falls back to DB only
- **No service interruption**: System continues working
- **Automatic recovery**: Reconnects on next request

### Database Failure
- **Error response**: 500 Internal Server Error
- **Logging**: Full error details logged
- **No data loss**: Redis can serve recent sessions (until TTL)

## Logout Flow

```javascript
// 1. Invalidate session in DB
await prisma.session.update({
  where: { id: sessionId },
  data: { isValid: false }
});

// 2. Delete from Redis
await Redis.del(`sess:${sessionId}`);

// Response: Success
```

## Refresh Token Flow

```javascript
// 1. Verify refresh token
// 2. Check DB for valid refresh token
// 3. Generate new session token
// 4. Update DB session
// 5. Refresh Redis cache
```

## Next Steps (Future)

1. **Subscription/Plan Check**
   - DB stores subscription state
   - Redis caches plan tier for fast gating
   - Webhook invalidates Redis on billing changes

2. **Session Management**
   - View active sessions
   - Revoke specific sessions
   - Device management

3. **Rate Limiting**
   - Per-user rate limiting in Redis
   - IP-based throttling
   - Adaptive limits based on plan tier

## Troubleshooting

### Redis Connection Failed
- Check `REDIS_URL` in `.env`
- Verify Redis server is running
- Check network connectivity
- System continues with DB-only authentication

### Database Connection Failed
- Check `DATABASE_URL` in `.env`
- Verify PostgreSQL is accessible
- Check credentials
- System returns 500 error for affected requests

### Performance Issues
- Monitor Redis hit rate
- Check Redis memory usage
- Verify TTL is working
- Check DB query performance

