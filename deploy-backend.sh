#!/bin/bash

# SKYBER Backend Deployment Script
# Run this on your EC2 instance

set -e  # Exit on error

echo "🚀 Starting Backend Deployment..."

# Navigate to backend directory
cd ~/skyber/backend || { echo "❌ Backend directory not found!"; exit 1; }

# Pull latest code (if using Git)
if [ -d .git ]; then
    echo "📥 Pulling latest code..."
    git pull origin main || git pull origin master
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Push database schema (if needed)
echo "💾 Updating database schema..."
npx prisma db push --accept-data-loss || echo "⚠️  Database push skipped or failed"

# Restart PM2 process
echo "🔄 Restarting backend..."
pm2 restart skyber-backend || pm2 start server.js --name "skyber-backend"

# Save PM2 configuration
pm2 save

echo "✅ Backend deployment complete!"
echo "📊 Check status: pm2 status"
echo "📝 View logs: pm2 logs skyber-backend"

