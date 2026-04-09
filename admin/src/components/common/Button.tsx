import React from "react";
import { cn } from "@/lib/utils";
import LoadingSpinner from "./LoadingSpinner";

const variantStyles = {
  primary: "bg-teal text-white hover:bg-teal/90",
  secondary: "bg-navy text-white hover:bg-navy/90",
  outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
  ghost: "text-gray-600 hover:bg-gray-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizeStyles = {
  sm: "h-8 px-3 text-xs rounded-md gap-1.5",
  md: "h-10 px-4 text-sm rounded-lg gap-2",
  lg: "h-12 px-6 text-base rounded-lg gap-2.5",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <LoadingSpinner size={16} className="text-current" />}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
