#!/bin/bash

# SKYBER Frontend Deployment Script
# Run this on your EC2 instance

set -e  # Exit on error

echo "🚀 Starting Frontend Deployment..."

# Navigate to frontend directory
cd ~/skyber/frontend || { echo "❌ Frontend directory not found!"; exit 1; }

# Pull latest code (if using Git)
if [ -d .git ]; then
    echo "📥 Pulling latest code..."
    git pull origin main || git pull origin master
fi

# Ensure .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local..."
    echo "NEXT_PUBLIC_API_URL=https://skyber.dev" > .env.local
fi

# Install dependencies
echo "📦 Installing dependencies..."
# Install ALL dependencies (including devDependencies) because Next.js needs TypeScript to build
npm install

# Build Next.js application
echo "🏗️  Building Next.js application..."
npm run build

# Restart PM2 process
echo "🔄 Restarting frontend..."
pm2 restart skyber-frontend || pm2 start npm --name "skyber-frontend" -- start

# Save PM2 configuration
pm2 save

echo "✅ Frontend deployment complete!"
echo "📊 Check status: pm2 status"
echo "📝 View logs: pm2 logs skyber-frontend"

