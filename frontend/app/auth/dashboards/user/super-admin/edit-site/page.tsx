"use client";

import { useState, useEffect, useRef } from "react";
import { HeaderEditor } from "@/components/dashboard/header-editor";
import { HeroEditor } from "@/components/dashboard/hero-editor";
import { LogoLoopEditor } from "@/components/dashboard/logo-loop-editor";
import { TruCommEditor } from "@/components/dashboard/trucomm-editor";
import { WhyChooseUsEditor } from "@/components/dashboard/why-choose-us-editor";
import { ClientTestimonialsEditor } from "@/components/dashboard/client-testimonials-editor";
import { StayUpdatedEditor } from "@/components/dashboard/stay-updated-editor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardBody } from "@/components/dashboard/dashboard-body";
import { useSecurity } from "@/components/security/page-security";
import { useToast } from "@/components/ui/toast-provider";
import { ChevronDown, ChevronUp, Save } from "lucide-react";

export default function EditSitePage() {
  const { user } = useSecurity();
  const { showSuccess, showError } = useToast();
  const [headerIp, setHeaderIp] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [headerExpanded, setHeaderExpanded] = useState(false);
  const [heroExpanded, setHeroExpanded] = useState(false);
  const [logoLoopExpanded, setLogoLoopExpanded] = useState(false);
  const [trucommExpanded, setTrucommExpanded] = useState(false);
  const [whyChooseUsExpanded, setWhyChooseUsExpanded] = useState(false);
  const [clientTestimonialsExpanded, setClientTestimonialsExpanded] = useState(false);
  const [stayUpdatedExpanded, setStayUpdatedExpanded] = useState(false);
  const [isSavingAll, setIsSavingAll] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  
  // Refs to access editor configs
  const headerConfigRef = useRef<any>(null);
  const heroConfigRef = useRef<any>(null);
  const logoLoopConfigRef = useRef<any>(null);
  const trucommConfigRef = useRef<any>(null);
  const whyChooseUsConfigRef = useRef<any>(null);
  const clientTestimonialsConfigRef = useRef<any>(null);
  const stayUpdatedConfigRef = useRef<any>(null);

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

  const handleSaveAll = async () => {
    setIsSavingAll(true);
    try {
      const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
      if (!sessionToken) {
        showError('Authentication Error', 'Please log in to save changes');
        return;
      }

      // Collect all configs
      const allConfigs: any = {};
      
      if (headerConfigRef.current) {
        allConfigs.header = headerConfigRef.current;
      }
      
      if (heroConfigRef.current) {
        allConfigs.hero = heroConfigRef.current;
      }
      
      if (logoLoopConfigRef.current) {
        allConfigs.logoLoop = logoLoopConfigRef.current;
      }
      
      if (trucommConfigRef.current) {
        allConfigs.trucomm = trucommConfigRef.current;
      }
      
      if (whyChooseUsConfigRef.current) {
        allConfigs.whyChooseUs = whyChooseUsConfigRef.current;
      }
      
      if (clientTestimonialsConfigRef.current) {
        allConfigs.clientTestimonials = clientTestimonialsConfigRef.current;
      }

      // Save all configs in one request
      const response = await fetch(`${API_URL}/api/site-config/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(allConfigs),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        showError('Save Failed', 'Server returned invalid response. Please check if the backend is running.');
        return;
      }

      const data = await response.json();

      if (response.ok && data.success) {
        showSuccess('Saved Successfully', 'All sections have been saved and backup created');
        // Trigger refresh events for all sections
        window.dispatchEvent(new Event('headerConfigUpdated'));
        window.dispatchEvent(new Event('heroConfigUpdated'));
        window.dispatchEvent(new Event('logoLoopConfigUpdated'));
        window.dispatchEvent(new Event('trucommConfigUpdated'));
        window.dispatchEvent(new Event('whyChooseUsConfigUpdated'));
        window.dispatchEvent(new Event('clientTestimonialsConfigUpdated'));
      } else {
        showError('Save Failed', data?.error || 'Failed to save configuration. Make sure the backend server is running.');
      }
    } catch (error: any) {
      console.error("Error saving all configs:", error);
      if (error.message === 'Failed to fetch') {
        showError('Connection Error', 'Cannot connect to the backend server. Please ensure it is running on port 3001.');
      } else {
        showError('Save Failed', 'An error occurred while saving');
      }
    } finally {
      setIsSavingAll(false);
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
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <h2 className="text-2xl font-semibold">Customize Your Website</h2>
              <p className="text-muted-foreground">
                Manage your website's appearance, content, and settings
              </p>
            </div>
            <Button
              onClick={handleSaveAll}
              disabled={isSavingAll}
              size="lg"
              className="shrink-0"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSavingAll ? "Saving All..." : "Save All Sections"}
            </Button>
          </div>

          {/* Header Section */}
          <Card>
            <CardHeader>
              <button
                onClick={() => setHeaderExpanded(!headerExpanded)}
                className="w-full flex items-center justify-between text-left"
              >
                <div>
                  <CardTitle>Header Settings</CardTitle>
                  <CardDescription>
                    Customize your website's header, logo, and navigation
                  </CardDescription>
                </div>
                {headerExpanded ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
            </CardHeader>
            {headerExpanded && (
              <CardContent>
                <HeaderEditor onConfigChange={(config) => { headerConfigRef.current = config; }} />
              </CardContent>
            )}
          </Card>

          {/* Hero Section */}
          <Card>
            <CardHeader>
              <button
                onClick={() => setHeroExpanded(!heroExpanded)}
                className="w-full flex items-center justify-between text-left"
              >
                <div>
                  <CardTitle>Hero Section</CardTitle>
                  <CardDescription>
                    Customize your homepage hero section content, images, and buttons
                  </CardDescription>
                </div>
                {heroExpanded ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
            </CardHeader>
            {heroExpanded && (
              <CardContent>
                <HeroEditor onConfigChange={(config) => { heroConfigRef.current = config; }} />
              </CardContent>
            )}
          </Card>

          {/* Logo Loop Section */}
          <Card>
            <CardHeader>
              <button
                onClick={() => setLogoLoopExpanded(!logoLoopExpanded)}
                className="w-full flex items-center justify-between text-left"
              >
                <div>
                  <CardTitle>Logo Loop Section</CardTitle>
                  <CardDescription>
                    Customize technology stack logos, animation, and display settings
                  </CardDescription>
                </div>
                {logoLoopExpanded ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
            </CardHeader>
            {logoLoopExpanded && (
              <CardContent>
                <LogoLoopEditor onConfigChange={(config) => { logoLoopConfigRef.current = config; }} />
              </CardContent>
            )}
          </Card>

          {/* Featured Software (TruComm) Section */}
          <Card>
            <CardHeader>
              <button
                onClick={() => setTrucommExpanded(!trucommExpanded)}
                className="w-full flex items-center justify-between text-left"
              >
                <div>
                  <CardTitle>Featured Software Section</CardTitle>
                  <CardDescription>
                    Customize the TruComm section with all its elements, cards, and effects
                  </CardDescription>
                </div>
                {trucommExpanded ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
            </CardHeader>
            {trucommExpanded && (
              <CardContent>
                <TruCommEditor onConfigChange={(config) => { trucommConfigRef.current = config; }} />
              </CardContent>
            )}
          </Card>

          {/* Why Teams Choose SKYBER Section */}
          <Card>
            <CardHeader>
              <button
                onClick={() => setWhyChooseUsExpanded(!whyChooseUsExpanded)}
                className="w-full flex items-center justify-between text-left"
              >
                <div>
                  <CardTitle>Why Teams Choose SKYBER Section</CardTitle>
                  <CardDescription>
                    Customize the Why Choose Us section with benefits, stats, and background effects
                  </CardDescription>
                </div>
                {whyChooseUsExpanded ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
            </CardHeader>
            {whyChooseUsExpanded && (
              <CardContent>
                <WhyChooseUsEditor onConfigChange={(config) => { whyChooseUsConfigRef.current = config; }} />
              </CardContent>
            )}
          </Card>

          {/* What Our Clients Say Section */}
          <Card>
            <CardHeader>
              <button
                onClick={() => setClientTestimonialsExpanded(!clientTestimonialsExpanded)}
                className="w-full flex items-center justify-between text-left"
              >
                <div>
                  <CardTitle>What Our Clients Say Section</CardTitle>
                  <CardDescription>
                    Customize the Client Testimonials section with testimonials, stats, and background effects
                  </CardDescription>
                </div>
                {clientTestimonialsExpanded ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
            </CardHeader>
            {clientTestimonialsExpanded && (
              <CardContent>
                <ClientTestimonialsEditor onConfigChange={(config) => { clientTestimonialsConfigRef.current = config; }} />
              </CardContent>
            )}
          </Card>

          {/* Stay Updated Section */}
          <Card>
            <CardHeader>
              <button
                onClick={() => setStayUpdatedExpanded(!stayUpdatedExpanded)}
                className="w-full flex items-center justify-between text-left"
              >
                <div>
                  <CardTitle>Stay Updated Section</CardTitle>
                  <CardDescription>
                    Customize the newsletter subscription section with benefits and background effects
                  </CardDescription>
                </div>
                {stayUpdatedExpanded ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
            </CardHeader>
            {stayUpdatedExpanded && (
              <CardContent>
                <StayUpdatedEditor />
              </CardContent>
            )}
          </Card>

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
