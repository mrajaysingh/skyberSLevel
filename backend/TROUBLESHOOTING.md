# Database Connection Troubleshooting

## Issue: "Cannot fetch data from service: fetch failed"

This error occurs when:
1. ✅ Database connection is established (connection successful)
2. ❌ But queries fail (fetch error)

### Common Causes:

1. **Schema not pushed to database** - Most common cause
2. **Network connectivity issues** with Prisma Accelerate
3. **Invalid or expired API key** in DATABASE_URL
4. **Database service not fully initialized**

## Solutions

### Solution 1: Push Schema to Database

The most common fix is to push your Prisma schema to the database:

```bash
npx prisma db push
```

If you get a DATABASE_URL error, make sure your `.env` file exists and contains:

```env
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=your-api-key"
```

### Solution 2: Check Your .env File

Ensure you have a `.env` file (not just `.env.example`):

```bash
# Check if .env exists
ls .env

# If not, create it from example
cp .env.example .env

# Then edit .env and add your DATABASE_URL
```

### Solution 3: Verify Prisma Accelerate Connection

Test your connection URL format:

```bash
# The DATABASE_URL should look like:
# prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_API_KEY
```

### Solution 4: Generate Prisma Client

Make sure Prisma Client is generated:

```bash
npx prisma generate
```

### Solution 5: Check Network/Firewall

If using Prisma Accelerate, ensure:
- Your network allows outbound HTTPS connections
- No firewall is blocking `accelerate.prisma-data.net`
- Corporate proxy settings are configured if needed

## Step-by-Step Fix

1. **Create/Update `.env` file:**
   ```bash
   # Make sure DATABASE_URL is set
   echo 'DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"' > .env
   ```

2. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

3. **Push schema to database:**
   ```bash
   npx prisma db push
   ```

4. **Verify connection:**
   ```bash
   node -e "require('dotenv').config(); const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.$connect().then(() => { console.log('✅ Connected'); return prisma.user.count(); }).then(count => { console.log('Users:', count); return prisma.$disconnect(); }).catch(e => { console.error('Error:', e.message); process.exit(1); });"
   ```

## Expected Success Output

After pushing schema, you should see:

```
✅ Prisma database connected successfully
✅ Database connection verified
✅ Prisma Client working - Found 0 user(s) in database
```

## Still Having Issues?

If queries still fail after pushing schema:

1. **Check Prisma Accelerate Dashboard:**
   - Verify your API key is active
   - Check service status
   - Verify database region settings

2. **Test with Prisma Studio:**
   ```bash
   npx prisma studio
   ```
   This will open a visual database browser to test queries

3. **Check logs:**
   - Look for detailed error messages
   - Check network tab in browser (if using web interface)
   - Review Prisma Accelerate logs in dashboard

4. **Contact Support:**
   - Prisma Accelerate support
   - Check Prisma status page
   - Review Prisma Accelerate documentation

