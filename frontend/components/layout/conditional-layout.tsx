"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "./header";
import Footer from "./footer";
import { BackToTop } from "@/components/ui/back-to-top";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isNotFound, setIsNotFound] = useState(false);
  const hideLayout = pathname === "/access-required" || pathname?.startsWith("/auth");
  const hideFooter = pathname === "/login" || isNotFound || pathname?.startsWith("/auth");

  useEffect(() => {
    // Check if we're on a 404 page by looking for the error-card class in the DOM
    const checkNotFound = () => {
      const errorCard = document.querySelector(".error-card");
      setIsNotFound(!!errorCard);
    };
    
    // Check after a short delay to allow DOM to render
    const timer = setTimeout(checkNotFound, 100);
    checkNotFound(); // Also check immediately
    
    return () => clearTimeout(timer);
  }, [pathname]);

  if (hideLayout) {
    return (
      <>
        {children}
        <BackToTop />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-grow pt-[var(--header-height)]">{children}</main>
      {!hideFooter && <Footer />}
      <BackToTop />
    </>
  );
}

