"use client";

import React from "react";
import { motion } from "motion/react";

const SIZE_MAP: Record<string, number> = {
  sm: 24,
  md: 48,
  lg: 64,
};

export default function LoadingSpinner({
  size = 48,
  className = "",
}: {
  size?: number | "sm" | "md" | "lg";
  className?: string;
}) {
  const px = typeof size === "string" ? (SIZE_MAP[size] ?? 48) : size;
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="rounded-full border-4 border-light-gray border-t-lord-teal"
        style={{ width: px, height: px }}
      />
    </div>
  );
}
