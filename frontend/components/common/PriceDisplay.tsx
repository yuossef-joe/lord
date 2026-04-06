"use client";

import React from "react";
import { formatPrice } from "@/lib/utils";

interface PriceDisplayProps {
  price: number;
  salePrice?: number;
  outOfStock?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function PriceDisplay({
  price,
  salePrice,
  outOfStock = false,
  size = "md",
}: PriceDisplayProps) {
  if (outOfStock) {
    return (
      <span className="inline-flex items-center rounded-full bg-error/10 px-3 py-1 text-sm font-medium text-error">
        Out of Stock
      </span>
    );
  }

  const sizeClasses = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-3xl",
  };

  if (salePrice && salePrice < price) {
    return (
      <div className="flex items-baseline gap-2">
        <span className={`font-bold text-lord-teal ${sizeClasses[size]}`}>
          {formatPrice(salePrice)}
        </span>
        <span className="text-medium-gray line-through text-sm">
          {formatPrice(price)}
        </span>
      </div>
    );
  }

  return (
    <span className={`font-bold text-lord-teal ${sizeClasses[size]}`}>
      {formatPrice(price)}
    </span>
  );
}
