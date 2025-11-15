"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";

export interface PageHeroProps {
  breadcrumbItems: BreadcrumbItem[];
  badge?: {
    icon?: LucideIcon;
    text: string | ReactNode;
  };
  title: string | ReactNode;
  titleHighlight?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function PageHero({
  breadcrumbItems,
  badge,
  title,
  titleHighlight,
  description,
  children,
  className,
}: PageHeroProps) {
  const BadgeIcon = badge?.icon;

  return (
    <section className={`relative pt-32 pb-20 overflow-hidden ${className || ""}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-[#17D492]/10 via-transparent to-[#17D492]/5" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Breadcrumb items={breadcrumbItems} />
          </motion.div>

          {/* Hero Content */}
          <div className="text-center">
            {badge && (
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#17D492]/10 backdrop-blur-md border border-[#17D492]/20 mb-6">
                {BadgeIcon && <BadgeIcon className="w-4 h-4 mr-2 text-[#17D492]" />}
                {badge.text}
              </div>
            )}
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              {titleHighlight && typeof title === 'string' ? (
                <>
                  {title.split(titleHighlight)[0]}
                  <span className="text-[#17D492]">{titleHighlight}</span>
                  {title.split(titleHighlight)[1]}
                </>
              ) : (
                title
              )}
            </h1>
            {description && (
              <p className="text-xl text-muted-foreground mb-8">
                {description}
              </p>
            )}
            {children && <div className="mt-6">{children}</div>}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

