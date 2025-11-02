# Authentication System - Complete Flow Guide

This document explains how the authentication system works during login, how protected routes are secured, and what dashboard paths are available.

## 🔐 Authentication System Overview

The backend supports **two authentication methods**:
1. **Passport.js** - JWT tokens with Passport strategies
2. **Auth.js Compatible** - JWT tokens compatible with NextAuth/Auth.js frontend

Both methods can work together, and the system automatically tries both when authenticating protected routes.

---

## 📋 Login Flow

### **Option 1: Unified Login (Recommended)**
**Endpoint:** `POST /api/auth/login`

**Flow:**
```
1. Frontend sends login request
   POST /api/auth/login
   Body: { email: "demo@skyber.com", password: "password" }

2. Server validates input
   ✓ Checks if email and password are provided

3. Server authenticates user
   ✓ Looks up user in database (currently placeholder)
   ✓ Compares password hash with bcrypt
   ✓ Validates credentials

4. Server generates tokens
   ✓ Passport.js JWT token (for Passport routes)
   ✓ Auth.js compatible token (for Auth.js routes)
   ✓ User information

5. Server responds with tokens
   Response: {
     success: true,
     data: {
       token: "eyJhbGciOiJIUzI1NiIs...",        // Passport JWT
       authjsToken: "eyJhbGciOiJIUzI1NiIs...",  // Auth.js JWT
       user: { id: "1", email: "...", role: "..." }
     }
   }

6. Frontend stores token
   ✓ Saves token in localStorage/sessionStorage
   ✓ Includes token in Authorization header for future requests
```

**Example Request:**
```javascript
// Frontend JavaScript
const response = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'demo@skyber.com',
    password: 'password'
  })
});

const data = await response.json();
// Store token: localStorage.setItem('authToken', data.data.token);
```

---

### **Option 2: Passport.js Login**
**Endpoint:** `POST /api/auth/passport/login`

**Flow:**
```
1. Frontend sends credentials
   POST /api/auth/passport/login
   Body: { email: "...", password: "..." }

2. Passport Local Strategy validates
   ✓ authenticateLocal middleware checks credentials
   ✓ Uses passport-local strategy

3. Passport attaches user to req.user
   ✓ User object is set in req.user

4. Controller generates JWT
   ✓ Creates JWT token with user data
   ✓ Returns token and user info
```

---

### **Option 3: Auth.js Login**
**Endpoint:** `POST /api/auth/authjs/login`

**Flow:**
```
1. Frontend sends credentials
   POST /api/auth/authjs/login
   Body: { email: "...", password: "..." }

2. Server authenticates
   ✓ Validates credentials

3. Server generates Auth.js token
   ✓ Creates Auth.js compatible JWT
   ✓ Returns session object
```

---

## 🛡️ Protected Routes - How They Work

### **Middleware Protection**

Protected routes use the `authenticateToken` middleware which:
1. **Tries Passport JWT first**
2. **Falls back to Auth.js if Passport fails**
3. **Attaches user to req.user if successful**

### **Protected Route Flow**

```
┌─────────────────────────────────────────────────────────┐
│ 1. Request arrives at protected route                   │
│    GET /api/dashboard/super-admin                        │
│    Headers: Authorization: Bearer <token>                 │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│ 2. authenticateToken middleware intercepts              │
│    - Extracts token from Authorization header            │
│    - Tries to verify as Passport JWT first              │
└───────────────────────┬─────────────────────────────────┘
                        │
            ┌───────────┴───────────┐
            │                       │
            ▼                       ▼
   ✓ Valid Passport JWT      ✗ Invalid/No Token
            │                       │
            │                       ▼
            │            ┌──────────────────────┐
            │            │ Try Auth.js token     │
            │            │ Verify authjsToken    │
            │            └──────────┬─────────────┘
            │                       │
            │              ┌────────┴────────┐
            │              │                │
            ▼              ▼                ▼
    ┌──────────────────────────────────────────┐
    │ 3. User attached to req.user            │
    │    req.user = {                         │
    │      id: "1",                           │
    │      email: "demo@skyber.com",          │
    │      role: "super-admin"                 │
    │    }                                    │
    └──────────────────┬─────────────────────┘
                       │
                       ▼
    ┌──────────────────────────────────────────┐
    │ 4. Request proceeds to controller        │
    │    - Controller has access to req.user    │
    │    - Can check req.user.role             │
    │    - Returns dashboard data               │
    └──────────────────────────────────────────┘
```

