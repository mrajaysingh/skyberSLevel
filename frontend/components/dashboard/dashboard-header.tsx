"use client";

import { useState, useEffect } from "react";
import { useSecurity } from "@/components/security/page-security";
import { Button } from "@/components/ui/button";
import { DashboardThemeSwitcher } from "@/components/dashboard/dashboard-theme-switcher";
import { Shield, LogOut, User } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type DashboardHeaderProps = {
  title?: string;
  subtitle?: string;
  ip?: string | null;
  onRefresh?: () => void;
  refreshing?: boolean;
  rightActions?: React.ReactNode;
};

export function DashboardHeader({
  title = "Dashboard",
  subtitle,
  ip: propIp,
  onRefresh: propOnRefresh,
  refreshing: propRefreshing = false,
  rightActions,
}: DashboardHeaderProps) {
  const { user, logout } = useSecurity();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [ip, setIp] = useState<string | null>(propIp || null);
  const [refreshing, setRefreshing] = useState(propRefreshing);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Fetch IP from dashboard API if not provided
  useEffect(() => {
    if (propIp !== undefined) {
      setIp(propIp);
      return;
    }
    
    const fetchIp = async () => {
      try {
        const sessionToken = localStorage.getItem("sessionToken");
        if (!sessionToken) return;
        
        const response = await fetch(`${API_URL}/api/dashboard/super-admin`, {
          headers: { 'Authorization': `Bearer ${sessionToken}` },
          cache: 'no-store'
        });
        
        if (!response.ok) return;
        
        const data = await response.json();
        const userData = data?.data?.dashboard?.user;
        if (userData) {
          setIp(userData.displayIp || userData.currentIp || userData.currentRequestIp || null);
        }
      } catch (error) {
        console.error("Error fetching IP:", error);
      }
    };
    
    fetchIp();
  }, [propIp, API_URL]);

  // Update refreshing state when prop changes
  useEffect(() => {
    setRefreshing(propRefreshing);
  }, [propRefreshing]);

  // Default refresh handler if not provided
  const handleRefresh = async () => {
    if (propOnRefresh) {
      propOnRefresh();
      return;
    }
    
    // Default refresh: reload dashboard data and update IP
    setRefreshing(true);
    try {
      const sessionToken = localStorage.getItem("sessionToken");
      if (!sessionToken) return;
      
      const response = await fetch(`${API_URL}/api/dashboard/super-admin?ts=${Date.now()}`, {
        headers: { 'Authorization': `Bearer ${sessionToken}` },
        cache: 'no-store'
      });
      
      if (response.ok) {
        const data = await response.json();
        const userData = data?.data?.dashboard?.user;
        if (userData) {
          setIp(userData.displayIp || userData.currentIp || userData.currentRequestIp || null);
        }
        // Trigger a page refresh to update all data
        window.location.reload();
      }
    } catch (error) {
      console.error("Error refreshing:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const performLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      try {
        localStorage.removeItem("sessionId");
        localStorage.removeItem("sessionToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userData");
        localStorage.removeItem("skyber_authenticated");
        sessionStorage.clear();
      } catch (_) {}
      await logout();
    } finally {
      setIsLoggingOut(false);
      setShowLogoutDialog(false);
    }
  };

  return (
    <header className="border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed top-0 right-0 left-0 md:left-64 z-50 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-[#17D492]" />
            <h1 className="text-2xl font-bold">
              {title}
              {subtitle ? (
                <span className="ml-2 text-xs text-muted-foreground align-sub font-sans">{subtitle}</span>
              ) : null}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Username, IP, and Role - Always visible */}
            <div className="hidden sm:flex flex-col items-end gap-1">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground font-medium">{user?.name || "User"}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#17D492]/10 text-[#17D492]">
                  ● Online
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {ip ? <span>IP: {ip}</span> : null}
                <span className="px-2 py-0.5 bg-[#17D492]/10 text-[#17D492] rounded-full font-medium">
                  {user?.role || "user"}
                </span>
              </div>
            </div>
            {/* Theme Switcher - Always visible */}
            <DashboardThemeSwitcher />
            {/* Refresh Button - Always visible */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={refreshing}
              className="relative"
              aria-label="Refresh dashboard"
            >
              <svg className={refreshing ? "h-4 w-4 animate-spin" : "h-4 w-4"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.13-3.36L23 10M1 14l5.36 5.36A9 9 0 0020.49 15"/></svg>
            </Button>
            {/* Custom right actions (if any) */}
            {rightActions}
            {/* Logout Button - Always visible */}
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(true)}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
      <Dialog 
        open={showLogoutDialog} 
        onOpenChange={(open) => {
          if (!isLoggingOut) setShowLogoutDialog(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowLogoutDialog(false)} disabled={isLoggingOut}>Stay</Button>
            <Button className="bg-[#17D492] hover:bg-[#17D492]/90 text-white" onClick={performLogout} disabled={isLoggingOut}>
              {isLoggingOut ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Cleaning...
                </span>
              ) : (
                'Clean'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}


