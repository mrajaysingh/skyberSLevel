"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "next-themes";
import { useSecurity } from "@/components/security/page-security";
import { useToast } from "@/components/ui/toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import DarkVeil from "@/components/ui/dark-veil";

export default function Login() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [role, setRole] = useState("client");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRoleLocked, setIsRoleLocked] = useState(false);
  const [checkingRole, setCheckingRole] = useState(false);
  const { login } = useSecurity();
  const { showSuccess } = useToast();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Force dark theme on login page
  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);

  // Check user role when email changes (debounced)
  useEffect(() => {
    // Reset role lock when email is cleared
    if (!email) {
      setIsRoleLocked(false);
      setRole("client");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return;
    }

    // Debounce API call
    const timeoutId = setTimeout(async () => {
      try {
        setCheckingRole(true);
        const response = await fetch(`${API_URL}/api/auth/check-role/${encodeURIComponent(email.toLowerCase())}`);
        const data = await response.json();

        if (data.success && data.data?.isSuperAdmin) {
          // Super admin detected - lock role
          setRole("superadmin");
          setIsRoleLocked(true);
          // Show success alert
          showSuccess(
            "Super Admin Account Detected",
            "Super admin account detected. Role cannot be changed.",
            5000
          );
        } else {
          // Email is not super admin - unlock if previously locked
          setIsRoleLocked((prev) => {
            if (prev) {
              // Was locked, now unlock
              setRole("client");
              return false;
            }
            return false;
          });
        }
      } catch (error) {
        console.error("Error checking user role:", error);
        // On error, unlock the role
        setIsRoleLocked(false);
        setRole("client");
      } finally {
        setCheckingRole(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [email, API_URL]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Validate input
    if (!email || !password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    // Validate department ID for employees (but not for super-admin)
    if (role === "employee" && !isRoleLocked && !departmentId) {
      setError("Department ID is required for employee login");
      setLoading(false);
      return;
    }
    
    try {
      // Call backend API login
      const result = await login(email, password);
      
      if (!result.success) {
        setError(result.error || "Login failed. Please check your credentials.");
      }
      // Success - redirect happens in SecurityProvider
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-var(--header-height))] bg-background px-4 sm:px-6 lg:px-8 overflow-hidden items-center justify-center py-4">
      {/* DarkVeil Background */}
      <div className="fixed inset-0 w-full h-full z-0">
        <DarkVeil 
          hueShift={160}
          noiseIntensity={0.02}
          scanlineIntensity={0.05}
          speed={0.3}
          scanlineFrequency={2.0}
          warpAmount={0.1}
          resolutionScale={1}
        />
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        {/* Left column: Login Form */}
        <div className="w-full max-w-md mx-auto lg:ml-0 lg:mr-auto order-2 lg:order-1">
          <Card className="border-border bg-card/95 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle>Sign in</CardTitle>
              <CardDescription>Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <form onSubmit={handleSubmit} className="space-y-3">
                {error && (
                  <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                    {error}
                  </div>
                )}
                
                <div className="space-y-1">
                  <div className="grid grid-cols-[auto,1fr] items-center gap-2 w-full">
                    <label htmlFor="role" className="text-sm font-bold text-foreground whitespace-nowrap tracking-wide">
                      I AM A
                    </label>
                    <div className="relative w-full">
                      <Select
                        value={role}
                        onValueChange={setRole}
                        disabled={isRoleLocked}
                      >
                        <SelectTrigger 
                          className={`w-full bg-background focus:ring-0 focus:ring-offset-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none ${
                            isRoleLocked ? 'opacity-75 cursor-not-allowed' : ''
                          }`}
                        >
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="client">Client</SelectItem>
                          <SelectItem value="employee">Employee</SelectItem>
                          <SelectItem value="superadmin">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      {checkingRole && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#17D492]"></div>
                        </div>
                      )}
                      {isRoleLocked && (
                        <div className="absolute right-8 top-1/2 -translate-y-1/2">
                          <span className="text-xs text-[#17D492] font-medium">Auto-detected</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {role === "employee" && !isRoleLocked && (
                  <div className="space-y-1">
                    <label htmlFor="departmentId" className="block text-sm font-medium text-foreground">
                      Department ID
                    </label>
                    <div className="flex">
                      <div className="bg-muted/50 text-foreground text-sm flex items-center px-3 border border-r-0 rounded-l-md border-input">
                        SKBB9
                      </div>
                      <Input
                        id="departmentId"
                        name="departmentId"
                        type="text"
                        required
                        value={departmentId}
                        onChange={(e) => setDepartmentId(e.target.value)}
                        className="bg-background focus:ring-0 focus:border-[#17D492] focus:border focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none rounded-l-none"
                        placeholder="Enter department code"
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-sm font-medium text-foreground">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background focus:ring-0 focus:border-[#17D492] focus:border focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="password" className="block text-sm font-medium text-foreground">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-background pr-10 focus:ring-0 focus:border-[#17D492] focus:border focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary/50"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link href="/contact" className="text-primary hover:text-primary/90">
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#17D492] hover:bg-[#17D492]/90 text-white"
                  disabled={loading || checkingRole}
                >
                  {loading ? "Signing in..." : checkingRole ? "Checking..." : `Sign in as ${
                    role === 'superadmin' ? 'Super Admin' : 
                    role === 'client' ? 'Client' : 
                    'Employee'
                  }`}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 border-t border-border pt-3 pb-4">
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Don&apos;t have an account? </span>
                <Link href="/contact" className="text-primary hover:text-primary/90">
                  Contact us
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        {/* Right column: Logo and brand info */}
        <div className="flex flex-col items-center justify-center space-y-4 order-1 lg:order-2">
          <Link href="/" className="inline-block">
            <div className="flex flex-col items-center justify-center">
              <Image
                src="/favicon.svg"
                alt="SKYBER Logo"
                width={80}
                height={80}
                className="text-[#17D492] mb-3"
              />
              <span className="text-3xl font-bold text-foreground skyber-text">SKYBER</span>
            </div>
          </Link>
          <div className="text-center max-w-md space-y-3">
            <h2 className="text-2xl font-extrabold text-foreground">Client Portal</h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Secure access to your projects and services with our dedicated portal. Monitor progress, access files, and communicate with your team all in one place.
            </p>
            <div className="pt-2">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-[#17D492]"></div>
                <div className="w-2 h-2 rounded-full bg-[#17D492]/70"></div>
                <div className="w-2 h-2 rounded-full bg-[#17D492]/40"></div>
              </div>
            </div>
            
            {/* Security Notice */}
            <div className="pt-3">
              <p className="text-xs text-center text-muted-foreground bg-secondary/50 dark:bg-secondary/20 border border-border rounded-lg px-4 py-2 backdrop-blur-sm">
                Protected by SKYBER security. &copy; {new Date().getFullYear()} SKYBER
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
