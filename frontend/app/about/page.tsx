"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { PageHero } from "@/components/ui/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Award, Lightbulb, Target, Heart, Rocket, Code, Palette, Shield, Globe, Lock, Star, Check, Zap } from "lucide-react";

interface TeamMember {
  name: string;
  designation: string;
  image: string;
  bio: string;
  expertise: string[];
}

interface Stat {
  label: string;
  value: string;
  icon: string;
}

interface Value {
  icon: string;
  title: string;
  description: string;
}

interface AboutConfig {
  leadershipTeam: {
    title: string;
    description: string;
    members: TeamMember[];
  };
  stats: Stat[];
  coreValues: {
    title: string;
    description: string;
    values: Value[];
  };
  mission: {
    title: string;
    paragraphs: string[];
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
const defaultConfig: AboutConfig = {
  leadershipTeam: {
    title: "Meet Our Leadership Team",
    description: "The visionaries and experts driving SKYBER's mission to deliver exceptional digital solutions.",
    members: [
      {
        name: "Founder",
        designation: "CEO & Founder",
        image: "/Default/founder-placeholder.png",
        bio: "Visionary leader driving innovation in cybersecurity and web development. With a passion for excellence and a commitment to client success, the founder has built SKYBER into a trusted partner for businesses seeking secure, scalable digital solutions.",
        expertise: ["Strategic Leadership", "Business Development", "Innovation"]
      },
      {
        name: "Ajay Singh",
        designation: "CTO (Chief Technology Officer)",
        image: "/Default/founder-placeholder.png",
        bio: "Technology expert with extensive experience in architecting secure, scalable systems. Leads our technical team in delivering cutting-edge solutions that combine innovation with reliability.",
        expertise: ["System Architecture", "Cybersecurity", "Cloud Infrastructure"]
      },
      {
        name: "Design Head",
        designation: "CDO (Chief Design Officer)",
        image: "/Default/founder-placeholder.png",
        bio: "Creative visionary transforming ideas into beautiful, user-centric experiences. Specializes in creating intuitive interfaces that not only look stunning but also drive business results.",
        expertise: ["UI/UX Design", "Design Systems", "User Research"]
      }
    ]
  },
  stats: [
    { label: "Projects Delivered", value: "250+", icon: "Code" },
    { label: "Client Satisfaction", value: "97%", icon: "Heart" },
    { label: "Years Experience", value: "4+", icon: "Award" },
    { label: "Security Incidents", value: "0", icon: "Shield" }
  ],
  coreValues: {
    title: "Our Core Values",
    description: "The principles that guide everything we do at SKYBER.",
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
    ]
  },
  mission: {
    title: "Our Mission",
    paragraphs: [
      "At SKYBER, we believe in creating digital solutions that are not just functional, but secure, scalable, and built to last. Our mission is to bridge the gap between cutting-edge technology and practical business needs.",
      "We're committed to delivering solutions that empower businesses, not complicate them. Every project is an opportunity to make a meaningful impact, and we approach each one with dedication, expertise, and a genuine passion for excellence.",
      "Whether you're looking to secure your digital infrastructure, build a cutting-edge web application, or transform your business with custom software solutions, SKYBER is here to help you achieve your goals."
    ]
  }
};

export default function AboutPage() {
  const [config, setConfig] = useState<AboutConfig>(defaultConfig);
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
          if (data.success && data.data?.about) {
            setConfig(data.data.about);
          }
        }
      } catch (error) {
        console.error('Error loading about config:', error);
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
    <div className="min-h-screen bg-background">
      <PageHero
        breadcrumbItems={[{ label: "About Us" }]}
        badge={{
          icon: Users,
          text: "Our Story"
        }}
        title={<span>About <span className="text-[#17D492] skyber-text">SKYBER</span></span>}
        description="Building secure, scalable, and innovative digital solutions with a team of passionate experts."
      />

      {/* Team Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {config.leadershipTeam.title.includes('Leadership Team') ? (
                  <>
                    {config.leadershipTeam.title.split('Leadership Team')[0]}
                    <span className="text-[#17D492]">Leadership Team</span>
                    {config.leadershipTeam.title.split('Leadership Team')[1]}
                  </>
                ) : (
                  config.leadershipTeam.title
                )}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {config.leadershipTeam.description}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {config.leadershipTeam.members.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="flex flex-col"
                >
                  <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-[#17D492]/50 transition-all duration-300 overflow-hidden group">
                    {/* Image Section */}
                    <div className="relative w-full h-[400px] overflow-hidden">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.parentElement) {
                            target.parentElement.style.background = 'linear-gradient(135deg, rgba(23, 212, 146, 0.1) 0%, rgba(23, 212, 146, 0.05) 100%)';
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                      
                      {/* Name & Designation Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-2xl font-bold text-foreground mb-1">
                          {member.name}
                        </h3>
                        <p className="text-[#17D492] font-semibold text-sm">
                          {member.designation}
                        </p>
                      </div>
                    </div>

                    <CardContent className="p-6 space-y-4">
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {member.bio}
                      </p>
                      
                      {/* Expertise Tags */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {member.expertise.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-3 py-1 rounded-full bg-[#17D492]/10 text-[#17D492] text-xs font-medium border border-[#17D492]/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {config.stats.map((stat, index) => {
                const Icon = iconMap[stat.icon] || Code;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-[#17D492]/50 transition-all duration-300 text-center p-6">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-3 rounded-full bg-[#17D492]/10">
                          <Icon className="w-6 h-6 text-[#17D492]" />
                        </div>
                        <div className="text-3xl font-bold text-[#17D492]">
                          {stat.value}
                        </div>
                        <div className="text-sm text-muted-foreground font-medium">
                          {stat.label}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {config.coreValues.title.includes('Core Values') ? (
                  <>
                    {config.coreValues.title.split('Core Values')[0]}
                    <span className="text-[#17D492]">Core Values</span>
                    {config.coreValues.title.split('Core Values')[1]}
                  </>
                ) : (
                  config.coreValues.title
                )}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {config.coreValues.description}
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {config.coreValues.values.map((value, index) => {
                const Icon = iconMap[value.icon] || Lightbulb;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-[#17D492]/50 transition-all duration-300 hover:shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-4">
                          <div className="p-3 rounded-lg bg-[#17D492]/10 w-fit">
                            <Icon className="w-6 h-6 text-[#17D492]" />
                          </div>
                          <h3 className="text-xl font-bold text-[#17D492]">
                            {value.title}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {value.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {config.mission.title.includes('Mission') ? (
                  <>
                    {config.mission.title.split('Mission')[0]}
                    <span className="text-[#17D492]">Mission</span>
                    {config.mission.title.split('Mission')[1]}
                  </>
                ) : (
                  config.mission.title
                )}
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                {config.mission.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

