'use client';

import React, { useState, useEffect } from 'react';
import { Monitor, Apple, Terminal } from 'lucide-react';

type CosmicPortalButtonProps = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  label?: string;
  className?: string;
  showSystemIcon?: boolean;
  showCrownIcon?: boolean;
  isDownloading?: boolean;
};

export default function CosmicPortalButton({ 
  onClick, 
  label = 'Download', 
  className, 
  showSystemIcon = true,
  showCrownIcon = false,
  isDownloading = false 
}: CosmicPortalButtonProps) {
  const [os, setOs] = useState<'windows' | 'mac' | 'linux'>('windows');

  useEffect(() => {
    // Auto-detect OS
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('mac')) {
      setOs('mac');
    } else if (userAgent.includes('linux')) {
      setOs('linux');
    } else {
      setOs('windows');
    }
  }, []);

  const getOsIcon = () => {
    switch (os) {
      case 'mac':
        return <Apple className="w-5 h-5" />;
      case 'linux':
        return <Terminal className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  return (
    <div className={`cosmic-portal-wrapper ${className || ''}`}>
      <button 
        className="cosmic-portal-btn" 
        onClick={onClick} 
        disabled={isDownloading}
      >
        <span className="btn-text">
          {isDownloading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>{label}</span>
            </span>
          ) : showCrownIcon ? (
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 24" className="trucomm-crown-icon">
                <path d="m18 0 8 12 10-8-4 20H4L0 4l10 8 8-12z" />
              </svg>
              <span>{label}</span>
            </span>
          ) : showSystemIcon ? (
            <span className="flex items-center gap-2">
              <span>{label}</span>
              {getOsIcon()}
            </span>
          ) : (
            label
          )}
        </span>
        <div className="portal-effect" />
      </button>
    </div>
  );
}