### **Code Example: Protected Route**

```javascript
// routes/dashboard.routes.js
router.get('/super-admin', authenticateToken, dashboardController.getSuperAdminDashboard);
//                          ^^^^^^^^^^^^^^^^^^
//                          This middleware protects the route

// middleware/auth.middleware.js
const authenticateToken = async (req, res, next) => {
  // 1. Extract token from header
  const token = req.headers.authorization?.split(' ')[1];
  
  // 2. Try Passport JWT
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role
    };
    return next(); // ✅ Continue to controller
  } catch (error) {
    // 3. Try Auth.js if Passport fails
    // ... (Auth.js verification)
  }
};

// controllers/dashboard.controller.js
const getSuperAdminDashboard = async (req, res) => {
  // req.user is available here! ✅
  console.log(req.user); // { id: "1", email: "...", role: "..." }
  
  // You can check user role
  if (req.user.role !== 'super-admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  
  // Return dashboard data
  res.json({ success: true, data: {...} });
};
```

### **What Happens if No Token?**

If a request to a protected route has no token or invalid token:

```javascript
// Response
{
  success: false,
  message: "Authentication required"
}
Status: 401 Unauthorized
```

---

## 📍 Dashboard Paths

### **Backend API Dashboard Routes**

All dashboard routes are **protected** and require authentication:

#### **1. Super Admin Dashboard**
```
GET /api/dashboard/super-admin
Headers: Authorization: Bearer <token>
```

**Description:** Returns super admin dashboard data

**Example Request:**
```javascript
fetch('http://localhost:3001/api/dashboard/super-admin', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

**Response:**
```json
{
  "success": true,
  "data": {
    "dashboard": {
      "title": "Super Admin Dashboard",
      "welcomeMessage": "Welcome to the Super Admin Dashboard",
      "stats": {
        "totalUsers": 0,
        "totalProjects": 0,
        "activeSessions": 0,
        "systemHealth": "healthy"
      },
      "systemInfo": {
        "version": "1.0.0",
        "uptime": 12345.67
      }
    }
  }
}
```

#### **2. User Dashboard**
```
GET /api/dashboard/user/:userId
Headers: Authorization: Bearer <token>
```

**Example:**
```javascript
GET /api/dashboard/user/123
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "123",
    "dashboard": {
      "welcomeMessage": "Welcome to your dashboard",
      "stats": {
        "totalProjects": 0,
        "activeTasks": 0,
        "completedTasks": 0
      }
    }
  }
}
```

#### **3. Dashboard Statistics**
```
GET /api/dashboard/stats
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "users": {
        "total": 0,
        "active": 0,
        "new": 0
      },
      "projects": {
        "total": 0,
        "active": 0,
        "completed": 0
      },
      "system": {
        "uptime": 12345.67,
        "memory": {...},
        "timestamp": "2025-11-02T..."
      }
    }
  }
}
```

---

### **Frontend Dashboard Paths**

#### **Super Admin Dashboard (Next.js)**
```
Route: /auth/dashboards/user/super-admin
File: newsite/app/auth/dashboards/user/super-admin/page.tsx
```

**Description:** Frontend dashboard page protected by `<SkyberSecutity>` component

**Protection:** Uses `SkyberSecutity` component which checks `localStorage.getItem("skyber_authenticated")`

**Flow:**
```
1. User navigates to /auth/dashboards/user/super-admin
2. SkyberSecutity component checks authentication
3. If not authenticated → Redirects to /access-required
4. If authenticated → Renders dashboard
5. Dashboard makes API call to /api/dashboard/super-admin
6. Backend verifies token in Authorization header
7. Returns dashboard data
```

---

## 🔄 Complete Authentication Flow Diagram

```
┌──────────────┐
│   FRONTEND   │
│  (Next.js)   │
└──────┬───────┘
       │
       │ 1. User clicks "Login"
       │    Email: demo@skyber.com
       │    Password: password
       ▼
