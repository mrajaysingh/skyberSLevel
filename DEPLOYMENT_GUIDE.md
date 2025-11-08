# AWS EC2 Deployment Guide for SKYBER
## Complete Step-by-Step Guide

This guide will help you deploy both frontend (Next.js) and backend (Node.js/Express) to AWS EC2 and connect your domain `https://skyber.dev/`.

**Server Details:**
- Instance Type: t3.micro
- OS: Ubuntu
- IP: 43.204.148.132
- Domain: skyber.dev

---

## Prerequisites

1. EC2 instance running Ubuntu
2. Domain name (skyber.dev) with DNS access
3. SSH access to EC2 instance
4. Local machine with your codebase

---

## Step 1: Initial EC2 Setup

### 1.1 Connect to Your EC2 Instance

```bash
# On your local machine
ssh -i /path/to/your-key.pem ubuntu@43.204.148.132

# If using username 'ubuntu' doesn't work, try 'ec2-user'
ssh -i /path/to/your-key.pem ec2-user@43.204.148.132
```

### 1.2 Update System Packages

```bash
sudo apt update
sudo apt upgrade -y
```

### 1.3 Configure Security Groups

**In AWS Console:**
1. Go to EC2 → Security Groups
2. Find your instance's security group
3. Add inbound rules:
   - **HTTP**: Port 80, Source: 0.0.0.0/0
   - **HTTPS**: Port 443, Source: 0.0.0.0/0
   - **SSH**: Port 22, Source: Your IP (recommended) or 0.0.0.0/0
   - **Backend API** (optional): Port 3001, Source: 0.0.0.0/0 (or restrict to same VPC)

---

## Step 2: Install Required Software

### 2.1 Install Node.js (v20.x LTS)

```bash
# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version
```

### 2.2 Install Nginx

```bash
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

### 2.3 Install PM2 (Process Manager)

```bash
sudo npm install -g pm2

# Verify installation
pm2 --version
```

### 2.4 Install Certbot (for SSL)

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 2.5 Install Git

```bash
sudo apt install -y git
```

### 2.6 Install Build Essentials (for native modules)

```bash
sudo apt install -y build-essential
```

---

## Step 3: Domain DNS Configuration

### 3.1 Configure DNS Records

**In your domain registrar (where you bought skyber.dev):**

1. Go to DNS management
2. Add/Update A record:
   - **Type**: A
   - **Name**: @ (or leave blank)
   - **Value**: 43.204.148.132
   - **TTL**: 300 (or default)

3. (Optional) Add www subdomain:
   - **Type**: A
   - **Name**: www
   - **Value**: 43.204.148.132
   - **TTL**: 300

**Wait for DNS propagation (5 minutes to 48 hours, usually 5-15 minutes)**

### 3.2 Verify DNS

```bash
# On your local machine
nslookup skyber.dev
# Should return: 43.204.148.132

# Or
dig skyber.dev
```

---

## Step 4: Create Application Directory Structure

```bash
# Create directory for your application
sudo mkdir -p /var/www/skyber
sudo chown -R ubuntu:ubuntu /var/www/skyber

# Or use home directory (easier permissions)
mkdir -p ~/skyber
cd ~/skyber
```

---

## Step 5: Deploy Backend

### 5.1 Upload Backend Code

**Option A: Using Git (Recommended)**

```bash
cd ~/skyber
git clone <your-repo-url> backend
# OR if code is already on GitHub/GitLab
cd backend
```

**Option B: Using SCP (if not using Git)**

```bash
# On your local machine
scp -i /path/to/your-key.pem -r backend/ ubuntu@43.204.148.132:~/skyber/
```

### 5.2 Install Backend Dependencies

```bash
cd ~/skyber/backend
# For production, you can use --production flag
# But if you need Prisma CLI or other dev tools, install all
npm install --production
```

### 5.3 Setup Backend Environment Variables

```bash
nano .env
```

**Add/Update these variables:**

```env
# Server Configuration
PORT=3001
NODE_ENV=production

# Frontend URL (your domain)
FRONTEND_URL=https://skyber.dev

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-min-32-chars
JWT_EXPIRES_IN=7d

# Auth.js Configuration
AUTHJS_SECRET=your-authjs-secret-key-change-this-min-32-chars

# Database Configuration - Prisma with PostgreSQL
DATABASE_URL="your-postgresql-connection-string"

# Redis Configuration
REDIS_URL="your-redis-connection-string"

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-change-this-min-32-chars

# OAuth Providers (if using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

**Save:** `Ctrl + X`, then `Y`, then `Enter`

