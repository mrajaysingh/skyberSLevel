"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const Footer = () => {
  return (
    <footer className="bg-secondary/50 dark:bg-secondary/20 text-foreground rounded-tl-[25px] rounded-tr-[25px] border-t border-[#14C082]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Image
                src="/favicon.svg"
                alt="SKYBER Logo"
                width={40}
                height={40}
                className="text-[#17D492] dark:text-[#17D492]"
              />
              <span className="font-bold text-xl skyber-text">SKYBER</span>
            </Link>
            <p className="text-muted-foreground mb-4">
              Providing cutting-edge cybersecurity and web development solutions to protect and propel your business.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-[#17D492] transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-[#17D492] transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-[#17D492] transition-colors">
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-[#17D492] transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-[#17D492] transition-colors">
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-foreground transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms-conditions" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services/cybersecurity" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cybersecurity
                </Link>
              </li>
              <li>
                <Link href="/services/web-development" className="text-muted-foreground hover:text-foreground transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link href="/services/app-development" className="text-muted-foreground hover:text-foreground transition-colors">
                  App Development
                </Link>
              </li>
              <li>
                <Link href="/services/custom-software" className="text-muted-foreground hover:text-foreground transition-colors">
                  Custom Software
                </Link>
              </li>
              <li>
                <Link href="/services/ui/ux" className="text-muted-foreground hover:text-foreground transition-colors">
                  UI/UX Design
                </Link>
              </li>
              <li>
                <Link href="/services/tech-consultancy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Tech Consultation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#17D492] mt-0.5" />
                <span className="text-muted-foreground">
                  Kanpur, Mandhana<br />
                  212108
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#17D492]" />
                <span className="text-muted-foreground">+91 89574 76865</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#17D492]" />
                <span className="text-muted-foreground">info@skyber.codes</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-border" />

        <div className="flex flex-col md:flex-row justify-between items-center relative">
          {/* Back to Top Button with Tooltip */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 group">
            <Button
              onClick={scrollToTop}
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-full bg-[#17D492]/10 hover:bg-[#17D492]/20 text-[#17D492] transition-colors"
              aria-label="Back to top"
            >
              <ArrowUp className="w-5 h-5" />
            </Button>
            <span className="absolute opacity-0 group-hover:opacity-100 group-hover:text-white group-hover:text-xs group-hover:-translate-y-12 right-1/2 group-hover:translate-x-1/2 whitespace-nowrap duration-700 pointer-events-none bg-gray-900 dark:bg-gray-700 px-2 py-1 rounded-md shadow-lg">
              Back to top
            </span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center w-full pr-12 md:pr-16">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {new Date().getFullYear()} <span className="skyber-text">SKYBER</span>. All rights reserved.
            </p>
            
            {/* TrustPilot Button - Between Copyright and Policy Links */}
            <div className="mb-4 md:mb-0">
              <a 
                href="https://www.trustpilot.com/review/skybersupport.me" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-[#17D492]/30 rounded-lg bg-white hover:border-[#17D492] transition-colors cursor-pointer hover:shadow-md shadow-sm"
              >
                <span className="text-gray-800 font-medium text-sm">Review us on</span>
                <svg className="w-4 h-4 text-[#17D492]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span className="text-gray-800 font-medium text-sm">Trustpilot</span>
              </a>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/policies/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/policies/terms-conditions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/policies/cookie-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cookie Policy
              </Link>
              <Link href="/policies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                All Policies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

