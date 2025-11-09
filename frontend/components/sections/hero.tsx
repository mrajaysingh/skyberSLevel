"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Shield, Lock, Zap, Star, Check, Award, Globe, Heart } from "lucide-react";
import { TypeWriter } from "@/components/ui/TypeWriter";
import { AnimatedMesh } from "@/components/ui/animated-mesh";
import { AnimatedButton } from "@/components/ui/animated-button";
import { GetStartedFormSimple } from "@/components/forms/get-started-form-simple";

interface HeroFeature {
  id: string;
  icon: string;
  text: string;
}

interface HeroConfig {
  badgeText?: string;
  typeWriterPhrases?: string[];
  heading?: string;
  headingHighlight?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  heroImageUrl?: string;
  features?: HeroFeature[];
  trustPilotUrl?: string;
  trustPilotText?: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield,
  Lock,
  Zap,
  Star,
  Check,
  Award,
  Globe,
  Heart,
};

const FeatureItem = React.memo<{
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}>(({ icon: Icon, text }) => (
  <div className="flex flex-col items-center lg:items-start">
    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#17D492]/10 mb-2">
      <Icon className="w-5 h-5 text-[#17D492]" />
    </div>
    <p className="font-medium text-sm">{text}</p>
  </div>
));

FeatureItem.displayName = 'FeatureItem';

const HeroContent = React.memo<{ config?: HeroConfig }>(({ config }) => {
  const [showForm, setShowForm] = useState(false);
  
  const badgeText = config?.badgeText || "New";
  const phrases = config?.typeWriterPhrases || [
    "Enhanced AI Security Features",
    "Smart Cybersecurity & Tech",
    "Secure Digital Experiences",
    "Innovative Security Solutions",
    "Secure, Develop, Design"
  ];
  const heading = config?.heading || "Secure Your Digital Future With";
  const headingHighlight = config?.headingHighlight || "SKYBER";
  const description = config?.description || "Leading cybersecurity solutions and exceptional web development to protect your business and accelerate your online growth.";
  const primaryButtonText = config?.primaryButtonText || "Get Started";
  const secondaryButtonText = config?.secondaryButtonText || "About Us";
  const secondaryButtonHref = config?.secondaryButtonHref || "/about";
  const features = config?.features || [
    { id: "1", icon: "Shield", text: "99.9% Uptime" },
    { id: "2", icon: "Lock", text: "SOC 2 Certified" },
    { id: "3", icon: "Zap", text: "24/7 Support" }
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center lg:text-left space-y-4 md:space-y-6"
      >
        <div className="inline-flex items-center px-3 py-1 rounded-full border border-border bg-background/50 backdrop-blur-sm text-sm font-medium">
          <span className="text-[#17D492] mr-2">{badgeText}</span>
          <TypeWriter phrases={phrases} typingSpeed={80} deletingSpeed={40} delayBetweenPhrases={3000} />
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
          {heading.split(' ').slice(0, -1).join(' ')}
          <br className="hidden md:block" /> {heading.split(' ').slice(-1)[0]}{" "}
          <span className="text-[#17D492] skyber-text">{headingHighlight}</span>
        </h1>

        <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
          <AnimatedButton 
            size="lg" 
            className="w-full sm:w-auto" 
            showArrow
            onClick={() => setShowForm(true)}
          >
            {primaryButtonText}
          </AnimatedButton>
          <AnimatedButton href={secondaryButtonHref} size="lg" variant="outline" className="w-full sm:w-auto">
            {secondaryButtonText}
          </AnimatedButton>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2 md:pt-4">
          {features.map((feature) => {
            const IconComponent = iconMap[feature.icon] || Shield;
            return <FeatureItem key={feature.id} icon={IconComponent} text={feature.text} />;
          })}
        </div>
      </motion.div>

      <GetStartedFormSimple open={showForm} onOpenChange={setShowForm} />
    </>
  );
});

HeroContent.displayName = 'HeroContent';

const HeroImage = React.memo<{ imageUrl?: string }>(({ imageUrl }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="relative mt-6 lg:mt-0"
  >
    <div className="relative h-[280px] sm:h-[320px] lg:h-[400px] w-full">
      <div className="absolute inset-0 bg-gradient-to-r from-[#17D492]/20 to-transparent rounded-lg"></div>
      <Image
        src={imageUrl || "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg"}
        alt="Cybersecurity Professional"
        fill
        sizes="(max-width: 1024px) 100vw, 600px"
        className="object-cover rounded-lg"
        priority
      />
      <div className="absolute -bottom-5 -right-5 w-32 h-32 bg-[#17D492]/10 rounded-full blur-3xl"></div>
    </div>
  </motion.div>
));

HeroImage.displayName = 'HeroImage';

export const Hero = React.memo(() => {
  const [heroConfig, setHeroConfig] = useState<HeroConfig | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const loadHeroConfig = async () => {
      try {
        const response = await fetch(`${API_URL}/api/site-config/current`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            if (data.success && data.data.hero) {
              setHeroConfig(data.data.hero);
            }
          }
        }
      } catch (error) {
        console.error('Error loading hero config:', error);
      }
    };

    loadHeroConfig();
    
    // Refresh config every 5 seconds to pick up changes
    const interval = setInterval(loadHeroConfig, 5000);
    
    // Listen for custom event when config is saved
    window.addEventListener('heroConfigUpdated', loadHeroConfig);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('heroConfigUpdated', loadHeroConfig);
    };
  }, [API_URL]);

  const trustPilotUrl = heroConfig?.trustPilotUrl || "https://www.trustpilot.com/review/skybersupport.me";
  const trustPilotText = heroConfig?.trustPilotText || "Review us on Trustpilot";

  return (
    <section className="relative min-h-screen md:min-h-[calc(100vh-5rem)] pt-4 md:pt-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b dark:from-background dark:to-background/60 from-background to-background/90 z-0" />
      <AnimatedMesh />
      <div className="container relative z-10 h-full flex items-start md:items-center py-4 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start md:items-center">
          <HeroContent config={heroConfig || undefined} />
          <HeroImage imageUrl={heroConfig?.heroImageUrl} />
        </div>
      </div>
      
      {/* TrustPilot Button - Full Width Canvas, Bottom Right */}
      <div className="absolute bottom-0 right-0 z-20 pr-3 pb-3">
        <a 
          href={trustPilotUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 border border-[#17D492]/30 rounded-lg bg-white hover:border-[#17D492] transition-colors cursor-pointer hover:shadow-md shadow-sm"
        >
          <span className="text-gray-800 font-medium text-sm">{trustPilotText}</span>
          <svg className="w-4 h-4 text-[#17D492]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </a>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

