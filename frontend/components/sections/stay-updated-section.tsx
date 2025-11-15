"use client";

import { FormEvent, ReactNode, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Mail, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Silk from "@/components/ui/Silk";
import { useToast } from "@/components/ui/toast-provider";

interface Benefit {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface StayUpdatedConfig {
  icon: string;
  title: string;
  description: string;
  privacyText: string;
  benefits: Benefit[];
  backgroundSpeed: number;
  backgroundScale: number;
  backgroundColor: string;
  backgroundNoiseIntensity: number;
  backgroundRotation: number;
  glassMorphismIntensity: number;
}

const defaultConfig: StayUpdatedConfig = {
  icon: "Mail",
  title: "Stay Updated with SKYBER",
  description: "Get the latest cybersecurity insights, tech updates, and exclusive offers delivered directly to your inbox.",
  privacyText: "🔒 We respect your privacy. Unsubscribe anytime—no spam, ever.",
  benefits: [
    {
      id: "1",
      icon: "Mail",
      title: "Weekly Updates",
      description: "Curated cybersecurity news and guidance from the Skyber team.",
    },
    {
      id: "2",
      icon: "CheckCircle",
      title: "Exclusive Offers",
      description: "Early access to workshops, private betas, and partner pricing.",
    },
    {
      id: "3",
      icon: "Send",
      title: "Expert Tips",
      description: "Actionable insights to harden infrastructure and ship faster.",
    },
  ],
  backgroundSpeed: 5,
  backgroundScale: 1,
  backgroundColor: "#17D492",
  backgroundNoiseIntensity: 1.5,
  backgroundRotation: 0,
  glassMorphismIntensity: 40,
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Mail,
  CheckCircle,
  Send,
};

export function StayUpdatedSection() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [config, setConfig] = useState<StayUpdatedConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch(`${API_URL}/api/site-config/current`, {
          cache: 'no-store',
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.stayUpdated) {
            setConfig({ ...defaultConfig, ...data.data.stayUpdated });
          }
        }
      } catch (error) {
        console.error('Error loading Stay Updated config:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
    window.addEventListener('stayUpdatedConfigUpdated', loadConfig);
    return () => {
      window.removeEventListener('stayUpdatedConfigUpdated', loadConfig);
    };
  }, [API_URL]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !email.includes("@")) {
      showError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubscribed(true);
        setIsLoading(false);
        setEmail("");
        showSuccess("Successfully subscribed! Check your email for confirmation.");
      } else {
        showError(data.message || "Failed to subscribe. Please try again.");
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error('Subscription error:', error);
      showError("Failed to subscribe. Please try again later.");
      setIsLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  const IconComponent = iconMap[config.icon] || Mail;

  return (
    <section className="relative">
      {/* Background layer that extends behind footer - 20% of section height */}
      <div 
        className="absolute top-0 left-0 right-0 py-12" 
        style={{ bottom: '-20%', zIndex: 0 }}
      >
        <div className="absolute inset-0" style={{ width: '100%', height: '100%' }}>
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Silk 
              speed={config.backgroundSpeed} 
              scale={config.backgroundScale} 
              color={config.backgroundColor} 
              noiseIntensity={config.backgroundNoiseIntensity} 
              rotation={config.backgroundRotation} 
            />
          </div>
        </div>
        {/* Glass morphism overlay for better text visibility */}
        <div 
          className="absolute inset-0 backdrop-blur-md bg-background/60" 
          style={{ 
            zIndex: 1,
            opacity: config.glassMorphismIntensity / 100
          }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/50" style={{ zIndex: 1 }} />
      </div>

      {/* Content container - stays in place */}
      <div className="container relative z-10 mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-7"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#17D492]/10">
              <IconComponent className="h-6 w-6 text-[#17D492]" />
            </div>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              {config.title}
            </h2>
            <p className="mt-2 text-base text-muted-foreground">
              {config.description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-7"
          >
            {!isSubscribed ? (
              <form
                onSubmit={handleSubmit}
                className="mx-auto flex max-w-xl flex-col gap-4 sm:flex-row"
              >
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-12 flex-1 border-2 border-border px-4 text-base transition-colors focus:border-[#17D492] focus:ring-[#17D492]/20"
                  required
                />
                <Button
                  type="submit"
                  disabled={isLoading || !email}
                  className="h-12 px-7 text-base font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
                  variant="default"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Subscribing…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Subscribe
                    </span>
                  )}
                </Button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="mx-auto max-w-xl rounded-2xl border-2 border-[#17D492]/20 bg-[#17D492]/10 p-6"
              >
                <div className="flex flex-col items-center gap-3 text-[#17D492]">
                  <CheckCircle className="h-6 w-6" />
                  <span className="text-lg font-semibold">
                    Successfully subscribed!
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Thank you for subscribing. You&apos;ll receive our updates
                  soon.
                </p>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid gap-4 md:grid-cols-3"
          >
            {config.benefits.map((benefit) => {
              const BenefitIcon = iconMap[benefit.icon] || Mail;
              return (
                <StayUpdatedBenefit
                  key={benefit.id}
                  icon={<BenefitIcon className="h-6 w-6 text-[#17D492]" />}
                  title={benefit.title}
                  description={benefit.description}
                />
              );
            })}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 text-sm text-muted-foreground"
          >
            {config.privacyText}
          </motion.p>
        </div>
      </div>
    </section>
  );
}

function StayUpdatedBenefit({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-border/40 bg-card/60 p-4 text-center backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-[#17D492]/30 hover:shadow-[0_22px_45px_-30px_rgba(23,212,146,0.7)]">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#17D492]/10">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

