"use client";

import { ReactNode } from "react";
import { SkyberSecutity } from "@/components/security/skybersecutity";
import { DashboardThemeProvider } from "@/components/dashboard/dashboard-theme-provider";
import { SuperAdminSidebar } from "@/components/dashboard/super-admin-sidebar";

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return (
    <SkyberSecutity>
      <DashboardThemeProvider>
        <div className="min-h-screen flex dashboard-container bg-background bg-[radial-gradient(ellipse_at_top_left,rgba(23,212,146,0.08),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.08),transparent_60%)]">
          <SuperAdminSidebar />
          <div className="flex-1 ml-64">
            <main className="w-full px-4 sm:px-6 lg:px-8 py-8">{children}</main>
          </div>
        </div>
      </DashboardThemeProvider>
    </SkyberSecutity>
  );
}