### 5.4 Generate Prisma Client

```bash
cd ~/skyber/backend
npx prisma generate
```

### 5.5 Push Database Schema

```bash
npx prisma db push
```

### 5.6 Test Backend

```bash
# Test if backend starts
npm start

# If successful, stop it (Ctrl + C)
```

### 5.7 Start Backend with PM2

```bash
cd ~/skyber/backend

# Start with PM2
pm2 start server.js --name "skyber-backend"

# Or using npm script
pm2 start npm --name "skyber-backend" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the command it outputs (usually involves sudo)

# Check status
pm2 status
pm2 logs skyber-backend
```

---

## Step 6: Deploy Frontend

### 6.1 Build Frontend Locally (Recommended)

**On your local machine:**

```bash
cd newsite

# Update .env.local with production API URL
echo "NEXT_PUBLIC_API_URL=https://skyber.dev" > .env.local

# Build for production
npm run build
```

### 6.2 Upload Built Frontend

```bash
# On your local machine, upload the built files
scp -i skyberserver.pem -r newsite/.next ubuntu@43.204.148.132:/var/www/skyber/frontend
scp -i skyberserver.pem newsite/package.json ubuntu@43.204.148.132:/var/www/skyber/frontend
scp -i skyberserver.pem newsite/next.config.* ubuntu@43.204.148.132:/var/www/skyber/frontend
scp -i skyberserver.pem -r newsite/public ubuntu@43.204.148.132:/var/www/skyber/frontend
scp -i skyberserver.pem -r newsite/app ubuntu@43.204.148.132:/var/www/skyber/frontend
scp -i skyberserver.pem -r newsite/components ubuntu@43.204.148.132:/var/www/skyber/frontend
scp -i skyberserver.pem -r newsite/lib ubuntu@43.204.148.132:/var/www/skyber/frontend






scp -i skyberserver.pem -r newsite/.next ubuntu@43.204.148.132:/var/www/skyber/frontend
```




**Or upload entire newsite folder and build on server:**

```bash
# On EC2
cd ~/skyber
mkdir -p frontend

# On local machine
scp -i /path/to/your-key.pem -r newsite/* ubuntu@43.204.148.132:~/skyber/frontend/
```

### 6.3 Install Frontend Dependencies on Server

```bash
cd ~/skyber/frontend
# Install ALL dependencies (including devDependencies) because Next.js needs TypeScript to build
npm install
# Note: We need devDependencies for the build process
```

### 6.4 Build Frontend on Server (if not built locally)

```bash
cd ~/skyber/frontend

# Create .env.local
echo "NEXT_PUBLIC_API_URL=https://skyber.dev" > .env.local

# Build
npm run build
```

### 6.5 Start Frontend with PM2

```bash
cd ~/skyber/frontend

# Start Next.js production server
pm2 start npm --name "skyber-frontend" -- start

# Or if you have a custom start script
pm2 start "npm start" --name "skyber-frontend"

# Save PM2 configuration
pm2 save

# Check status
pm2 status
pm2 logs skyber-frontend
```

**Note:** Next.js will run on port 3000 by default. You can change this if needed.

---

## Step 7: Configure Nginx Reverse Proxy

### 7.1 Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/skyber.dev
```

**Add this configuration:**

```nginx
# Frontend (Next.js) - Main domain
server {
    listen 80;
    listen [::]:80;
    server_name skyber.dev www.skyber.dev;

    # Redirect to HTTPS (will be configured after SSL)
    return 301 https://$server_name$request_uri;
}

# Frontend (Next.js) - HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name skyber.dev www.skyber.dev;

    # SSL Configuration (will be added by Certbot)
    # ssl_certificate /etc/letsencrypt/live/skyber.dev/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/skyber.dev/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API proxy
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Save:** `Ctrl + X`, then `Y`, then `Enter`

### 7.2 Enable Site Configuration

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/skyber.dev /etc/nginx/sites-enabled/

# Remove default configuration
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# If test passes, reload Nginx
sudo systemctl reload nginx
```

---

## Step 8: Setup SSL Certificate (Let's Encrypt)

### 8.1 Obtain SSL Certificate

```bash
# Run Certbot
sudo certbot --nginx -d skyber.dev -d www.skyber.dev

# Follow the prompts:
# - Enter email address
# - Agree to terms
# - Choose whether to redirect HTTP to HTTPS (Yes recommended)
```

### 8.2 Verify Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Certificates auto-renew every 90 days, but you can verify
```

---

## Step 9: Configure Firewall (UFW)

