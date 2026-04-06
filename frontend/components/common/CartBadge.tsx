"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { badgeBounce } from "@/lib/animations";

interface CartBadgeProps {
  count: number;
}

export default function CartBadge({ count }: CartBadgeProps) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key={count}
          variants={badgeBounce}
          initial="initial"
          animate="animate"
          exit={{ scale: 0, opacity: 0 }}
          className="absolute -top-1.5 -right-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-lord-teal px-1 text-[11px] font-bold text-white"
        >
          {count > 99 ? "99+" : count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
