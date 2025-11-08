"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSecurity } from "@/components/security/page-security";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LogOut, User, Shield, Zap, RefreshCw, Database, Server, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardThemeSwitcher } from "@/components/dashboard/dashboard-theme-switcher";
import { useToast } from "@/components/ui/toast-provider";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardBody } from "@/components/dashboard/dashboard-body";

export default function SuperAdminDashboard() {
  const { logout, user } = useSecurity();
  const router = useRouter();
  const { showSuccess } = useToast();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [globalRefreshing, setGlobalRefreshing] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      // Fetch dashboard data from backend
      const fetchDashboardData = async (isRefresh = false) => {
        // Validate API URL is accessible
        if (!API_URL || API_URL === 'undefined') {
          console.error('API URL is not configured. Please set NEXT_PUBLIC_API_URL in .env.local');
          setLoading(false);
          setRefreshing(false);
          return;
        }
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const sessionToken = localStorage.getItem("sessionToken");
      if (!sessionToken) {
        router.push("/login");
        return;
      }

      const url = isRefresh
        ? `${API_URL}/api/dashboard/super-admin?ts=${Date.now()}`
        : `${API_URL}/api/dashboard/super-admin`;
      const response = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        },
      });

      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("sessionToken");
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setDashboardData(data.data.dashboard);
      } else {
        console.error("Dashboard API error:", data.message);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Don't redirect on network errors, just show error
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.error("❌ Backend server may be down or unreachable.");
        console.error("📍 Expected backend URL:", API_URL);
        console.error("💡 Please ensure:");
        console.error("   1. Backend server is running (npm run dev in backend folder)");
        console.error("   2. Backend is accessible at:", API_URL);
        console.error("   3. CORS is properly configured");
        console.error("   4. No firewall is blocking the connection");
      } else if (error instanceof Error && error.message?.includes('HTTP error')) {
        console.error("HTTP Error:", error.message);
      } else {
        console.error("Unknown error:", error);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [router, API_URL]);

  const handleGlobalRefresh = async () => {
    if (globalRefreshing) return;
    setGlobalRefreshing(true);
    try {
      await fetchDashboardData(true);
      // Ask Next.js to revalidate any cached data for this route (if any)
      try { router.refresh(); } catch (_) {}
    } finally {
      setGlobalRefreshing(false);
    }
  };

  // Live clock (Asia/Kolkata, 12h, no seconds)
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const timeFormatter = new Intl.DateTimeFormat('en-IN', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
      });
      const dateFormatter = new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        timeZone: 'Asia/Kolkata'
      });
      const time = timeFormatter.format(now);
      const date = dateFormatter.format(now);
      setCurrentTime(`${time} • ${date}`);
    };
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, []);

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      // Show success toast immediately
      showSuccess("Logout successful", "Redirecting to Home...");

      // Brief delay to render loader/toast smoothly
      await new Promise((r) => setTimeout(r, 250));

      // Proactively clean client-side state
      try {
        localStorage.removeItem("sessionId");
        localStorage.removeItem("sessionToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userData");
        localStorage.removeItem("skyber_authenticated");
        sessionStorage.clear();
      } catch (_) {}

      // Call shared logout (server + final redirect)
      await logout();
    } finally {
      setIsLoggingOut(false);
      setShowLogoutDialog(false);
    }
  };

  // Check if user is super-admin
  useEffect(() => {
    if (user && user.role !== 'super-admin') {
      router.push("/");
    }
  }, [user, router]);

  return (
        <>
          {/* Logout Confirmation Dialog */}
        <Dialog 
          open={showLogoutDialog} 
          onOpenChange={(open) => {
            if (!isLoggingOut) {
              setShowLogoutDialog(open);
            }
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
              <Button 
                variant="outline" 
                onClick={() => setShowLogoutDialog(false)}
                disabled={isLoggingOut}
              >
                Stay
              </Button>
              <Button 
                className="bg-[#17D492] hover:bg-[#17D492]/90 text-white" 
                onClick={confirmLogout}
                disabled={isLoggingOut}
              >
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

        {/* Header */}
        <DashboardHeader 
          title="Super Admin Dashboard" 
          subtitle="- Skyber Engine v 7SKB.R2.02.5"
          ip={dashboardData?.user?.displayIp || dashboardData?.user?.currentIp || dashboardData?.user?.currentRequestIp || null}
          onRefresh={handleGlobalRefresh}
          refreshing={globalRefreshing}
        />

        {/* Dashboard Content */}
        <DashboardBody>
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#17D492] mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading dashboard...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Welcome Card */}
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-[#17D492]" />
                    Welcome, {user?.name || 'Super Admin'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    This is your secure super admin dashboard. You have full access to system management and configuration.
                  </p>
                  {(user || dashboardData?.user) && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                      <div className="bg-secondary rounded-lg p-3 border">
                        <p className="text-xs text-muted-foreground mb-1">Time</p>
                        <p className="font-medium text-sm skyber-text">{globalRefreshing ? '' : currentTime}</p>
                        {globalRefreshing && (
                          <span className="mt-2 inline-block h-3 w-3 rounded-full border-2 border-foreground/30 border-t-[#17D492] animate-spin" />
                        )}
                      </div>
                      <div className="bg-secondary rounded-lg p-3 border">
                        <p className="text-xs text-muted-foreground mb-1">Email</p>
                        <p className="font-medium text-sm">{globalRefreshing ? '' : (user?.email || dashboardData?.user?.email)}</p>
                        {globalRefreshing && (
                          <span className="mt-2 inline-block h-3 w-3 rounded-full border-2 border-foreground/30 border-t-[#17D492] animate-spin" />
                        )}
                      </div>
                      <div className="bg-secondary rounded-lg p-3 border">
                        <p className="text-xs text-muted-foreground mb-1">Role</p>
                        <p className="font-medium text-sm capitalize">{globalRefreshing ? '' : (user?.role || 'super-admin')}</p>
                        {globalRefreshing && (
                          <span className="mt-2 inline-block h-3 w-3 rounded-full border-2 border-foreground/30 border-t-[#17D492] animate-spin" />
                        )}
                      </div>
                      <div className="bg-secondary rounded-lg p-3 border">
                        <p className="text-xs text-muted-foreground mb-1">Plan Tier</p>
                        <p className="font-medium text-sm capitalize">{globalRefreshing ? '' : (user?.planTier || dashboardData?.user?.planTier || 'enterprise')}</p>
                        {globalRefreshing && (
                          <span className="mt-2 inline-block h-3 w-3 rounded-full border-2 border-foreground/30 border-t-[#17D492] animate-spin" />
                        )}
                      </div>
                      <div className="bg-secondary rounded-lg p-3 border">
                        <p className="text-xs text-muted-foreground mb-1">Status</p>
                        <p className="font-medium text-sm text-[#17D492]">
                          {globalRefreshing ? '' : (dashboardData?.user?.isActive !== false ? 'Active' : 'Inactive')}
                        </p>
                        {globalRefreshing && (
                          <span className="mt-2 inline-block h-3 w-3 rounded-full border-2 border-foreground/30 border-t-[#17D492] animate-spin" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* System Status incl. IDs */}
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">System Status</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchDashboardData(true)}
                        disabled={refreshing}
                        className="flex items-center gap-2"
                      >
                        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                      </Button>
                    </div>
                    {/* IDs Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-secondary/50 rounded-lg p-4 border">
                        <p className="text-xs text-muted-foreground mb-1">User ID</p>
                        <p className="font-medium text-sm font-mono break-all">{globalRefreshing ? '' : (dashboardData?.user?.id || user?.id || 'N/A')}</p>
                        {globalRefreshing && (
                          <span className="mt-2 inline-block h-3 w-3 rounded-full border-2 border-foreground/30 border-t-[#17D492] animate-spin" />
                        )}
                      </div>
                      <div className="bg-secondary/50 rounded-lg p-4 border">
                        <p className="text-xs text-muted-foreground mb-1">Session ID</p>
                        <p className="font-medium text-sm font-mono break-all">{globalRefreshing ? '' : (dashboardData?.systemInfo?.session?.id || 'N/A')}</p>
                        {globalRefreshing && (
                          <span className="mt-2 inline-block h-3 w-3 rounded-full border-2 border-foreground/30 border-t-[#17D492] animate-spin" />
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Prisma Database Status */}
                      <div className="bg-secondary/50 rounded-lg p-4 border shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Database className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Database</p>
                              <p className="text-xs text-muted-foreground">PostgreSQL (Prisma)</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {globalRefreshing ? (
                              <span className="ml-2 inline-block h-3 w-3 rounded-full border-2 border-foreground/30 border-t-[#17D492] animate-spin" />
                            ) : (
                              dashboardData?.systemInfo?.database?.status === 'active' ? (
                                <>
                                  <CheckCircle2 className="h-5 w-5 text-[#17D492]" />
                                  <span className="text-sm font-medium text-[#17D492]">Active</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-5 w-5 text-destructive" />
                                  <span className="text-sm font-medium text-destructive">Down</span>
                                </>
                              )
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Redis Status */}
                      <div className="bg-secondary/50 rounded-lg p-4 border shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Server className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Redis Cache</p>
                              <p className="text-xs text-muted-foreground">Session Cache</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {globalRefreshing ? (
                              <span className="ml-2 inline-block h-3 w-3 rounded-full border-2 border-foreground/30 border-t-[#17D492] animate-spin" />
                            ) : (
                              dashboardData?.systemInfo?.redis?.status === 'active' ? (
                                <>
                                  <CheckCircle2 className="h-5 w-5 text-[#17D492]" />
                                  <span className="text-sm font-medium text-[#17D492]">Active</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-5 w-5 text-destructive" />
                                  <span className="text-sm font-medium text-destructive">Down</span>
                                </>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Cards */}
              {dashboardData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{globalRefreshing ? '' : (dashboardData.stats?.totalUsers || 0)}</div>
                      {globalRefreshing && (
                        <span className="mt-2 inline-block h-3 w-3 rounded-full border-2 border-foreground/30 border-t-[#17D492] animate-spin" />
                      )}
                    </CardContent>
                  </Card>
                  <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{globalRefreshing ? '' : (dashboardData.stats?.totalProjects || 0)}</div>
                      {globalRefreshing && (
                        <span className="mt-2 inline-block h-3 w-3 rounded-full border-2 border-foreground/30 border-t-[#17D492] animate-spin" />
                      )}
                    </CardContent>
                  </Card>
                  <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Active Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{globalRefreshing ? '' : (dashboardData.stats?.activeSessions || 0)}</div>
                      {globalRefreshing && (
                        <span className="mt-2 inline-block h-3 w-3 rounded-full border-2 border-foreground/30 border-t-[#17D492] animate-spin" />
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* System Info */}
              {dashboardData?.systemInfo && (
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>System Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">System Health</p>
                        <p className="font-medium capitalize">{globalRefreshing ? '' : (dashboardData.systemInfo.systemHealth || 'healthy')}</p>
                        {globalRefreshing && (
                          <span className="mt-2 inline-block h-3 w-3 rounded-full border-2 border-foreground/30 border-t-[#17D492] animate-spin" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Version</p>
                        <p className="font-medium">{globalRefreshing ? '' : (dashboardData.systemInfo.version || '1.0.0')}</p>
                        {globalRefreshing && (
                          <span className="mt-2 inline-block h-3 w-3 rounded-full border-2 border-foreground/30 border-t-[#17D492] animate-spin" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DashboardBody>
        </>
  );
}

