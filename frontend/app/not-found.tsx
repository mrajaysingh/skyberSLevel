"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="h-[calc(100vh-var(--header-height))] flex items-center justify-center bg-background px-4 overflow-hidden">
      <div className="max-w-2xl w-full text-center">
        <div className="error-card relative bg-[#3a3a3a] dark:bg-card border border-border rounded-lg p-6 md:p-8 transform scale-75 md:scale-100">
          <div className="score absolute top-0 right-0 font-mono text-xs text-[#888]">00400</div>

          <div className="dino-scene flex items-center justify-around h-[60px] my-3 border-b-[3px] border-[#555] relative overflow-hidden">
            {/* Ground pattern */}
            <div 
              className="absolute bottom-[-1px] left-0 right-0 h-[2px]"
              style={{
                background: 'repeating-linear-gradient(to right, #666 0px, #666 4px, transparent 4px, transparent 8px)'
              }}
            />

            {/* Dino */}
            <div className="dino-container relative">
              <div className="dino" style={{ "--wh-number": 24 } as React.CSSProperties}>
                <div className="pixel" />
              </div>
            </div>

            {/* Cactus */}
            <div className="cactus relative w-4 h-12 bg-[#888]">
              <div 
                className="absolute top-0 left-1 w-[1px] h-12"
                style={{
                  background: 'repeating-linear-gradient(to bottom, #666 0px, #666 2px, transparent 2px, transparent 4px)'
                }}
              />
              <div className="absolute top-3 -left-2 w-3 h-5 bg-[#888]" />
              <div className="cactus-arm-right absolute top-2 -right-[10px] w-3 h-6 bg-[#888]">
                <div 
                  className="absolute top-0 left-0.5 w-[1px] h-6"
                  style={{
                    background: 'repeating-linear-gradient(to bottom, #666 0px, #666 2px, transparent 2px, transparent 4px)'
                  }}
                />
              </div>
            </div>
          </div>

          <p className="title text-2xl font-normal text-[#ccc] mb-4">No internet</p>

          <p className="subtitle text-sm text-[#999] mb-3">Try:</p>

          <ul className="suggestions list-none p-0 m-0 mb-4">
            <li className="text-sm text-[#ccc] mb-2 relative pl-3">
              <span className="absolute left-0 top-0">•</span>
              Checking the network cables, modem, and router
            </li>
            <li className="text-sm text-[#ccc] mb-2 relative pl-3">
              <span className="absolute left-0 top-0">•</span>
              Reconnecting to Wi-Fi
            </li>
          </ul>

          <div className="error-code text-xs text-[#666] mt-4 font-mono">ERR_INTERNET_DISCONNECTED</div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
            <Button
              asChild
              className="flex items-center justify-center gap-2 bg-[#17D492] hover:bg-[#14c082] text-white"
            >
              <Link href="/">
                <Home className="w-4 h-4" />
                Go Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
