"use client";

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { SessionExpiredCard } from "@/components/ui/session-expired-card";
import { setSessionExpiredHandler } from "@/lib/api-client";

interface SessionExpiredContextType {
  showSessionExpired: () => void;
  hideSessionExpired: () => void;
  isSessionExpired: boolean;
}

const SessionExpiredContext = createContext<SessionExpiredContextType | undefined>(undefined);

export const useSessionExpired = () => {
  const context = useContext(SessionExpiredContext);
  if (!context) {
    throw new Error("useSessionExpired must be used within SessionExpiredProvider");
  }
  return context;
};

export function SessionExpiredProvider({ children }: { children: ReactNode }) {
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  const showSessionExpired = useCallback(() => {
    setIsSessionExpired(true);
  }, []);

  const hideSessionExpired = useCallback(() => {
    setIsSessionExpired(false);
  }, []);

  // Register the handler with the API client
  useEffect(() => {
    setSessionExpiredHandler(showSessionExpired);
    return () => {
      setSessionExpiredHandler(() => {});
    };
  }, [showSessionExpired]);

  return (
    <SessionExpiredContext.Provider value={{ showSessionExpired, hideSessionExpired, isSessionExpired }}>
      {children}
      {isSessionExpired && (
        <SessionExpiredCard onClose={hideSessionExpired} />
      )}
    </SessionExpiredContext.Provider>
  );
}

