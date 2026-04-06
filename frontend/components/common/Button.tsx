"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

const variantStyles = {
  primary: "bg-lord-teal text-white hover:bg-lord-frost border-transparent",
  secondary:
    "bg-transparent text-lord-navy border-lord-navy hover:bg-lord-navy hover:text-white",
  ghost:
    "bg-transparent text-lord-teal border-transparent hover:bg-lord-teal/10",
  danger: "bg-error text-white border-transparent hover:bg-red-700",
};

const sizeStyles = {
  sm: "h-9 px-4 text-sm rounded-button",
  md: "h-11 px-6 text-base rounded-button",
  lg: "h-12 px-8 text-base font-semibold rounded-button",
};

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  // Exclude onAnimationStart to avoid type conflict with motion
  const { onAnimationStart: _, ...safeProps } = props as Record<
    string,
    unknown
  >;
  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 border font-medium transition-colors focus-visible:outline-2 focus-visible:outline-lord-teal focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      disabled={disabled || isLoading}
      {...safeProps}
    >
      {isLoading && (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-4 w-4" />
        </motion.span>
      )}
      {children}
    </motion.button>
  );
}
