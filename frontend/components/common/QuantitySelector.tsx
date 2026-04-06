"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";
import { motion } from "motion/react";

interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export default function QuantitySelector({
  value,
  min = 1,
  max = 99,
  onChange,
  disabled = false,
}: QuantitySelectorProps) {
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };
  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className="inline-flex items-center border border-[#E8EAED] rounded-input overflow-hidden">
      <button
        onClick={decrement}
        disabled={disabled || value <= min}
        className="flex items-center justify-center w-10 h-11 text-medium-gray hover:bg-light-gray hover:text-lord-navy transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <motion.span
        key={value}
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.15 }}
        className="flex items-center justify-center w-12 h-11 text-center font-semibold text-lord-navy border-x border-[#E8EAED]"
      >
        {value}
      </motion.span>
      <button
        onClick={increment}
        disabled={disabled || value >= max}
        className="flex items-center justify-center w-10 h-11 text-medium-gray hover:bg-light-gray hover:text-lord-navy transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
