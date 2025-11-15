"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Cpu,
  Sparkles,
  Users,
  TimerReset,
  Trophy,
  RefreshCw,
  Shield,
  Zap,
  Globe,
  Lock,
  MessageSquare,
  Code,
  Award,
  Heart,
  Rocket,
  Target,
  Lightbulb,
  Star,
  Check,
  Palette,
} from "lucide-react";
import Shuffle from "@/components/ui/Shuffle";
import { GridScan } from "@/components/ui/GridScan";
import { useTheme } from "next-themes";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck,
  Cpu,
  Sparkles,
  Users,
  TimerReset,
  Trophy,
  RefreshCw,
  Shield,
  Zap,
  Globe,
  Lock,
  MessageSquare,
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

interface Benefit {
  id: string;
  icon: string;
  title: string;
  description: string;
  accent: string;
}

interface Stat {
  id: string;
  label: string;
  numericValue: number;
  suffix: string;
  duration: number;
}

interface WhyChooseUsConfig {
  badgeText: string;
  badgeIcon: string;
  title: string;
  titleHighlight: string;
  description: string;
  benefits: Benefit[];
  stats: Stat[];
  gridScanSensitivity: number;
  gridScanLineThickness: number;
  gridScanLinesColorLight: string;
  gridScanLinesColorDark: string;
  gridScanGridScale: number;
  gridScanScanColor: string;
  gridScanScanOpacity: number;
  gridScanEnablePost: boolean;
  gridScanBloomIntensity: number;
  gridScanChromaticAberration: number;
  gridScanNoiseIntensity: number;
  gradientOverlay1Enabled: boolean;
  gradientOverlay1Size: number;
  gradientOverlay1X: number;
  gradientOverlay1Y: number;
  gradientOverlay1Color: string;
  gradientOverlay1Opacity: number;
  gradientOverlay2Enabled: boolean;
  gradientOverlay2Size: number;
  gradientOverlay2X: number;
  gradientOverlay2Y: number;
  gradientOverlay2Color: string;
  gradientOverlay2Opacity: number;
  gradientOverlay3Enabled: boolean;
  gradientOverlay3Size: number;
  gradientOverlay3X: number;
  gradientOverlay3Y: number;
  gradientOverlay3Color: string;
  gradientOverlay3Opacity: number;
  backgroundOverlayOpacity: number;
  backgroundOverlayOpacityDark: number;
}

const defaultConfig: WhyChooseUsConfig = {
  badgeText: "Why Teams Choose SKYBER",
  badgeIcon: "RefreshCw",
  title: "Build with the",
  titleHighlight: "team you can trust",
  description: "From stealth startups to enterprise ops teams, SKYBER becomes your partner in launching secure, resilient, jaw-dropping products—fast.",
  benefits: [
    {
      id: "1",
      icon: "ShieldCheck",
      title: "Security-First DNA",
      description: "Every solution is architected with zero-trust principles, hardened infrastructure, and compliance-driven workflows.",
      accent: "from-[#17D492]/40 to-transparent",
    },
    {
      id: "2",
      icon: "Cpu",
      title: "Human x AI Synergy",
      description: "We pair experienced engineers with battle-tested AI tooling to ship faster without compromising quality.",
      accent: "from-[#14c082]/40 to-transparent",
    },
    {
      id: "3",
      icon: "Sparkles",
      title: "Design That Converts",
      description: "From UX architecture to pixel-perfect interfaces, we craft experiences that feel premium and perform flawlessly.",
      accent: "from-[#63ddb3]/40 to-transparent",
    },
    {
      id: "4",
      icon: "Users",
      title: "Elite Delivery Squad",
      description: "You collaborate directly with core builders—no layers, no handoff telephone. Transparent, weekly value drops.",
      accent: "from-[#17d4c2]/40 to-transparent",
    },
    {
      id: "5",
      icon: "TimerReset",
      title: "24/7 Observability",
      description: "Real-time dashboards, automated alerts, and proactive threat hunting keep your stack healthy around the clock.",
      accent: "from-[#1ae5a0]/40 to-transparent",
    },
    {
      id: "6",
      icon: "Trophy",
      title: "Scale Without Fear",
      description: "Modular architectures, rigorous testing, and DevSecOps pipelines make evolving and scaling effortless.",
      accent: "from-[#0f172a]/60 via-transparent to-transparent",
    },
  ],
  stats: [
    { id: "1", label: "Mission-critical launches", numericValue: 120, suffix: "+", duration: 2000 },
    { id: "2", label: "Average response time", numericValue: 12, suffix: "m", duration: 1500 },
    { id: "3", label: "Client retention", numericValue: 96, suffix: "%", duration: 2000 },
    { id: "4", label: "Security incidents", numericValue: 0, suffix: "", duration: 1000 },
  ],
  gridScanSensitivity: 0.55,
  gridScanLineThickness: 1,
  gridScanLinesColorLight: "#e0d4f0",
  gridScanLinesColorDark: "#392e4e",
  gridScanGridScale: 0.1,
  gridScanScanColor: "#17D492",
  gridScanScanOpacity: 0.4,
  gridScanEnablePost: true,
  gridScanBloomIntensity: 0.6,
  gridScanChromaticAberration: 0.002,
  gridScanNoiseIntensity: 0.01,
  gradientOverlay1Enabled: true,
  gradientOverlay1Size: 384,
  gradientOverlay1X: -128,
  gradientOverlay1Y: -160,
  gradientOverlay1Color: "#17D492",
  gradientOverlay1Opacity: 0.1,
  gradientOverlay2Enabled: true,
  gradientOverlay2Size: 288,
  gradientOverlay2X: 40,
  gradientOverlay2Y: 133,
  gradientOverlay2Color: "#63ddb3",
  gradientOverlay2Opacity: 0.1,
  gradientOverlay3Enabled: true,
  gradientOverlay3Size: 600,
  gradientOverlay3X: 150,
  gradientOverlay3Y: 0,
  gradientOverlay3Color: "#0f172a",
  gradientOverlay3Opacity: 0.4,
  backgroundOverlayOpacity: 0.6,
  backgroundOverlayOpacityDark: 0.4,
};

