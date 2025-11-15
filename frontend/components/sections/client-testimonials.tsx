"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  position: string;
  company: string;
  image: string;
}

interface Stat {
  id: string;
  label: string;
  numericValue: number;
  suffix: string;
  duration: number;
}

interface ClientTestimonialsConfig {
  badgeText: string;
  badgeIcon: string;
  title: string;
  description: string;
  testimonials: Testimonial[];
  autoplayEnabled: boolean;
  autoplayInterval: number;
  stats: Stat[];
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
}

const defaultConfig: ClientTestimonialsConfig = {
  badgeText: "What Our Clients Say",
  badgeIcon: "Quote",
  title: "Results that speak for themselves",
  description: "Teams that build with SKYBER stay with SKYBER—because we obsess over reliability, speed, and measurable outcomes.",
  testimonials: [
    {
      id: "1",
      quote: '<span className="skyber-text">SKYBER</span> transformed our cybersecurity posture. Within weeks, they patched critical vulnerabilities and delivered an observability layer that gives us complete confidence in production.',
      author: "Alexandra Chen",
      position: "CTO",
      company: "NexusFinance",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      id: "2",
      quote: "Partnering with <span className=\"skyber-text\">SKYBER</span> raised our product standard overnight. Their design systems, automation, and security reviews helped us launch confidently and scale to thousands of users.",
      author: "Marcus Johnson",
      position: "Product Director",
      company: "EcoSolutions",
      image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      id: "3",
      quote: "From discovery to deployment, <span className=\"skyber-text\">SKYBER</span> felt like an extension of our own team. The custom platform they engineered slashed manual ops by 35% and unlocked entirely new revenue streams.",
      author: "Sophia Rodriguez",
      position: "Operations Lead",
      company: "MedTech Innovations",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
  ],
  autoplayEnabled: true,
  autoplayInterval: 8000,
  stats: [
    { id: "1", label: "Client satisfaction", numericValue: 97, suffix: "%", duration: 2000 },
    { id: "2", label: "Return for new work", numericValue: 85, suffix: "%", duration: 2000 },
    { id: "3", label: "Avg. response time", numericValue: 12, suffix: "m", duration: 1500 },
    { id: "4", label: "Security incidents", numericValue: 0, suffix: "", duration: 1000 },
  ],
  gradientOverlay1Enabled: true,
  gradientOverlay1Size: 288,
  gradientOverlay1X: -80,
  gradientOverlay1Y: 40,
  gradientOverlay1Color: "#17D492",
  gradientOverlay1Opacity: 0.1,
  gradientOverlay2Enabled: true,
  gradientOverlay2Size: 384,
  gradientOverlay2X: 40,
  gradientOverlay2Y: 0,
  gradientOverlay2Color: "#0f172a",
  gradientOverlay2Opacity: 0.4,
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
    <motion.div
      className="flex flex-col items-center justify-center rounded-2xl border border-border/40 bg-card/70 px-4 py-6 text-center shadow-[0_18px_45px_-30px_rgba(23,212,146,0.6)]"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ duration: 0.5 }}
    >
      <span className="text-3xl font-bold text-[#17D492]">
        {displayValue}
      </span>
      <span className={cn("mt-1 text-xs uppercase tracking-wide text-muted-foreground")}>
        {stat.label}
      </span>
    </motion.div>
  );
}

