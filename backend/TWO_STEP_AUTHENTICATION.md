# Two-Step Authentication System

## Overview

This authentication system implements a **2-step verification process**:

1. **Step 1: Auth.js Authentication** - Primary authentication layer
2. **Step 2: Passport.js Verification** - Secondary verification layer

Both steps must pass for access to protected routes.

---

## 🔐 Authentication Flow

### **Login Process**

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: User submits credentials                            │
│ POST /api/auth/login                                        │
│ Body: { email: "demo@skyber.com", password: "password" }   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Auth.js Authentication                             │
│ - Validates credentials                                     │
│ - Generates Auth.js JWT token                              │
│ - Sets authjsVerified flag                                 │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Passport.js Verification                            │
│ - Uses Auth.js token validation result                      │
│ - Generates Passport.js JWT token                           │
│ - Links Passport token to Auth.js token                     │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ Response: Both tokens returned                              │
│ {                                                            │
│   authjsToken: "...",    // Step 1 token                    │
│   passportToken: "...",  // Step 2 token                    │
│   user: {...}                                               │
│ }                                                            │
└─────────────────────────────────────────────────────────────┘
```

### **Protected Route Access**

```
┌─────────────────────────────────────────────────────────────┐
│ Request to protected route                                  │
│ GET /api/dashboard/super-admin                               │
│ Headers: Authorization: Bearer <authjsToken>                │
│         X-Passport-Token: Bearer <passportToken>            │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Verify Auth.js Token                                │
│ - Extract authjsToken from header/cookie                    │
│ - Verify JWT signature                                      │
│ - Check expiration                                          │
│ - Extract user information                                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
            ┌───────────┴───────────┐
            │                       │
            ▼                       ▼
    ✓ Auth.js Valid         ✗ Auth.js Invalid
            │                       │
            │                       ▼
            │            ┌──────────────────────┐
            │            │ Return 401           │
            │            │ Step 1 failed        │
            │            └──────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Verify Passport.js Token                            │
│ - Extract passportToken from header/cookie                   │
│ - Verify JWT signature with JWT_SECRET                     │
│ - Check expiration                                          │
│ - Verify user ID matches Auth.js token user                │
└───────────────────────┬─────────────────────────────────────┘
                        │
            ┌───────────┴───────────┐
            │                       │
            ▼                       ▼
    ✓ Passport Valid        ✗ Passport Invalid
            │                       │
            │                       ▼
            │            ┌──────────────────────┐
            │            │ Return 401           │
            │            │ Step 2 failed        │
            │            └──────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│ Both steps passed!                                          │
│ - Attach user to req.user                                   │
│ - Continue to controller                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 API Endpoints

### **Login (2-Step Authentication)**

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "demo@skyber.com",
  "password": "password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful - Two-step authentication completed",
  "data": {
    "authjsToken": "eyJhbGciOiJIUzI1NiIs...",     // Step 1 token
    "passportToken": "eyJhbGciOiJIUzI1NiIs...", // Step 2 token
    "token": "eyJhbGciOiJIUzI1NiIs...",         // Legacy (same as passportToken)
    "user": {
      "id": "1",
      "email": "demo@skyber.com",
      "name": "demo@skyber.com",
      "role": "super-admin"
    },
    "authenticationFlow": {
      "step1": "Auth.js authentication - COMPLETED",
      "step2": "Passport.js verification - COMPLETED"
    }
  }
}
```

### **Protected Routes**

All dashboard routes require **both tokens**:

**Option 1: Both tokens in Authorization header (same token)**
```http
GET /api/dashboard/super-admin
Authorization: Bearer <authjsToken>
X-Passport-Token: Bearer <passportToken>
```

**Option 2: Tokens in cookies**
```http
GET /api/dashboard/super-admin
Cookie: authjs.session-token=<authjsToken>; passportToken=<passportToken>
```

**Option 3: Auth.js in header, Passport in cookie**
```http
GET /api/dashboard/super-admin
Authorization: Bearer <authjsToken>
Cookie: passportToken=<passportToken>
```

---

## 🔧 Implementation Details

### **Login Controller**

The login controller implements 2-step authentication:

```javascript
// Step 1: Auth.js authentication
const authjsToken = generateAuthjsToken(user);

