# Fixing DATABASE_URL for Prisma Accelerate

## Issue

Prisma is trying to connect to `localhost` instead of Prisma Accelerate.

## Solution

Your `DATABASE_URL` in `.env` should be in this format:

```env
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_API_KEY_HERE"
```

## Steps to Fix

1. **Open your `.env` file** in the backend directory

2. **Update DATABASE_URL** with your actual API key:
   ```env
   DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19IV0E4VHhhMUI0ZmwzYXk1V3JGUWEiLCJhcGlfa2V5IjoiMDFLOTFHWlpHSjdFMTJZNjIyVldEQk1FTUIiLCJ0ZW5hbnRfaWQiOiIyMDdlYTA2MGU5MWI0MDFmM2IxMWNjODNjNTEzNjUxYjQ4OGNhZDkyN2U0MWFjY2RhODMyYzhjOWRhOGJiZmMyIiwiaW50ZXJuYWxfc2VjcmV0IjoiNjY2YmM4NmEtMTUzYi00NTM1LTk5OGEtMWY1OTVkYjc5YzFmIn0.zEXf1g0Df-U53y7uaL2ZFus4NpAEXQdNul5nR_Txj4E"
   ```

3. **Make sure the quotes are included** (double quotes)

4. **No extra spaces** around the `=` sign

5. **Verify the format** - it should start with `prisma+postgres://accelerate.prisma-data.net/`

## Alternative: Direct PostgreSQL Connection

If you have a direct PostgreSQL connection string instead:

```env
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
```

But for Prisma Accelerate, use the `prisma+postgres://` format.

## Verify Configuration

After updating `.env`, verify it's loaded:

```bash
# Windows PowerShell
Get-Content .env | Select-String "DATABASE_URL"

# Should show your DATABASE_URL
```

Then try pushing again:

```bash
npx prisma db push
```

