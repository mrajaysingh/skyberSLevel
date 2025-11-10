# Cloudflare DNS Setup Guide: api.skyber.dev & m.skyber.dev

This guide explains the DNS proxy settings (proxied vs unproxied) for your domains on Cloudflare.

## Understanding Cloudflare Proxy Settings

### Proxied (Orange Cloud) ☁️
- Traffic routes through Cloudflare's CDN/proxy
- Provides DDoS protection, caching, and SSL
- Hides your server's real IP address
- May interfere with WebSockets, real IP detection, and some API features
- Better for static content and websites

### Unproxied (Grey Cloud) ⚪
- Direct connection to your server
- No Cloudflare proxy/CDN
- Real IP addresses are visible
- Better for APIs, WebSockets, and real-time connections
- Lower latency for direct connections
- No caching or DDoS protection from Cloudflare

## Recommended Settings

### api.skyber.dev (Backend API) - **UNPROXIED** ⚪

**Why Unproxied:**
- ✅ APIs need direct connections for optimal performance
- ✅ WebSockets work properly without proxy interference
- ✅ Real IP addresses are needed for security and rate limiting
- ✅ No caching needed for API responses (APIs should be dynamic)
- ✅ Lower latency for API calls
- ✅ Better for authentication tokens and session management
- ✅ Prevents issues with CORS and preflight requests

**Cloudflare DNS Settings:**
```
Type: A
Name: api
Content: <your-ec2-ip-address>
Proxy status: DNS only (Grey Cloud) ⚪
TTL: Auto (or 300 seconds)
```

### m.skyber.dev (Frontend) - **PROXIED** ☁️

**Why Proxied:**
- ✅ Static assets (JS, CSS, images) benefit from CDN caching
- ✅ DDoS protection for your frontend
- ✅ SSL/TLS termination handled by Cloudflare
- ✅ Better performance for global users
- ✅ Reduced server load
- ✅ Free SSL certificate from Cloudflare

**Cloudflare DNS Settings:**
```
Type: A
Name: m
Content: <your-ec2-ip-address>
Proxy status: Proxied (Orange Cloud) ☁️
TTL: Auto
```

**Note:** If you're using WebSockets or Server-Sent Events (SSE) in your Next.js app, you may need to set it to **unproxied** or configure Cloudflare WebSocket support.

## Step-by-Step Cloudflare DNS Configuration

### 1. Login to Cloudflare
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Select your domain (`skyber.dev`)
3. Navigate to **DNS** → **Records**

### 2. Configure api.skyber.dev (Unproxied)

1. Click **Add record**
2. Configure as follows:
   - **Type:** `A`
   - **Name:** `api`
   - **IPv4 address:** `<your-ec2-ip-address>`
   - **Proxy status:** **DNS only** (Grey Cloud) ⚪
   - **TTL:** `Auto` or `300`
3. Click **Save**

**Example:**
```
Type: A
Name: api
Content: 54.123.45.67
Proxy: OFF (Grey Cloud) ⚪
TTL: Auto
```

### 3. Configure m.skyber.dev (Proxied)

1. Click **Add record**
2. Configure as follows:
   - **Type:** `A`
   - **Name:** `m`
   - **IPv4 address:** `<your-ec2-ip-address>`
   - **Proxy status:** **Proxied** (Orange Cloud) ☁️
   - **TTL:** `Auto`
3. Click **Save**

**Example:**
```
Type: A
Name: m
Content: 54.123.45.67
Proxy: ON (Orange Cloud) ☁️
TTL: Auto
```

## Additional Cloudflare Settings

### For api.skyber.dev (Unproxied)

Since it's unproxied, configure these settings:

1. **SSL/TLS Mode:**
   - Go to **SSL/TLS** → **Overview**
   - Set to **Full** or **Full (strict)** (if you have SSL on your server)
   - This ensures HTTPS works properly

2. **Page Rules (Optional):**
   - No page rules needed since it's unproxied
   - All traffic goes directly to your server

3. **Firewall Rules:**
   - Set up firewall rules to protect your API
   - Block known bad IPs
   - Rate limiting (if needed)

### For m.skyber.dev (Proxied)

1. **SSL/TLS Mode:**
   - Go to **SSL/TLS** → **Overview**
   - Set to **Full** or **Full (strict)**
   - Cloudflare will handle SSL termination

2. **Caching:**
   - Go to **Caching** → **Configuration**
   - Enable caching for static assets
   - Set cache level to **Standard**
   - Browser Cache TTL: **4 hours** or **1 month** for static assets

