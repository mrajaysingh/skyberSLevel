## Skyber – Complete Production Setup (EC2 + Cloudflare + Nginx + PM2 + Prisma/Postgres)

This guide walks you through a full production setup for the Skyber stack on a single Ubuntu EC2 instance, fronted by Cloudflare, with Nginx reverse-proxy, PM2 process management, firewall hardening, Prisma/Postgres database, and domain routing for:

- api.skyber.dev → Backend (Express/Node)
- admin.skyber.dev → Admin dashboard (only after successful login)
- skyber.dev → Desktop site
- m.skyber.dev → Mobile site (always use this on mobile)

Your EC2 IP: 43.205.232.124

Example Postgres connection string:

```
DATABASE_URL="postgresql://postgres:u8QNV5DPjWbaVZeK1vD0cI5dvZ2I0v3@43.205.232.124:5432/postgres"
```

Note: If your database runs elsewhere, replace the host with that DB host. An older example you had used `43.204.220.52`—that’s fine if that is your DB host. The password you shared will be treated as the Postgres user password for this setup.


### 1) Prerequisites

- A fresh Ubuntu 22.04/24.04 EC2 instance with a public IP (43.205.232.124)
- Cloudflare account with the `skyber.dev` zone managed there
- SSH access to EC2
- Node.js 18+ (LTS recommended), pnpm or npm
- Nginx
- PM2
- Postgres (local on EC2 or remote, e.g., RDS)


### 2) Connect to EC2

```bash
ssh -i /path/to/key.pem ubuntu@43.205.232.124
```

Update and install basics:

```bash
sudo apt update && sudo apt -y upgrade
sudo apt -y install curl git build-essential ufw nginx
```


### 3) Install Node.js, pnpm, PM2

```bash
# Node (LTS)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt -y install nodejs

# PM2
sudo npm i -g pm2
pm2 startup # Follow the printed command to enable autostart
```


### 4) (Option A) Install Postgres on EC2

If you don’t already have a managed Postgres:

```bash
sudo apt -y install postgresql postgresql-contrib
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

Set a password for the `postgres` DB user and create a database:

```bash
sudo -u postgres psql
-- In psql:
ALTER USER postgres WITH PASSWORD 'u8QNV5DPjWbaVZeK1vD0cI5dvZ2I0v3';
CREATE DATABASE postgres; -- or a custom DB name
\q
```

If you want to allow external connection to Postgres (optional; not needed if backend connects locally):

- Edit `/etc/postgresql/*/main/postgresql.conf` → set `listen_addresses = '*'`
- Edit `/etc/postgresql/*/main/pg_hba.conf` → add a permissive line (limit by your office IP ideally):
  `host    all             all             0.0.0.0/0               md5`

Then:

```bash
sudo systemctl restart postgresql
```

Your local EC2 Postgres connection string would be (backend on same host can use `localhost` instead of the public IP):

```
DATABASE_URL="postgresql://postgres:u8QNV5DPjWbaVZeK1vD0cI5dvZ2I0v3@localhost:5432/postgres"
```


### 4b) (Option B) Use external Postgres

If your Postgres is external (e.g., RDS or another server), your earlier example looked like:

```
DATABASE_URL="postgresql://postgres:u8QNV5DPjWbaVZeK1vD0cI5dvZ2I0v3@43.204.220.52:5432/postgres"
```

Use that host:port in your backend `.env`. Ensure the DB security group allows inbound 5432 from your EC2’s public IP.


### 5) Firewall (UFW) Hardening on EC2

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
# Optional only if you expose Postgres externally (prefer SG restriction instead):
# sudo ufw allow 5432/tcp
sudo ufw enable
sudo ufw status
```


### 6) AWS Security Groups (Inbound/Outbound)

- Inbound:
  - 22/tcp from your IP (SSH)
  - 80/tcp from 0.0.0.0/0 (HTTP)
  - 443/tcp from 0.0.0.0/0 (HTTPS)
  - 5432/tcp only if external access to Postgres is required (limit to your office IP or backend host only)
- Outbound: allow all (default) or allow necessary egress for package installs and API calls.


### 7) Cloudflare DNS

Create A records pointing to 43.205.232.124:

- `skyber.dev` → A → 43.205.232.124 (Proxied: ON)
- `api` → A → 43.205.232.124 (Proxied: ON)
- `admin` → A → 43.205.232.124 (Proxied: ON)
- `m` → A → 43.205.232.124 (Proxied: ON)

If using a separate DB host by public IP, DO NOT proxy it via Cloudflare—databases should not be fronted by Cloudflare.


### 8) Clone the project on EC2

```bash
cd ~
git clone https://your-repo-url/skyber-full.git
cd skyber-full
```


### 8b) Deploy into /var/www with separate folders (no sudo needed later)

Create domain-specific folders and give your user ownership:

```bash
sudo mkdir -p /var/www/api.skyber.dev
sudo mkdir -p /var/www/m.skyber.dev

# Replace 'ubuntu' with your EC2 username if different
sudo chown -R ubuntu:ubuntu /var/www
sudo chmod -R 775 /var/www

# Optional: ensure future files inherit user write perms
sudo apt -y install acl
sudo setfacl -R -m u:ubuntu:rwx /var/www
sudo setfacl -d -m u:ubuntu:rwx /var/www
```

