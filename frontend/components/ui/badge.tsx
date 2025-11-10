import React from 'react';
import { cn } from '@/lib/utils';

export function Badge({ className, children, variant = 'default' }: { className?: string; children: React.ReactNode; variant?: 'default' | 'secondary' | 'outline' }) {
  const variants: Record<string, string> = {
    default: 'inline-flex items-center rounded-full border border-transparent bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    secondary: 'inline-flex items-center rounded-full border bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground',
    outline: 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
  };
  return <span className={cn(variants[variant], className)}>{children}</span>;
}

