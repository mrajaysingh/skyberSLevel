#!/bin/bash

# SKYBER Deployment Status Check Script
# Run this on your EC2 instance to check deployment status

echo "🔍 Checking Deployment Status..."
echo "================================"
echo ""

# Check PM2 Processes
echo "📊 PM2 Processes:"
pm2 list
echo ""

# Check Nginx Status
echo "🌐 Nginx Status:"
sudo systemctl status nginx --no-pager -l
echo ""

# Check Backend Health
echo "🔧 Backend Health Check:"
curl -s http://localhost:3001/health || echo "❌ Backend not responding"
echo ""
echo ""

# Check Frontend
echo "💻 Frontend Status:"
curl -s http://localhost:3000 > /dev/null && echo "✅ Frontend is running" || echo "❌ Frontend not responding"
echo ""

# Check SSL Certificate
echo "🔒 SSL Certificate Status:"
sudo certbot certificates 2>/dev/null || echo "⚠️  Certbot not configured"
echo ""

# Check Disk Space
echo "💾 Disk Usage:"
df -h | grep -E 'Filesystem|/dev/'
echo ""

# Check Memory
echo "🧠 Memory Usage:"
free -h
echo ""

# Check Ports
echo "🔌 Active Ports:"
sudo netstat -tulpn | grep -E '3000|3001|80|443' || ss -tulpn | grep -E '3000|3001|80|443'
echo ""

echo "================================"
echo "✅ Status check complete!"

