"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function MobileRedirect() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Get URLs from environment variables (client-side needs NEXT_PUBLIC_ prefix)
    const mobileUrl = process.env.NEXT_PUBLIC_MOBILE_URL || 'm.skyber.dev';
    const mobileHostname = mobileUrl.replace(/^https?:\/\//, '').split('/')[0];
    const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || 'admin.skyber.dev';
    const adminHostname = adminUrl.replace(/^https?:\/\//, '').split('/')[0];
    const mainDomain = 'skyber.dev';

    // Skip redirect for localhost
    const currentHost = window.location.hostname;
    if (currentHost === "localhost" || currentHost === "127.0.0.1") {
      return;
    }

    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth <= 768;

    // Get current path and query string
    const currentPath = pathname || window.location.pathname;
    const searchParams = window.location.search;
    const hash = window.location.hash;

    // Check if path is a dashboard/auth route
    const isDashboardRoute = currentPath?.startsWith('/auth/dashboards') || currentPath?.startsWith('/login');

    // If user is accessing dashboard routes on main domain, redirect to admin domain
    if (currentHost === mainDomain && isDashboardRoute) {
      const redirectBase = adminUrl.startsWith('http') ? adminUrl : `https://${adminUrl}`;
      const redirectUrl = `${redirectBase}${currentPath}${searchParams}${hash}`;
      window.location.href = redirectUrl;
      return;
    }

    // If user is on admin domain but not on dashboard routes, redirect to main domain
    if (currentHost === adminHostname && !isDashboardRoute) {
      const redirectUrl = `https://${mainDomain}${currentPath}${searchParams}${hash}`;
      window.location.href = redirectUrl;
      return;
    }

    // If desktop user is trying to access m.skyber.dev, redirect to main domain
    if (currentHost === mobileHostname && !isMobile) {
      const redirectUrl = `https://${mainDomain}${currentPath}${searchParams}${hash}`;
      window.location.href = redirectUrl;
      return;
    }

    // If mobile user is on main domain (and not dashboard route), redirect to mobile domain
    if (currentHost === mainDomain && isMobile && !isDashboardRoute) {
      const redirectBase = mobileUrl.startsWith('http') ? mobileUrl : `https://${mobileUrl}`;
      const redirectUrl = `${redirectBase}${currentPath}${searchParams}${hash}`;
      window.location.href = redirectUrl;
      return;
    }

    // Allow all other cases
  }, [pathname]);

  return null;
}

