"use client";

import React from "react";
import ContentLoader, { IContentLoaderProps } from "react-content-loader";

interface ContentLoaderProps extends IContentLoaderProps {
  width?: number | string;
  height?: number | string;
  speed?: number;
  backgroundColor?: string;
  foregroundColor?: string;
  className?: string;
}

export function ContentLoaderComponent({
  width = 400,
  height = 200,
  speed = 2,
  backgroundColor,
  foregroundColor,
  className = "",
  ...props
}: ContentLoaderProps) {
  // Use theme-aware colors with fallback
  const bgColor = backgroundColor || "hsl(var(--muted))";
  const fgColor = foregroundColor || "hsl(var(--muted-foreground))";

  return (
    <ContentLoader
      speed={speed}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      backgroundColor={bgColor}
      foregroundColor={fgColor}
      className={className}
      {...props}
    >
      {props.children}
    </ContentLoader>
  );
}

// Predefined loaders for common use cases
export function CardLoader({ className = "" }: { className?: string }) {
  return (
    <ContentLoaderComponent
      width={400}
      height={300}
      className={className}
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="0" y="0" rx="8" ry="8" width="400" height="200" />
      <rect x="20" y="220" rx="4" ry="4" width="200" height="20" />
      <rect x="20" y="250" rx="4" ry="4" width="150" height="16" />
      <rect x="20" y="280" rx="4" ry="4" width="100" height="16" />
    </ContentLoaderComponent>
  );
}

export function TextLoader({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <ContentLoaderComponent
      width="100%"
      height={lines * 24 + 16}
      className={className}
    >
      {Array.from({ length: lines }).map((_, i) => (
        <rect
          key={i}
          x="0"
          y={i * 28}
          rx="4"
          ry="4"
          width={i === lines - 1 ? "60%" : "100%"}
          height="20"
        />
      ))}
    </ContentLoaderComponent>
  );
}

export function AvatarLoader({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <ContentLoaderComponent
      width={size}
      height={size}
      className={className}
    >
      <circle cx={size / 2} cy={size / 2} r={size / 2} />
    </ContentLoaderComponent>
  );
}

export function ButtonLoader({ width = 120, height = 40, className = "" }: { width?: number; height?: number; className?: string }) {
  return (
    <ContentLoaderComponent
      width={width}
      height={height}
      className={className}
    >
      <rect x="0" y="0" rx="8" ry="8" width={width} height={height} />
    </ContentLoaderComponent>
  );
}

// Global wrapper component to show loader while content is loading
export function ContentLoaderWrapper({
  isLoading,
  loader = CardLoader,
  children,
  className = "",
}: {
  isLoading?: boolean;
  loader?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
}) {
  if (isLoading) {
    const Loader = loader;
    return <Loader className={className} />;
  }
  return <>{children}</>;
}

// Higher-order component to wrap components with loading state
export function withContentLoader<T extends object>(
  Component: React.ComponentType<T>,
  Loader: React.ComponentType = CardLoader
) {
  return function LoadedComponent({ isLoading, ...props }: T & { isLoading?: boolean }) {
    if (isLoading) {
      return <Loader />;
    }
    return <Component {...(props as T)} />;
  };
}

// Hook for managing loading states
export function useContentLoader(initialState: boolean = false) {
  const [isLoading, setIsLoading] = React.useState(initialState);

  const startLoading = React.useCallback(() => setIsLoading(true), []);
  const stopLoading = React.useCallback(() => setIsLoading(false), []);
  const toggleLoading = React.useCallback(() => setIsLoading((prev) => !prev), []);

  return {
    isLoading,
    startLoading,
    stopLoading,
    toggleLoading,
  };
}

