"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Shield, Zap, Globe, Users, Lock, Code, Award, Heart, Rocket, Target, Lightbulb, Star, Check, Palette } from "lucide-react";
import CardSwap, { Card } from "@/components/ui/CardSwap";
import Aurora from "@/components/ui/Aurora";
import CosmicPortalButton from "@/components/ui/cosmic-portal-button";
import "@/styles/pagecss.css";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageSquare,
  Shield,
  Zap,
  Globe,
  Users,
  Lock,
  Code,
  Award,
  Heart,
  Rocket,
  Target,
  Lightbulb,
  Star,
  Check,
  Palette,
};

interface FeatureCard {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface FloatingCard {
  id: string;
  icon: string;
  badge: string;
  title: string;
  description: string;
}

interface TruCommConfig {
  badgeText: string;
  badgeIcon: string;
  title: string;
  titleHighlight: string;
  description: string;
  descriptionHighlight: string;
  descriptionSuffix: string;
  subtitle: string;
  subtitleHighlight: string;
  subtitleSuffix: string;
  subtitleText: string;
  features: FeatureCard[];
  ctaButtonText: string;
  ctaButtonIcon: string;
  noCardRequiredText: string;
  floatingCards: FloatingCard[];
  cardWidth: number;
  cardHeight: number;
  cardDistance: number;
  verticalDistance: number;
  delay: number;
  pauseOnHover: boolean;
  skewAmount: number;
  backgroundColor: string;
  auroraColor1: string;
  auroraColor2: string;
  auroraColor3: string;
  auroraAmplitude: number;
  auroraBlend: number;
  auroraSpeed: number;
  auroraOpacity: number;
  floatingEffect1Enabled: boolean;
  floatingEffect1Size: number;
  floatingEffect1X: number;
  floatingEffect1Y: number;
  floatingEffect1Duration: number;
  floatingEffect1Opacity: number;
  floatingEffect2Enabled: boolean;
  floatingEffect2Size: number;
  floatingEffect2X: number;
  floatingEffect2Y: number;
  floatingEffect2Duration: number;
  floatingEffect2Opacity: number;
  floatingEffect2Delay: number;
}

const defaultConfig: TruCommConfig = {
  badgeText: "Featured Software",
  badgeIcon: "MessageSquare",
  title: "Outstanding Software by",
  titleHighlight: "Skyber",
  description: "Introducing",
  descriptionHighlight: "TruComm",
  descriptionSuffix: "- Revolutionary communication platform designed for modern teams",
  subtitle: "MEET",
  subtitleHighlight: "TRU",
  subtitleSuffix: "COMM",
  subtitleText: "Experience the future of team collaboration with TruComm. Built with enterprise-grade security and cutting-edge technology to keep your team connected and productive.",
  features: [
    { id: "1", icon: "Shield", title: "Enterprise Security", description: "End-to-end encryption" },
    { id: "2", icon: "Zap", title: "Lightning Fast", description: "Real-time messaging" },
    { id: "3", icon: "Globe", title: "Global Reach", description: "Works anywhere" },
    { id: "4", icon: "Users", title: "Team Collaboration", description: "Seamless teamwork" },
    { id: "5", icon: "Lock", title: "Privacy First", description: "Your data, your control" },
    { id: "6", icon: "MessageSquare", title: "Smart Features", description: "AI-powered insights" },
  ],
  ctaButtonText: "GET STARTED",
  ctaButtonIcon: "Crown",
  noCardRequiredText: "(No Card Required)",
  floatingCards: [
    { id: "1", icon: "Shield", badge: "Security", title: "Enterprise-Grade Protection", description: "End-to-end encryption ensures your conversations remain private and secure." },
    { id: "2", icon: "Zap", badge: "Performance", title: "Lightning-Fast Messaging", description: "Real-time communication with zero latency. Stay connected instantly." },
    { id: "3", icon: "Users", badge: "Collaboration", title: "Team Collaboration", description: "Seamless teamwork with channels, threads, and integrated workflows." },
    { id: "4", icon: "Globe", badge: "Global", title: "Works Everywhere", description: "Access TruComm from any device, anywhere in the world. Cloud-powered and reliable." },
  ],
  cardWidth: 420,
  cardHeight: 336,
  cardDistance: 50,
  verticalDistance: 59,
  delay: 5000,
  pauseOnHover: true,
  skewAmount: 6,
  backgroundColor: "#09090B",
  auroraColor1: "#09090B",
  auroraColor2: "#E94560",
  auroraColor3: "#09090B",
  auroraAmplitude: 1.5,
  auroraBlend: 0.8,
  auroraSpeed: 1.0,
  auroraOpacity: 0.7,
  floatingEffect1Enabled: true,
  floatingEffect1Size: 288,
  floatingEffect1X: 10,
  floatingEffect1Y: 20,
  floatingEffect1Duration: 8,
  floatingEffect1Opacity: 0.3,
  floatingEffect2Enabled: true,
  floatingEffect2Size: 384,
  floatingEffect2X: 10,
  floatingEffect2Y: 20,
  floatingEffect2Duration: 10,
  floatingEffect2Opacity: 0.2,
  floatingEffect2Delay: 2,
};

export function TruCommSection() {
  const [config, setConfig] = useState<TruCommConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch(`${API_URL}/api/site-config/current`, {
          cache: 'no-store'
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.trucomm) {
            setConfig({ ...defaultConfig, ...data.data.trucomm });
          }
        }
      } catch (error) {
        console.error('Error loading TruComm config:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();

    // Listen for config updates
    const handleConfigUpdate = () => {
      loadConfig();
    };
    window.addEventListener('trucommConfigUpdated', handleConfigUpdate);
    return () => {
      window.removeEventListener('trucommConfigUpdated', handleConfigUpdate);
    };
  }, [API_URL]);

