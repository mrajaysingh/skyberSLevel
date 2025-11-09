"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu as MenuIcon } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { MegaMenu } from "@/components/ui/mega-menu";
import { AnimatedButton } from "@/components/ui/animated-button";
import { useSecurity } from "@/components/security/page-security";
import Image from "next/image";

interface NavigationLink {
  id: string;
  label: string;
  href: string;
  order: number;
}

interface HeaderConfig {
  logoUrl: string;
  siteName: string;
  navigationLinks: NavigationLink[];
  glassMorphismIntensity?: number; // 0-100, controls opacity of glass effect
  headerBgColor?: string; // Legacy support
  headerTextColor: string;
  stickyHeader: boolean;
}

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [headerConfig, setHeaderConfig] = useState<HeaderConfig>({
    logoUrl: "/favicon.svg",
    siteName: "SKYBER",
    navigationLinks: [
      { id: "1", label: "About Us", href: "#about", order: 1 },
      { id: "2", label: "Demo", href: "/demo", order: 2 },
      { id: "3", label: "Insights", href: "#insights", order: 3 },
      { id: "4", label: "Blogs", href: "#blogs", order: 4 },
      { id: "5", label: "Policies", href: "/policies", order: 5 },
      { id: "6", label: "Contact Us", href: "#contact", order: 6 },
    ],
    glassMorphismIntensity: 40, // Default 40% opacity
    headerTextColor: "#000000",
    stickyHeader: true,
  });
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user } = useSecurity();
  const isHomePage = pathname === "/";
  const isInsightsPage = pathname === "/insights";
  const isBlogsPage = pathname === "/blogs";
  const isDemoPage = pathname === "/demo";
  const isLoginPage = pathname === "/login";

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Load header configuration from API
  useEffect(() => {
    const loadHeaderConfig = async () => {
      try {
        const response = await fetch(`${API_URL}/api/site-config/current`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        if (response.ok) {
          // Check if response is JSON before parsing
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            if (data.success && data.data.header) {
              const loadedConfig = data.data.header;
              // Handle backward compatibility: if headerBgColor exists but glassMorphismIntensity doesn't, set default
              if (!loadedConfig.glassMorphismIntensity && loadedConfig.headerBgColor) {
                loadedConfig.glassMorphismIntensity = 40; // Default intensity
              } else if (!loadedConfig.glassMorphismIntensity) {
                loadedConfig.glassMorphismIntensity = 40; // Default if neither exists
              }
              setHeaderConfig(loadedConfig);
            }
          }
        }
      } catch (error) {
        console.error('Error loading header config:', error);
        // Keep default config on error
      }
    };

    loadHeaderConfig();
    
    // Refresh config every 5 seconds to pick up changes
    const interval = setInterval(loadHeaderConfig, 5000);
    
    // Also listen for storage events (when config is saved in another tab)
    const handleStorageChange = () => {
      loadHeaderConfig();
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom event when config is saved
    window.addEventListener('headerConfigUpdated', loadHeaderConfig);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('headerConfigUpdated', loadHeaderConfig);
    };
  }, [API_URL]);

  // Ensure component is mounted before using auth state to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check for dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  // Determine button text and href based on authentication
  const getClientAreaButton = () => {
    // While on login page, always show Client Area button regardless of auth state
    if (isLoginPage) {
      return {
        text: 'Client Area',
        href: '/login'
      };
    }

    // Only check auth state after mounting to prevent hydration mismatch
    if (mounted && isAuthenticated && user) {
      // Determine dashboard URL based on role
      const dashboardUrl = user.role === 'super-admin' 
        ? '/auth/dashboards/user/super-admin'
        : '/dashboard'; // Add other role dashboards as needed
      
      return {
        text: 'Dashboard',
        href: dashboardUrl
      };
    }
    
    return {
      text: 'Client Area',
      href: '/login'
    };
  };

  const clientAreaButton = getClientAreaButton();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, section: string) => {
    e.preventDefault();
    const lenis = (window as unknown as { lenis?: { scrollTo: (target: number | Element, opts?: Record<string, unknown>) => void } }).lenis;

    if (section === "#insights") {
      if (isInsightsPage) {
        if (lenis) { lenis.scrollTo(0, { duration: 1.2 }); } else { window.scrollTo({ top: 0, behavior: "smooth" }); }
      } else {
        router.push("/insights");
      }
      return;
    }

    if (section === "#about") {
      if (isHomePage) {
        const element = document.querySelector(section);
        const offset = scrolled ? -68 : -80; // Adjust offset based on header state
        if (element && lenis) { lenis.scrollTo(element, { duration: 1.2, offset }); }
        else if (element) { element.scrollIntoView({ behavior: "smooth" }); }
      } else {
        router.push("/about");
      }
      return;
    }

    if (section === "#blogs") {
      if (isBlogsPage) {
        if (lenis) { lenis.scrollTo(0, { duration: 1.2 }); } else { window.scrollTo({ top: 0, behavior: "smooth" }); }
      } else {
        router.push("/blogs");
      }
      return;
    }

    if (section === "#contact") {
      router.push("/contact");
      return;
    }

    if (isHomePage) {
      const element = document.querySelector(section);
      const offset = scrolled ? -68 : -80; // Adjust offset based on header state
      if (element && lenis) { lenis.scrollTo(element, { duration: 1.2, offset }); }
      else if (element) { element.scrollIntoView({ behavior: "smooth" }); }
    } else {
      router.push(`/${section}`);
    }
  };

  return (
    <>
      <MegaMenu isOpen={megaMenuOpen} onClose={() => setMegaMenuOpen(false)} />
      
	  <header
	    className={cn(
	      "fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-out",
	      isInsightsPage
	        ? (scrolled
	            ? "bg-background shadow-md py-2 border-b border-border/30"
	            : "bg-background py-5")
	        : (scrolled
	            ? "bg-background/70 shadow-md py-2 backdrop-blur-xl border-b border-border/30"
	            : "bg-background/40 py-5 backdrop-blur-lg")
	    )}
	    style={{
	      height: scrolled ? 'calc(var(--header-height) * 0.85)' : 'var(--header-height)',
	      transition: 'height 500ms ease-out, padding 500ms ease-out',
	      // Calculate background opacity based on glass morphism intensity
	      // Use CSS variable with opacity for glass morphism effect
	      ...(headerConfig.glassMorphismIntensity !== undefined && {
	        backgroundColor: `hsl(var(--background) / ${(headerConfig.glassMorphismIntensity ?? 40) / 100})`,
	      }),
	      // Only apply custom text color in dark mode, use default theme color in light mode
	      ...(isDarkMode && headerConfig.headerTextColor ? { color: headerConfig.headerTextColor } : {}),
	    } as React.CSSProperties}
	  >
        <div className="container mx-auto flex items-center justify-between h-full">
          <div className="flex items-center space-x-4">
            <AnimatedButton
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setMegaMenuOpen(true)}
            >
              <MenuIcon className="h-6 w-6" />
            </AnimatedButton>

            <Link href="/" className="flex items-center space-x-2">
              <Image
                src={headerConfig.logoUrl}
                alt={`${headerConfig.siteName} Logo`}
                width={40}
                height={40}
                className="text-[#17D492] dark:text-[#17D492]"
              />
              <span className="font-bold text-xl text-foreground skyber-text">{headerConfig.siteName}</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              {headerConfig.navigationLinks
                .sort((a, b) => a.order - b.order)
                .map((link) => {
                  const isCurrentPage = pathname === link.href || 
                    (link.href === "#insights" && isInsightsPage) ||
                    (link.href === "#blogs" && isBlogsPage) ||
                    (link.href === "/demo" && isDemoPage);
                  
                  return (
                    <a
                      key={link.id}
                      href={link.href}
                      onClick={(e) => link.href.startsWith('#') ? handleNavClick(e, link.href) : undefined}
                      className={cn(
                        "relative px-4 py-2 rounded-full transition-colors hover:bg-accent hover:text-accent-foreground group",
                        isCurrentPage && "bg-accent text-accent-foreground"
                      )}
                    >
                      {link.label}
                      <span className={cn(
                        "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#17D492] transition-all duration-300 ease-out",
                        isCurrentPage ? "w-[calc(100%-2rem)]" : "w-0 group-hover:w-[calc(100%-2rem)]"
                      )}></span>
                    </a>
                  );
                })}
            </div>

            <div className="flex items-center space-x-4">
              {!isLoginPage && <ThemeSwitcher />}
              <AnimatedButton href={clientAreaButton.href} className="bg-[#17D492] hover:bg-[#14c082] text-white">
                {clientAreaButton.text}
              </AnimatedButton>
            </div>
          </nav>

          <div className="flex md:hidden items-center space-x-4">
            {!isLoginPage && <ThemeSwitcher />}
            <AnimatedButton href={clientAreaButton.href} className="bg-[#17D492] hover:bg-[#14c082] text-white">
              {clientAreaButton.text}
            </AnimatedButton>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

