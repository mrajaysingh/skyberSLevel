"use client";

import { useState, useEffect, useRef } from "react";
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
import { CustomCheckbox } from "@/components/ui/custom-checkbox";

export default function Login() {
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const initialThemeRef = useRef<string | undefined>(undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [role, setRole] = useState("client");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRoleLocked, setIsRoleLocked] = useState(false);
  const [checkingRole, setCheckingRole] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useSecurity();
  const { showSuccess } = useToast();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Check for OAuth errors in URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get('error');
    const messageParam = params.get('message');
    
    if (errorParam) {
      const errorMessages: Record<string, string> = {
        'account_not_found': messageParam || 'Account not found. Please connect your social account from the dashboard first.',
        'github_not_connected': messageParam || 'Please connect your GitHub account from the dashboard first.',
        'google_not_connected': messageParam || 'Please connect your Google account from the dashboard first.',
        'github_oauth_failed': 'GitHub OAuth failed. Please try again.',
        'google_oauth_failed': 'Google OAuth failed. Please try again.',
        'github_oauth_state': 'GitHub OAuth state mismatch. Please try again.',
        'google_oauth_state': 'Google OAuth state mismatch. Please try again.',
        'github_oauth_config': 'GitHub OAuth not configured. Please contact support.',
        'google_oauth_config': 'Google OAuth not configured. Please contact support.',
        'github_oauth_token': 'Failed to get GitHub access token. Please try again.',
        'google_oauth_token': 'Failed to get Google access token. Please try again.',
        'github_email_required': 'GitHub email not available. Please ensure your GitHub account has a verified email.',
        'google_email_required': 'Google email not available. Please ensure your Google account has a verified email.',
      };
      setError(errorMessages[errorParam] || 'An error occurred during OAuth login.');
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Force dark theme on login page, and restore previous theme when leaving
  useEffect(() => {
    if (initialThemeRef.current === undefined) {
      initialThemeRef.current = theme;
    }
    setTheme("dark");
    // Also ensure no flash by applying .dark at root while on this page
    const root = document.documentElement;
    root.classList.add("dark");
    root.style.colorScheme = "dark";
    return () => {
      const prev = initialThemeRef.current;
      if (prev) setTheme(prev as any);
      // Remove forced dark if another page sets light
      if (prev !== "dark") {
        root.classList.remove("dark");
        root.style.colorScheme = prev === "light" ? "light" : "dark";
      }
    };
  }, [setTheme, theme]);

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
    <div className="dark relative flex min-h-[calc(100vh-var(--header-height))] bg-background px-4 sm:px-6 lg:px-8 overflow-hidden items-center justify-center py-4">
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
        <div className="w-full max-w-md mx-auto lg:ml-0 lg:mr-auto order-2 lg:order-1 relative">
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
                      {isRoleLocked && role === 'superadmin' ? (
                        <div className="flex items-center justify-between w-full border rounded-md bg-muted/50 text-foreground px-3 py-2">
                          <span className="text-sm">Super Admin (Auto-detected)</span>
                          <span className="text-xs text-[#17D492] font-medium">Verified</span>
                        </div>
                      ) : (
                        <>
                          <Select
                            value={role}
                            onValueChange={setRole}
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
                              {/* Super Admin intentionally not listed; becomes available only after verification */}
                            </SelectContent>
                          </Select>
                          {checkingRole && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#17D492]"></div>
                            </div>
                          )}
                        </>
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
                  <div className="flex items-center gap-2">
                    <CustomCheckbox
                      id="remember-me"
                      checked={rememberMe}
                      onChange={setRememberMe}
                    />
                    <label htmlFor="remember-me" className="block text-sm text-muted-foreground cursor-pointer">
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

          {/* Social Login Icons - attached to right edge of the form (UI only) */}
          <div className="absolute left-full top-0 ml-[5px] hidden lg:flex flex-col items-center">
            <div className="flex flex-col gap-2.5 py-3 px-1.5 rounded-full bg-card/95 backdrop-blur-sm border border-[#17D492]/30 shadow-lg">
              {/* GitHub Login Icon */}
              <a
                href={`${API_URL}/api/auth/oauth/github`}
                className="relative w-[50px] h-[50px] rounded-full bg-background border border-border hover:border-[#17D492] transition-all duration-200 flex items-center justify-center hover:scale-110 cursor-pointer group shadow-sm"
                aria-label="Login with GitHub"
              >
                <Image
                  src="/AuthImg/GithubAuthIcon.svg"
                  alt="GitHub"
                  width={29}
                  height={29}
                  className="opacity-90 group-hover:opacity-100 transition-opacity"
                />
                <span className="absolute left-full ml-2 opacity-0 group-hover:opacity-100 group-hover:text-foreground group-hover:text-sm whitespace-nowrap duration-300 pointer-events-none bg-card/95 backdrop-blur-sm border border-border rounded-md px-2 py-1 shadow-lg">
                  Login with GitHub
                </span>
              </a>

              {/* Google Login Icon */}
              <a
                href={`${API_URL}/api/auth/oauth/google`}
                className="relative w-[50px] h-[50px] rounded-full bg-background border border-border hover:border-[#17D492] transition-all duration-200 flex items-center justify-center hover:scale-110 cursor-pointer group shadow-sm"
                aria-label="Login with Google"
              >
                <Image
                  src="/AuthImg/GoogleAuthIcon.svg"
                  alt="Google"
                  width={29}
                  height={29}
                  className="opacity-90 group-hover:opacity-100 transition-opacity"
                />
                <span className="absolute left-full ml-2 opacity-0 group-hover:opacity-100 group-hover:text-foreground group-hover:text-sm whitespace-nowrap duration-300 pointer-events-none bg-card/95 backdrop-blur-sm border border-border rounded-md px-2 py-1 shadow-lg">
                  Login with Google
                </span>
              </a>
            </div>
          </div>
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
