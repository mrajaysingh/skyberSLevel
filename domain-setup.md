# Domain Setup Guide: m.skyber.dev & api.skyber.dev

This guide covers setting up `m.skyber.dev` (mobile frontend) and `api.skyber.dev` (backend API) on an EC2 instance with PM2 and Nginx.

## Prerequisites

- EC2 instance with Ubuntu/Debian Linux
- Root or sudo access
- Domain names `m.skyber.dev` and `api.skyber.dev` pointing to your EC2 instance IP
- Node.js and npm installed
- PM2 installed globally
- Nginx installed

## Step 1: DNS Configuration

### Configure DNS Records

Add the following A records in your domain registrar's DNS settings:

```
Type: A
Name: m
Value: <your-ec2-ip-address>
TTL: 3600

Type: A
Name: api
Value: <your-ec2-ip-address>
TTL: 3600
```

**Note:** Replace `<your-ec2-ip-address>` with your EC2 instance's public IP address.

Verify DNS propagation:
```bash
dig m.skyber.dev
dig api.skyber.dev
```

## Step 2: Install Required Software

### Install Required Modules

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install Certbot for SSL certificates
sudo apt install certbot python3-certbot-nginx -y

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Step 3: Setup Backend API (api.skyber.dev)

### 3.1 Deploy Backend Application

```bash
# Create directory for backend
sudo mkdir -p /var/www/api.skyber.dev
sudo chown -R $USER:$USER /var/www/api.skyber.dev

# Navigate to backend directory
cd /var/www/api.skyber.dev

# Clone or upload your backend code
# git clone <your-backend-repo> .
# OR upload your files via SCP/SFTP

# Install dependencies
npm install

# Create .env file
nano .env
```

### 3.2 Configure Backend Environment

Add the following to `/var/www/api.skyber.dev/.env`:

```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://m.skyber.dev
DATABASE_URL=your_database_connection_string
REDIS_URL=your_redis_connection_string
# Add other required environment variables
```

### 3.3 Start Backend with PM2

```bash
# Start the backend application with PM2
cd /var/www/api.skyber.dev
pm2 start npm --name "api-skyber" -- start

# Or if you have a start script in package.json:
pm2 start ecosystem.config.js
# OR
pm2 start server.js --name "api-skyber"

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Follow the instructions provided by the command
```

### 3.3.1 Create PM2 Ecosystem File (Optional but Recommended)

Create `/var/www/api.skyber.dev/ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'api-skyber',
    script: 'server.js', // or 'npm', 'start'
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G'
  }]
};
```

## Step 4: Setup Frontend (m.skyber.dev)

### 4.1 Build and Deploy Frontend

```bash
# Create directory for frontend
sudo mkdir -p /var/www/m.skyber.dev
sudo chown -R $USER:$USER /var/www/m.skyber.dev

# Navigate to frontend directory
cd /var/www/m.skyber.dev

# Clone or upload your frontend code
# git clone <your-frontend-repo> .
# OR upload your files via SCP/SFTP

# Install dependencies
npm install

# Build the Next.js application
npm run build

# Create .env.local file
nano .env.local
```

### 4.2 Configure Frontend Environment

Add the following to `/var/www/m.skyber.dev/.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.skyber.dev
MOBILE_URL=app.skyber.dev
NEXT_PUBLIC_MOBILE_URL=app.skyber.dev
NODE_ENV=production
```

### 4.3 Start Frontend with PM2

```bash
# Start the frontend application with PM2
cd /var/www/m.skyber.dev
pm2 start npm --name "m-skyber" -- start

# Save PM2 configuration
pm2 save
```

### 4.3.1 Create PM2 Ecosystem File for Frontend

Create `/var/www/m.skyber.dev/ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'm-skyber',
    script: 'npm',
    args: 'start',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G'
  }]
};
```

## Step 5: Configure Nginx Server Blocks