  if (loading) {
    return null; // Or a loading skeleton
  }

  const BadgeIcon = iconMap[config.badgeIcon] || MessageSquare;

  return (
    <section className="relative pt-[0.907rem] pb-[0.907rem] md:pt-[1.426rem] md:pb-[1.426rem] overflow-hidden rounded-tl-[200px] rounded-tr-[200px]" style={{ backgroundColor: config.backgroundColor }}>
      {/* Aurora Background Effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ opacity: config.auroraOpacity }}>
          <Aurora
            colorStops={[config.auroraColor1, config.auroraColor2, config.auroraColor3]}
            amplitude={config.auroraAmplitude}
            blend={config.auroraBlend}
            speed={config.auroraSpeed}
          />
        </div>
      </div>
      
      {/* Additional Background Effects */}
      {config.floatingEffect1Enabled && (
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute rounded-full blur-3xl"
            style={{
              top: `${config.floatingEffect1Y}px`,
              left: `${config.floatingEffect1X}px`,
              width: `${config.floatingEffect1Size}px`,
              height: `${config.floatingEffect1Size}px`,
              backgroundColor: config.auroraColor2,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [config.floatingEffect1Opacity, config.floatingEffect1Opacity * 2, config.floatingEffect1Opacity],
              x: [0, 20, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: config.floatingEffect1Duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      )}
      {config.floatingEffect2Enabled && (
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute rounded-full blur-3xl"
            style={{
              bottom: `${config.floatingEffect2Y}px`,
              right: `${config.floatingEffect2X}px`,
              width: `${config.floatingEffect2Size}px`,
              height: `${config.floatingEffect2Size}px`,
              backgroundColor: config.auroraColor2,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [config.floatingEffect2Opacity, config.floatingEffect2Opacity * 2.5, config.floatingEffect2Opacity],
              x: [0, -30, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: config.floatingEffect2Duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: config.floatingEffect2Delay,
            }}
          />
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 space-y-3"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#E94560]/10 backdrop-blur-md border border-[#E94560]/20 mb-4">
            <BadgeIcon className="w-4 h-4 mr-2 text-[#E94560]" />
            <span className="text-sm font-medium text-[#E94560]">{config.badgeText}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            {config.title}{" "}
            <span className="text-[#E94560] skyber-text">{config.titleHighlight}</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {config.description} <span className="font-semibold text-white">{config.descriptionHighlight}</span> {config.descriptionSuffix}
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="space-y-3">
              <div>
                <h3 className="text-3xl font-bold mb-2 text-white trucomm-text">
                  {config.subtitle} <span className="text-[#FF4655] hover:text-white transition-colors duration-300 cursor-pointer">{config.subtitleHighlight}</span>{config.subtitleSuffix}
                </h3>
                <p className="text-lg text-gray-300">
                  {config.subtitleText}
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid sm:grid-cols-2 gap-3">
                {config.features.map((feature, index) => {
                  const FeatureIcon = iconMap[feature.icon] || Shield;
                  return (
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      className="p-4 rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm transition-all duration-300 hover:border-[#17D492]/50 dark:hover:border-[#E94560]/50 hover:shadow-[0_0_20px_rgba(23,212,146,0.3)] dark:hover:shadow-[0_12px_40px_rgba(233,69,96,0.3)]"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-[#E94560]/10">
                          <FeatureIcon className="w-5 h-5 text-[#E94560]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-1 text-white">{feature.title}</h4>
                          <p className="text-sm text-gray-300">{feature.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA Button */}
              <div className="flex flex-col items-start gap-2 pt-2">
                <CosmicPortalButton
                  onClick={() => {
                    console.log('Get Started clicked');
                  }}
                  className="w-full sm:w-auto"
                  label={config.ctaButtonText}
                  showSystemIcon={false}
                  showCrownIcon={config.ctaButtonIcon === "Crown"}
                />
                <p className="text-xs text-gray-300">{config.noCardRequiredText}</p>
              </div>
            </div>
          </motion.div>

          {/* Right: CardSwap Component */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            <div className="trucomm-cards-container">
              <CardSwap
                width={config.cardWidth}
                height={config.cardHeight}
                cardDistance={config.cardDistance}
                verticalDistance={config.verticalDistance}
                delay={config.delay}
                pauseOnHover={config.pauseOnHover}
                skewAmount={config.skewAmount}
                easing="elastic"
              >
                {config.floatingCards.map((card, index) => {
                  const CardIcon = iconMap[card.icon] || Shield;
                  return (
                    <Card key={card.id} className={`trucomm-card trucomm-card-${index + 1} !bg-transparent !border-[#E94560]/30`}>
                      <div className="p-6 h-full flex flex-col justify-between">
                        <div>
                          <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#E94560]/20 text-[#E94560] text-xs font-medium mb-3">
                            <CardIcon className="w-3 h-3 mr-1" />
                            {card.badge}
                          </div>
                          <h4 className="text-xl font-bold mb-2 text-white">{card.title}</h4>
                          <p className="text-gray-300 text-xs">
                            {card.description}
                          </p>
                        </div>
                        <div className="mt-4 text-[#E94560] font-semibold text-xs">
                          Learn More →
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </CardSwap>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
