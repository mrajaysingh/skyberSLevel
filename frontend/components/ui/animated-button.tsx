"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;

const LoadingSpinner = ({ variant }: { variant: ButtonVariant }) => (
  <svg
    className={cn(
      "animate-spin h-5 w-5",
      variant === "default" ? "text-white" : "text-[#17D492]"
    )}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="3"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const BinaryAnimation = ({ variant }: { variant: ButtonVariant }) => {
  return (
    <div className="flex space-x-1">
      {[...Array(3)].map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "linear",
          }}
          className={cn(
            "font-mono text-sm",
            variant === "default" ? "text-white" : "text-[#17D492]"
          )}
        >
          1
        </motion.span>
      ))}
    </div>
  );
};

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  href?: string;
  children: React.ReactNode;
  showArrow?: boolean;
  className?: string;
  onClick?: () => void | Promise<void>;
  skipLoadingAnimation?: boolean;
}

export function AnimatedButton({
  href,
  children,
  showArrow,
  variant = "default",
  size = "default",
  className,
  onClick,
  skipLoadingAnimation = false,
  ...props
}: AnimatedButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async (e: React.MouseEvent) => {
    if (isLoading || skipLoadingAnimation) return;

    setIsLoading(true);
    e.preventDefault();

    try {
      if (onClick) {
        await onClick();
      }

      if (href) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push(href);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isPrimary = variant === "default";

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "relative group",
        isPrimary && "bg-[#17D492] hover:bg-[#14c082] text-white",
        className
      )}
      onClick={skipLoadingAnimation ? onClick : handleClick}
      disabled={isLoading}
      {...props}
    >
      <span
        className={cn(
          "flex items-center gap-2 transition-opacity duration-200",
          isLoading ? "opacity-0" : "opacity-100"
        )}
      >
        {children}
        {showArrow && <ArrowRight className="ml-2 h-4 w-4" />}
      </span>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center gap-3">
          <LoadingSpinner variant={variant as ButtonVariant} />
          <BinaryAnimation variant={variant as ButtonVariant} />
        </div>
      )}

      <motion.div
        className={cn(
          "absolute inset-0 rounded-lg",
          isPrimary ? "bg-[#14c082]/50" : "bg-[#17D492]/5"
        )}
        initial={false}
        animate={{
          scale: isLoading ? 1 : 0.5,
          opacity: isLoading ? 1 : 0
        }}
        transition={{ duration: 0.2 }}
      />
    </Button>
  );
}

