"use client";

import React from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { Brand, ProductCategory } from "@/types/product";
import { useLanguage } from "@/context/LanguageContext";

interface FilterSidebarProps {
  brands: Brand[];
  categories: ProductCategory[];
  selectedBrand: string;
  selectedCategory: string;
  onBrandChange: (brand: string) => void;
  onCategoryChange: (category: string) => void;
  onClearAll: () => void;
}

export default function FilterSidebar({
  brands,
  categories,
  selectedBrand,
  selectedCategory,
  onBrandChange,
  onCategoryChange,
  onClearAll,
}: FilterSidebarProps) {
  const { t } = useLanguage();
  const hasActiveFilters = selectedBrand || selectedCategory;

  return (
    <div className="space-y-6">
      {/* Active Filters */}
      {hasActiveFilters && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-lord-navy">
              Active Filters
            </span>
            <button
              onClick={onClearAll}
              className="text-xs text-lord-teal hover:underline"
            >
              {t("products.clearFilters")}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedBrand && (
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="inline-flex items-center gap-1 rounded-full bg-lord-teal/10 px-3 py-1 text-xs text-lord-teal"
              >
                {brands.find((b) => b._id === selectedBrand)?.name ||
                  selectedBrand}
                <button onClick={() => onBrandChange("")}>
                  <X className="h-3 w-3" />
                </button>
              </motion.span>
            )}
            {selectedCategory && (
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="inline-flex items-center gap-1 rounded-full bg-lord-teal/10 px-3 py-1 text-xs text-lord-teal"
              >
                {categories.find((c) => c._id === selectedCategory)?.name ||
                  selectedCategory}
                <button onClick={() => onCategoryChange("")}>
                  <X className="h-3 w-3" />
                </button>
              </motion.span>
            )}
          </div>
        </div>
      )}

      {/* Brands */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-lord-navy uppercase tracking-wide">
          {t("products.brands")}
        </h4>
        <div className="space-y-2">
          <button
            onClick={() => onBrandChange("")}
            className={`block w-full text-left rounded-button px-3 py-2 text-sm transition-colors ${
              !selectedBrand
                ? "bg-lord-teal/10 text-lord-teal font-medium"
                : "text-dark-charcoal hover:bg-off-white"
            }`}
          >
            {t("products.allBrands")}
          </button>
          {brands.map((brand) => (
            <button
              key={brand._id}
              onClick={() => onBrandChange(brand._id)}
              className={`block w-full text-left rounded-button px-3 py-2 text-sm transition-colors ${
                selectedBrand === brand._id
                  ? "bg-lord-teal/10 text-lord-teal font-medium"
                  : "text-dark-charcoal hover:bg-off-white"
              }`}
            >
              {brand.name}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-lord-navy uppercase tracking-wide">
          {t("products.categories")}
        </h4>
        <div className="space-y-2">
          <button
            onClick={() => onCategoryChange("")}
            className={`block w-full text-left rounded-button px-3 py-2 text-sm transition-colors ${
              !selectedCategory
                ? "bg-lord-teal/10 text-lord-teal font-medium"
                : "text-dark-charcoal hover:bg-off-white"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => onCategoryChange(cat._id)}
              className={`block w-full text-left rounded-button px-3 py-2 text-sm transition-colors ${
                selectedCategory === cat._id
                  ? "bg-lord-teal/10 text-lord-teal font-medium"
                  : "text-dark-charcoal hover:bg-off-white"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
