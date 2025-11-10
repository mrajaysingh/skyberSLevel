"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  Clock, 
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PolicySection {
  id: string;
  title: string;
  level: 1 | 2 | 3;
}

interface PolicyTemplateProps {
  title: string;
  description: string;
  lastUpdated: string;
  readingTime: string;
  category: string;
  sections: PolicySection[];
  children: React.ReactNode;
}

export function PolicyTemplate({
  title,
  description,
  lastUpdated,
  readingTime,
  category,
  sections,
  children
}: PolicyTemplateProps) {
  const [activeSection, setActiveSection] = useState<string>("");
  const [showTOC, setShowTOC] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 120; // Account for fixed header
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth"
      });
    }
  };

  const getLevelClass = (level: number) => {
    switch (level) {
      case 1: return "text-lg font-semibold";
      case 2: return "text-base font-medium ml-4";
      case 3: return "text-sm ml-8";
      default: return "text-base";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#17D492]/10 via-transparent to-[#17D492]/5" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            {/* Back Button */}
            <Button
              asChild
              variant="ghost"
              className="mb-6 hover:bg-[#17D492]/10 hover:text-[#17D492]"
            >
              <Link href="/policies">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Policies
              </Link>
            </Button>

            {/* Policy Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#17D492]/10 backdrop-blur-md border border-[#17D492]/20 mb-6">
                <FileText className="w-4 h-4 mr-2 text-[#17D492]" />
                {category}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                {title}
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                {description}
              </p>
              
              {/* Policy Meta */}
              <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Last Updated: {lastUpdated}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {readingTime} read
                </div>
              </div>
            </div>

            {/* Table of Contents Toggle */}
            <div className="text-center">
              <Button
                onClick={() => setShowTOC(!showTOC)}
                variant="outline"
                className="bg-background/50 backdrop-blur-sm border-[#17D492]/20 hover:border-[#17D492] hover:text-[#17D492]"
              >
                {showTOC ? "Hide" : "Show"} Table of Contents
                <ChevronRight className={`w-4 h-4 ml-2 transition-transform ${showTOC ? "rotate-90" : ""}`} />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-20">
        <div className={`grid gap-8 transition-all duration-300 ${showTOC ? "lg:grid-cols-4" : "lg:grid-cols-1"}`}>
          {/* Table of Contents Sidebar */}
          {showTOC && (
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-32 transition-all duration-300">
                <Card className="border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#17D492]" />
                      Table of Contents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <nav className="space-y-2">
                      {sections.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className={`w-full text-left p-2 rounded-lg transition-all hover:bg-[#17D492]/10 hover:text-[#17D492] ${
                            activeSection === section.id
                              ? "bg-[#17D492]/20 text-[#17D492] font-medium"
                              : "text-muted-foreground"
                          } ${getLevelClass(section.level)}`}
                        >
                          {section.title}
                        </button>
                      ))}
                    </nav>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Policy Content */}
          <div className={showTOC ? "lg:col-span-3" : "lg:col-span-1"}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-none"
              style={{
                '--tw-prose-body': 'rgb(var(--muted-foreground))',
                '--tw-prose-headings': 'rgb(var(--foreground))',
                '--tw-prose-links': 'rgb(var(--foreground))',
                '--tw-prose-bold': 'rgb(var(--foreground))',
                '--tw-prose-counters': 'rgb(var(--muted-foreground))',
                '--tw-prose-bullets': 'rgb(var(--muted-foreground))',
                '--tw-prose-hr': 'rgb(var(--border))',
                '--tw-prose-quotes': 'rgb(var(--foreground))',
                '--tw-prose-quote-borders': 'rgb(var(--border))',
                '--tw-prose-captions': 'rgb(var(--muted-foreground))',
                '--tw-prose-code': 'rgb(var(--foreground))',
                '--tw-prose-pre-code': 'rgb(var(--muted-foreground))',
                '--tw-prose-pre-bg': 'rgb(var(--muted))',
                '--tw-prose-th-borders': 'rgb(var(--border))',
                '--tw-prose-td-borders': 'rgb(var(--border))',
              } as React.CSSProperties}
            >
              <style jsx>{`
                div[id] h2 {
                  font-size: 2rem;
                  line-height: 2.5rem;
                  font-weight: 700;
                  color: rgb(var(--foreground));
                  margin-top: 2rem;
                  margin-bottom: 1rem;
                }
                div[id] h3 {
                  font-size: 1.25rem;
                  line-height: 1.75rem;
                  font-weight: 600;
                  color: rgb(var(--foreground));
                  margin-top: 1.5rem;
                  margin-bottom: 0.75rem;
                }
                div[id] p {
                  font-size: 1.125rem;
                  line-height: 1.75rem;
                  color: rgb(var(--muted-foreground));
                  margin-bottom: 1rem;
                }
                div[id] ul, div[id] ol {
                  font-size: 1.125rem;
                  line-height: 1.75rem;
                  color: rgb(var(--muted-foreground));
                  margin-bottom: 1rem;
                  padding-left: 1.5rem;
                }
                div[id] li {
                  margin-bottom: 0.5rem;
                }
                div[id] strong {
                  font-weight: 600;
                  color: rgb(var(--foreground));
                }
              `}</style>
              {children}
            </motion.div>

            {/* Policy Footer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16 p-8 bg-muted/30 rounded-2xl border border-border/50"
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Questions About This Policy?
                </h3>
                <p className="text-muted-foreground mb-6">
                  If you have any questions or need clarification about this policy, 
                  our team is here to help.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button asChild className="bg-[#17D492] hover:bg-[#14c082] text-white">
                    <Link href="/contact">
                      Contact Support
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/policies">
                      View All Policies
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

