import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Code,
  Laptop,
  Smartphone,
  Palette,
  Settings,
  Shield,
  Building2,
  GraduationCap,
  Heart,
  Store,
  X,
  ChevronRight,
  Scale,
  Cookie,
  Database,
  RefreshCw,
  AlertTriangle,
  Copyright,
  Clock,
  Users,
  CreditCard,
  Lock,
  UserCheck,
  HeadphonesIcon,
  Eye,
  Baby,
  Leaf,
  HeartHandshake
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";
  const isInsightsPage = pathname === "/insights";
  const isBlogsPage = pathname === "/blogs";
  const isContactPage = pathname === "/contact";
  const isAboutPage = pathname === "/about";

  // Handle menu closing
  const handleClose = () => {
    setIsClosing(true);
    // Delay clearing activeTab to allow image fade out animation
    setTimeout(() => {
      setActiveTab(null);
    }, 200); // 200ms = 0.2s to match the fade out duration
    onClose();
  };

  // Reset closing state when menu opens
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  const getPolicyHref = (title: string): string => {
    const policyMap: Record<string, string> = {
      "Privacy Policy": "/policies/privacy-policy",
      "Terms & Conditions": "/policies/terms-conditions",
      "Cookie Policy": "/policies/cookie-policy",
      "Data Protection Policy": "/policies/data-protection-policy",
      "Refund & Cancellation": "/policies/refund-cancellation-policy",
      "Disclaimer": "/policies/disclaimer",
      "Intellectual Property": "/policies/intellectual-property-policy",
      "Service Level Agreement": "/policies/service-level-agreement",
      "Acceptable Use Policy": "/policies/acceptable-use-policy",
      "Payment & Billing": "/policies/payment-billing-policy",
      "Security Policy": "/policies/security-policy",
      "Client Onboarding": "/policies/client-onboarding-policy",
      "Support Policy": "/policies/support-policy",
      "Accessibility Policy": "/policies/accessibility-policy",
      "GDPR Compliance": "/policies/gdpr-compliance",
      "Children's Privacy": "/policies/children-privacy-policy",
      "Environmental Policy": "/policies/environmental-policy",
      "Transparency & Ethics": "/policies/transparency-ethics-policy"
    };
    return policyMap[title] || "/policies";
  };

  const mainNavItems = [
    { title: "About", href: "/about" },
    { title: "Demo", href: "/demo" },
    { title: "Insights", href: "#insights" },
    { title: "Blogs", href: "#blogs" },
    { title: "Contact", href: "/contact" },
    { title: "Policies", href: "#policies" }
  ];

  const menuItems = {
    services: {
      title: "Our Services",
      items: [
        {
          icon: <Shield className="w-6 h-6 text-[#17D492]" />,
          title: "Cybersecurity Solutions",
          description: "Advanced security measures for your digital assets",
          image: "https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        },
        {
          icon: <Laptop className="w-6 h-6 text-[#17D492]" />,
          title: "Web Development",
          description: "Custom websites and web applications",
          image: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        },
        {
          icon: <Smartphone className="w-6 h-6 text-[#17D492]" />,
          title: "App Development",
          description: "Native and cross-platform mobile solutions",
          image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        },
        {
          icon: <Code className="w-6 h-6 text-[#17D492]" />,
          title: "Custom Software",
          description: "Tailored software solutions for your business",
          image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        },
        {
          icon: <Palette className="w-6 h-6 text-[#17D492]" />,
          title: "UI/UX Design",
          description: "Beautiful and intuitive user experiences",
          image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        },
        {
          icon: <Settings className="w-6 h-6 text-[#17D492]" />,
          title: "Tech Consultation",
          description: "Expert guidance for your tech decisions",
          image: "https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        }
      ]
    },
    industries: {
      title: "Industries Served",
      items: [
        {
          icon: <Building2 className="w-6 h-6 text-[#17D492]" />,
          title: "Startups",
          description: "Empowering new ventures with technology",
          image: "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        },
        {
          icon: <Store className="w-6 h-6 text-[#17D492]" />,
          title: "E-commerce",
          description: "Digital solutions for online retail",
          image: "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        },
        {
          icon: <GraduationCap className="w-6 h-6 text-[#17D492]" />,
          title: "Education",
          description: "Technology for modern learning",
          image: "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        },
        {
          icon: <Heart className="w-6 h-6 text-[#17D492]" />,
          title: "Healthcare",
          description: "Digital solutions for healthcare providers",
          image: "https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        }
      ]
    },
    policies: {
      title: "Company Policies",
      items: [
        {
          icon: <Shield className="w-6 h-6 text-[#17D492]" />,
          title: "Privacy Policy",
          description: "How we collect, use, and protect your data",
          image: "https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        },
        {
          icon: <Scale className="w-6 h-6 text-[#17D492]" />,
          title: "Terms & Conditions",
          description: "Rules for using our website and services",
          image: "https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        },
        {
          icon: <Cookie className="w-6 h-6 text-[#17D492]" />,
          title: "Cookie Policy",
          description: "Our use of cookies and tracking technologies",
          image: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        },
        {
          icon: <Database className="w-6 h-6 text-[#17D492]" />,
          title: "Data Protection Policy",
          description: "How we store, secure, and handle your data",
          image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        },
        {
          icon: <RefreshCw className="w-6 h-6 text-[#17D492]" />,
          title: "Refund & Cancellation",
          description: "Our refund and service cancellation terms",
          image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        },
        {
          icon: <AlertTriangle className="w-6 h-6 text-[#17D492]" />,
          title: "Disclaimer",
          description: "Limitations of liability for site information",
          image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        },
        {
          icon: <Copyright className="w-6 h-6 text-[#17D492]" />,
          title: "Intellectual Property",
          description: "Ownership of content, logos, and code",
          image: "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        },
        {
          icon: <Clock className="w-6 h-6 text-[#17D492]" />,
          title: "Service Level Agreement",
          description: "Our commitment to uptime and performance",
          image: "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        },
        {
          icon: <Users className="w-6 h-6 text-[#17D492]" />,
          title: "Acceptable Use Policy",
          description: "Rules for using our services and platforms",
          image: "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        },
        {
          icon: <CreditCard className="w-6 h-6 text-[#17D492]" />,
          title: "Payment & Billing",
          description: "Payment methods, invoicing, and fees",
          image: "https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        },
        {
          icon: <Lock className="w-6 h-6 text-[#17D492]" />,
          title: "Security Policy",
          description: "Our cybersecurity measures and protocols",
          image: "https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        },
        {
          icon: <UserCheck className="w-6 h-6 text-[#17D492]" />,
          title: "Client Onboarding",
          description: "Steps from signup to project completion",
          image: "https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        },
        {
          icon: <HeadphonesIcon className="w-6 h-6 text-[#17D492]" />,
          title: "Support Policy",
          description: "Support hours, channels, and response times",
          image: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        },
        {
          icon: <Eye className="w-6 h-6 text-[#17D492]" />,
          title: "Accessibility Policy",
          description: "Making our site usable for everyone",
          image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        },
        {
          icon: <Shield className="w-6 h-6 text-[#17D492]" />,
          title: "GDPR Compliance",
          description: "How we comply with European data laws",
          image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        },
        {
          icon: <Baby className="w-6 h-6 text-[#17D492]" />,
          title: "Children's Privacy",
          description: "Safe handling of minor data and COPPA compliance",
          image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        },
        {
          icon: <Leaf className="w-6 h-6 text-[#17D492]" />,
          title: "Environmental Policy",
          description: "Our eco-friendly commitments and sustainability",
          image: "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        },
        {
          icon: <HeartHandshake className="w-6 h-6 text-[#17D492]" />,
          title: "Transparency & Ethics",
          description: "Our stance on fair practices and anti-corruption",
          image: "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        }
      ]
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, section: string) => {
    e.preventDefault();
    const lenis = (window as unknown as { lenis?: { scrollTo: (target: number | Element, opts?: Record<string, unknown>) => void } }).lenis;

    if (section === "#insights") {
      if (isInsightsPage) {
        if (lenis) { lenis.scrollTo(0, { duration: 1.2 }); } else { window.scrollTo({ top: 0, behavior: "smooth" }); }
      } else {
        router.push("/insights");
      }
      handleClose();
      return;
    }

    if (section === "#about") {
      if (isHomePage) {
        const element = document.querySelector(section);
        const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const offset = scrollTop > 10 ? -68 : -80; // Adjust offset based on scroll state
        if (element && lenis) { lenis.scrollTo(element, { duration: 1.2, offset }); }
        else if (element) { element.scrollIntoView({ behavior: "smooth" }); }
      } else {
        router.push("/about");
      }
      handleClose();
      return;
    }

    if (section === "#blogs") {
      if (isBlogsPage) {
        if (lenis) { lenis.scrollTo(0, { duration: 1.2 }); } else { window.scrollTo({ top: 0, behavior: "smooth" }); }
      } else {
        router.push("/blogs");
      }
      handleClose();
      return;
    }

    if (section === "#contact" || section === "/contact") {
      router.push("/contact");
      handleClose();
      return;
    }

    if (section === "#policies") {
      router.push("/policies");
      handleClose();
      return;
    }

    if (isHomePage) {
      const element = document.querySelector(section);
      const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const offset = scrollTop > 10 ? -68 : -80; // Adjust offset based on scroll state
      if (element && lenis) { lenis.scrollTo(element, { duration: 1.2, offset }); }
      else if (element) { element.scrollIntoView({ behavior: "smooth" }); }
    } else {
      router.push(`/${section}`);
    }
    handleClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="fixed top-0 left-0 h-screen w-full sm:w-[400px] bg-background border-r border-border z-50 overflow-y-auto scrollbar-hide"
            data-lenis-prevent
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-2">
                  <Image
                    src="/favicon.svg"
                    alt="SKYBER Logo"
                    width={40}
                    height={40}
                    className="text-[#17D492] dark:text-[#17D492]"
                  />
                  <span className="font-bold text-xl text-foreground skyber-text">SKYBER</span>
                </div>
                <Button variant="ghost" size="icon" onClick={handleClose}>
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <div className="space-y-8">
                <div className="md:hidden">
                  <div className="grid grid-cols-2 gap-4">
                    {mainNavItems.filter(item => item.href !== "#policies").map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        onClick={(e) => {
                          if (item.href.startsWith("#")) {
                            handleNavClick(e, item.href);
                          } else {
                            handleClose();
                          }
                        }}
                        className={cn(
                          "nav-menu-item flex items-center justify-center p-3 rounded-lg border border-border hover:bg-secondary/50 hover:text-[#17D492] transition-colors font-medium",
                          (item.href === "#insights" && isInsightsPage) ||
                          (item.href === "#blogs" && isBlogsPage) ||
                          (item.href === "/about" && pathname === "/about") ||
                          (item.href === "/demo" && pathname === "/demo") ||
                          ((item.href === "/contact" || item.href === "#contact") && isContactPage) ||
                          (item.href === "#policies" && pathname.startsWith("/policies"))
                            ? "bg-secondary/50 text-[#17D492]"
                            : ""
                        )}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                  {/* Policies button spanning full width */}
                  <div className="mt-4">
                    <a
                      href="#policies"
                      onClick={(e) => handleNavClick(e, "#policies")}
                      className={cn(
                        "flex items-center justify-center p-3 rounded-lg border border-border hover:bg-secondary/50 hover:text-[#17D492] transition-colors font-medium w-full",
                        pathname.startsWith("/policies") ? "bg-secondary/50 text-[#17D492]" : ""
                      )}
                    >
                      Policies
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">{menuItems.services.title}</h3>
                  <div className="space-y-4">
                    {menuItems.services.items.map((item, index) => (
                      <Link
                        key={index}
                        href={
                          item.title === "UI/UX Design" ? "/services/ui/ux" :
                          item.title === "Cybersecurity Solutions" ? "/services/cybersecurity" :
                          item.title === "Web Development" ? "/services/web-development" :
                          item.title === "App Development" ? "/services/app-development" :
                          item.title === "Custom Software" ? "/services/custom-software" :
                          item.title === "Tech Consultation" ? "/services/tech-consultancy" :
                          "/services"
                        }
                        onClick={handleClose}
                        className="group flex items-start space-x-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                        onMouseEnter={() => setActiveTab(`services-${index}`)}
                        onMouseLeave={() => setActiveTab(null)}
                      >
                        <div className="flex-shrink-0">{item.icon}</div>
                        <div className="flex-grow">
                          <h4 className="font-medium group-hover:text-[#17D492] transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">{menuItems.industries.title}</h3>
                  <div className="space-y-4">
                    {menuItems.industries.items.map((item, index) => (
                      <Link
                        key={index}
                        href="/services"
                        onClick={handleClose}
                        className="group flex items-start space-x-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                        onMouseEnter={() => setActiveTab(`industries-${index}`)}
                        onMouseLeave={() => setActiveTab(null)}
                      >
                        <div className="flex-shrink-0">{item.icon}</div>
                        <div className="flex-grow">
                          <h4 className="font-medium group-hover:text-[#17D492] transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">{menuItems.policies.title}</h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {menuItems.policies.items.map((item, index) => {
                      const policyHref = getPolicyHref(item.title);
                      return (
                        <Link
                          key={index}
                          href={policyHref}
                          onClick={handleClose}
                          className="group flex items-start space-x-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                          onMouseEnter={() => setActiveTab(`policies-${index}`)}
                          onMouseLeave={() => setActiveTab(null)}
                        >
                          <div className="flex-shrink-0">{item.icon}</div>
                          <div className="flex-grow">
                            <h4 className="font-medium group-hover:text-[#17D492] transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {activeTab && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ 
                  duration: isClosing ? 0.2 : 0.3,
                  ease: isClosing ? "easeOut" : "easeInOut"
                }}
                className="fixed top-0 right-0 h-screen w-[calc(100%-400px)] bg-background border-l border-border z-50 hidden lg:block"
              >
                <div className="relative h-full">
                  <Image
                    src={
                      activeTab.startsWith("services")
                        ? menuItems.services.items[parseInt(activeTab.split("-")[1])].image
                        : activeTab.startsWith("industries")
                        ? menuItems.industries.items[parseInt(activeTab.split("-")[1])].image
                        : menuItems.policies.items[parseInt(activeTab.split("-")[1])].image
                    }
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}

