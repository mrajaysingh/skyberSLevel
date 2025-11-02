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

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user } = useSecurity();
  const isHomePage = pathname === "/";
  const isInsightsPage = pathname === "/insights";
  const isBlogsPage = pathname === "/blogs";
  const isDemoPage = pathname === "/demo";
  const isLoginPage = pathname === "/login";

  // Determine button text and href based on authentication
  const getClientAreaButton = () => {
    if (isAuthenticated && user) {
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
	      transition: 'height 500ms ease-out, padding 500ms ease-out'
	    }}
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
                src="/favicon.svg"
                alt="SKYBER Logo"
                width={40}
                height={40}
                className="text-[#17D492] dark:text-[#17D492]"
              />
              <span className="font-bold text-xl text-foreground skyber-text">SKYBER</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <a 
                href="#about" 
                onClick={(e) => handleNavClick(e, "#about")}
                className="relative px-4 py-2 rounded-full transition-colors hover:bg-accent hover:text-accent-foreground group"
              >
                About Us
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#17D492] transition-all duration-300 ease-out group-hover:w-[calc(100%-2rem)]"></span>
              </a>

              <a 
                href="/demo"
                className={cn(
                  "relative px-4 py-2 rounded-full transition-colors hover:bg-accent hover:text-accent-foreground group",
                  isDemoPage && "bg-accent text-accent-foreground"
                )}
              >
                Demo
                <span className={cn(
                  "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#17D492] transition-all duration-300 ease-out",
                  isDemoPage ? "w-[calc(100%-2rem)]" : "w-0 group-hover:w-[calc(100%-2rem)]"
                )}></span>
              </a>

              <a 
                href="#insights" 
                onClick={(e) => handleNavClick(e, "#insights")}
                className={cn(
                  "relative px-4 py-2 rounded-full transition-colors hover:bg-accent hover:text-accent-foreground group",
                  isInsightsPage && "bg-accent text-accent-foreground"
                )}
              >
                Insights
                <span className={cn(
                  "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#17D492] transition-all duration-300 ease-out",
                  isInsightsPage ? "w-[calc(100%-2rem)]" : "w-0 group-hover:w-[calc(100%-2rem)]"
                )}></span>
              </a>

              <a 
                href="#blogs" 
                onClick={(e) => handleNavClick(e, "#blogs")}
                className={cn(
                  "relative px-4 py-2 rounded-full transition-colors hover:bg-accent hover:text-accent-foreground group",
                  isBlogsPage && "bg-accent text-accent-foreground"
                )}
              >
                Blogs
                <span className={cn(
                  "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#17D492] transition-all duration-300 ease-out",
                  isBlogsPage ? "w-[calc(100%-2rem)]" : "w-0 group-hover:w-[calc(100%-2rem)]"
                )}></span>
              </a>

              <a 
                href="/policies"
                className="relative px-4 py-2 rounded-full transition-colors hover:bg-accent hover:text-accent-foreground group"
              >
                Policies
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#17D492] transition-all duration-300 ease-out group-hover:w-[calc(100%-2rem)]"></span>
              </a>

              <a 
                href="#contact" 
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/contact");
                }}
                className="relative px-4 py-2 rounded-full transition-colors hover:bg-accent hover:text-accent-foreground group"
              >
                Contact Us
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#17D492] transition-all duration-300 ease-out group-hover:w-[calc(100%-2rem)]"></span>
              </a>
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

