"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { PageHero } from "@/components/ui/page-hero";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Award, Lightbulb, Target, Heart, Rocket, Code, Shield, Users, Zap, Palette, Globe, Lock, Star, Check } from "lucide-react";

interface Value {
  icon: string;
  title: string;
  description: string;
}

interface FounderConfig {
  pageHero: {
    badgeText: string;
    title: string;
    description: string;
  };
  founder: {
    name: string;
    designation: string;
    image: string;
    aboutTitle: string;
    aboutParagraphs: string[];
  };
  values: Value[];
  bottomSection: {
    title: string;
    description: string;
    ctaText: string;
    ctaSubtext: string;
  };
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Lightbulb,
  Target,
  Heart,
  Rocket,
  Code,
  Award,
  Shield,
  Users,
  Zap,
  Palette,
  Globe,
  Lock,
  Star,
  Check,
};

// Default fallback data
const defaultConfig: FounderConfig = {
  pageHero: {
    badgeText: "Meet the Founder",
    title: "About the SKYBER Founder",
    description: "Driving innovation in cybersecurity and web development with a vision for excellence."
  },
  founder: {
    name: "Founder Name",
    designation: "CEO & Founder, SKYBER",
    image: "/Default/founder-placeholder.png",
    aboutTitle: "About the Founder",
    aboutParagraphs: [
      "At SKYBER, we believe in creating digital solutions that are not just functional, but secure, scalable, and built to last. Our founder's vision is to bridge the gap between cutting-edge technology and practical business needs.",
      "SKYBER was founded on the principle that technology should empower businesses, not complicate them. We're committed to delivering solutions that are secure, efficient, and tailored to your unique needs. Every project is an opportunity to make a meaningful impact, and we approach each one with dedication, expertise, and a genuine passion for excellence.",
      "With years of experience in cybersecurity and web development, the founder has built SKYBER into a trusted partner for businesses looking to secure their digital infrastructure and build innovative solutions that drive growth."
    ]
  },
  values: [
    {
      icon: "Lightbulb",
      title: "Innovation First",
      description: "Constantly pushing boundaries and exploring new technologies to deliver cutting-edge solutions."
    },
    {
      icon: "Target",
      title: "Client-Centric",
      description: "Every decision is made with our clients' success and satisfaction as the top priority."
    },
    {
      icon: "Heart",
      title: "Passion-Driven",
      description: "We love what we do, and that passion translates into exceptional results for every project."
    },
    {
      icon: "Rocket",
      title: "Growth Mindset",
      description: "Always learning, always improving, always evolving to stay ahead of the curve."
    }
  ],
  bottomSection: {
    title: "Building the Future, One Project at a Time",
    description: "Whether you're looking to secure your digital infrastructure, build a cutting-edge web application, or transform your business with custom software solutions, SKYBER is here to help you achieve your goals.",
    ctaText: "Ready to get started?",
    ctaSubtext: "Let's build something amazing together."
  }
};

export default function FounderPage() {
  const [config, setConfig] = useState<FounderConfig>(defaultConfig);
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
          if (data.success && data.data?.founder) {
            setConfig(data.data.founder);
          }
        }
      } catch (error) {
        console.error('Error loading founder config:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [API_URL]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background founder-page">
      <PageHero
        breadcrumbItems={[{ label: "Founder" }]}
        badge={{
          icon: User,
          text: <span className="founder-text">{config.pageHero.badgeText}</span>
        }}
        title={<span>{config.pageHero.title}</span>}
        description={config.pageHero.description}
      />

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Left Container: Image (80%) + Name & Designation (20%) */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col h-full"
              >
                {/* Image - 80% */}
                <div className="relative w-full flex-[8] min-h-[400px] mb-4">
                  <div className="relative w-full h-full rounded-xl overflow-hidden border border-border/50 bg-card/50">
                    <Image
                      src={config.founder.image}
                      alt={config.founder.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        // Fallback to a gradient if image doesn't exist
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        if (target.parentElement) {
                          target.parentElement.style.background = 'linear-gradient(135deg, rgba(23, 212, 146, 0.1) 0%, rgba(23, 212, 146, 0.05) 100%)';
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
                  </div>
                </div>
                
                {/* Name & Designation - 20% */}
                <div className="space-y-2 flex-[2] min-h-[100px]">
                  <h3 className="text-2xl font-bold text-[#17D492] founder-text">{config.founder.name}</h3>
                  <p className="text-lg text-muted-foreground font-medium">{config.founder.designation}</p>
                </div>
              </motion.div>

              {/* Right Container: About Content */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-3xl font-bold mb-4">
                    {config.founder.aboutTitle.includes('Founder') ? (
                      <>
                        {config.founder.aboutTitle.split('Founder')[0]}
                        <span className="text-[#17D492] founder-text">Founder</span>
                        {config.founder.aboutTitle.split('Founder')[1]}
                      </>
                    ) : (
                      config.founder.aboutTitle
                    )}
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    {config.founder.aboutParagraphs.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                {/* Values Grid */}
                <div className="grid sm:grid-cols-2 gap-4 mt-8">
                  {config.values.map((value, index) => {
                    const Icon = iconMap[value.icon] || Lightbulb;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                      >
                        <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-[#17D492]/50 transition-all duration-300">
                          <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                              <div className="p-2 rounded-lg bg-[#17D492]/10">
                                <Icon className="w-5 h-5 text-[#17D492]" />
                              </div>
                              <CardTitle className="text-lg text-[#17D492]">{value.title}</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="text-muted-foreground text-sm">
                              {value.description}
                            </CardDescription>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6">
                {config.bottomSection.title.includes('Future') ? (
                  <>
                    {config.bottomSection.title.split('Future')[0]}
                    <span className="text-[#17D492]">Future</span>
                    {config.bottomSection.title.split('Future')[1]}
                  </>
                ) : (
                  config.bottomSection.title
                )}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {config.bottomSection.description}
              </p>
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#17D492]/10 border border-[#17D492]/20">
                <span className="text-[#17D492] font-semibold">{config.bottomSection.ctaText}</span>
                <span className="text-muted-foreground">{config.bottomSection.ctaSubtext}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

