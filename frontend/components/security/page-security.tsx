"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SessionExpiredProvider, useSessionExpired } from "./session-expired-provider";

interface SecurityContextType {
      isAuthenticated: boolean;
      user: {
        id: string;
        email: string;
        name: string | null;
        firstName?: string | null;
        middleName?: string | null;
        lastName?: string | null;
        username?: string | null;
        role: string;
        planTier: string;
        status?: string;
        currentIp?: string;
        lastIp?: string;
        avatar?: string | null;
        banner?: string | null;
        designation?: string | null;
        company?: string | null;
      } | null;
      login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
      logout: () => Promise<void>;
      updateUser: (updates: Partial<SecurityContextType['user']>) => void;
    }

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error("useSecurity must be used within SecurityProvider");
  }
  return context;
};

function SecurityProviderContent({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { showSessionExpired } = useSessionExpired();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    if (window.location?.pathname === '/login') return false;
    return !!localStorage.getItem('sessionToken');
  });
  const [user, setUser] = useState<SecurityContextType['user']>(() => {
    if (typeof window === 'undefined') return null;
    if (window.location?.pathname === '/login') return null;
    const raw = localStorage.getItem('userData');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  });

  // Backend API URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Immediately clear cached auth when user is on the login page
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pathname === "/login") {
      try {
        localStorage.removeItem("sessionId");
        localStorage.removeItem("sessionToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userData");
        localStorage.removeItem("skyber_authenticated");
        sessionStorage.clear();
      } catch (_) {}
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [pathname]);

  // Protect auth routes + verify token when present
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isAuthRoute = pathname?.startsWith("/auth/dashboards");
    const sessionToken = localStorage.getItem("sessionToken");

    const redirectToLogin = () => {
      sessionStorage.setItem("skyber_redirect_after_login", pathname || "/");
      try {
        localStorage.removeItem("sessionToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userData");
        localStorage.removeItem("skyber_authenticated");
      } catch (_) {}
      setIsAuthenticated(false);
      setUser(null);
      
      // Redirect to login on admin domain if on dashboard route
      const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || 'admin.skyber.dev';
      const adminBase = adminUrl.startsWith('http') ? adminUrl : `https://${adminUrl}`;
      
      if (isAuthRoute) {
        window.location.href = `${adminBase}/login`;
      } else {
        router.push("/login");
      }
    };

    // If on protected route without token → redirect
    if (isAuthRoute && !sessionToken) {
      redirectToLogin();
      return;
    }

    // If token exists on protected route, verify it once
    const verify = async () => {
      try {
        if (!isAuthRoute || !sessionToken) return;
        const r = await fetch(`${API_URL}/api/auth/verify`, {
          headers: { 'Authorization': `Bearer ${sessionToken}` },
          cache: 'no-store'
        });
        if (!r.ok) {
          // Show session expired card instead of immediate redirect
          if (r.status === 401) {
            showSessionExpired();
          } else {
            redirectToLogin();
          }
          return;
        }
        const j = await r.json().catch(() => ({}));
        if (!j?.success) {
          if (r.status === 401) {
            showSessionExpired();
          } else {
            redirectToLogin();
          }
        }
      } catch (_) {
        redirectToLogin();
      }
    };
    verify();
  }, [pathname, router, showSessionExpired]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Check if response is JSON before parsing
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        return {
          success: false,
          error: "Server returned invalid response. Please check if the backend is running."
        };
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          error: data.message || 'Login failed'
        };
      }

      // Store tokens and user data
      localStorage.setItem("sessionToken", data.data.sessionToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      localStorage.setItem("userData", JSON.stringify(data.data.user));
      localStorage.setItem("skyber_authenticated", "true");

      // Update state
      setIsAuthenticated(true);
      setUser(data.data.user);

      // Redirect based on role
      const redirectPath = sessionStorage.getItem("skyber_redirect_after_login");
      sessionStorage.removeItem("skyber_redirect_after_login");

      // Get admin URL from environment variable
      const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || 'admin.skyber.dev';
      const adminBase = adminUrl.startsWith('http') ? adminUrl : `https://${adminUrl}`;

      if (redirectPath) {
        // If redirect path is a dashboard route, redirect to admin domain
        if (redirectPath.startsWith('/auth/dashboards') || redirectPath.startsWith('/login')) {
          window.location.href = `${adminBase}${redirectPath}`;
        } else {
          router.push(redirectPath);
        }
      } else if (data.data.user.role === 'super-admin') {
        // Auto-redirect super-admin to dashboard on admin domain
        window.location.href = `${adminBase}/auth/dashboards/user/super-admin`;
      } else {
        router.push("/");
      }

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: "Network error. Please try again."
      };
    }
  };

  const updateUser = (updates: Partial<SecurityContextType['user']>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem('userData', JSON.stringify(next));
      } catch (_) {}
      return next;
    });
  };

  const logout = async (): Promise<void> => {
    try {
      const sessionToken = localStorage.getItem("sessionToken");
      
      // Call backend logout endpoint
      if (sessionToken) {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sessionToken}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear all auth data
      localStorage.removeItem("sessionToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("skyber_authenticated");
      
      setIsAuthenticated(false);
      setUser(null);
      router.push("/");
    }
  };

  return (
    <SecurityContext.Provider value={{ isAuthenticated, user, login, logout, updateUser }}>
      {children}
    </SecurityContext.Provider>
  );
}

export function SecurityProvider({ children }: { children: ReactNode }) {
  return (
    <SessionExpiredProvider>
      <SecurityProviderContent>{children}</SecurityProviderContent>
    </SessionExpiredProvider>
  );
}