### 5.1 Create Server Block for API (api.skyber.dev)

```bash
sudo nano /etc/nginx/sites-available/api.skyber.dev
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name api.skyber.dev www.api.skyber.dev;

    # Logging
    access_log /var/log/nginx/api.skyber.dev_access.log;
    error_log /var/log/nginx/api.skyber.dev_error.log;

    # Proxy all requests to Node.js backend
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

### 5.2 Create Server Block for Frontend (m.skyber.dev)

```bash
sudo nano /etc/nginx/sites-available/m.skyber.dev
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name m.skyber.dev www.m.skyber.dev;

    # Logging
    access_log /var/log/nginx/m.skyber.dev_access.log;
    error_log /var/log/nginx/m.skyber.dev_error.log;

    # Proxy all requests to Next.js frontend
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
        
        # WebSocket support for Next.js
        proxy_set_header Connection "upgrade";
    }
}
```

### 5.3 Enable Sites and Restart Nginx

```bash
# Create symbolic links to enable sites
sudo ln -s /etc/nginx/sites-available/api.skyber.dev /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/m.skyber.dev /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Step 6: Setup SSL Certificates (HTTPS)

### 6.1 Obtain SSL Certificates with Let's Encrypt

```bash
# Obtain certificate for api.skyber.dev
sudo certbot --nginx -d api.skyber.dev -d www.api.skyber.dev

# Obtain certificate for m.skyber.dev
sudo certbot --nginx -d m.skyber.dev -d www.m.skyber.dev

# Certbot will automatically update your Nginx configuration
```

### 6.2 Auto-Renewal Setup

```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot automatically sets up a cron job for renewal
# Verify it exists:
sudo systemctl status certbot.timer
```

## Step 7: Update Nginx Configurations for HTTPS

After SSL certificates are installed, Certbot will have updated your configurations. However, you may need to manually update them for better security:

### 7.1 Update API Server Block (HTTPS)

```bash
sudo nano /etc/nginx/sites-available/api.skyber.dev
```

After Certbot runs, your configuration should look like this (Certbot adds SSL automatically):

```nginx
server {
    listen 80;
    server_name api.skyber.dev www.api.skyber.dev;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.skyber.dev www.api.skyber.dev;

    # SSL Configuration (added by Certbot)
    ssl_certificate /etc/letsencrypt/live/api.skyber.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.skyber.dev/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security Headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # CORS Headers (if needed)
    add_header Access-Control-Allow-Origin "*" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;

    # Logging
    access_log /var/log/nginx/api.skyber.dev_access.log;
    error_log /var/log/nginx/api.skyber.dev_error.log;

    # Proxy all requests to Node.js backend
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

### 7.2 Update Frontend Server Block (HTTPS)

```bash
sudo nano /etc/nginx/sites-available/m.skyber.dev
```

After Certbot runs, your configuration should look like this:

```nginx
server {
    listen 80;
    server_name m.skyber.dev www.m.skyber.dev;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name m.skyber.dev www.m.skyber.dev;

    # SSL Configuration (added by Certbot)
    ssl_certificate /etc/letsencrypt/live/m.skyber.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/m.skyber.dev/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security Headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Logging
    access_log /var/log/nginx/m.skyber.dev_access.log;
    error_log /var/log/nginx/m.skyber.dev_error.log;

    # Proxy all requests to Next.js frontend
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
        
        # WebSocket support for Next.js
        proxy_set_header Connection "upgrade";
    }
}
```

### 7.3 Test and Reload Nginx

```bash
# Test Nginx configuration
sudo nginx -t

# Reload Nginx (no downtime)
sudo systemctl reload nginx
```

## Step 8: Configure Firewall

```bash
# Allow HTTP and HTTPS traffic
sudo ufw allow 'Nginx Full'
# OR
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow SSH (if not already allowed)
sudo ufw allow 22/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## Step 9: Verify Setup

### 9.1 Check PM2 Status