export function ClientTestimonialsSection() {
  const [config, setConfig] = useState<ClientTestimonialsConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [statsInView, setStatsInView] = useState<Set<number>>(new Set());
  const statsRef = useRef<HTMLDivElement>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Load config from backend
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch(`${API_URL}/api/site-config/current`, {
          cache: 'no-store'
        });

        if (!response.ok) {
          // Non-critical error - backend might be offline or endpoint doesn't exist
          setLoading(false);
          return;
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          try {
            const data = await response.json();
            if (data.success && data.data?.clientTestimonials) {
              setConfig({ ...defaultConfig, ...data.data.clientTestimonials });
              setIsAutoplay(data.data.clientTestimonials.autoplayEnabled ?? true);
            }
          } catch (parseError) {
            // Non-critical error - invalid JSON response
            console.warn('Error parsing client testimonials config response:', parseError);
          }
        }
      } catch (error: any) {
        // Handle network errors gracefully - backend might not be running
        // This is non-critical as the component will use default values
        if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
          // Silently handle network errors - backend might not be running
          // Component will use default values
        } else {
          console.warn('Error loading client testimonials config (non-critical):', error?.message || error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadConfig();

    // Listen for config updates
    const handleConfigUpdate = () => {
      loadConfig();
    };
    window.addEventListener('clientTestimonialsConfigUpdated', handleConfigUpdate);
    return () => {
      window.removeEventListener('clientTestimonialsConfigUpdated', handleConfigUpdate);
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

  // Autoplay effect
  useEffect(() => {
    if (!isAutoplay || !config.autoplayEnabled || loading || config.testimonials.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === config.testimonials.length - 1 ? 0 : prev + 1));
    }, config.autoplayInterval);

    return () => clearInterval(interval);
  }, [isAutoplay, config.autoplayEnabled, config.autoplayInterval, config.testimonials.length, loading]);

  const safeQuote = useMemo(() => {
    if (loading || config.testimonials.length === 0) return "";
    const quote = config.testimonials[current]?.quote || "";
    return quote.replace(
      /<span className="skyber-text">SKYBER<\/span>/g,
      `<span class="skyber-text text-[#17D492]">SKYBER</span>`
    );
  }, [current, config.testimonials, loading]);

  const handlePrev = () => {
    setIsAutoplay(false);
    setCurrent((prev) => (prev === 0 ? config.testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsAutoplay(false);
    setCurrent((prev) => (prev === config.testimonials.length - 1 ? 0 : prev + 1));
  };

  if (loading || config.testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = config.testimonials[current];
  if (!currentTestimonial) return null;

  return (
    <section className="relative overflow-hidden bg-background py-20">
      <div className="absolute inset-0 pointer-events-none">
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
            className="absolute rounded-full blur-[120px]"
            style={{
              width: `${config.gradientOverlay2Size}px`,
              height: `${config.gradientOverlay2Size}px`,
              bottom: `${config.gradientOverlay2Y}px`,
              right: `${config.gradientOverlay2X}px`,
              backgroundColor: config.gradientOverlay2Color,
              opacity: config.gradientOverlay2Opacity,
            }}
          />
        )}
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#17D492]/20 bg-[#17D492]/10 px-4 py-2 text-sm font-medium text-[#17D492]">
            <Quote className="h-4 w-4" />
            {config.badgeText}
          </div>
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {config.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {config.description}
          </p>
        </motion.div>

        <div className="relative mx-auto max-w-4xl">
          <div className="absolute -top-16 -left-10 text-[120px] text-[#17D492]/20">
            <Quote className="h-[1em] w-[1em]" />
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 px-6 py-10 shadow-[0_32px_60px_-35px_rgba(23,212,146,0.45)] backdrop-blur">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.45 }}
                className="space-y-6 text-center"
              >
                <p className="text-lg italic text-muted-foreground md:text-xl">
                  "
                  <span
                    dangerouslySetInnerHTML={{
                      __html: safeQuote,
                    }}
                  />
                  "
                </p>

                <div className="flex flex-col items-center gap-3">
                  <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-[#17D492] shadow-lg">
                    <Image
                      src={currentTestimonial.image}
                      alt={currentTestimonial.author}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {currentTestimonial.author}
                    </h3>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {currentTestimonial.position} ·{" "}
                      <span className="text-foreground">
                        {currentTestimonial.company}
                      </span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="pointer-events-none absolute inset-y-10 left-8 right-8 rounded-3xl border border-[#17D492]/10" />

            <div className="absolute top-1/2 left-6 -translate-y-1/2">
              <Button
                variant="ghost"
                size="icon"
                className="pointer-events-auto rounded-full border border-border/50 bg-background/80 text-muted-foreground transition-all hover:border-[#17D492]/40 hover:bg-[#17D492]/10 hover:text-[#17D492]"
                onClick={handlePrev}
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </div>
            <div className="absolute top-1/2 right-6 -translate-y-1/2">
              <Button
                variant="ghost"
                size="icon"
                className="pointer-events-auto rounded-full border border-border/50 bg-background/80 text-muted-foreground transition-all hover:border-[#17D492]/40 hover:bg-[#17D492]/10 hover:text-[#17D492]"
                onClick={handleNext}
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        <motion.div
          ref={statsRef}
          className="mt-16 grid gap-6 rounded-3xl border border-border/50 bg-muted/20 p-6 md:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, staggerChildren: 0.08 }}
        >
          {config.stats.map((stat, index) => (
            <StatItem
              key={stat.id}
              stat={stat}
              isInView={statsInView.has(index)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
