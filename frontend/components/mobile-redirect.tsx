"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function MobileRedirect() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Get mobile URL from environment variable (client-side needs NEXT_PUBLIC_ prefix)
    const mobileUrl = process.env.NEXT_PUBLIC_MOBILE_URL || 'm.skyber.dev';
    const mobileHostname = mobileUrl.replace(/^https?:\/\//, '').split('/')[0];

    // Check if already on mobile URL or localhost
    const currentHost = window.location.hostname;
    if (currentHost === mobileHostname || currentHost === "localhost" || currentHost === "127.0.0.1") {
      return;
    }

    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth <= 768;

    if (isMobile) {
      // Get current path and query string
      const currentPath = pathname || window.location.pathname;
      const searchParams = window.location.search;
      const hash = window.location.hash;
      
      // Build the redirect URL - ensure it has protocol
      const redirectBase = mobileUrl.startsWith('http') ? mobileUrl : `https://${mobileUrl}`;
      const redirectUrl = `${redirectBase}${currentPath}${searchParams}${hash}`;
      
      // Perform redirect
      window.location.href = redirectUrl;
    }
  }, [pathname]);

  return null;
}

