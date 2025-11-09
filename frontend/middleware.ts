import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for mobile device detection and redirect
 * 
 * Note: Next.js 16 shows a deprecation warning for middleware, suggesting "proxy" instead.
 * However, middleware is still the correct approach for redirects and request modifications.
 * This warning is informational and does not affect functionality.
 */
export function middleware(request: NextRequest) {
  const { pathname, search, hash } = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  
  // Get mobile URL from environment variable
  const mobileUrl = process.env.MOBILE_URL || 'm.skyber.dev';
  const mobileHostname = mobileUrl.replace(/^https?:\/\//, '').split('/')[0];
  
  // Skip redirect if already on mobile URL or localhost
  if (hostname === mobileHostname || hostname === 'localhost' || hostname.startsWith('127.0.0.1') || hostname.startsWith('localhost:')) {
    return NextResponse.next();
  }

  // Check if user is on mobile device
  const userAgent = request.headers.get('user-agent') || '';
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  // Also check viewport width from headers (if available)
  const viewportWidth = request.headers.get('viewport-width');
  const isMobileByWidth = viewportWidth ? parseInt(viewportWidth) <= 768 : false;

  if (isMobile || isMobileByWidth) {
    // Build redirect URL - ensure it has protocol
    const redirectBase = mobileUrl.startsWith('http') ? mobileUrl : `https://${mobileUrl}`;
    const redirectUrl = new URL(`${redirectBase}${pathname}${search}${hash || ''}`);
    
    // Perform redirect
    return NextResponse.redirect(redirectUrl);
  }

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