Copy the code into place (or clone directly there):

```bash
# Backend → /var/www/api.skyber.dev
rsync -a /home/ubuntu/skyberSLevel/backend/ /var/www/api.skyber.dev/

# Frontend → /var/www/m.skyber.dev
rsync -a /home/ubuntu/skyberSLevel/frontend/ /var/www/m.skyber.dev/
```

Install and build in each folder (now without sudo):

```bash
# Frontend
cd /var/www/m.skyber.dev
npm install
npm run build

# Backend
cd /var/www/api.skyber.dev
npm install --omit=dev
npx prisma generate
npx prisma migrate deploy
```

Run with PM2 from these paths:

```bash
# Frontend (Next.js) on port 3000
pm2 start "npm start -- -p 3000" --name skyber-frontend --cwd /var/www/m.skyber.dev

# Backend (Express) on port 4000 (adjust if your server uses another port)
pm2 start server.js --name skyber-backend --cwd /var/www/api.skyber.dev

pm2 save
```

Note: Nginx will reverse-proxy to ports 3000/4000, independent of folder locations.


### 9) First: Frontend Setup (Next.js)

```bash
cd frontend
cp .env.example .env || true  # if you have an example file; otherwise create .env

# Minimal required env for Next.js; adjust as needed. Domains do NOT need to be in .env.
# NEXT_PUBLIC_API_BASE_URL should point to your API domain:
echo 'NEXT_PUBLIC_API_BASE_URL=https://api.skyber.dev' >> .env

npm install --omit=dev
npm run build
```

Run in PM2 (port 3000):

```bash
pm2 start "npm start -- -p 3000" --name skyber-frontend --cwd ~/skyber-full/frontend
pm2 save
```

Notes:
- You previously accessed `admin.skyber.dev` and `m.skyber.dev` without putting them in `.env`. Keep it that way—host routing will be done at Nginx, and the app can inspect `request.headers.host` or use middleware to redirect mobile to `m.skyber.dev`.
- If you need strict domain handling per host, implement it in `frontend/middleware.ts` based on the `host` header and user-agent detection.


### 10) Backend Setup (Node/Express + Prisma)

```bash
cd ~/skyber-full/backend
cp .env.example .env || true  # if exists

# Write the database URL (local or external). Example with EC2-local Postgres:
sed -i 's|^DATABASE_URL=.*$||' .env 2>/dev/null || true
echo 'DATABASE_URL="postgresql://postgres:u8QNV5DPjWbaVZeK1vD0cI5dvZ2I0v3@localhost:5432/postgres"' >> .env

# If your DB is external, use:
# echo 'DATABASE_URL="postgresql://postgres:u8QNV5DPjWbaVZeK1vD0cI5dvZ2I0v3@43.204.220.52:5432/postgres"' >> .env

pnpm install  # or npm install

# Prisma: generate and migrate
npx prisma generate
npx prisma migrate deploy
```

Check DB connectivity:

```bash
# Using psql (local DB)
psql "postgresql://postgres:u8QNV5DPjWbaVZeK1vD0cI5dvZ2I0v3@localhost:5432/postgres" -c "\dt"

# If external DB
psql "postgresql://postgres:u8QNV5DPjWbaVZeK1vD0cI5dvZ2I0v3@43.204.220.52:5432/postgres" -c "\dt"
```

Start backend via PM2 (assumes it serves on port 4000; adjust if different):

```bash
pm2 start server.js --name skyber-backend --cwd ~/skyber-full/backend
pm2 save
```


### 11) Nginx Reverse Proxy

Create server blocks for each host. Example simple config (replace email, ensure DNS is set first):

```bash
sudo mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled

# skyber.dev (desktop)
sudo tee /etc/nginx/sites-available/skyber.dev.conf >/dev/null <<'NGX'
server {
  listen 80;
  server_name skyber.dev;

  location / {
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_pass http://127.0.0.1:3000;
  }
}
NGX

# m.skyber.dev (mobile)
sudo tee /etc/nginx/sites-available/m.skyber.dev.conf >/dev/null <<'NGX'
server {
  listen 80;
  server_name m.skyber.dev;

  location / {
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_pass http://127.0.0.1:3000;
  }
}
NGX

# admin.skyber.dev (admin dashboard host)
sudo tee /etc/nginx/sites-available/admin.skyber.dev.conf >/dev/null <<'NGX'
server {
  listen 80;
  server_name admin.skyber.dev;

  location / {
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_pass http://127.0.0.1:3000;
  }
}
NGX

# api.skyber.dev (backend)
sudo tee /etc/nginx/sites-available/api.skyber.dev.conf >/dev/null <<'NGX'
server {
  listen 80;
  server_name api.skyber.dev;

  location / {
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_pass http://127.0.0.1:4000;
  }
}
NGX

sudo ln -sf /etc/nginx/sites-available/skyber.dev.conf /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/m.skyber.dev.conf /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/admin.skyber.dev.conf /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/api.skyber.dev.conf /etc/nginx/sites-enabled/

sudo nginx -t
sudo systemctl reload nginx
```

