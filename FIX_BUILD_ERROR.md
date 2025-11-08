# Fix Next.js Build Error: TypeScript Not Found

## Problem
```
⚠ Installing TypeScript as it was not found while loading "next.config.ts".
uncaughtException Error: spawn pnpm ENOENT
```

## Root Cause
1. `npm install --production` was run, which skips `devDependencies`
2. TypeScript is in `devDependencies` but is needed for Next.js build
3. Next.js tried to use `pnpm` but it's not installed

## Solution

### Option 1: Install All Dependencies (Recommended)

```bash
cd /var/www/skyber/frontend

# Remove node_modules and package-lock.json (optional, for clean install)
rm -rf node_modules package-lock.json

# Install ALL dependencies (including devDependencies)
npm install

# Now try building
npm run build
```

### Option 2: Install TypeScript Manually

```bash
cd /var/www/skyber/frontend

# Install TypeScript specifically
npm install --save-dev typescript

# Now try building
npm run build
```

### Option 3: Fix package.json and Reinstall

Make sure TypeScript is in `devDependencies` (it already is):

```bash
cd /var/www/skyber/frontend

# Install all dependencies
npm install

# Build
npm run build
```

## Why This Happens

- **Development dependencies are needed for build**: Next.js requires TypeScript during the build process
- **Production install skips devDependencies**: `npm install --production` only installs `dependencies`
- **Build happens before production**: The build step needs dev tools

## Updated Deployment Strategy

**For Frontend:**
```bash
# On server - Install ALL dependencies (needed for build)
npm install

# Build the application
npm run build

# Then start (this only needs production dependencies, but they're already installed)
npm start
```

**For Backend:**
```bash
# On server - Can use --production if you don't need Prisma CLI
npm install --production

# Or install all if you need Prisma commands
npm install
```

## Quick Fix Commands

Run these on your EC2 instance:

```bash
cd /var/www/skyber/frontend
npm install
npm run build
pm2 restart skyber-frontend
```

