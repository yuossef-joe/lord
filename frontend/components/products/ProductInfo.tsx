"use client";

import React from "react";
import { motion } from "motion/react";
import { fadeInUp } from "@/lib/animations";
import { Product } from "@/types/product";
import PriceDisplay from "@/components/common/PriceDisplay";
import { useLanguage } from "@/context/LanguageContext";
import { Shield, Truck, Award, CheckCircle } from "lucide-react";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const { t } = useLanguage();
  const isOutOfStock = product.stockQuantity !== undefined && product.stockQuantity <= 0;

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Brand & Category */}
      <div className="flex items-center gap-2">
        {product.brand && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium text-white ${
              product.brand.name === "Carrier" ? "bg-lord-navy" : "bg-lord-teal"
            }`}
          >
            {product.brand.name}
          </span>
        )}
        {product.category && (
          <span className="text-sm text-medium-gray">
            {product.category.name}
          </span>
        )}
      </div>

      {/* Name */}
      <h1 className="text-2xl font-bold text-lord-navy md:text-3xl">
        {product.name}
      </h1>

      {/* Model */}
      {product.modelNumber && (
        <p className="text-sm text-medium-gray">
          Model:{" "}
          <span className="font-medium text-dark-charcoal">
            {product.modelNumber}
          </span>
        </p>
      )}

      {/* Price */}
      <PriceDisplay
        price={product.price}
        salePrice={product.salePrice}
        outOfStock={isOutOfStock}
        size="lg"
      />

      {/* Short Description */}
      {product.shortDescription && (
        <p className="text-dark-charcoal leading-relaxed">
          {product.shortDescription}
        </p>
      )}

      {/* Availability */}
      <div className="flex items-center gap-2">
        {isOutOfStock ? (
          <span className="text-sm font-medium text-red-500">
            {t("products.outOfStock")}
          </span>
        ) : (
          <span className="flex items-center gap-1 text-sm font-medium text-green-600">
            <CheckCircle className="h-4 w-4" />
            {t("products.inStock")}
          </span>
        )}
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="flex items-center gap-2 rounded-card bg-off-white p-3">
          <Shield className="h-5 w-5 text-lord-teal" />
          <span className="text-xs text-dark-charcoal">
            {t("products.warranty")}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-card bg-off-white p-3">
          <Truck className="h-5 w-5 text-lord-teal" />
          <span className="text-xs text-dark-charcoal">
            {t("products.freeDelivery")}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-card bg-off-white p-3">
          <Award className="h-5 w-5 text-lord-teal" />
          <span className="text-xs text-dark-charcoal">
            {t("products.authorizedDealer")}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-card bg-off-white p-3">
          <CheckCircle className="h-5 w-5 text-lord-teal" />
          <span className="text-xs text-dark-charcoal">
            {t("products.genuineParts")}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
