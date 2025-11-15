# AWS EC2 Deployment Guide for SKYBER (Production with Admin and API Domains)
## Complete Step-by-Step Guide

This guide deploys:
- Frontend (Next.js) served on `https://skyber.dev` (marketing site) and `https://admin.skyber.dev` (admin dashboard)
- Backend API (Express) served on `https://api.skyber.dev`

Server details (example):
- Instance Type: t3.micro
- OS: Ubuntu
- IP: 43.204.148.132
- Domains: `skyber.dev`, `admin.skyber.dev`, `api.skyber.dev`

---

## Prerequisites

1. EC2 instance running Ubuntu
2. Domain `skyber.dev` with DNS access
3. SSH access to EC2 instance
4. Local machine with your codebase

---

## Step 1: Initial EC2 Setup

### 1.1 Connect to Your EC2 Instance

```bash
# On your local machine
ssh -i /path/to/your-key.pem ubuntu@43.204.148.132

# If 'ubuntu' doesn't work, try 'ec2-user'
ssh -i /path/to/your-key.pem ec2-user@43.204.148.132
```

### 1.2 Update System Packages

```bash
sudo apt update
sudo apt upgrade -y
```

### 1.3 Configure Security Groups

In AWS Console → EC2 → Security Groups, add inbound rules:
- HTTP: Port 80, Source: 0.0.0.0/0
- HTTPS: Port 443, Source: 0.0.0.0/0
- SSH: Port 22, Source: your IP
- Backend API (optional for direct test): Port 3001, Source: 0.0.0.0/0

---

## Step 2: Install Required Software

### 2.1 Node.js (v20.x LTS)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # v20.x.x
npm --version
```

### 2.2 Nginx
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
```

### 2.3 PM2 (Process Manager)
```bash
sudo npm install -g pm2
pm2 --version
```

### 2.4 Certbot (SSL)
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 2.5 Git and Build Essentials
```bash
sudo apt install -y git build-essential
```

---

## Step 3: Domain DNS Configuration

### 3.1 Configure DNS Records
In your DNS provider:

1) Root domain
- Type: A
- Name: `@`
- Value: `43.204.148.132`

2) Admin subdomain
- Type: A
- Name: `admin`
- Value: `43.204.148.132`

3) API subdomain
- Type: A
- Name: `api`
- Value: `43.204.148.132`

4) Optional `www`
- Type: A
- Name: `www`
- Value: `43.204.148.132`

Propagation typically 5–15 minutes.

### 3.2 Verify DNS
```bash
nslookup skyber.dev
nslookup admin.skyber.dev
nslookup api.skyber.dev
```

---

## Step 4: Directory Structure
```bash
sudo mkdir -p /var/www/skyber
sudo chown -R ubuntu:ubuntu /var/www/skyber

mkdir -p ~/skyber && cd ~/skyber
```

---

## Step 5: Deploy Backend (API)

### 5.1 Get Code
```bash
cd ~/skyber
git clone <your-repo-url> backend
cd backend
```

### 5.2 Install Dependencies
```bash
npm install --production
```

### 5.3 Backend Environment
```bash
nano .env
```

Use:
```env
# Server
PORT=3001
NODE_ENV=production

# CORS (admin dashboard origin)
FRONTEND_URL=https://admin.skyber.dev

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-min-32-chars
JWT_EXPIRES_IN=7d

# Auth.js
AUTHJS_SECRET=your-authjs-secret-key-change-this-min-32-chars

# Database (Prisma/PostgreSQL)
DATABASE_URL="your-postgresql-connection-string"

# Redis
REDIS_URL="your-redis-connection-string"

# Session
SESSION_SECRET=your-super-secret-session-key-change-this-min-32-chars
```

Notes:
- Backend CORS in `backend/server.js` uses `FRONTEND_URL`. Set this to `https://admin.skyber.dev`.
- If you also call API from `https://skyber.dev`, you’d need to update CORS to allow multiple origins (custom logic or comma-separated parsing). Default supports a single origin.

### 5.4 Prisma
```bash
npx prisma generate
npx prisma db push
```

### 5.5 Test & Start with PM2
```bash
npm start  # test, then Ctrl+C

pm2 start server.js --name "skyber-backend"
pm2 save
pm2 startup   # follow printed instructions
pm2 status
pm2 logs skyber-backend
```

---

## Step 6: Deploy Frontend (Next.js)

### 6.1 Upload or Clone Frontend
```bash
cd ~/skyber
mkdir -p frontend
# Option A: clone repo into ~/skyber/frontend
# Option B: upload built app or source and build on server
```

### 6.2 Frontend Environment (.env.local)
```bash
cd ~/skyber/frontend
nano .env.local
```

