# Quick Deployment Checklist for skyber.dev

## Pre-Deployment Checklist

### Domain & DNS
- [ ] Domain `skyber.dev` is purchased
- [ ] DNS A record points to `43.204.148.132`
- [ ] DNS propagation verified (`nslookup skyber.dev`)

### AWS EC2
- [ ] EC2 instance (t3.micro) is running
- [ ] Security groups configured:
  - [ ] Port 22 (SSH)
  - [ ] Port 80 (HTTP)
  - [ ] Port 443 (HTTPS)
- [ ] SSH key pair available

### Code & Dependencies
- [ ] Backend code ready
- [ ] Frontend code ready
- [ ] Environment variables documented
- [ ] Database connection string ready
- [ ] Redis connection string ready

---

## Deployment Steps (Quick Reference)

### 1. Connect & Setup
```bash
ssh -i your-key.pem ubuntu@43.204.148.132
sudo apt update && sudo apt upgrade -y
```

### 2. Install Software
```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Nginx, PM2, Certbot
sudo apt install -y nginx git build-essential
sudo npm install -g pm2
sudo apt install -y certbot python3-certbot-nginx
```

### 3. Deploy Backend
```bash
cd ~/skyber/backend
# Upload code or git clone
npm install --production
nano .env  # Add environment variables
npx prisma generate
npx prisma db push
pm2 start server.js --name "skyber-backend"
pm2 save
pm2 startup
```

### 4. Deploy Frontend
```bash
cd ~/skyber/frontend
# Upload code or git clone
npm install --production
echo "NEXT_PUBLIC_API_URL=https://skyber.dev" > .env.local
npm run build
pm2 start npm --name "skyber-frontend" -- start
pm2 save
```

### 5. Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/skyber.dev
# (Copy configuration from DEPLOYMENT_GUIDE.md)
sudo ln -s /etc/nginx/sites-available/skyber.dev /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Setup SSL
```bash
sudo certbot --nginx -d skyber.dev -d www.skyber.dev
```

### 7. Configure Firewall
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 8. Verify
```bash
pm2 status
curl https://skyber.dev
```

---

## Environment Variables Checklist

### Backend (.env)
- [ ] `PORT=3001`
- [ ] `NODE_ENV=production`
- [ ] `FRONTEND_URL=https://skyber.dev`
- [ ] `JWT_SECRET` (32+ characters)
- [ ] `DATABASE_URL` (PostgreSQL connection)
- [ ] `REDIS_URL` (Redis connection)
- [ ] `SESSION_SECRET` (32+ characters)

### Frontend (.env.local)
- [ ] `NEXT_PUBLIC_API_URL=https://skyber.dev`

---

## Post-Deployment Testing

- [ ] Visit https://skyber.dev - Frontend loads
- [ ] Test login functionality
- [ ] Test API endpoints at https://skyber.dev/api/health
- [ ] Check browser console for errors
- [ ] Verify SSL certificate (green padlock)
- [ ] Test dashboard access
- [ ] Verify all routes work

---

## Common Issues & Solutions

### Issue: 502 Bad Gateway
**Solution:**
```bash
pm2 logs skyber-frontend
pm2 restart skyber-frontend
sudo systemctl restart nginx
```

### Issue: SSL Certificate Error
**Solution:**
```bash
sudo certbot renew
sudo systemctl reload nginx
```

### Issue: Database Connection Failed
**Solution:**
```bash
cd ~/skyber/backend
cat .env | grep DATABASE_URL
npx prisma db push
```

### Issue: Port Already in Use
**Solution:**
```bash
sudo netstat -tulpn | grep 3001
pm2 delete skyber-backend
pm2 start server.js --name "skyber-backend"
```

---

## Maintenance Commands

```bash
# View logs
pm2 logs

# Restart services
pm2 restart all
sudo systemctl restart nginx

# Update code
cd ~/skyber/backend && git pull && npm install && pm2 restart skyber-backend
cd ~/skyber/frontend && git pull && npm install && npm run build && pm2 restart skyber-frontend

# Check resources
htop
df -h
free -h
```

---

## Backup Checklist

- [ ] Database backups configured
- [ ] Code repository backed up (Git)
- [ ] Environment variables backed up securely
- [ ] SSL certificates auto-renewing
- [ ] PM2 startup script configured

---

**Time Estimate:** 1-2 hours for first deployment
**Difficulty:** Intermediate

