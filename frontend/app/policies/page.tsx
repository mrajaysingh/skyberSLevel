"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Shield, 
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
  HeartHandshake,
  FileText,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/ui/page-hero";

const policyCategories = [
  {
    title: "Core Legal & Privacy Policies",
    description: "Essential legal documents for compliance and user protection",
    policies: [
      {
        title: "Privacy Policy",
        description: "Explains how we collect, use, and protect user data",
        icon: Shield,
        href: "/policies/privacy-policy",
        required: true,
        category: "Legal Compliance"
      },
      {
        title: "Terms & Conditions",
        description: "Defines rules for using our website and services",
        icon: Scale,
        href: "/policies/terms-conditions",
        required: true,
        category: "Legal Compliance"
      },
      {
        title: "Cookie Policy",
        description: "Details our use of cookies, tracking, and user consent",
        icon: Cookie,
        href: "/policies/cookie-policy",
        required: true,
        category: "Legal Compliance"
      },
      {
        title: "Data Protection Policy",
        description: "Outlines how we store, secure, and handle customer data",
        icon: Database,
        href: "/policies/data-protection-policy",
        required: true,
        category: "Legal Compliance"
      },
      {
        title: "Refund & Cancellation Policy",
        description: "States conditions for refunds and service cancellations",
        icon: RefreshCw,
        href: "/policies/refund-cancellation-policy",
        required: true,
        category: "Legal Compliance"
      },
      {
        title: "Disclaimer",
        description: "Limits liability for information on our site",
        icon: AlertTriangle,
        href: "/policies/disclaimer",
        required: true,
        category: "Legal Compliance"
      },
      {
        title: "Intellectual Property Rights Policy",
        description: "Clarifies ownership of content, logos, and code",
        icon: Copyright,
        href: "/policies/intellectual-property-policy",
        required: true,
        category: "Legal Compliance"
      }
    ]
  },
  {
    title: "Business & Service-Specific Policies",
    description: "Policies governing our business operations and service delivery",
    policies: [
      {
        title: "Service Level Agreement (SLA)",
        description: "Commitment to uptime, performance, and response times",
        icon: Clock,
        href: "/policies/service-level-agreement",
        required: true,
        category: "Service Delivery"
      },
      {
        title: "Acceptable Use Policy",
        description: "Rules for customers using our services and platforms",
        icon: Users,
        href: "/policies/acceptable-use-policy",
        required: true,
        category: "Service Delivery"
      },
      {
        title: "Payment & Billing Policy",
        description: "Explains payment methods, invoicing, and late fee rules",
        icon: CreditCard,
        href: "/policies/payment-billing-policy",
        required: true,
        category: "Service Delivery"
      },
      {
        title: "Security Policy",
        description: "Our cybersecurity measures and vulnerability management",
        icon: Lock,
        href: "/policies/security-policy",
        required: true,
        category: "Service Delivery"
      },
      {
        title: "Client Onboarding Policy",
        description: "Steps from signing up to project completion",
        icon: UserCheck,
        href: "/policies/client-onboarding-policy",
        required: true,
        category: "Service Delivery"
      },
      {
        title: "Support Policy",
        description: "Details support hours, channels, and response timelines",
        icon: HeadphonesIcon,
        href: "/policies/support-policy",
        required: true,
        category: "Service Delivery"
      }
    ]
  },
  {
    title: "Compliance & Trust Policies",
    description: "Policies demonstrating our commitment to compliance and ethical practices",
    policies: [
      {
        title: "Accessibility Policy",
        description: "Commitment to making our site usable for people with disabilities",
        icon: Eye,
        href: "/policies/accessibility-policy",
        required: true,
        category: "Compliance"
      },
      {
        title: "GDPR Compliance Statement",
        description: "How we comply with European data protection laws",
        icon: Shield,
        href: "/policies/gdpr-compliance",
        required: false,
        category: "Compliance"
      },
      {
        title: "Children's Privacy Policy",
        description: "Safe handling of minor data and COPPA compliance",
        icon: Baby,
        href: "/policies/children-privacy-policy",
        required: false,
        category: "Compliance"
      },
      {
        title: "Environmental/Sustainability Policy",
        description: "Our eco-friendly commitments and sustainability practices",
        icon: Leaf,
        href: "/policies/environmental-policy",
        required: false,
        category: "Trust Building"
      },
      {
        title: "Transparency & Ethics Policy",
        description: "Our stance on fair practices and anti-corruption",
        icon: HeartHandshake,
        href: "/policies/transparency-ethics-policy",
        required: false,
        category: "Trust Building"
      }
    ]
  }
];

const totalPolicies = policyCategories.reduce((sum, category) => sum + category.policies.length, 0);

export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <PageHero
        breadcrumbItems={[{ label: "Policies" }]}
        badge={{
          icon: FileText,
          text: "Company Policies"
        }}
        title="SKYBER Company Policies"
        titleHighlight="SKYBER"
        description="Transparent, comprehensive policies that govern our operations, protect your rights, and ensure the highest standards of service delivery."
      >
        <div className="flex flex-wrap justify-center gap-4">
          <Badge variant="secondary" className="px-4 py-2">
            <CheckCircle className="w-4 h-4 mr-2 text-[#17D492]" />
            {totalPolicies} Total Policies
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <Shield className="w-4 h-4 mr-2" />
            Legal Compliance
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <Lock className="w-4 h-4 mr-2" />
            Security Focused
          </Badge>
        </div>
      </PageHero>

      {/* Policy Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {policyCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              className="mb-16 last:mb-0"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">{category.title}</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  {category.description}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.policies.map((policy, policyIndex) => (
                  <motion.div
                    key={policy.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: (categoryIndex * 0.1) + (policyIndex * 0.05) }}
                  >
                    <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm h-full">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className="p-3 rounded-xl bg-[#17D492]/10">
                            <policy.icon className="w-6 h-6 text-[#17D492]" />
                          </div>
                          {policy.required && (
                            <Badge className="bg-[#17D492] text-white border-0">
                              Required
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg group-hover:text-[#17D492] transition-colors">
                          {policy.title}
                        </CardTitle>
                        <Badge variant="secondary" className="w-fit">
                          {policy.category}
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-sm mb-4">
                          {policy.description}
                        </CardDescription>
                        <Button 
                          asChild
                          variant="ghost" 
                          className="w-full group-hover:text-[#17D492] p-0 h-auto font-medium"
                        >
                          <Link href={policy.href}>
                            Read Policy
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Questions About Our Policies?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our team is here to help clarify any policy-related questions or concerns.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="bg-[#17D492] hover:bg-[#14c082] text-white">
                <Link href="/contact">
                  Contact Support
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/client">
                  Client Portal
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

