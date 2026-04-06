"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className, hover = true }: CardProps) {
  return (
    <motion.div
      whileHover={
        hover
          ? {
              y: -4,
              boxShadow: "0 8px 24px rgba(23,32,65,0.12)",
            }
          : undefined
      }
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "bg-white border border-[#E8EAED] rounded-card p-6",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
