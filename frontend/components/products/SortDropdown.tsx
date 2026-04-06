"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const SORT_OPTIONS = [
  { value: "", labelKey: "products.sortDefault" },
  { value: "price_asc", labelKey: "products.sortPriceLow" },
  { value: "price_desc", labelKey: "products.sortPriceHigh" },
  { value: "newest", labelKey: "products.sortNewest" },
  { value: "name_asc", labelKey: "products.sortNameAZ" },
];

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const { t } = useLanguage();

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-button border border-[#E8EAED] bg-white py-2 pl-4 pr-10 text-sm text-lord-navy focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {t(option.labelKey)}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-medium-gray" />
    </div>
  );
}
