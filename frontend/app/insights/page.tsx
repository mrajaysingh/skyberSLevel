"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  CheckCircle,
  Server,
  Users,
  Star,
  Shield,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Spinner } from "@/components/ui/spinner";
import { PageHero } from "@/components/ui/page-hero";
import { cn } from "@/lib/utils";

// API endpoints
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const HEALTH_ENDPOINT = `${API_URL}/health`;
const PROD_HEALTH_ENDPOINT = 'https://api.skyber.dev/health';
const MAIN_SITE = 'https://skyber.dev';
const MOBILE_SITE = 'https://m.skyber.dev';
const ADMIN_DASHBOARD = 'https://admin.skyber.dev/dashboard';

// Initial state
const initialSystemStatus = {
  uptime: 0,
  responseTime: 0,
  activeUsers: 1243, // Demo data
  completedProjects: 156,
  happyClients: 142,
  systemHealth: 0,
  securityScore: 0,
  serverStatus: {
    main: { status: 'checking', responseTime: 0 },
    mobile: { status: 'checking', responseTime: 0 },
  },
};

// Simple counter component
function CountUp({ end, duration = 2, decimals = 0, suffix = "" }: { 
  end: number; 
  duration?: number; 
  decimals?: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(end * easeOutQuart);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <>{count.toFixed(decimals)}{suffix}</>;
}

// Simple bar chart component
function SimpleBarChart({ data }: { data: { name: string; value: number }[] }) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="h-[180px] flex items-end justify-between gap-2">
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center gap-2">
          <div className="relative w-full h-full flex items-end">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(item.value / maxValue) * 100}%` }}
              transition={{ duration: 1, delay: index * 0.1 }}
              className="w-full bg-[#17D492] rounded-t"
            />
          </div>
          <span className="text-xs text-muted-foreground">{item.name}</span>
        </div>
      ))}
    </div>
  );
}

// Simple line chart component
function SimpleLineChart({ data }: { data: { name: string; value: number }[] }) {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;
  
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((item.value - minValue) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="h-[180px] relative">
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#17D492" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#17D492" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          points={points}
          fill="url(#lineGradient)"
          stroke="#17D492"
          strokeWidth="0.5"
        />
        <polyline
          points={points}
          fill="none"
          stroke="#17D492"
          strokeWidth="1"
        />
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground">
        {data.map((item, index) => (
          <span key={index}>{item.name}</span>
        ))}
      </div>
    </div>
  );
}

const reviews = [
  {
    name: "John Smith",
    company: "Tech Solutions Inc.",
    rating: 5,
    comment: "Exceptional service and outstanding security measures!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  },
  {
    name: "Sarah Johnson",
    company: "Digital Innovations",
    rating: 5,
    comment: "The analytics insights have been invaluable for our business.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    name: "Michael Chen",
    company: "Global Systems",
    rating: 5,
    comment: "Best-in-class cybersecurity solutions and support.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
  },
];

const performanceData = [
  { name: "00:00", value: 95 },
  { name: "04:00", value: 98 },
  { name: "08:00", value: 92 },
  { name: "12:00", value: 96 },
  { name: "16:00", value: 97 },
  { name: "20:00", value: 94 },
];

const userActivityData = [
  { name: "Mon", value: 1200 },
  { name: "Tue", value: 1350 },
  { name: "Wed", value: 1500 },
  { name: "Thu", value: 1243 },
  { name: "Fri", value: 1400 },
  { name: "Sat", value: 1150 },
  { name: "Sun", value: 1000 },
];

const securityChecksData = [
  { name: "Jan", value: 2400 },
  { name: "Feb", value: 1398 },
  { name: "Mar", value: 9800 },
  { name: "Apr", value: 3908 },
  { name: "May", value: 4800 },
  { name: "Jun", value: 3800 },
];

// Helper function to ping a URL
async function pingServer(url: string): Promise<{ status: 'online' | 'offline'; responseTime: number }> {
  const startTime = performance.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    // Try with normal fetch first (for same-origin or CORS-enabled)
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        cache: 'no-store',
        mode: 'cors',
      });
      
      clearTimeout(timeoutId);
      const responseTime = Math.round(performance.now() - startTime);
      
      if (response.ok || response.status < 500) {
        return { status: 'online', responseTime };
      }
    } catch (corsError) {
      // If CORS fails, try with no-cors (we can't read response but can check if it completes)
      try {
        await fetch(url, {
          method: 'HEAD',
          mode: 'no-cors',
          signal: controller.signal,
          cache: 'no-store',
        });
        
        clearTimeout(timeoutId);
        const responseTime = Math.round(performance.now() - startTime);
        // If no-cors request completes, server is likely online
        return { status: 'online', responseTime };
      } catch (noCorsError) {
        // Both methods failed
        throw noCorsError;
      }
    }
    
    const responseTime = Math.round(performance.now() - startTime);
    return { status: 'offline', responseTime };
  } catch (error) {
    const responseTime = Math.round(performance.now() - startTime);
    return { status: 'offline', responseTime };
  }
}

// Helper function to check security (try accessing admin dashboard without auth)
async function checkSecurity(): Promise<number> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    // Try to fetch the admin dashboard
    // If it redirects to login or returns 401/403, it's protected (good security)
    // If it returns 200, it might be accessible (bad security)
    const response = await fetch(ADMIN_DASHBOARD, {
      method: 'GET',
      signal: controller.signal,
      cache: 'no-store',
      credentials: 'omit',
      redirect: 'manual', // Don't follow redirects
    });
    
    clearTimeout(timeoutId);
    
    // Check response status
    if (response.status === 0) {
      // CORS blocked or network error - likely protected (good)
      return 95;
    } else if (response.status === 401 || response.status === 403) {
      // Unauthorized/Forbidden - properly protected (excellent)
      return 100;
    } else if (response.status >= 300 && response.status < 400) {
      // Redirect (likely to login) - protected (good)
      return 95;
    } else if (response.status === 200) {
      // Successfully accessed - might be unprotected (bad)
      // Check if response contains login indicators
      const text = await response.text().catch(() => '');
      if (text.includes('login') || text.includes('password') || text.includes('auth')) {
        // Contains login elements - likely protected
        return 90;
      }
      // No login elements - might be accessible without auth
      return 20;
    } else {
      // Other status codes - assume protected
      return 85;
    }
  } catch (error: any) {
    // Network error, CORS error, or timeout
    // If it's a CORS error, it's likely because the endpoint is protected
    if (error.name === 'AbortError') {
      // Timeout - assume protected
      return 90;
    }
    // Other errors - assume protected (better safe than sorry)
    return 95;
  }
}

// Helper function to fetch health data
async function fetchHealthData(): Promise<{ health: number; responseTime: number }> {
  const endpoints = [HEALTH_ENDPOINT, PROD_HEALTH_ENDPOINT];
  
  for (const endpoint of endpoints) {
    try {
      const startTime = performance.now();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(endpoint, {
        method: 'GET',
        signal: controller.signal,
        cache: 'no-store',
      });
      
      clearTimeout(timeoutId);
      const responseTime = Math.round(performance.now() - startTime);
      
      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        // Calculate health score based on response
        // If status is 'ok' or 'healthy', health is 100, otherwise lower
        const health = data.status === 'ok' || data.status === 'healthy' ? 100 : 
                      data.uptime ? Math.min(100, data.uptime) : 95;
        return { health, responseTime };
      }
    } catch (error) {
      // Try next endpoint
      continue;
    }
  }
  
  // If all endpoints fail, return low health
  return { health: 0, responseTime: 0 };
}

const InsightsPage = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState(initialSystemStatus);
  const [healthHistory, setHealthHistory] = useState<{ name: string; value: number }[]>([]);
  const [securityHistory, setSecurityHistory] = useState<{ name: string; value: number }[]>([]);
  const [chartData, setChartData] = useState({
    userActivity: userActivityData,
    securityChecks: securityChecksData,
    performance: performanceData,
  });

  // Load initial data on mount
  useEffect(() => {
    loadData();
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    setIsRefreshing(true);
    
    try {
      // Fetch health data
      const healthData = await fetchHealthData();
      
      // Ping servers
      const [mainStatus, mobileStatus] = await Promise.all([
        pingServer(MAIN_SITE),
        pingServer(MOBILE_SITE),
      ]);
      
      // Check security
      const securityScore = await checkSecurity();
      
      // Calculate average response time
      const avgResponseTime = mainStatus.responseTime > 0 && mobileStatus.responseTime > 0
        ? Math.round((mainStatus.responseTime + mobileStatus.responseTime) / 2)
        : mainStatus.responseTime || mobileStatus.responseTime || 0;
      
      // Calculate uptime based on server status
      const uptime = (mainStatus.status === 'online' && mobileStatus.status === 'online') ? 100 :
                     (mainStatus.status === 'online' || mobileStatus.status === 'online') ? 50 : 0;
      
      // Update health history (keep last 6 data points)
      const now = new Date();
      const timeLabel = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      setHealthHistory(prev => {
        const newHistory = [...prev, { name: timeLabel, value: healthData.health }];
        return newHistory.slice(-6); // Keep last 6 points
      });
      
      // Update security history
      setSecurityHistory(prev => {
        const newHistory = [...prev, { name: timeLabel, value: securityScore }];
        return newHistory.slice(-6); // Keep last 6 points
      });
      
      // Update stats
      setStats(prev => ({
        ...prev,
        systemHealth: healthData.health,
        uptime,
        responseTime: avgResponseTime,
        securityScore,
        serverStatus: {
          main: mainStatus,
          mobile: mobileStatus,
        },
      }));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  const renderCard = (index: number, content: React.ReactNode) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="relative overflow-hidden h-full">
        <motion.div
          initial={isRefreshing ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: isRefreshing ? 1.5 + index * 0.1 : 0
          }}
        >
          {content}
        </motion.div>
        {isRefreshing && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
            <Spinner size="lg" className="text-[#17D492]" />
          </div>
        )}
      </Card>
    </motion.div>
  );

  const renderCardContent = (
    title: string,
    icon: React.ReactNode,
    description: string,
    content: React.ReactNode
  ) => (
    <>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          {icon}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {content}
        </div>
      </CardContent>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <PageHero
        breadcrumbItems={[{ label: "Insights" }]}
        badge={{
          icon: TrendingUp,
          text: "Analytics & Insights"
        }}
        title="Insights & Analytics"
        titleHighlight="Analytics"
        description="Explore the latest trends and real-time analytics in cybersecurity, cloud, and tech innovation."
      />

      {/* System Insights Section */}
      <section
        id="system-insights"
        className="container mx-auto px-4 py-12 border-t border-border"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 space-y-4"
        >
          <div className="flex items-center justify-center space-x-2">
            <h2 className="text-3xl font-bold">
              System <span className="text-[#17D492]">Insights</span>
            </h2>
            <AnimatedButton
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={refreshData}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn(
                "h-5 w-5 text-[#17D492]",
                isRefreshing && "animate-spin"
              )} />
            </AnimatedButton>
          </div>
          <p className="text-muted-foreground">
            Real-time monitoring and analytics for your digital infrastructure
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* System Health Card */}
          {renderCard(0, renderCardContent(
            "System Health",
            <Activity className="h-5 w-5 text-[#17D492]" />,
            "Overall system performance",
            <>
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  <CountUp end={stats.systemHealth} duration={2} suffix="%" />
                </span>
                <Badge variant="outline" className="bg-[#17D492]/10 text-[#17D492]">
                  Excellent
                </Badge>
              </div>
              <Progress value={stats.systemHealth} className="h-2" />
              <SimpleLineChart data={healthHistory.length > 0 ? healthHistory : chartData.performance} />
            </>
          ))}

          {/* Server Status Card */}
          {renderCard(1, renderCardContent(
            "Server Status",
            <Server className="h-5 w-5 text-[#17D492]" />,
            "Current server performance",
            <>
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  <CountUp end={stats.uptime} duration={2} decimals={2} suffix="%" />
                </span>
                <Badge variant="outline" className="bg-[#17D492]/10 text-[#17D492]">
                  Operational
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Response Time: <CountUp end={stats.responseTime} duration={2} suffix="ms" /></div>
                <div className="flex gap-2 text-xs">
                  <span className={cn(
                    "px-2 py-1 rounded",
                    stats.serverStatus.main.status === 'online' 
                      ? "bg-[#17D492]/10 text-[#17D492]" 
                      : "bg-red-500/10 text-red-500"
                  )}>
                    Main: {stats.serverStatus.main.status === 'online' ? 'Online' : 'Offline'}
                  </span>
                  <span className={cn(
                    "px-2 py-1 rounded",
                    stats.serverStatus.mobile.status === 'online' 
                      ? "bg-[#17D492]/10 text-[#17D492]" 
                      : "bg-red-500/10 text-red-500"
                  )}>
                    Mobile: {stats.serverStatus.mobile.status === 'online' ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
              <SimpleLineChart data={chartData.securityChecks} />
            </>
          ))}

          {/* Security Score Card */}
          {renderCard(2, renderCardContent(
            "Security Score",
            <Shield className="h-5 w-5 text-[#17D492]" />,
            "System security status",
            <>
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  <CountUp end={stats.securityScore} duration={2} suffix="%" />
                </span>
                <Badge variant="outline" className="bg-[#17D492]/10 text-[#17D492]">
                  Protected
                </Badge>
              </div>
              <Progress value={stats.securityScore} className="h-2" />
              <SimpleLineChart data={securityHistory.length > 0 ? securityHistory : chartData.securityChecks} />
            </>
          ))}

          {/* Active Users Card */}
          {renderCard(3, renderCardContent(
            "Active Users",
            <Users className="h-5 w-5 text-[#17D492]" />,
            "Current active users",
            <>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  <CountUp end={stats.activeUsers} duration={2} />
                </span>
                <Badge variant="outline" className="bg-[#17D492]/10 text-[#17D492]">
                  Online
                </Badge>
              </div>
              <SimpleBarChart data={chartData.userActivity} />
            </>
          ))}

          {/* Projects Card */}
          {renderCard(4, renderCardContent(
            "Completed Projects",
            <CheckCircle className="h-5 w-5 text-[#17D492]" />,
            "Total completed projects",
            <>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  <CountUp end={stats.completedProjects} duration={2} />
                </span>
                <Badge variant="outline" className="bg-[#17D492]/10 text-[#17D492]">
                  Success
                </Badge>
              </div>
              <SimpleLineChart data={chartData.performance} />
            </>
          ))}

          {/* Happy Clients Card */}
          {renderCard(5, renderCardContent(
            "Happy Clients",
            <Star className="h-5 w-5 text-[#17D492]" />,
            "Satisfied customers",
            <>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  <CountUp end={stats.happyClients} duration={2} />
                </span>
                <Badge variant="outline" className="bg-[#17D492]/10 text-[#17D492]">
                  5.0 Rating
                </Badge>
              </div>
              <SimpleBarChart data={chartData.userActivity} />
            </>
          ))}
        </div>

        {/* Client Reviews Section */}
        <section className="py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Client Reviews</h2>
            <p className="text-muted-foreground">What our clients say about us</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <motion.div
                key={review.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <Image
                        src={review.avatar}
                        alt={review.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{review.name}</h3>
                        <p className="text-sm text-muted-foreground">{review.company}</p>
                        <div className="flex items-center mt-2">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-[#17D492] text-[#17D492]"
                            />
                          ))}
                        </div>
                        <p className="mt-4 text-sm">{review.comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-12"
          >
            <AnimatedButton variant="outline" showArrow>
              View All Reviews
            </AnimatedButton>
          </motion.div>
        </section>
      </section>
    </div>
  );
};

export default InsightsPage;

