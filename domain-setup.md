# Domain Setup Guide: m.skyber.dev & api.skyber.dev

This guide covers setting up `m.skyber.dev` (mobile frontend) and `api.skyber.dev` (backend API) on an EC2 instance with PM2 and Apache.

## Prerequisites

- EC2 instance with Ubuntu/Debian Linux
- Root or sudo access
- Domain names `m.skyber.dev` and `api.skyber.dev` pointing to your EC2 instance IP
- Node.js and npm installed
- PM2 installed globally
- Apache2 installed

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

# Install Apache2
sudo apt install apache2 -y

# Install Certbot for SSL certificates
sudo apt install certbot python3-certbot-apache -y

# Enable required Apache modules
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod proxy_balancer
sudo a2enmod lbmethod_byrequests
sudo a2enmod headers
sudo a2enmod ssl
sudo a2enmod rewrite
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

## Step 5: Configure Apache Virtual Hosts

### 5.1 Create Virtual Host for API (api.skyber.dev)

```bash
sudo nano /etc/apache2/sites-available/api.skyber.dev.conf
```

Add the following configuration:

```apache
<VirtualHost *:80>
    ServerName api.skyber.dev
    ServerAlias www.api.skyber.dev
    
    # Proxy all requests to Node.js backend
    ProxyPreserveHost On
    ProxyRequests Off
    
    <Proxy *>
        Order deny,allow
        Allow from all
    </Proxy>
    
    ProxyPass / http://localhost:3001/
    ProxyPassReverse / http://localhost:3001/
    
    # Logging
    ErrorLog ${APACHE_LOG_DIR}/api.skyber.dev_error.log
    CustomLog ${APACHE_LOG_DIR}/api.skyber.dev_access.log combined
</VirtualHost>
```

### 5.2 Create Virtual Host for Frontend (m.skyber.dev)

```bash
sudo nano /etc/apache2/sites-available/m.skyber.dev.conf
```

Add the following configuration:

```apache
<VirtualHost *:80>
    ServerName m.skyber.dev
    ServerAlias www.m.skyber.dev
    
    # Proxy all requests to Next.js frontend
    ProxyPreserveHost On
    ProxyRequests Off
    
    <Proxy *>
        Order deny,allow
        Allow from all
    </Proxy>
    
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
    
    # WebSocket support for Next.js
    RewriteEngine on
    RewriteCond %{HTTP:Upgrade} websocket [NC]
    RewriteCond %{HTTP:Connection} upgrade [NC]
    RewriteRule ^/?(.*) "ws://localhost:3000/$1" [P,L]
    
    # Logging
    ErrorLog ${APACHE_LOG_DIR}/m.skyber.dev_error.log
    CustomLog ${APACHE_LOG_DIR}/m.skyber.dev_access.log combined
</VirtualHost>
```

### 5.3 Enable Sites and Restart Apache

```bash
# Enable the sites
sudo a2ensite api.skyber.dev.conf
sudo a2ensite m.skyber.dev.conf

# Disable default site (optional)
sudo a2dissite 000-default.conf

# Test Apache configuration
sudo apache2ctl configtest

# Restart Apache
sudo systemctl restart apache2
```

## Step 6: Setup SSL Certificates (HTTPS)

### 6.1 Obtain SSL Certificates with Let's Encrypt

```bash
# Obtain certificate for api.skyber.dev
sudo certbot --apache -d api.skyber.dev -d www.api.skyber.dev

# Obtain certificate for m.skyber.dev
sudo certbot --apache -d m.skyber.dev -d www.m.skyber.dev

# Certbot will automatically update your Apache configuration
```

### 6.2 Auto-Renewal Setup

```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot automatically sets up a cron job for renewal
# Verify it exists:
sudo systemctl status certbot.timer
```

## Step 7: Update Apache Configurations for HTTPS

After SSL certificates are installed, Certbot will have updated your configurations. However, you may need to manually update them for better security:

### 7.1 Update API Virtual Host (HTTPS)

```bash
sudo nano /etc/apache2/sites-available/api.skyber.dev-le-ssl.conf
```

Ensure it includes:

```apache
<VirtualHost *:443>
    ServerName api.skyber.dev
    ServerAlias www.api.skyber.dev
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/api.skyber.dev/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/api.skyber.dev/privkey.pem
    Include /etc/letsencrypt/options-ssl-apache.conf
    
    # Security Headers
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    
    # CORS Headers (if needed)
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization"
    
    # Proxy Configuration
    ProxyPreserveHost On
    ProxyRequests Off
    
    <Proxy *>
        Order deny,allow
        Allow from all
    </Proxy>
    
    ProxyPass / http://localhost:3001/
    ProxyPassReverse / http://localhost:3001/
    
    # Logging
    ErrorLog ${APACHE_LOG_DIR}/api.skyber.dev_error.log
    CustomLog ${APACHE_LOG_DIR}/api.skyber.dev_access.log combined
</VirtualHost>
```

### 7.2 Update Frontend Virtual Host (HTTPS)

```bash
sudo nano /etc/apache2/sites-available/m.skyber.dev-le-ssl.conf
```

Ensure it includes:

```apache
<VirtualHost *:443>
    ServerName m.skyber.dev
    ServerAlias www.m.skyber.dev
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/m.skyber.dev/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/m.skyber.dev/privkey.pem
    Include /etc/letsencrypt/options-ssl-apache.conf
    
    # Security Headers
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    # Proxy Configuration
    ProxyPreserveHost On
    ProxyRequests Off
    
    <Proxy *>
        Order deny,allow
        Allow from all
    </Proxy>
    
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
    
    # WebSocket support
    RewriteEngine on
    RewriteCond %{HTTP:Upgrade} websocket [NC]
    RewriteCond %{HTTP:Connection} upgrade [NC]
    RewriteRule ^/?(.*) "ws://localhost:3000/$1" [P,L]
    
    # Logging
    ErrorLog ${APACHE_LOG_DIR}/m.skyber.dev_error.log
    CustomLog ${APACHE_LOG_DIR}/m.skyber.dev_access.log combined
</VirtualHost>
```

### 7.3 Redirect HTTP to HTTPS

Update the HTTP virtual hosts to redirect to HTTPS:

```bash
sudo nano /etc/apache2/sites-available/api.skyber.dev.conf
```

```apache
<VirtualHost *:80>
    ServerName api.skyber.dev
    ServerAlias www.api.skyber.dev
    
    # Redirect to HTTPS
    Redirect permanent / https://api.skyber.dev/
</VirtualHost>
```

```bash
sudo nano /etc/apache2/sites-available/m.skyber.dev.conf
```

```apache
<VirtualHost *:80>
    ServerName m.skyber.dev
    ServerAlias www.m.skyber.dev
    
    # Redirect to HTTPS
    Redirect permanent / https://m.skyber.dev/
</VirtualHost>
```

Restart Apache:
```bash
sudo systemctl restart apache2
```

## Step 8: Configure Firewall

```bash
# Allow HTTP and HTTPS traffic
sudo ufw allow 'Apache Full'
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

### 9.2 Check Apache Status

```bash
# Check Apache status
sudo systemctl status apache2

# Check Apache error logs
sudo tail -f /var/log/apache2/error.log
sudo tail -f /var/log/apache2/api.skyber.dev_error.log
sudo tail -f /var/log/apache2/m.skyber.dev_error.log
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

### Apache Commands

```bash
# Restart Apache
sudo systemctl restart apache2

# Reload Apache (without downtime)
sudo systemctl reload apache2

# Check configuration
sudo apache2ctl configtest

# View error logs
sudo tail -f /var/log/apache2/error.log
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

