"use client";

import { useMemo, useState, useEffect } from "react";
import LogoLoop from "@/components/ui/LogoLoop";
import type { LogoItem } from "@/components/ui/LogoLoop";
import techLogosData from "@/data/tech-logos.json";

// Convert SVG string to React node
const createSVGNode = (svgString: string) => {
  return (
    <div
      className="flex items-center justify-center w-full h-full"
      dangerouslySetInnerHTML={{ __html: svgString }}
    />
  );
};

// Convert JSON data to LogoItem format
const convertToLogoItems = (data: typeof techLogosData): LogoItem[] => {
  // Limit to maximum 5 logos
  return data.slice(0, 5).map((item) => ({
    node: createSVGNode(item.svg),
    href: item.href,
    title: item.title,
    ariaLabel: item.name,
  }));
};

interface LogoLoopConfig {
  enabled: boolean;
  logos: Array<{
    id: string;
    name: string;
    title: string;
    href: string;
    svg: string;
    imageUrl?: string;
  }>;
  speed: number;
  gap: number;
  logoHeight: number;
  sectionHeight: number;
  direction: "left" | "right" | "up" | "down";
  pauseOnHover: boolean;
  scaleOnHover: boolean;
  fadeOut: boolean;
}

export function TechStackSection() {
  const [config, setConfig] = useState<LogoLoopConfig | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Load config from API
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch(`${API_URL}/api/site-config/current`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        });
        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            if (data.success && data.data.logoLoop) {
              setConfig(data.data.logoLoop);
            }
          }
        }
      } catch (error) {
        console.error('Error loading logo loop config:', error);
        // Fallback to default config
        setConfig({
          enabled: true,
          logos: [],
          speed: 120,
          gap: 40,
          logoHeight: 53,
          sectionHeight: 80,
          direction: "right",
          pauseOnHover: true,
          scaleOnHover: true,
          fadeOut: true,
        });
      }
    };

    loadConfig();

    // Listen for config updates
    const handleConfigUpdate = () => {
      loadConfig();
    };
    window.addEventListener('logoLoopConfigUpdated', handleConfigUpdate);
    return () => {
      window.removeEventListener('logoLoopConfigUpdated', handleConfigUpdate);
    };
  }, [API_URL]);

  // Convert config logos to LogoItem format
  const techLogos = useMemo(() => {
    if (!config || !config.logos || config.logos.length === 0) {
      // Fallback to default logos
      return convertToLogoItems(techLogosData);
    }

    const logoItems: LogoItem[] = [];
    for (const item of config.logos) {
      if (item.svg) {
        logoItems.push({
          node: createSVGNode(item.svg),
          href: item.href,
          title: item.title,
          ariaLabel: item.name,
        });
      } else if (item.imageUrl) {
        logoItems.push({
          node: (
            <div className="flex items-center justify-center w-full h-full">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ),
          href: item.href,
          title: item.title,
          ariaLabel: item.name,
        });
      }
    }
    return logoItems;
  }, [config]);

  // Don't render if disabled
  if (config && !config.enabled) {
    return null;
  }

  const finalConfig = config || {
    enabled: true,
    logos: [],
    speed: 120,
    gap: 40,
    logoHeight: 53,
    sectionHeight: 80,
    direction: "right" as const,
    pauseOnHover: true,
    scaleOnHover: true,
    fadeOut: true,
  };

  return (
    <section className="relative py-[43.2px] bg-white dark:bg-[#09090C] px-0">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white via-transparent to-white dark:from-[#09090C] dark:via-transparent dark:to-[#09090C]" />
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10">
        <div className="relative w-full" style={{ height: `${finalConfig.sectionHeight}px` }}>
          <LogoLoop
            logos={techLogos}
            speed={finalConfig.speed}
            direction={finalConfig.direction}
            logoHeight={finalConfig.logoHeight}
            gap={finalConfig.gap}
            hoverSpeed={0}
            pauseOnHover={finalConfig.pauseOnHover}
            scaleOnHover={finalConfig.scaleOnHover}
            fadeOut={finalConfig.fadeOut}
            fadeOutColor=""
            ariaLabel="Technology stack logos"
            className="opacity-80 w-full"
            width="100%"
          />
        </div>
      </div>
    </section>
  );
}

