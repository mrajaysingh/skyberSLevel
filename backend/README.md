# SKYBER Backend API

Express.js backend server for SKYBER application with **Passport.js** and **Auth.js** authentication.

## Features

- ✅ Express.js RESTful API
- ✅ **Passport.js Authentication** with multiple strategies:
  - JWT (JSON Web Token)
  - Local (Email/Password)
  - Google OAuth 2.0
  - GitHub OAuth
- ✅ **Auth.js Compatible API** - JWT tokens compatible with Auth.js/NextAuth frontend integration
- ✅ CORS enabled for frontend integration
- ✅ Security middleware (Helmet)
- ✅ Request logging (Morgan)
- ✅ Rate limiting
- ✅ Compression middleware
- ✅ Session management
- ✅ Cookie parsing
- ✅ Error handling

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
AUTHJS_SECRET=your-authjs-secret-key-min-32-chars
SESSION_SECRET=your-session-secret-min-32-chars

# OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## Running the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:3001` (or your configured PORT).

## Authentication Systems

### Passport.js

Passport.js provides flexible authentication strategies:

#### Local Authentication (Email/Password)
```javascript
POST /api/auth/passport/login
Body: { email: "user@example.com", password: "password" }
```

#### JWT Authentication
JWT tokens are generated on login and can be used for protected routes:
```javascript
Authorization: Bearer <jwt-token>
```

#### Google OAuth
```javascript
GET /api/auth/passport/google
# Redirects to Google for authentication
# Callback: /api/auth/passport/google/callback
```

#### GitHub OAuth
```javascript
GET /api/auth/passport/github
# Redirects to GitHub for authentication
# Callback: /api/auth/passport/github/callback
```

### Auth.js (NextAuth Compatible)

Auth.js provides NextAuth-compatible endpoints:

```javascript
POST /api/auth/authjs/login
Body: { email: "user@example.com", password: "password" }

GET /api/auth/authjs/session
Headers: Authorization: Bearer <authjs-token>
```

## API Endpoints

### Health Check
- `GET /health` - Server health check

### Authentication (Unified)
- `POST /api/auth/login` - Login (supports both Passport and Auth.js)
- `POST /api/auth/logout` - Logout
- `POST /api/auth/register` - User registration
- `GET /api/auth/verify` - Verify authentication token

### Passport.js Routes
- `POST /api/auth/passport/login` - Passport local login
- `GET /api/auth/passport/google` - Google OAuth initiation
- `GET /api/auth/passport/google/callback` - Google OAuth callback
- `GET /api/auth/passport/github` - GitHub OAuth initiation
- `GET /api/auth/passport/github/callback` - GitHub OAuth callback

### Auth.js Routes
- `POST /api/auth/authjs/login` - Auth.js login
- `GET /api/auth/authjs/session` - Get Auth.js session

### Dashboard (Protected)
- `GET /api/dashboard/user/:userId` - Get user dashboard
- `GET /api/dashboard/super-admin` - Get super admin dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Project Structure

```
backend/
├── config/
│   ├── passport.config.js        # Passport.js strategies
│   ├── authjs.config.js          # Auth.js configuration
│   └── database.js                # Database configuration
├── controllers/
│   ├── auth.controller.js         # Authentication logic
│   └── dashboard.controller.js   # Dashboard logic
├── middleware/
│   ├── auth.middleware.js         # Unified authentication
│   ├── passport.middleware.js    # Passport middleware
│   └── authjs.middleware.js      # Auth.js middleware
├── routes/
│   ├── auth.routes.js             # Authentication routes
│   └── dashboard.routes.js       # Dashboard routes
├── .env.example                  # Environment variables example
├── .gitignore                     # Git ignore file
├── package.json                  # Dependencies and scripts
├── README.md                     # This file
└── server.js                     # Main server file
```

## Authentication Flow

### Passport.js Flow

1. **Local Login:**
   ```
   POST /api/auth/passport/login
   → Passport validates credentials
   → Returns JWT token
   → Use token: Authorization: Bearer <token>
   ```

2. **OAuth Flow:**
   ```
   GET /api/auth/passport/google
   → Redirects to provider
   → Provider authenticates
   → Callback receives user
   → Returns JWT token
   ```

### Auth.js Flow

1. **Login:**
   ```
   POST /api/auth/authjs/login
   → Validates credentials
   → Returns Auth.js token
   → Use token: Authorization: Bearer <token>
   ```

2. **Session:**
   ```
   GET /api/auth/authjs/session
   → Validates Auth.js token
   → Returns session data
   ```

## Middleware Usage

### Universal Authentication (Tries Both Methods)
```javascript
const { authenticateToken } = require('./middleware/auth.middleware');
router.get('/protected', authenticateToken, controller.handler);
```

### Passport JWT Only
```javascript
const { authenticatePassportJWT } = require('./middleware/auth.middleware');
router.get('/protected', authenticatePassportJWT, controller.handler);
```

### Auth.js Only
```javascript
const { authenticateAuthjsOnly } = require('./middleware/auth.middleware');
router.get('/protected', authenticateAuthjsOnly, controller.handler);
```

### Role-Based Authorization
```javascript
const { authorize } = require('./middleware/auth.middleware');
router.get('/admin', authenticateToken, authorize('admin', 'super-admin'), controller.handler);
```

## Next Steps

### 1. Database Integration
- Uncomment and configure database connection in `config/database.js`
- Update controllers to use database instead of placeholder data
- Implement proper data models/schemas

### 2. Password Hashing
- Password hashing with bcrypt is already set up
- Update controllers to hash passwords before storing

### 3. Input Validation
- Install `express-validator` or `joi` package
- Add validation middleware to routes
- Validate all user inputs

### 4. Error Handling
- Create custom error classes
- Implement comprehensive error handling
- Add error logging

### 5. Testing
- Install testing framework (`jest` or `mocha`)
- Write unit tests for controllers
- Write integration tests for routes

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment mode | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `AUTHJS_SECRET` | Auth.js secret key | Required |
| `SESSION_SECRET` | Session secret key | Required |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Optional |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Optional |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | Optional |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | Optional |

## Security Notes

⚠️ **Important**: Before deploying to production:

1. ✅ Change all secrets in `.env` (use strong, random strings)
2. ✅ Implement database connections
3. ✅ Enable HTTPS
4. ✅ Review and update CORS settings
5. ✅ Implement rate limiting per user
6. ✅ Add request validation and sanitization
7. ✅ Set up proper error logging
8. ✅ Configure session store (MongoDB session store ready)

## OAuth Setup

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3001/api/auth/passport/google/callback`
6. Copy Client ID and Client Secret to `.env`

### GitHub OAuth Setup

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:3001/api/auth/passport/github/callback`
4. Copy Client ID and Client Secret to `.env`

## Development

The server uses `nodemon` in development mode for automatic restart on file changes.

## License

ISC
