"use client";

import React from "react";

export default function ImagePlaceholder({
  className = "",
  width,
  height,
}: {
  className?: string;
  width?: number;
  height?: number;
}) {
  return (
    <div
      className={`flex items-center justify-center bg-light-gray skeleton-shimmer ${className}`}
      style={{ width, height }}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        className="text-lord-silver"
      >
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          fill="currentColor"
        >
          L
        </text>
      </svg>
    </div>
  );
}