SSL/TLS:
- If Cloudflare proxy is ON (orange cloud), you can use Cloudflare “Full (strict)” with an Origin certificate, or use Certbot—both work.
- Easiest: use Certbot to issue Let’s Encrypt certificates (with Cloudflare proxy ON it still works with HTTP-01 in most cases).

```bash
sudo apt -y install certbot python3-certbot-nginx
sudo certbot --nginx -d skyber.dev -d m.skyber.dev -d admin.skyber.dev -d api.skyber.dev --email you@example.com --agree-tos --no-eff-email
sudo systemctl reload nginx
```


### 12) Enforcing Mobile and Admin Host Semantics (Frontend)

You mentioned it previously worked without adding domains to `.env`—we’ll keep it that way. Two options to enforce behavior:

1) In-app middleware (`frontend/middleware.ts`) checks `request.headers.get('host')` and user-agent to:
   - On mobile UA + host is `skyber.dev` → redirect to `https://m.skyber.dev`
   - On desktop UA + host is `m.skyber.dev` → redirect to `https://skyber.dev`
   - Protect admin pages so they run only on `admin.skyber.dev` (and require session)

2) Cloudflare rules (Page Rules/Transform Rules) to redirect mobile → `m.skyber.dev`. App-level control is usually more flexible; Nginx can also be used, but UA parsing in Nginx is limited.

Minimal example (conceptual) for middleware logic:

```ts
// frontend/middleware.ts (conceptual sketch)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';
  const ua = req.headers.get('user-agent') || '';
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

  // Force mobile domain for mobile devices
  if (isMobile && host === 'skyber.dev') {
    return NextResponse.redirect(new URL(req.nextUrl.pathname + req.nextUrl.search, 'https://m.skyber.dev'));
  }

  // Keep desktop on main
  if (!isMobile && host === 'm.skyber.dev') {
    return NextResponse.redirect(new URL(req.nextUrl.pathname + req.nextUrl.search, 'https://skyber.dev'));
  }

  // Ensure admin pages only on admin.skyber.dev (example: any path under /auth/dashboards)
  if (req.nextUrl.pathname.startsWith('/auth/dashboards') && host !== 'admin.skyber.dev') {
    return NextResponse.redirect(new URL('/login', 'https://admin.skyber.dev'));
  }

  return NextResponse.next();
}
```


### 13) Password Reset (Backend)

Prerequisites:
- Configure SMTP in `backend/.env` (check `backend/controllers/smtp.controller.js` and `backend/utils/smtp-logger.js` for required env keys). Typical variables:
  - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
  - APP_BASE_URL (for constructing reset links—use `https://admin.skyber.dev` if dashboard login/reset happens there)

General flow:
1) User submits email to “forgot password” endpoint
2) Backend generates a token, stores it (DB/Redis), sends email with reset link
3) User clicks link → frontend shows reset page → submits new password + token to backend

Example testing (adjust endpoints based on `backend/routes/auth.routes.js`):

```bash
# 1) Request reset
curl -X POST https://api.skyber.dev/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# 2) After receiving the email, use the token from the link to reset
curl -X POST https://api.skyber.dev/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"<token-from-email>","password":"NewStrongPassword123"}'
```

Tip: Use the backend’s SMTP tester/logging utilities (see `backend/utils/smtp-tester.js`, `backend/utils/smtp-logger.js`) if available in this repo.


### 14) Health and Connectivity Checks

- Frontend health: `curl -I https://skyber.dev`
- Mobile host: `curl -I https://m.skyber.dev`
- Admin host: `curl -I https://admin.skyber.dev`
- Backend health (if route exists): `curl -I https://api.skyber.dev/health` or root path
- DB with prisma: from `backend` run:
  ```bash
  npx prisma db pull
  npx prisma studio # if needed locally (avoid exposing in prod)
  ```


### 15) PM2 Process Management

List and set restart on boot:

```bash
pm2 ls
pm2 save
pm2 startup  # if not already done
```

Reload after deployment:

```bash
# From frontend/
npm run build
pm2 reload skyber-frontend

# From backend/
npm run build || true  # if there is a build step
pm2 reload skyber-backend
```

Logs:

```bash
pm2 logs skyber-frontend
pm2 logs skyber-backend
```


### 16) Common Production Notes

- Keep domains out of `.env` unless the app strictly needs them; your prior setup worked via host detection, which is robust.
- Terminate TLS at Nginx; keep internal proxying over localhost.
- With Cloudflare, set SSL/TLS to “Full (strict)” and use Origin certificates or Let’s Encrypt. Ensure HSTS only after confirming HTTPS works.
- Don’t expose Prisma Studio in production.
- Limit DB network exposure using security groups; prefer `localhost` DB when app and DB are on the same instance.
- Backups: schedule Postgres dumps (see `backend/scripts/backup-postgres.ps1` for inspiration if you’re on Windows; on Linux, use `pg_dump` and cron).

