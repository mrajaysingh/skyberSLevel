"use client";

import { ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SkyberSecutityProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function SkyberSecutity({ children, fallback }: SkyberSecutityProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sessionToken = localStorage.getItem("sessionToken");
      const authenticated = !!sessionToken;
      setIsAuthenticated(authenticated);

      if (!authenticated) {
        // Store current path for redirect after login
        sessionStorage.setItem("skyber_redirect_after_login", window.location.pathname);
        router.push("/login");
      }
    }
  }, [router]);

  // Show nothing while checking authentication
  if (isAuthenticated === null) {
    return fallback || null;
  }

  // Show nothing if not authenticated (redirect will happen)
  if (!isAuthenticated) {
    return fallback || null;
  }

  // Show protected content if authenticated
  return <>{children}</>;
}