3. **Page Rules (Recommended):**
   Create page rules for better caching:
   
   **Rule 1: Cache Static Assets**
   ```
   URL Pattern: m.skyber.dev/_next/static/*
   Settings:
   - Cache Level: Cache Everything
   - Edge Cache TTL: 1 month
   - Browser Cache TTL: 1 month
   ```
   
   **Rule 2: Don't Cache API Routes**
   ```
   URL Pattern: m.skyber.dev/api/*
   Settings:
   - Cache Level: Bypass
   ```

4. **Speed Optimizations:**
   - Enable **Auto Minify** for JS, CSS, HTML
   - Enable **Brotli** compression
   - Enable **HTTP/2** and **HTTP/3**

5. **WebSocket Support (if needed):**
   - If using WebSockets, ensure they're enabled
   - Go to **Network** → Enable **WebSockets**

## Security Settings

### For Both Domains

1. **Security Level:**
   - Set to **Medium** or **High**
   - Go to **Security** → **Settings**

2. **Bot Fight Mode:**
   - Enable for `m.skyber.dev` (frontend)
   - Consider enabling for `api.skyber.dev` if you have bot issues

3. **Rate Limiting:**
   - Set up rate limiting for `api.skyber.dev`
   - Protect against API abuse
   - Go to **Security** → **WAF** → **Rate limiting rules**

4. **WAF (Web Application Firewall):**
   - Enable for both domains
   - Protect against common attacks
   - Go to **Security** → **WAF**

## Testing Your Configuration

### Test api.skyber.dev (Unproxied)

```bash
# Check DNS resolution
dig api.skyber.dev

# Should show your EC2 IP directly
# Test API endpoint
curl https://api.skyber.dev/api/health

# Check if real IP is visible (should show your server's IP)
curl https://api.skyber.dev/api/ip
```

### Test m.skyber.dev (Proxied)

```bash
# Check DNS resolution
dig m.skyber.dev

# Should show Cloudflare IPs (not your EC2 IP)
# Test frontend
curl -I https://m.skyber.dev

# Check headers - should see Cloudflare headers
curl -I https://m.skyber.dev | grep -i cloudflare
```

## Troubleshooting

### Issue: API requests failing with CORS errors

**Solution:**
- Ensure `api.skyber.dev` is **unproxied**
- Check CORS configuration in your backend
- Verify `FRONTEND_URL` in backend `.env` matches `https://m.skyber.dev`

### Issue: WebSockets not working

**Solution:**
- For `api.skyber.dev`: Ensure it's **unproxied**
- For `m.skyber.dev`: Either set to **unproxied** or enable WebSocket support in Cloudflare
- Go to **Network** → Enable **WebSockets**

### Issue: Real IP addresses not visible

**Solution:**
- For `api.skyber.dev`: Should be **unproxied** to see real IPs
- For `m.skyber.dev`: If you need real IPs, set to **unproxied**
- Configure your server to read `CF-Connecting-IP` header if proxied

### Issue: SSL certificate errors

**Solution:**
- Ensure SSL/TLS mode is set to **Full** or **Full (strict)**
- Verify your server has a valid SSL certificate
- For `api.skyber.dev`: Use Let's Encrypt or your own certificate
- For `m.skyber.dev`: Cloudflare provides free SSL

## Summary

| Domain | Proxy Status | Reason |
|--------|-------------|--------|
| `api.skyber.dev` | **Unproxied** ⚪ | Direct API connections, WebSockets, real IPs needed |
| `m.skyber.dev` | **Proxied** ☁️ | CDN caching, DDoS protection, better performance |

## Quick Reference

### api.skyber.dev
- ✅ **Unproxied** (Grey Cloud)
- ✅ SSL/TLS: Full or Full (strict)
- ✅ Direct connection to server
- ✅ Real IP addresses visible

### m.skyber.dev
- ✅ **Proxied** (Orange Cloud)
- ✅ SSL/TLS: Full or Full (strict)
- ✅ CDN caching enabled
- ✅ DDoS protection active

## Additional Resources

- [Cloudflare DNS Documentation](https://developers.cloudflare.com/dns/)
- [Cloudflare Proxy Settings](https://developers.cloudflare.com/fundamentals/get-started/concepts/how-cloudflare-works/)
- [Cloudflare SSL/TLS Modes](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/)
- [Cloudflare WebSocket Support](https://developers.cloudflare.com/fundamentals/get-started/concepts/cloudflare-challenges/)

