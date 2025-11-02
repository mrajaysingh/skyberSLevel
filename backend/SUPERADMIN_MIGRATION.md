# SuperAdmin Table Migration Guide

## Overview

Super admin accounts have been moved from the `users` table to a dedicated `super_admins` table for better security and organization.

## Database Schema Changes

### New Table: `super_admins`

```prisma
model SuperAdmin {
  id            String    @id @default(uuid())
  userId        String    @unique // Reference to User table
  email         String    @unique // Email for quick lookup
  name          String?
  permissions   String[]  @default([]) // Array of permission strings
  accessLevel   String    @default("full") // full, limited
  isActive      Boolean   @default(true)
  notes         String?   // Admin notes
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  lastLogin     DateTime?
  user          User      @relation(fields: [userId], references: [id])
  sessions      Session[]
}
```

### Updated Tables

1. **User Table**: 
   - Removed `role: 'super-admin'` option
   - Added `superAdmin` relation (one-to-one)
   - Roles are now: `user`, `admin`

2. **Session Table**:
   - Added `superAdminId` field (optional)
   - Added relation to `SuperAdmin` model

## Migration Steps

### 1. Database Schema Updated
✅ Schema has been pushed to database
```bash
npx prisma db push
```

### 2. Create New Super Admin
Run the create script to create a super admin (it handles existing users):
```bash
node scripts/create-superadmin.js
```

The script will:
- Check if user exists
- If exists and is already super admin → update password option
- If exists but not super admin → convert to super admin
- If doesn't exist → create user + super admin entry

### 3. Migrate Existing Super Admins (If Any)

If you have existing users with `role: 'super-admin'`, you'll need to migrate them:

```javascript
// Migration script (run once)
const { prisma } = require('./config/database');

async function migrateSuperAdmins() {
  // Find all users with super-admin role
  const superAdminUsers = await prisma.user.findMany({
    where: { role: 'super-admin' }
  });

  for (const user of superAdminUsers) {
    // Check if super admin entry already exists
    const existing = await prisma.superAdmin.findUnique({
      where: { userId: user.id }
    });

    if (!existing) {
      // Create super admin entry
      await prisma.superAdmin.create({
        data: {
          userId: user.id,
          email: user.email,
          name: user.name,
          permissions: ['*'],
          accessLevel: 'full',
          isActive: true
        }
      });

      // Update user role to admin
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'admin' }
      });

      console.log(`✅ Migrated ${user.email} to super admin table`);
    }
  }
}

migrateSuperAdmins();
```

## Code Changes

### Authentication Controller (`auth.controller.js`)

1. **Login Function**:
   - Now checks `user.superAdmin` relation
   - Sets `role: 'super-admin'` if super admin exists and is active
   - Includes `superAdminId` in JWT token
   - Updates both user and super admin `lastLogin`

2. **Check User Role**:
   - Checks `super_admins` table first
   - Falls back to `users` table for regular users

### Session Management

- Sessions now include `superAdminId` if user is super admin
- Redis cache includes `isSuperAdmin: true` flag

## Benefits

1. **Separation of Concerns**: Super admin logic is isolated
2. **Additional Fields**: Permissions, access levels, notes
3. **Better Security**: Super admin accounts can be deactivated independently
4. **Scalability**: Easier to manage super admin-specific features
5. **Audit Trail**: Separate timestamps for super admin actions

## API Changes

### Login Response

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@skyber.dev",
      "name": "Ajayt Singh",
      "role": "super-admin",
      "planTier": "enterprise",
      "isSuperAdmin": true
    }
  }
}
```

### Check Role Endpoint

```json
{
  "success": true,
  "data": {
    "role": "super-admin",
    "exists": true,
    "isSuperAdmin": true
  }
}
```

## Testing

1. **Create Super Admin**:
   ```bash
   node scripts/create-superadmin.js
   ```

2. **Test Login**:
   - Use super admin email: `admin@skyber.dev`
   - Should return `role: "super-admin"` and `isSuperAdmin: true`

3. **Test Role Check**:
   ```bash
   GET /api/auth/check-role/admin@skyber.dev
   ```
   Should return `isSuperAdmin: true`

## Next Steps

- [ ] Run migration script for existing super admins (if any)
- [ ] Update any queries that check for `role: 'super-admin'`
- [ ] Test login flow with new super admin
- [ ] Verify dashboard access works correctly

