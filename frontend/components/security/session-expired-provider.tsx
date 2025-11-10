"use client";

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { SessionExpiredCard } from "@/components/ui/session-expired-card";
import { setSessionExpiredHandler } from "@/lib/api-client";

interface SessionExpiredContextType {
  showSessionExpired: () => void;
  hideSessionExpired: () => void;
  isSessionExpired: boolean;
}

const SessionExpiredContext = createContext<SessionExpiredContextType | undefined>(undefined);

export const useSessionExpired = () => {
  const context = useContext(SessionExpiredContext);
  if (!context) {
    throw new Error("useSessionExpired must be used within SessionExpiredProvider");
  }
  return context;
};

export function SessionExpiredProvider({ children }: { children: ReactNode }) {
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  const showSessionExpired = useCallback(() => {
    setIsSessionExpired(true);
  }, []);

  const hideSessionExpired = useCallback(() => {
    setIsSessionExpired(false);
  }, []);

  // Register the handler with the API client
  useEffect(() => {
    setSessionExpiredHandler(showSessionExpired);
    return () => {
      setSessionExpiredHandler(() => {});
    };
  }, [showSessionExpired]);

  const handleRefresh = async () => {
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
            setIsSessionExpired(false);
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
  };

  const handleLogin = () => {
    // Clear all auth data
    localStorage.removeItem("sessionToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("skyber_authenticated");
    
    // Redirect to login
    const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || 'admin.skyber.dev';
    const adminBase = adminUrl.startsWith('http') ? adminUrl : `https://${adminUrl}`;
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    
    if (currentPath.startsWith('/auth/dashboards')) {
      window.location.href = `${adminBase}/login`;
    } else {
      window.location.href = '/login';
    }
  };

  return (
    <SessionExpiredContext.Provider value={{ showSessionExpired, hideSessionExpired, isSessionExpired }}>
      {children}
      {isSessionExpired && (
        <SessionExpiredCard onRefresh={handleRefresh} onLogin={handleLogin} />
      )}
    </SessionExpiredContext.Provider>
  );
}

