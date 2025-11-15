"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardBody } from "@/components/dashboard/dashboard-body";
import { AboutUsEditor } from "@/components/dashboard/about-us-editor";
import { FounderEditor } from "@/components/dashboard/founder-editor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useSecurity } from "@/components/security/page-security";

export default function PagesEditPage() {
  const { user } = useSecurity();
  const [headerIp, setHeaderIp] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    aboutUs: false,
    founder: false
  });
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Fetch user IP on mount
  useEffect(() => {
    const loadIp = async () => {
      try {
        const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
        if (!sessionToken) return;
        const response = await fetch(`${API_URL}/api/dashboard/super-admin`, {
          headers: { 'Authorization': `Bearer ${sessionToken}` },
          cache: 'no-store'
        });
        if (!response.ok) return;
        const data = await response.json();
        const userData = data?.data?.dashboard?.user;
        if (userData) {
          setHeaderIp(userData.displayIp || userData.currentIp || userData.currentRequestIp || null);
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

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <>
      <DashboardHeader
        title="Pages"
        subtitle="Edit all pages"
        ip={headerIp}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
      <DashboardBody>
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Page Management</h2>
            <p className="text-muted-foreground">
              Manage and edit all pages on your website
            </p>
          </div>

          {/* About Us Section */}
          <Card>
            <CardHeader>
              <button
                onClick={() => toggleSection('aboutUs')}
                className="w-full flex items-center justify-between text-left"
              >
                <div>
                  <CardTitle>About Us Page</CardTitle>
                  <CardDescription>
                    Edit the About Us page content, team members, stats, values, and mission
                  </CardDescription>
                </div>
                {expandedSections.aboutUs ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
            </CardHeader>
            {expandedSections.aboutUs && (
              <CardContent>
                <AboutUsEditor />
              </CardContent>
            )}
          </Card>

          {/* Founder Page Section */}
          <Card>
            <CardHeader>
              <button
                onClick={() => toggleSection('founder')}
                className="w-full flex items-center justify-between text-left"
              >
                <div>
                  <CardTitle>Founder Page</CardTitle>
                  <CardDescription>
                    Edit the Founder page content, founder information, values, and call-to-action
                  </CardDescription>
                </div>
                {expandedSections.founder ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
            </CardHeader>
            {expandedSections.founder && (
              <CardContent>
                <FounderEditor />
              </CardContent>
            )}
          </Card>

          {/* More pages can be added here in the future */}
        </div>
      </DashboardBody>
    </>
  );
}

