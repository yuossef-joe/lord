"use client";

import React from "react";
import { motion } from "motion/react";
import { pageTransition } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const shouldReduce = useReducedMotion();

  if (shouldReduce) {
    return <>{children}</>;
  }

  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}
