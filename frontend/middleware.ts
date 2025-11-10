import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for mobile device detection, admin domain routing, and redirects
 * 
 * Note: Next.js 16 shows a deprecation warning for middleware, suggesting "proxy" instead.
 * However, middleware is still the correct approach for redirects and request modifications.
 * This warning is informational and does not affect functionality.
 */
export function middleware(request: NextRequest) {
  const { pathname, search, hash } = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  
  // Get URLs from environment variables
  const mobileUrl = process.env.MOBILE_URL || 'm.skyber.dev';
  const mobileHostname = mobileUrl.replace(/^https?:\/\//, '').split('/')[0];
  const adminUrl = process.env.ADMIN_URL || 'admin.skyber.dev';
  const adminHostname = adminUrl.replace(/^https?:\/\//, '').split('/')[0];
  const mainDomain = 'skyber.dev';
  
  // Skip redirect for localhost
  if (hostname === 'localhost' || hostname.startsWith('127.0.0.1') || hostname.startsWith('localhost:')) {
    return NextResponse.next();
  }

  // Check if user is on mobile device
  const userAgent = request.headers.get('user-agent') || '';
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  // Also check viewport width from headers (if available)
  const viewportWidth = request.headers.get('viewport-width');
  const isMobileByWidth = viewportWidth ? parseInt(viewportWidth) <= 768 : false;
  const isMobileDevice = isMobile || isMobileByWidth;

  // Check if path is a dashboard/auth route
  const isDashboardRoute = pathname?.startsWith('/auth/dashboards') || pathname?.startsWith('/login');

  // If user is accessing dashboard routes on main domain, redirect to admin domain
  if (hostname === mainDomain && isDashboardRoute) {
    const redirectBase = adminUrl.startsWith('http') ? adminUrl : `https://${adminUrl}`;
    const redirectUrl = new URL(`${redirectBase}${pathname}${search}${hash || ''}`);
    return NextResponse.redirect(redirectUrl);
  }

  // If user is on admin domain but not on dashboard routes, redirect to main domain
  if (hostname === adminHostname && !isDashboardRoute) {
    const redirectUrl = new URL(`https://${mainDomain}${pathname}${search}${hash || ''}`);
    return NextResponse.redirect(redirectUrl);
  }

  // If desktop user is trying to access m.skyber.dev, redirect to main domain
  if (hostname === mobileHostname && !isMobileDevice) {
    const redirectUrl = new URL(`https://${mainDomain}${pathname}${search}${hash || ''}`);
    return NextResponse.redirect(redirectUrl);
  }

  // If mobile user is on main domain, redirect to mobile domain
  if (hostname === mainDomain && isMobileDevice && !isDashboardRoute) {
    const redirectBase = mobileUrl.startsWith('http') ? mobileUrl : `https://${mobileUrl}`;
    const redirectUrl = new URL(`${redirectBase}${pathname}${search}${hash || ''}`);
    return NextResponse.redirect(redirectUrl);
  }

  // Allow all other cases
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

