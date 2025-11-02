# Login & Dashboard Integration Guide

## Overview

The frontend login system is now fully integrated with the backend enterprise authentication API. Super admin users are automatically redirected to the dashboard after successful login.

## Setup

### 1. Environment Variables

Create a `.env.local` file in `newsite/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Or set it to your production backend URL:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### 2. Backend Server

Ensure the backend server is running:

```bash
cd backend
npm run dev
```

The server should be accessible at `http://localhost:3001`

### 3. CORS Configuration

The backend is already configured to accept requests from `http://localhost:3000`. If your Next.js app runs on a different port, update `backend/.env`:

```env
FRONTEND_URL=http://localhost:3000
```

## Authentication Flow

### Login Process

1. **User submits credentials** on `/login`
2. **Frontend calls** `POST /api/auth/login` with email and password
3. **Backend validates** credentials via Prisma (Redis + DB)
4. **Backend returns** session token, refresh token, and user data
5. **Frontend stores** tokens in localStorage
6. **Auto-redirect** based on user role:
   - `super-admin` → `/auth/dashboards/user/super-admin`
   - Other roles → Home page

### Protected Routes

- Routes under `/auth/dashboards/*` require authentication
- If not authenticated, redirects to `/login`
- After login, redirects back to intended destination

### Session Management

- **Session Token**: Stored in localStorage (15 min expiry)
- **Refresh Token**: Stored in localStorage (7 days expiry)
- **User Data**: Stored in localStorage
- **Auto-logout**: On token expiry or 401 response

## Super Admin Credentials

**Email:** `admin@skyber.dev`  
**Password:** `Ajays8268#`

## Testing

### 1. Start Backend

```bash
cd backend
npm run dev
```

### 2. Start Frontend

```bash
cd newsite
npm run dev
```

### 3. Test Login

1. Navigate to `http://localhost:3000/login`
2. Enter super admin credentials
3. Click "Sign in as Client" (role selector doesn't affect backend login)
4. Should auto-redirect to `/auth/dashboards/user/super-admin`

### 4. Test Protected Route

1. Logout or clear localStorage
2. Navigate directly to `/auth/dashboards/user/super-admin`
3. Should redirect to `/login`
4. After login, should redirect back to dashboard

## API Endpoints Used

### Login
- **Endpoint:** `POST /api/auth/login`
- **Body:** `{ email: string, password: string }`
- **Response:** `{ success: boolean, data: { sessionToken, refreshToken, user } }`

### Logout
- **Endpoint:** `POST /api/auth/logout`
- **Headers:** `Authorization: Bearer <sessionToken>`
- **Response:** `{ success: boolean, message: string }`

### Dashboard Data
- **Endpoint:** `GET /api/dashboard/super-admin`
- **Headers:** `Authorization: Bearer <sessionToken>`
- **Response:** `{ success: boolean, data: { dashboard: {...} } }`

## Files Modified

### Frontend (`newsite/`)

1. **`components/security/page-security.tsx`**
   - Updated `login()` to call backend API
   - Added user state management
   - Auto-redirect logic for super-admin

2. **`app/login/page.tsx`**
   - Integrated with backend API
   - Error handling for login failures

3. **`app/auth/dashboards/user/super-admin/page.tsx`**
   - Enhanced dashboard with user info
   - Fetches data from backend API
   - Displays user details and stats

4. **`components/security/skybersecutity.tsx`**
   - Updated to check `sessionToken` instead of simple flag

### Backend (`backend/`)

- Already configured with Redis-first authentication
- CORS enabled for frontend origin
- Dashboard routes protected with `authenticateRedis` middleware

## Troubleshooting

### Login fails with "Network error"
- Check if backend server is running
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for CORS errors

### 401 Unauthorized
- Session token expired (refresh or re-login)
- Invalid token (clear localStorage and login again)

### CORS Error
- Update `FRONTEND_URL` in `backend/.env`
- Restart backend server

### Redirect not working
- Check browser console for errors
- Verify `router.push()` is being called
- Check localStorage for stored tokens

## Next Steps

1. Implement refresh token logic for auto-renewal
2. Add token refresh before expiry
3. Add loading states and error boundaries
4. Implement remember me functionality
5. Add password reset flow

