"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Shield, Lock, Zap } from "lucide-react";
import { TypeWriter } from "@/components/ui/TypeWriter";
import { AnimatedMesh } from "@/components/ui/animated-mesh";
import { AnimatedButton } from "@/components/ui/animated-button";
import { GetStartedFormSimple } from "@/components/forms/get-started-form-simple";

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

const HeroContent = React.memo(() => {
  const [showForm, setShowForm] = useState(false);
  
  const phrases = [
    "Enhanced AI Security Features",
    "Smart Cybersecurity & Tech",
    "Secure Digital Experiences",
    "Innovative Security Solutions",
    "Secure, Develop, Design"
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
          <span className="text-[#17D492] mr-2">New</span>
          <TypeWriter phrases={phrases} typingSpeed={80} deletingSpeed={40} delayBetweenPhrases={3000} />
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
          Secure Your Digital<br className="hidden md:block" /> Future With{" "}
          <span className="text-[#17D492] skyber-text">SKYBER</span>
        </h1>

        <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
          Leading cybersecurity solutions and exceptional web development to protect your business and accelerate your online growth.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
          <AnimatedButton 
            size="lg" 
            className="w-full sm:w-auto" 
            showArrow
            onClick={() => setShowForm(true)}
          >
            Get Started
          </AnimatedButton>
          <AnimatedButton href="/about" size="lg" variant="outline" className="w-full sm:w-auto">
            About Us
          </AnimatedButton>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2 md:pt-4">
          <FeatureItem icon={Shield} text="99.9% Uptime" />
          <FeatureItem icon={Lock} text="SOC 2 Certified" />
          <FeatureItem icon={Zap} text="24/7 Support" />
        </div>
      </motion.div>

      <GetStartedFormSimple open={showForm} onOpenChange={setShowForm} />
    </>
  );
});

HeroContent.displayName = 'HeroContent';

const HeroImage = React.memo(() => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="relative mt-6 lg:mt-0"
  >
    <div className="relative h-[280px] sm:h-[320px] lg:h-[400px] w-full">
      <div className="absolute inset-0 bg-gradient-to-r from-[#17D492]/20 to-transparent rounded-lg"></div>
      <Image
        src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg"
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
  return (
    <section className="relative min-h-screen md:min-h-[calc(100vh-5rem)] pt-4 md:pt-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b dark:from-background dark:to-background/60 from-background to-background/90 z-0" />
      <AnimatedMesh />
      <div className="container relative z-10 h-full flex items-start md:items-center py-4 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start md:items-center">
          <HeroContent />
          <HeroImage />
        </div>
      </div>
      
      {/* TrustPilot Button - Full Width Canvas, Bottom Right */}
      <div className="absolute bottom-0 right-0 z-20 pr-3 pb-3">
        <a 
          href="https://www.trustpilot.com/review/skybersupport.me" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 border border-[#17D492]/30 rounded-lg bg-white hover:border-[#17D492] transition-colors cursor-pointer hover:shadow-md shadow-sm"
        >
          <span className="text-gray-800 font-medium text-sm">Review us on</span>
          <svg className="w-4 h-4 text-[#17D492]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span className="text-gray-800 font-medium text-sm">Trustpilot</span>
        </a>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