```bash
# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

## Step 10: Final Configuration

### 10.1 Update Frontend Environment

Make sure frontend knows about the backend:

```bash
# Frontend should use https://skyber.dev/api for API calls
# This is already configured in your .env.local
```

### 10.2 Verify All Services

```bash
# Check PM2 processes
pm2 status

# Check Nginx
sudo systemctl status nginx

# Check backend
curl http://localhost:3001/health

# Check frontend
curl http://localhost:3000
```

### 10.3 Test from Browser

1. Open `https://skyber.dev` in your browser
2. Test login functionality
3. Test API endpoints

---

## Step 11: Setup Auto-Deployment (Optional)

### 11.1 Create Deployment Script

```bash
nano ~/deploy.sh
```

**Add:**

```bash
#!/bin/bash

echo "🚀 Starting deployment..."

# Backend
cd ~/skyber/backend
git pull origin main
npm install --production
npx prisma generate
pm2 restart skyber-backend

# Frontend
cd ~/skyber/frontend
git pull origin main
npm install --production
npm run build
pm2 restart skyber-frontend

echo "✅ Deployment complete!"
```

```bash
chmod +x ~/deploy.sh
```

### 11.2 Setup Git Hooks (GitHub Actions)

Create `.github/workflows/deploy.yml` in your repository (see additional deployment scripts).

---

## Step 12: Monitoring & Maintenance

### 12.1 Monitor PM2 Processes

```bash
# View all processes
pm2 list

# View logs
pm2 logs

# View specific process logs
pm2 logs skyber-backend
pm2 logs skyber-frontend

# Monitor resources
pm2 monit
```

### 12.2 Monitor Nginx

```bash
# View access logs
sudo tail -f /var/log/nginx/access.log

# View error logs
sudo tail -f /var/log/nginx/error.log
```

### 12.3 Monitor System Resources

```bash
# CPU and Memory
htop
# Or
top

# Disk space
df -h
```

---

## Troubleshooting

### Backend not starting

```bash
# Check PM2 logs
pm2 logs skyber-backend --lines 100

# Restart backend
pm2 restart skyber-backend

# Check if port is in use
sudo netstat -tulpn | grep 3001
```

### Frontend not loading

```bash
# Check PM2 logs
pm2 logs skyber-frontend --lines 100

# Restart frontend
pm2 restart skyber-frontend

# Check Nginx configuration
sudo nginx -t
sudo systemctl reload nginx
```

### SSL Certificate issues

```bash
# Renew certificate manually
sudo certbot renew

# Check certificate status
sudo certbot certificates
```

### Database connection issues

```bash
# Test database connection
cd ~/skyber/backend
npx prisma db pull

# Check DATABASE_URL in .env
cat .env | grep DATABASE_URL
```

---

## Security Checklist

- [ ] Changed all default passwords/keys
- [ ] Used strong JWT_SECRET (32+ characters)
- [ ] Enabled firewall (UFW)
- [ ] Restricted SSH access (if possible)
- [ ] SSL certificate installed and auto-renewing
- [ ] Security headers configured in Nginx
- [ ] Environment variables not in Git
- [ ] PM2 processes running as non-root user
- [ ] Regular backups configured
- [ ] Database backups enabled

---

## Useful Commands Reference

```bash
# PM2
pm2 list                    # List all processes
pm2 restart <name>          # Restart a process
pm2 stop <name>             # Stop a process
pm2 delete <name>           # Delete a process
pm2 logs <name>             # View logs
pm2 save                    # Save current process list
pm2 startup                 # Setup startup script

# Nginx
sudo nginx -t               # Test configuration
sudo systemctl reload nginx # Reload configuration
sudo systemctl restart nginx # Restart Nginx
sudo systemctl status nginx  # Check status

# SSL
sudo certbot renew          # Renew certificates
sudo certbot certificates   # List certificates

# System
sudo reboot                 # Reboot server
df -h                       # Disk usage
free -h                     # Memory usage
```

---

## Next Steps

1. **Setup Backups**: Configure automated backups for database
2. **Monitoring**: Setup CloudWatch or similar monitoring
3. **CDN**: Consider CloudFront for static assets
4. **Load Balancing**: If scaling, add load balancer
5. **Database**: Move to RDS if using PostgreSQL
6. **Redis**: Consider ElastiCache for Redis

---

## Support

If you encounter issues:
1. Check PM2 logs: `pm2 logs`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Check system resources: `htop`
4. Verify DNS: `nslookup skyber.dev`

---

**Deployment Complete! 🎉**

Your application should now be accessible at:
- Frontend: https://skyber.dev
- Backend API: https://skyber.dev/api