// Hook for counting animation
function useCountUp(
  end: number,
  duration: number,
  isInView: boolean,
  suffix: string = ""
): string {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isInView) {
      setCount(0);
      countRef.current = 0;
      startTimeRef.current = null;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const animate = (currentTime: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(easeOut * end);

      if (currentCount !== countRef.current) {
        countRef.current = currentCount;
        setCount(currentCount);
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [end, duration, isInView]);

  return `${count}${suffix}`;
}

// Stat item component
function StatItem({ 
  stat, 
  isInView 
}: { 
  stat: Stat; 
  isInView: boolean;
}) {
  const displayValue = useCountUp(
    stat.numericValue,
    stat.duration,
    isInView,
    stat.suffix
  );

  return (
    <div className="flex flex-col items-center justify-center gap-1 border-border/50 px-6 py-8 text-center text-muted-foreground first:border-l-0 border-l">
      <span className="text-3xl font-bold text-[#17D492]">
        {displayValue}
      </span>
      <span className="text-xs uppercase tracking-wide">
        {stat.label}
      </span>
    </div>
  );
}

export function WhyChooseUsSection() {
  const [config, setConfig] = useState<WhyChooseUsConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [animatedCards, setAnimatedCards] = useState<Set<number>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [statsInView, setStatsInView] = useState<Set<number>>(new Set());
  const [mounted, setMounted] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const shuffleRefs = useRef<{ [key: number]: HTMLElement | null }>({});
  const statsRef = useRef<HTMLDivElement>(null);
  const { theme, resolvedTheme } = useTheme();
  const isDark = mounted && (resolvedTheme === 'dark' || theme === 'dark');
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Handle theme mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load config from backend
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch(`${API_URL}/api/site-config/current`, {
          cache: 'no-store'
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.whyChooseUs) {
            setConfig({ ...defaultConfig, ...data.data.whyChooseUs });
          }
        }
      } catch (error) {
        console.error('Error loading Why Choose Us config:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();

    // Listen for config updates
    const handleConfigUpdate = () => {
      loadConfig();
    };
    window.addEventListener('whyChooseUsConfigUpdated', handleConfigUpdate);
    return () => {
      window.removeEventListener('whyChooseUsConfigUpdated', handleConfigUpdate);
    };
  }, [API_URL]);

  // Intersection Observer for stats animation
  useEffect(() => {
    if (!statsRef.current || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Start animation for all stats
            setStatsInView(new Set(config.stats.map((_, index) => index)));
          } else {
            // Reset when out of view so it can animate again
            setStatsInView(new Set());
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '0px',
      }
    );

    observer.observe(statsRef.current);

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [config.stats, loading]);

  // Trigger shuffle when card is hovered
  useEffect(() => {
    if (hoveredCard !== null) {
      const timeout = setTimeout(() => {
        const shuffleElement = shuffleRefs.current[hoveredCard];
        if (shuffleElement) {
          const event = new MouseEvent('mouseenter', {
            bubbles: true,
            cancelable: true,
            view: window,
          });
          shuffleElement.dispatchEvent(event);
        } else {
          const cardElement = document.querySelector(`[data-card-index="${hoveredCard}"]`);
          if (cardElement) {
            const h3Element = cardElement.querySelector('h3');
            if (h3Element) {
              shuffleRefs.current[hoveredCard] = h3Element as HTMLElement;
              const event = new MouseEvent('mouseenter', {
                bubbles: true,
                cancelable: true,
                view: window,
              });
              h3Element.dispatchEvent(event);
            }
          }
        }
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [hoveredCard]);

  useEffect(() => {
    if (loading) return;

    // First animate cards in order: 1, 5, 3 (card numbers = indices 0, 4, 2)
    const firstSequence = [0, 4, 2];
    // Then animate cards in order: 6, 2, 4 (card numbers = indices 5, 1, 3)
    const secondSequence = [5, 1, 3];
    const staggerDelay = 300;
    const returnDelay = 300;
    const gapBetweenSequences = 1500;
    
    const animateCards = () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      
      setAnimatedCards(new Set());
      
      firstSequence.forEach((index, i) => {
        const timeout = setTimeout(() => {
          setAnimatedCards((prev) => new Set([...prev, index]));
        }, i * staggerDelay);
        timeoutsRef.current.push(timeout);
      });

      const firstSequenceReturnStart = firstSequence.length * staggerDelay + returnDelay;
      firstSequence.forEach((index, i) => {
        const timeout = setTimeout(() => {
          setAnimatedCards((prev) => {
            const newSet = new Set(prev);
            newSet.delete(index);
            return newSet;
          });
        }, firstSequenceReturnStart + i * returnDelay);
        timeoutsRef.current.push(timeout);
      });

      const secondSequenceStart = firstSequenceReturnStart + firstSequence.length * returnDelay + gapBetweenSequences;
      secondSequence.forEach((index, i) => {
        const timeout = setTimeout(() => {
          setAnimatedCards((prev) => new Set([...prev, index]));
        }, secondSequenceStart + i * staggerDelay);
        timeoutsRef.current.push(timeout);
      });

      const secondSequenceReturnStart = secondSequenceStart + secondSequence.length * staggerDelay + returnDelay;
      secondSequence.forEach((index, i) => {
        const timeout = setTimeout(() => {
          setAnimatedCards((prev) => {
            const newSet = new Set(prev);
            newSet.delete(index);
            return newSet;
          });
        }, secondSequenceReturnStart + i * returnDelay);
        timeoutsRef.current.push(timeout);
      });
    };

    animateCards();

    const cycleDuration = 
      firstSequence.length * staggerDelay +
      returnDelay +
      firstSequence.length * returnDelay +
      gapBetweenSequences +
      secondSequence.length * staggerDelay +
      returnDelay +
      secondSequence.length * returnDelay +
      2000;
    
    const interval = setInterval(() => {
      animateCards();
    }, cycleDuration);

    return () => {
      clearInterval(interval);
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, [config.benefits, loading]);

  if (loading) {
    return null;
  }

  const BadgeIcon = iconMap[config.badgeIcon] || RefreshCw;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/20 py-20">
      {/* GridScan Background */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <GridScan
            sensitivity={config.gridScanSensitivity}
            lineThickness={config.gridScanLineThickness}
            linesColor={isDark ? config.gridScanLinesColorDark : config.gridScanLinesColorLight}
            gridScale={config.gridScanGridScale}
            scanColor={config.gridScanScanColor}
            scanOpacity={config.gridScanScanOpacity}
            enablePost={config.gridScanEnablePost}
            bloomIntensity={config.gridScanBloomIntensity}
            chromaticAberration={config.gridScanChromaticAberration}
            noiseIntensity={config.gridScanNoiseIntensity}
            className="w-full h-full"
          />
        </div>
      )}
      
      {/* Gradient overlays for better content readability */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        {config.gradientOverlay1Enabled && (
          <div 
            className="absolute rounded-full blur-3xl"
            style={{
              width: `${config.gradientOverlay1Size}px`,
              height: `${config.gradientOverlay1Size}px`,
              top: `${config.gradientOverlay1Y}px`,
              left: `${config.gradientOverlay1X}px`,
              backgroundColor: config.gradientOverlay1Color,
              opacity: config.gradientOverlay1Opacity,
            }}
          />
        )}
        {config.gradientOverlay2Enabled && (
          <div 
            className="absolute rounded-full blur-3xl"
            style={{
              width: `${config.gradientOverlay2Size}px`,
              height: `${config.gradientOverlay2Size}px`,
              top: `${config.gradientOverlay2Y}px`,
              right: `${config.gradientOverlay2X}px`,
              backgroundColor: config.gradientOverlay2Color,
              opacity: config.gradientOverlay2Opacity,
            }}
          />
        )}
        {config.gradientOverlay3Enabled && (
          <div 
            className="absolute rounded-full blur-[160px]"
            style={{
              width: `${config.gradientOverlay3Size}px`,
              height: `${config.gradientOverlay3Size}px`,
              bottom: `${config.gradientOverlay3Y}px`,
              left: `${config.gradientOverlay3X}px`,
              backgroundColor: config.gradientOverlay3Color,
              opacity: config.gradientOverlay3Opacity,
            }}
          />
        )}
        {/* Semi-transparent overlay for better text readability */}
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundColor: isDark 
              ? `rgba(0, 0, 0, ${config.backgroundOverlayOpacityDark})` 
              : `rgba(255, 255, 255, ${config.backgroundOverlayOpacity})` 
          }} 
        />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#17D492]/20 bg-[#17D492]/10 px-4 py-2 text-sm font-medium text-[#17D492]">
            <BadgeIcon className="h-4 w-4" />
            {config.badgeText}
          </div>
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {config.title}{" "}
            <span className="text-[#17D492]">{config.titleHighlight}</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {config.description}
          </p>
        </motion.div>

        <motion.div
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.08 }}
        >
          {config.benefits.map((benefit, index) => {
            const Icon = iconMap[benefit.icon] || ShieldCheck;
            const isAnimated = animatedCards.has(index);
            return (
              <motion.div
                key={benefit.id}
                data-card-index={index}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6 }}
                className={`group relative h-full overflow-hidden rounded-2xl border bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 ${
                  isAnimated
                    ? "-translate-y-1 border-[#17D492]/50 shadow-[0_25px_45px_-20px_rgba(23,212,146,0.35)]"
                    : "border-border/40"
                } hover:-translate-y-1 hover:border-[#17D492]/50 hover:shadow-[0_25px_45px_-20px_rgba(23,212,146,0.35)]`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${benefit.accent} opacity-60`}
                />
                <div className="relative flex h-full flex-col gap-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#17D492]/10 text-[#17D492]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-xl font-semibold text-foreground min-h-[1.75rem] w-full">
                      <div 
                        ref={(el) => {
                          if (el) {
                            const h3Element = el.querySelector('h3');
                            if (h3Element) {
                              shuffleRefs.current[index] = h3Element as HTMLElement;
                            }
                          }
                        }}
                        className="w-full"
                      >
                        <Shuffle
                          text={benefit.title}
                          tag="h3"
                          className="!text-xl !font-semibold !text-foreground !normal-case !leading-normal w-full"
                          style={{ 
                            fontFamily: 'inherit',
                            fontSize: '1.25rem',
                            lineHeight: '1.75rem',
                            textTransform: 'none',
                            letterSpacing: 'normal',
                            fontWeight: '600',
                            width: '100%'
                          }}
                          triggerOnHover={true}
                          triggerOnce={false}
                          threshold={1.0}
                          rootMargin="1000px"
                          duration={0.35}
                          shuffleTimes={3}
                          animationMode="evenodd"
                          stagger={0.03}
                          loop={false}
                          respectReducedMotion={true}
                        />
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          ref={statsRef}
          className="mt-16 rounded-2xl border border-border/40 bg-card/70 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-2 divide-border/50 md:grid-cols-4">
            {config.stats.map((stat, index) => (
              <StatItem
                key={stat.id}
                stat={stat}
                isInView={statsInView.has(index)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