// Step 2: Passport.js verification (after Auth.js success)
const passportToken = jwt.sign({
  sub: user.id,
  email: user.email,
  role: user.role,
  authjsVerified: true  // Flag indicating Auth.js passed
}, JWT_SECRET, { expiresIn: '7d' });
```

### **Two-Step Middleware**

The `twoStepAuthenticate` middleware:

1. **Extracts Auth.js token** from header or cookie
2. **Verifies Auth.js token** and extracts user
3. **Extracts Passport token** from header or cookie
4. **Verifies Passport token** with JWT_SECRET
5. **Validates user ID match** between both tokens
6. **Attaches user to req.user** if both pass

### **Error Responses**

**Step 1 Failed (Auth.js):**
```json
{
  "success": false,
  "message": "Step 1 failed: Auth.js token required",
  "step": 1,
  "error": "AUTHJS_TOKEN_MISSING"
}
```

**Step 2 Failed (Passport.js):**
```json
{
  "success": false,
  "message": "Step 2 failed: Passport.js token required",
  "step": 2,
  "error": "PASSPORT_TOKEN_MISSING"
}
```

**User Mismatch:**
```json
{
  "success": false,
  "message": "Step 2 failed: Token user mismatch",
  "step": 2,
  "error": "TOKEN_USER_MISMATCH",
  "details": "Auth.js and Passport.js tokens belong to different users"
}
```

---

## 💻 Frontend Integration

### **Step 1: Login and Store Tokens**

```javascript
// Login
const response = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'demo@skyber.com',
    password: 'password'
  })
});

const data = await response.json();

// Store both tokens
localStorage.setItem('authjsToken', data.data.authjsToken);
localStorage.setItem('passportToken', data.data.passportToken);
```

### **Step 2: Access Protected Routes**

```javascript
// Get tokens
const authjsToken = localStorage.getItem('authjsToken');
const passportToken = localStorage.getItem('passportToken');

// Make authenticated request
const response = await fetch('http://localhost:3001/api/dashboard/super-admin', {
  headers: {
    'Authorization': `Bearer ${authjsToken}`,
    'X-Passport-Token': `Bearer ${passportToken}`,
    'Content-Type': 'application/json'
  }
});

if (response.status === 401) {
  const error = await response.json();
  if (error.step === 1) {
    console.error('Auth.js authentication failed');
  } else if (error.step === 2) {
    console.error('Passport.js verification failed');
  }
}
```

### **Alternative: Using Cookies**

If tokens are stored in cookies:

```javascript
// Login with credentials: true
const response = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  credentials: 'include',  // Important!
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

// Protected routes will automatically read cookies
const dashboardResponse = await fetch('http://localhost:3001/api/dashboard/super-admin', {
  credentials: 'include'  // Important!
});
```

---

## 🧪 Testing

### **Test Login**

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@skyber.com","password":"password"}'
```

**Save tokens from response:**
```bash
# Example response contains:
# authjsToken: "eyJhbGci..."
# passportToken: "eyJhbGci..."
```

### **Test Protected Route (Both Tokens)**

```bash
curl -X GET http://localhost:3001/api/dashboard/super-admin \
  -H "Authorization: Bearer <authjsToken>" \
  -H "X-Passport-Token: Bearer <passportToken>"
```

### **Test Missing Auth.js Token**

```bash
curl -X GET http://localhost:3001/api/dashboard/super-admin \
  -H "X-Passport-Token: Bearer <passportToken>"
# Should return: Step 1 failed
```

### **Test Missing Passport Token**

```bash
curl -X GET http://localhost:3001/api/dashboard/super-admin \
  -H "Authorization: Bearer <authjsToken>"
# Should return: Step 2 failed
```

---

## 🔒 Security Benefits

1. **Double Verification**: Both tokens must be valid
2. **User Matching**: Both tokens must belong to same user
3. **Independent Validation**: Each step validates independently
4. **Token Separation**: Auth.js and Passport.js tokens are separate
5. **Enhanced Security**: If one token is compromised, attacker still needs the other

---

## 📝 Summary

- **Login**: Returns both `authjsToken` and `passportToken`
- **Protected Routes**: Require both tokens in headers or cookies
- **Step 1**: Auth.js token verification
- **Step 2**: Passport.js token verification + user ID matching
- **Both must pass**: Route access only granted if both steps succeed

This 2-step system provides enhanced security through dual token verification.

