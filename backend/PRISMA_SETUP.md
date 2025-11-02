# Prisma Setup Guide

## Overview

This project uses **Prisma** with **PostgreSQL** and **Prisma Accelerate** for database management.

## Setup Steps

### 1. Create `.env` File

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### 2. Add Database URL

Update your `.env` file with your DATABASE_URL:

```env
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=your-api-key-here"
```

Replace `your-api-key-here` with your actual Prisma Accelerate API key.

### 3. Generate Prisma Client

After setting up `.env`, generate the Prisma Client:

```bash
npm run prisma:generate
```

Or:

```bash
npx prisma generate
```

### 4. Push Schema to Database

Push your schema to the database (for development):

```bash
npm run prisma:push
```

Or:

```bash
npx prisma db push
```

For production, use migrations:

```bash
npm run prisma:migrate
```

### 5. Open Prisma Studio (Optional)

View and edit your database with Prisma Studio:

```bash
npm run prisma:studio
```

## Database Schema

### Models

#### User Model
- `id` - UUID (Primary Key)
- `email` - String (Unique)
- `password` - String (Hashed)
- `name` - String (Optional)
- `role` - String (Default: "user")
- `avatar` - String (Optional)
- `googleId` - String (Optional, Unique)
- `githubId` - String (Optional, Unique)
- `provider` - String (Optional: local, google, github)
- `createdAt` - DateTime
- `updatedAt` - DateTime
- `lastLogin` - DateTime (Optional)

#### Session Model
- `id` - UUID (Primary Key)
- `userId` - String (Foreign Key to User)
- `token` - String (Unique)
- `refreshToken` - String (Optional, Unique)
- `expiresAt` - DateTime
- `userAgent` - String (Optional)
- `ipAddress` - String (Optional)
- `isValid` - Boolean (Default: true)
- `createdAt` - DateTime
- `updatedAt` - DateTime

## Using Prisma Client

### Import Prisma

```javascript
const { prisma } = require('./config/database');
// OR
const prisma = require('../lib/prisma');
```

### Example Queries

#### Create User
```javascript
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    password: hashedPassword,
    name: 'John Doe',
    role: 'user'
  }
});
```

#### Find User
```javascript
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' }
});
```

#### Update User
```javascript
const user = await prisma.user.update({
  where: { id: userId },
  data: {
    lastLogin: new Date()
  }
});
```

#### Create Session
```javascript
const session = await prisma.session.create({
  data: {
    userId: user.id,
    token: jwtToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    userAgent: req.headers['user-agent'],
    ipAddress: req.ip
  }
});
```

## Prisma Accelerate

Prisma Accelerate provides:
- ✅ Connection pooling
- ✅ Global caching
- ✅ Serverless-friendly
- ✅ Managed PostgreSQL database

The Prisma Client is automatically extended with Accelerate:

```javascript
const { PrismaClient } = require('@prisma/client');
const { withAccelerate } = require('@prisma/extension-accelerate');

const prisma = new PrismaClient().$extends(withAccelerate());
```

## Scripts

- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run migrations (dev)
- `npm run prisma:push` - Push schema changes
- `npm run prisma:studio` - Open Prisma Studio

## Troubleshooting

### Error: Missing DATABASE_URL
- Ensure `.env` file exists with `DATABASE_URL` set
- Check that the URL format is correct

### Error: Cannot connect to database
- Verify your Prisma Accelerate API key is correct
- Check network connectivity
- Ensure the database service is running

### Error: Schema is out of sync
- Run `npm run prisma:push` to sync schema
- Or create a migration with `npm run prisma:migrate`

