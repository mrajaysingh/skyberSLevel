"use client";

import { ReactNode } from "react";

type DashboardBodyProps = {
  children: ReactNode;
  className?: string;
};

export function DashboardBody({ children, className }: DashboardBodyProps) {
  return (
    <div className={`px-4 sm:px-6 lg:px-8 pt-16 pb-8 ${className || ''}`.trim()}>
      {children}
    </div>
  );
}


