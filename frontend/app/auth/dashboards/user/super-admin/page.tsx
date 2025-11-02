"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SkyberSecutity } from "@/components/security/skybersecutity";
import { useSecurity } from "@/components/security/page-security";
import { Button } from "@/components/ui/button";
import { LogOut, User, Shield, Zap, RefreshCw, Database, Server, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardThemeSwitcher } from "@/components/dashboard/dashboard-theme-switcher";
import { DashboardThemeProvider } from "@/components/dashboard/dashboard-theme-provider";
import { SuperAdminSidebar } from "@/components/dashboard/super-admin-sidebar";

export default function SuperAdminDashboard() {
  const { logout, user } = useSecurity();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

      const response = await fetch(`${API_URL}/api/dashboard/super-admin`, {
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
          'Content-Type': 'application/json',
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

  const handleLogout = async () => {
    await logout();
  };

  // Check if user is super-admin
  useEffect(() => {
    if (user && user.role !== 'super-admin') {
      router.push("/");
    }
  }, [user, router]);

  return (
    <SkyberSecutity>
      <DashboardThemeProvider>
        <div className="min-h-screen bg-background flex dashboard-container">
          {/* Sidebar */}
          <SuperAdminSidebar />

        {/* Main Content Area */}
        <div className="flex-1 ml-64">
          {/* Dashboard Header */}
          <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-[#17D492]" />
                <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
              </div>
              <div className="flex items-center gap-4">
                {(user || dashboardData?.user) && (
                  <div className="hidden sm:flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground font-medium">{user?.name || dashboardData?.user?.name || user?.email || dashboardData?.user?.email}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        (dashboardData?.user?.status || user?.status) === 'online' 
                          ? 'bg-[#17D492]/10 text-[#17D492]' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {(dashboardData?.user?.status || user?.status) === 'online' ? '● Online' : '○ Offline'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>IP: {dashboardData?.user?.displayIp || dashboardData?.user?.currentIp || dashboardData?.user?.currentRequestIp || 'Unknown'}</span>
                      <span className="px-2 py-0.5 bg-[#17D492]/10 text-[#17D492] rounded-full font-medium">
                        {user?.role || dashboardData?.user?.role || 'super-admin'}
                      </span>
                    </div>
                  </div>
                )}
                 <DashboardThemeSwitcher />
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <Card>
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
                      <div className="bg-secondary/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">ID</p>
                        <p className="font-medium text-sm font-mono text-xs break-all">
                          {dashboardData?.user?.id || user?.id || 'N/A'}
                        </p>
                      </div>
                      <div className="bg-secondary/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Email</p>
                        <p className="font-medium text-sm">{user?.email || dashboardData?.user?.email}</p>
                      </div>
                      <div className="bg-secondary/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Role</p>
                        <p className="font-medium text-sm capitalize">{user?.role || 'super-admin'}</p>
                      </div>
                      <div className="bg-secondary/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Plan Tier</p>
                        <p className="font-medium text-sm capitalize">{user?.planTier || dashboardData?.user?.planTier || 'enterprise'}</p>
                      </div>
                      <div className="bg-secondary/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Status</p>
                        <p className="font-medium text-sm text-[#17D492]">
                          {dashboardData?.user?.isActive !== false ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Database & Redis Status */}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Prisma Database Status */}
                      <div className="bg-secondary/50 rounded-lg p-4 border">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Database className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Database</p>
                              <p className="text-xs text-muted-foreground">PostgreSQL (Prisma)</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {dashboardData?.systemInfo?.database?.status === 'active' ? (
                              <>
                                <CheckCircle2 className="h-5 w-5 text-[#17D492]" />
                                <span className="text-sm font-medium text-[#17D492]">Active</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-5 w-5 text-destructive" />
                                <span className="text-sm font-medium text-destructive">Down</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Redis Status */}
                      <div className="bg-secondary/50 rounded-lg p-4 border">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Server className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Redis Cache</p>
                              <p className="text-xs text-muted-foreground">Session Cache</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {dashboardData?.systemInfo?.redis?.status === 'active' ? (
                              <>
                                <CheckCircle2 className="h-5 w-5 text-[#17D492]" />
                                <span className="text-sm font-medium text-[#17D492]">Active</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-5 w-5 text-destructive" />
                                <span className="text-sm font-medium text-destructive">Down</span>
                              </>
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
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{dashboardData.stats?.totalUsers || 0}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{dashboardData.stats?.totalProjects || 0}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Active Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{dashboardData.stats?.activeSessions || 0}</div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* System Info */}
              {dashboardData?.systemInfo && (
                <Card>
                  <CardHeader>
                    <CardTitle>System Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">System Health</p>
                        <p className="font-medium capitalize">{dashboardData.systemInfo.systemHealth || 'healthy'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Version</p>
                        <p className="font-medium">{dashboardData.systemInfo.version || '1.0.0'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          </main>
        </div>
        </div>
      </DashboardThemeProvider>
    </SkyberSecutity>
  );
}

