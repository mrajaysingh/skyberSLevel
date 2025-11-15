"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardBody } from "@/components/dashboard/dashboard-body";
import { AboutUsEditor } from "@/components/dashboard/about-us-editor";
import { useSecurity } from "@/components/security/page-security";

export default function AboutUsEditPage() {
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
      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <>
      <DashboardHeader
        title="About Us"
        subtitle="Edit About Us page"
        ip={headerIp}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
      <DashboardBody>
        <AboutUsEditor />
      </DashboardBody>
    </>
  );
}

