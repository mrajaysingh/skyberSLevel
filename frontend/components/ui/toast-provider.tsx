"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { ToastContainer, ToastProps, ToastType } from "./toast";

interface ToastContextType {
  showToast: (type: ToastType, title: string, description?: string, duration?: number) => void;
  showSuccess: (title: string, description?: string, duration?: number) => void;
  showError: (title: string, description?: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, title: string, description?: string, duration?: number) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastProps = {
        id,
        type,
        title,
        description,
        duration,
        onClose: removeToast,
      };
      setToasts((prev) => [...prev, newToast]);
    },
    [removeToast]
  );

  const showSuccess = useCallback(
    (title: string, description?: string, duration?: number) => {
      showToast("success", title, description, duration);
    },
    [showToast]
  );

  const showError = useCallback(
    (title: string, description?: string, duration?: number) => {
      showToast("error", title, description, duration);
    },
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

