"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export function Preloader() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if this is a page reload (not client-side navigation)
    const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    const isReload = 
      (performance.navigation && (performance.navigation as any).type === 1) || // Legacy API
      (navEntries.length > 0 && navEntries[0].type === "reload");

    // Only show preloader on actual page reload, not on client-side navigation
    if (isReload) {
      setIsLoading(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) return;

    document.body.classList.add('loading', 'preloader-active');
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100vh';
    document.documentElement.style.touchAction = 'none';

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.classList.remove('loading', 'preloader-active');
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
      document.documentElement.style.touchAction = '';
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
      document.body.classList.remove('loading', 'preloader-active');
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
      document.documentElement.style.touchAction = '';
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="preloader" onContextMenu={(e) => e.preventDefault()}>
      <div className="flex flex-col items-center gap-8">
        <motion.div
          className="preloader-logo text-[#17D492] w-20 h-20 md:w-24 md:h-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0.5, 1], scale: [1, 1.1, 1, 1.1, 1] }}
          transition={{ duration: 2, times: [0, 0.2, 0.5, 0.8, 1], repeat: Infinity, ease: 'easeInOut' }}
        >
          <Image
            src="/favicon.svg"
            alt="SKYBER Logo"
            width={96}
            height={96}
            className="w-full h-full"
          />
        </motion.div>
        <div className="w-32 md:w-40">
          <div className="h-0.5 bg-[#17D492]/20 rounded-full overflow-hidden">
            <motion.div className="h-full bg-[#17D492] rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.1, ease: 'linear' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

