# Quick Fix for Build Error

## Run This on Your EC2 Server:

```bash
cd /var/www/skyber/frontend
npm install
npm run build
```

The issue was that `npm install --production` skips devDependencies, but Next.js needs TypeScript (which is in devDependencies) to build.

After running `npm install` (without --production), the build should work.

