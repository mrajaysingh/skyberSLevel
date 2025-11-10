"use client";

import React from "react";
import { Button } from "./button";
import { useRouter } from "next/navigation";

interface SessionExpiredCardProps {
  onRefresh?: () => void;
  onLogin?: () => void;
}

export function SessionExpiredCard({ onRefresh, onLogin }: SessionExpiredCardProps) {
  const router = useRouter();

  const handleRefresh = async () => {
    if (onRefresh) {
      onRefresh();
    } else {
      // Try to refresh token
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
          const response = await fetch(`${API_URL}/api/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data?.sessionToken) {
              localStorage.setItem("sessionToken", data.data.sessionToken);
              if (data.data.refreshToken) {
                localStorage.setItem("refreshToken", data.data.refreshToken);
              }
              window.location.reload();
              return;
            }
          }
        } catch (error) {
          console.error("Token refresh failed:", error);
        }
      }
      // If refresh fails, redirect to login
      handleLogin();
    }
  };

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    } else {
      // Clear all auth data
      localStorage.removeItem("sessionToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("skyber_authenticated");
      
      // Redirect to login
      const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || 'admin.skyber.dev';
      const adminBase = adminUrl.startsWith('http') ? adminUrl : `https://${adminUrl}`;
      const currentPath = window.location.pathname;
      
      if (currentPath.startsWith('/auth/dashboards')) {
        window.location.href = `${adminBase}/login`;
      } else {
        router.push("/login");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="max-w-xl w-full mx-auto bg-card border rounded-xl overflow-hidden shadow-2xl">
        <div className="max-w-md mx-auto pt-12 pb-14 px-5 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-5 rounded-full">
            <svg 
              viewBox="0 0 48 48" 
              height={100} 
              width={100} 
              y="0px" 
              x="0px" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-destructive"
            >
              <linearGradient 
                gradientUnits="userSpaceOnUse" 
                y2="37.081" 
                y1="10.918" 
                x2="10.918" 
                x1="37.081" 
                id="SVGID_1__sessionExpired"
              >
                <stop stopColor="#ef4444" offset={0} />
                <stop stopColor="#f87171" offset=".033" />
                <stop stopColor="#fca5a5" offset=".197" />
                <stop stopColor="#fecaca" offset=".362" />
                <stop stopColor="#fee2e2" offset=".525" />
                <stop stopColor="#fef2f2" offset=".687" />
                <stop stopColor="#fef2f2" offset=".846" />
                <stop stopColor="#fff" offset={1} />
              </linearGradient>
              <circle fill="url(#SVGID_1__sessionExpired)" r="18.5" cy={24} cx={24} />
              <path 
                d="M35.401,38.773C32.248,41.21,28.293,42.66,24,42.66C13.695,42.66,5.34,34.305,5.34,24	c0-2.648,0.551-5.167,1.546-7.448" 
                strokeWidth={3} 
                strokeMiterlimit={10} 
                strokeLinejoin="round" 
                strokeLinecap="round" 
                stroke="#dc2626" 
                fill="none" 
              />
              <path 
                d="M12.077,9.646C15.31,6.957,19.466,5.34,24,5.34c10.305,0,18.66,8.354,18.66,18.66	c0,2.309-0.419,4.52-1.186,6.561" 
                strokeWidth={3} 
                strokeMiterlimit={10} 
                strokeLinejoin="round" 
                strokeLinecap="round" 
                stroke="#dc2626" 
                fill="none" 
              />
              <path 
                d="M18 18 L30 30 M30 18 L18 30" 
                strokeWidth={3} 
                strokeMiterlimit={10} 
                strokeLinejoin="round" 
                strokeLinecap="round" 
                stroke="#dc2626" 
                fill="none" 
              />
            </svg>
          </div>
          <h4 className="text-xl text-foreground font-semibold mb-5">
            Your session has expired!
          </h4>
          <p className="text-muted-foreground font-medium">
            Your session token has expired. Please refresh your session or log in again.
          </p>
        </div>
        <div className="pt-5 pb-6 px-6 text-right bg-muted/50 border-t">
          <div className="flex flex-col sm:flex-row gap-2 justify-end">
            <Button
              onClick={handleLogin}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Go to Login
            </Button>
            <Button
              onClick={handleRefresh}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            >
              Refresh Session
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