┌─────────────────────────────────────┐
│ POST /api/auth/login                │
│ Body: { email, password }          │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ auth.controller.login()              │
│ - Validates input                   │
│ - Checks credentials                │
│ - Generates JWT tokens              │
└──────┬──────────────────────────────┘
       │
       │ 2. Returns tokens
       │    { token, authjsToken, user }
       ▼
┌─────────────────────────────────────┐
│ Frontend stores token                │
│ localStorage.setItem('token', ...)   │
└──────┬──────────────────────────────┘
       │
       │ 3. User navigates to dashboard
       │    /auth/dashboards/user/super-admin
       ▼
┌─────────────────────────────────────┐
│ SkyberSecutity component checks     │
│ localStorage.getItem('skyber_...')  │
└──────┬──────────────────────────────┘
       │
       │ ✓ Authenticated
       ▼
┌─────────────────────────────────────┐
│ Dashboard renders                   │
│ Makes API call with token            │
│ GET /api/dashboard/super-admin       │
│ Headers: Authorization: Bearer <token>│
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ authenticateToken middleware        │
│ - Extracts token                    │
│ - Verifies JWT                      │
│ - Attaches user to req.user         │
└──────┬──────────────────────────────┘
       │
       │ ✓ Token valid
       ▼
┌─────────────────────────────────────┐
│ dashboardController.getSuperAdmin... │
│ - Uses req.user                      │
│ - Returns dashboard data             │
└──────┬──────────────────────────────┘
       │
       │ 4. Returns dashboard data
       ▼
┌─────────────────────────────────────┐
│ Frontend displays dashboard          │
│ ✅ User sees protected content        │
└─────────────────────────────────────┘
```

---

## 🔑 Token Storage & Usage

### **Frontend Token Storage**

```javascript
// After login
const loginResponse = await fetch('/api/auth/login', {...});
const { token } = await loginResponse.json();

// Store token
localStorage.setItem('authToken', token);
// OR
sessionStorage.setItem('authToken', token);
```

### **Using Token in Requests**

```javascript
// Get token
const token = localStorage.getItem('authToken');

// Make authenticated request
fetch('http://localhost:3001/api/dashboard/super-admin', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

---

## 🚨 Error Handling

### **No Token Provided**
```json
{
  "success": false,
  "message": "Authentication required"
}
Status: 401
```

### **Invalid Token**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
Status: 401
```

### **Insufficient Permissions**
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
Status: 403
```

---

## 🛠️ Testing Authentication

### **1. Test Login**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@skyber.com","password":"password"}'
```

### **2. Test Protected Route (with token)**
```bash
# Replace <token> with actual token from login response
curl -X GET http://localhost:3001/api/dashboard/super-admin \
  -H "Authorization: Bearer <token>"
```

### **3. Test Protected Route (without token)**
```bash
curl -X GET http://localhost:3001/api/dashboard/super-admin
# Should return 401 Unauthorized
```

---

## 📝 Summary

1. **Login:** User sends credentials → Server validates → Returns JWT tokens
2. **Protected Routes:** Middleware verifies token → Attaches user to request → Controller accesses `req.user`
3. **Dashboard Paths:**
   - Backend: `/api/dashboard/*` (all protected)
   - Frontend: `/auth/dashboards/user/super-admin` (protected by `SkyberSecutity`)

All protected routes require a valid JWT token in the `Authorization: Bearer <token>` header.