```bash
# Check PM2 processes
pm2 list

# Check logs
pm2 logs api-skyber
pm2 logs m-skyber

# Monitor
pm2 monit
```

### 9.2 Check Nginx Status

```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/api.skyber.dev_error.log
sudo tail -f /var/log/nginx/m.skyber.dev_error.log

# Check Nginx access logs
sudo tail -f /var/log/nginx/api.skyber.dev_access.log
sudo tail -f /var/log/nginx/m.skyber.dev_access.log
```

### 9.3 Test Domains

```bash
# Test API endpoint
curl https://api.skyber.dev/api/health
# OR
curl https://api.skyber.dev

# Test frontend
curl https://m.skyber.dev

# Test from browser
# Visit: https://m.skyber.dev
# Visit: https://api.skyber.dev
```

## Step 10: Maintenance Commands

### PM2 Commands

```bash
# List all processes
pm2 list

# Restart application
pm2 restart api-skyber
pm2 restart m-skyber

# Stop application
pm2 stop api-skyber
pm2 stop m-skyber

# Delete application
pm2 delete api-skyber
pm2 delete m-skyber

# View logs
pm2 logs api-skyber
pm2 logs m-skyber

# Monitor resources
pm2 monit

# Save current process list
pm2 save
```

### Nginx Commands

```bash
# Restart Nginx
sudo systemctl restart nginx

# Reload Nginx (without downtime)
sudo systemctl reload nginx

# Check configuration
sudo nginx -t

# View error logs
sudo tail -f /var/log/nginx/error.log

# View access logs
sudo tail -f /var/log/nginx/access.log
```

### Update Application

```bash
# Backend update
cd /var/www/api.skyber.dev
git pull  # or upload new files
npm install
pm2 restart api-skyber

# Frontend update
cd /var/www/m.skyber.dev
git pull  # or upload new files
npm install
npm run build
pm2 restart m-skyber
```

## Troubleshooting

### Issue: 502 Bad Gateway

**Solution:**
- Check if Node.js applications are running: `pm2 list`
- Check if applications are listening on correct ports: `netstat -tulpn | grep :3000` and `netstat -tulpn | grep :3001`
- Check Apache error logs: `sudo tail -f /var/log/apache2/error.log`
- Restart applications: `pm2 restart all`

### Issue: SSL Certificate Not Working

**Solution:**
- Verify DNS records are correct: `dig api.skyber.dev` and `dig m.skyber.dev`
- Check certificate status: `sudo certbot certificates`
- Renew certificate manually: `sudo certbot renew`

### Issue: CORS Errors

**Solution:**
- Ensure CORS headers are set in Apache configuration
- Check backend CORS configuration
- Verify `FRONTEND_URL` in backend `.env` matches `https://m.skyber.dev`

### Issue: Application Not Starting

**Solution:**
- Check PM2 logs: `pm2 logs <app-name>`
- Check Node.js version: `node -v`
- Verify environment variables are set correctly
- Check file permissions: `ls -la /var/www/`

## Security Best Practices

1. **Keep system updated:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Configure firewall properly:**
   ```bash
   sudo ufw status
   ```

3. **Use strong passwords and SSH keys**

4. **Regular backups:**
   - Database backups
   - Application code backups
   - Configuration backups

5. **Monitor logs regularly:**
   ```bash
   pm2 logs
   sudo tail -f /var/log/apache2/error.log
   ```

6. **Set up log rotation:**
   ```bash
   pm2 install pm2-logrotate
   pm2 set pm2-logrotate:max_size 10M
   pm2 set pm2-logrotate:retain 7
   ```

## Additional Resources

- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Apache Virtual Hosts](https://httpd.apache.org/docs/2.4/vhosts/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

## Support

For issues or questions, refer to:
- Application logs: `pm2 logs`
- Apache logs: `/var/log/apache2/`
- System logs: `journalctl -xe`

