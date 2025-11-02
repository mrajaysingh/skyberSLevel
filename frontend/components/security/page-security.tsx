"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface SecurityContextType {
      isAuthenticated: boolean;
      user: {
        id: string;
        email: string;
        name: string | null;
        role: string;
        planTier: string;
        status?: string;
        currentIp?: string;
        lastIp?: string;
      } | null;
      login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
      logout: () => Promise<void>;
    }

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error("useSecurity must be used within SecurityProvider");
  }
  return context;
};

export function SecurityProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<SecurityContextType['user']>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Backend API URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Check localStorage on mount
  useEffect(() => {
    const sessionToken = localStorage.getItem("sessionToken");
    const userData = localStorage.getItem("userData");
    
    if (sessionToken) {
      setIsAuthenticated(true);
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }
    }
  }, []);

  // Protect auth routes
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const sessionToken = localStorage.getItem("sessionToken");
    const isAuthRoute = pathname?.startsWith("/auth/dashboards");
    
    if (isAuthRoute && !sessionToken) {
      // Store the intended destination
      sessionStorage.setItem("skyber_redirect_after_login", pathname || "/");
      router.push("/login");
    }
  }, [pathname, router]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

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

      if (redirectPath) {
        router.push(redirectPath);
      } else if (data.data.user.role === 'super-admin') {
        // Auto-redirect super-admin to dashboard
        router.push("/auth/dashboards/user/super-admin");
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
    <SecurityContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </SecurityContext.Provider>
  );
}

