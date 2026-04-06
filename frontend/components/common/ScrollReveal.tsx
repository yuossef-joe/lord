"use client";

import React from "react";
import { motion } from "motion/react";
import { fadeInUp, fadeInLeft, fadeInRight, scaleIn } from "@/lib/animations";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: "up" | "left" | "right" | "scale";
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
}

const directionVariants = {
  up: fadeInUp,
  left: fadeInLeft,
  right: fadeInRight,
  scale: scaleIn,
};

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  className,
}: ScrollRevealProps) {
  const { ref, controls } = useScrollReveal();
  const shouldReduce = useReducedMotion();

  if (shouldReduce) {
    return <div className={className}>{children}</div>;
  }

  const variants = directionVariants[direction];

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={controls}
      custom={delay}
      className={className}
    >
      {children}
    </motion.div>
  );
}
