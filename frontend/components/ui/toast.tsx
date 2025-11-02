"use client";

import React, { useEffect } from "react";
import { X, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type ToastType = "success" | "error";

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export function Toast({ id, type, title, description, duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const iconColor = type === "success" ? "text-[#2b9875]" : "text-[#d65563]";
  const Icon = type === "success" ? CheckCircle2 : AlertCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-2 w-60 sm:w-72 text-[10px] sm:text-xs z-50"
    >
      <div
        className={`${type === "success" ? "succsess-alert" : "error-alert"} cursor-default flex items-center justify-between w-full h-12 sm:h-14 rounded-lg bg-[#232531] dark:bg-card border border-border px-[10px]`}
      >
        <div className="flex gap-2">
          <div className={`${iconColor} bg-white/5 backdrop-blur-xl p-1 rounded-lg`}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-white dark:text-foreground">{title}</p>
            {description && (
              <p className="text-gray-500 dark:text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => onClose(id)}
          className="text-gray-600 dark:text-muted-foreground hover:bg-white/5 dark:hover:bg-white/10 p-1 rounded-md transition-colors ease-linear"
          aria-label="Close"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
        </button>
      </div>
    </motion.div>
  );
}

export function ToastContainer({ toasts, onClose }: { toasts: ToastProps[]; onClose: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast {...toast} onClose={onClose} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

