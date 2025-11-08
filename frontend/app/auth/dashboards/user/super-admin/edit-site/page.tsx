"use client";

import { useState, useEffect } from "react";
import { HeaderEditor } from "@/components/dashboard/header-editor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardBody } from "@/components/dashboard/dashboard-body";
import { useSecurity } from "@/components/security/page-security";

export default function EditSitePage() {
  const { user } = useSecurity();
  const [headerIp, setHeaderIp] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Fetch user IP on mount
  useEffect(() => {
    const loadIp = async () => {
      try {
        const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
        if (!sessionToken) return;
        const r = await fetch(`${API_URL}/api/dashboard/super-admin`, {
          headers: { 'Authorization': `Bearer ${sessionToken}` },
          cache: 'no-store'
        });
        if (!r.ok) return;
        const j = await r.json();
        const u = j?.data?.dashboard?.user;
        if (u) {
          setHeaderIp(u.displayIp || u.currentIp || u.currentRequestIp || null);
        }
      } catch (error) {
        console.error('Error loading IP:', error);
      }
    };
    loadIp();
  }, [API_URL]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Reload page data
      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <>
      <DashboardHeader
        title="Edit Site"
        subtitle="Customize your website"
        ip={headerIp}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
      <DashboardBody>
        <div className="space-y-8">
          {/* Page Description */}
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Customize Your Website</h2>
            <p className="text-muted-foreground">
              Manage your website's appearance, content, and settings
            </p>
          </div>

          {/* Header Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">Header Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Customize your website's header, logo, and navigation
                </p>
              </div>
            </div>
            
            <HeaderEditor />
          </div>

          {/* Coming Soon Sections */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-dashed opacity-60">
              <CardHeader>
                <CardTitle>Footer Settings</CardTitle>
                <CardDescription>Customize footer content and links</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Coming soon...</p>
              </CardContent>
            </Card>

            <Card className="border-dashed opacity-60">
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>Edit homepage hero content</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Coming soon...</p>
              </CardContent>
            </Card>

            <Card className="border-dashed opacity-60">
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
                <CardDescription>Customize colors and typography</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Coming soon...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardBody>
    </>
  );
}
