"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Calculate if footer is visible (within 300px of bottom)
      const distanceFromBottom = documentHeight - (scrollPosition + windowHeight);
      const footerVisible = distanceFromBottom < 300;
      
      // Show button when user scrolls down 300px AND footer is not visible
      if (scrollPosition > 300 && !footerVisible) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={scrollToTop}
          className={cn(
            "fixed bottom-6 right-6 z-50",
            "w-12 h-12 rounded-full",
            "bg-gradient-to-r from-[#17D492] to-[#14c082]",
            "text-white shadow-lg",
            "flex items-center justify-center",
            "hover:from-[#14c082] hover:to-[#0f9f6f]",
            "hover:shadow-xl hover:scale-110",
            "active:scale-95",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-[#17D492]/50 focus:ring-offset-2"
          )}
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

