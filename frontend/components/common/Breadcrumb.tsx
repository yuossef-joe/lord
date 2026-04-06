"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BreadcrumbItem } from "@/types/common";

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1.5 text-sm text-medium-gray">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight className="h-3.5 w-3.5 text-lord-silver rtl:rotate-180" />
              )}
              {isLast || !item.href ? (
                <span className="text-lord-navy font-medium">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-lord-teal transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
