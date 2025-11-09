"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export function GoogleAnalytics() {
  const [analyticsId, setAnalyticsId] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const fetchAnalyticsId = async () => {
      try {
        if (typeof window === 'undefined') return;
        
        const sessionToken = localStorage.getItem('sessionToken');
        if (!sessionToken) return;

        // Try to fetch from super-admin dashboard endpoint first
        let response = await fetch(`${API_URL}/api/dashboard/super-admin`, {
          headers: { 'Authorization': `Bearer ${sessionToken}` },
          cache: 'no-store'
        });

        if (response.ok) {
          const data = await response.json();
          const googleAnalyticsId = data?.data?.dashboard?.user?.googleAnalyticsId;
          if (googleAnalyticsId && typeof googleAnalyticsId === 'string' && googleAnalyticsId.trim()) {
            setAnalyticsId(googleAnalyticsId.trim());
            return;
          }
        }

        // If super-admin endpoint fails or doesn't have analytics ID, 
        // try regular user dashboard (for future support)
        // For now, we only support super-admin
      } catch (error) {
        // Silently fail - analytics is not critical
        console.debug('Failed to fetch Google Analytics ID:', error);
      }
    };

    fetchAnalyticsId();
  }, [API_URL]);

  if (!analyticsId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${analyticsId}');
        `}
      </Script>
    </>
  );
}

