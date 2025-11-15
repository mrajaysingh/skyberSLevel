"use client";

import { motion } from "framer-motion";
import { PageHero } from "@/components/ui/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Clock, 
  Users, 
  Zap, 
  Heart, 
  Globe, 
  Coffee,
  Briefcase,
  TrendingUp
} from "lucide-react";

export default function CareersPage() {
  const benefits = [
    {
      icon: Clock,
      title: "Flexible Hours",
      description: "Work when you're most productive. No rigid 9-to-5 schedules. We trust you to manage your time effectively."
    },
    {
      icon: Briefcase,
      title: "Freelance Freedom",
      description: "Work independently without micromanagement. We value autonomy and trust our team members to deliver excellence."
    },
    {
      icon: Zap,
      title: "No Pressure Environment",
      description: "Focus on quality over quantity. We believe in sustainable work practices that don't burn you out."
    },
    {
      icon: Heart,
      title: "Work-Life Balance",
      description: "Your well-being matters. We encourage taking breaks, vacations, and maintaining a healthy lifestyle."
    },
    {
      icon: Globe,
      title: "Remote First",
      description: "Work from anywhere in the world. Our team is distributed globally, and we embrace remote collaboration."
    },
    {
      icon: Coffee,
      title: "Creative Freedom",
      description: "Bring your ideas to the table. We encourage innovation and creative problem-solving in everything we do."
    },
    {
      icon: Users,
      title: "Collaborative Culture",
      description: "Work with talented individuals who respect your expertise and support your growth."
    },
    {
      icon: TrendingUp,
      title: "Growth Opportunities",
      description: "Learn new technologies, take on challenging projects, and grow your skills at your own pace."
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <PageHero
        breadcrumbItems={[{ label: "Careers" }]}
        badge={{
          icon: Briefcase,
          text: "Coming Soon"
        }}
        title="Join the SKYBER Team"
        titleHighlight="SKYBER"
        description="We're building something special. A place where talented individuals can thrive without the corporate pressure."
      />

      {/* Coming Soon Message */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#17D492]/10 mb-6">
              <Clock className="w-12 h-12 text-[#17D492] animate-pulse" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              We're Hiring Soon!
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're currently setting up our careers platform. Soon, you'll be able to explore exciting opportunities 
              to work with a team that values freedom, creativity, and work-life balance.
            </p>
            <div className="bg-[#17D492]/10 border border-[#17D492]/20 rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-foreground font-medium">
                Interested in joining us? Stay tuned! We'll be launching our careers page soon.
              </p>
            </div>
          </motion.div>

          {/* What Makes Us Different */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-4">
              Why Work With <span className="text-[#17D492]">SKYBER</span>?
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              We're not your typical company. We believe in working smart, not hard. 
              Here's what makes us different:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
                      <CardContent className="p-6 text-center">
                        <div className="flex justify-center mb-4">
                          <div className="w-16 h-16 rounded-full bg-[#17D492]/10 flex items-center justify-center">
                            <Icon className="w-8 h-8 text-[#17D492]" />
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Our Philosophy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="border-0 bg-gradient-to-br from-[#17D492]/10 via-transparent to-[#17D492]/5 backdrop-blur-sm">
              <CardContent className="p-8 md:p-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                  Our Work Philosophy
                </h2>
                <div className="space-y-6 text-muted-foreground">
                  <p className="text-lg">
                    At <span className="text-[#17D492] font-semibold">SKYBER</span>, we believe that the best work 
                    happens when people are free to work in their own way, at their own pace, without unnecessary pressure.
                  </p>
                  <p>
                    We're a team of freelancers and independent professionals who come together to build amazing things. 
                    We don't believe in micromanagement, rigid schedules, or burning out our team members. Instead, we focus on:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Trusting our team members to deliver quality work</li>
                    <li>Providing flexibility in how and when you work</li>
                    <li>Encouraging work-life balance and personal well-being</li>
                    <li>Fostering a collaborative environment without hierarchy</li>
                    <li>Valuing creativity and innovation over strict processes</li>
                  </ul>
                  <p className="text-lg font-medium text-foreground">
                    If this sounds like the kind of environment you'd thrive in, we'd love to hear from you when we launch!
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

