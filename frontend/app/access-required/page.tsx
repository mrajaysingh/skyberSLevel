"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Home, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AccessRequired() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-4 text-center space-y-8">
        <div className="space-y-4">
          <div className="mx-auto w-24 h-24 rounded-full bg-[#17D492]/10 flex items-center justify-center">
            <svg 
              className="w-12 h-12 text-[#17D492]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-foreground">
            Access Required
          </h1>
          
          <p className="text-lg text-muted-foreground">
            To access this page, please login first.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          
          <Button
            onClick={() => router.push("/login")}
            className="flex items-center justify-center gap-2 bg-[#17D492] hover:bg-[#14c082] text-white"
          >
            <Lock className="w-4 h-4" />
            Login
          </Button>
          
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}