Use:
```env
# API URL - Production
NEXT_PUBLIC_API_URL=https://api.skyber.dev

# Admin dashboard URL (used for redirects and links)
ADMIN_URL=https://admin.skyber.dev
NEXT_PUBLIC_ADMIN_URL=https://admin.skyber.dev

# Optional: Mobile app/web URL
# MOBILE_URL=https://app.skyber.dev
# NEXT_PUBLIC_MOBILE_URL=https://app.skyber.dev
```

### 6.3 Install & Build
```bash
npm install
npm run build
```

### 6.4 Start with PM2
```bash
pm2 start npm --name "skyber-frontend" -- start
pm2 save
pm2 status
pm2 logs skyber-frontend
```

Note: Next.js runs on port 3000 by default.

---

## Step 7: Nginx Reverse Proxy

### 7.1 Create Nginx Config
```bash
sudo nano /etc/nginx/sites-available/skyber.dev
```

Paste:
```nginx
# Redirect HTTP → HTTPS for all three hosts
server {
    listen 80;
    listen [::]:80;
    server_name skyber.dev www.skyber.dev admin.skyber.dev api.skyber.dev;
    return 301 https://$host$request_uri;
}

# Frontend (Marketing) - skyber.dev
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name skyber.dev www.skyber.dev;

    # SSL will be auto-filled by Certbot

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

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
}

# Frontend (Admin) - admin.skyber.dev
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name admin.skyber.dev;

    # SSL will be auto-filled by Certbot

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

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
}

# Backend API - api.skyber.dev
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.skyber.dev;

    # SSL will be auto-filled by Certbot

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 7.2 Enable and Reload
```bash
sudo ln -s /etc/nginx/sites-available/skyber.dev /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

## Step 8: SSL Certificates (Let's Encrypt)

### 8.1 Obtain Certificates
```bash
sudo certbot --nginx -d skyber.dev -d www.skyber.dev -d admin.skyber.dev -d api.skyber.dev
```
Follow prompts (email, terms, redirect yes).

### 8.2 Auto-Renewal
```bash
sudo certbot renew --dry-run
```

---

## Step 9: Firewall (UFW)
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

---

## Step 10: Final Configuration & Verification

### 10.1 Frontend Env Recap
Ensure `frontend/.env.local` has:
```env
NEXT_PUBLIC_API_URL=https://api.skyber.dev
ADMIN_URL=https://admin.skyber.dev
NEXT_PUBLIC_ADMIN_URL=https://admin.skyber.dev
```
Rebuild after changes:
```bash
cd ~/skyber/frontend
npm run build
pm2 restart skyber-frontend
```

### 10.2 Backend CORS Recap
Backend `.env`:
```env
FRONTEND_URL=https://admin.skyber.dev
```
Restart backend if changed:
```bash
pm2 restart skyber-backend
```

### 10.3 Verify Services
```bash
pm2 status
sudo systemctl status nginx
curl http://localhost:3001/health
curl http://localhost:3000
```

### 10.4 Test in Browser
- Marketing site: `https://skyber.dev`
- Admin dashboard: `https://admin.skyber.dev`
- API: `https://api.skyber.dev/health` (optional health route if exposed via Nginx)

---

## Step 11: Optional Auto-Deployment

### 11.1 Deploy Script
```bash
nano ~/deploy.sh
```

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

### 11.2 CI/CD (GitHub Actions)
Create `.github/workflows/deploy.yml` as needed.

---

## Step 12: Monitoring & Maintenance

### PM2
```bash
pm2 list
pm2 logs
pm2 logs skyber-backend
pm2 logs skyber-frontend
pm2 monit
```

### Nginx
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### System
```bash
htop
df -h
free -h
```

---

## Troubleshooting

### Backend not starting
```bash
pm2 logs skyber-backend --lines 100
pm2 restart skyber-backend
sudo netstat -tulpn | grep 3001
```

### Frontend not loading
```bash
pm2 logs skyber-frontend --lines 100
pm2 restart skyber-frontend
sudo nginx -t
sudo systemctl reload nginx
```

### SSL issues
```bash
sudo certbot renew
sudo certbot certificates
```

### Database issues
```bash
cd ~/skyber/backend
npx prisma db pull
cat .env | grep DATABASE_URL
```

---

## Security Checklist
- [ ] Strong secrets for JWT/SESSION/AUTHJS (32+ chars)
- [ ] UFW enabled
-$
- [ ] SSH restricted to your IP
- [ ] SSL installed and auto-renewing
- [ ] Security headers in Nginx
- [ ] Env vars not committed
- [ ] PM2 runs as non-root
- [ ] Regular backups

---

## Final URLs
- Marketing Frontend: `https://skyber.dev`
- Admin Dashboard: `https://admin.skyber.dev`
- Backend API: `https://api.skyber.dev`

