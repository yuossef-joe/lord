"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart, Eye, Check, Loader2 } from "lucide-react";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import PriceDisplay from "@/components/common/PriceDisplay";
import Button from "@/components/common/Button";

interface ProductCardProps {
  product: Product;
}

type AddState = "idle" | "loading" | "success";

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { t } = useLanguage();
  const [addState, setAddState] = useState<AddState>("idle");
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const primaryImage =
    product.images?.find((img) => img.isPrimary) || product.images?.[0];
  const isOutOfStock = product.stockQuantity === 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || addState !== "idle") return;

    setAddState("loading");
    try {
      await addItem(product, 1);
      setAddState("success");
      setTimeout(() => setAddState("idle"), 1500);
    } catch {
      setAddState("idle");
    }
  };

  const brandBadgeColor =
    product.brand?.name?.toLowerCase() === "carrier"
      ? "bg-lord-navy"
      : "bg-lord-teal";

  return (
    <motion.div
      whileHover={{
        y: -6,
        boxShadow: "0 12px 32px rgba(23,32,65,0.12)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative flex flex-col bg-white border border-[#E8EAED] rounded-card overflow-hidden"
    >
      <Link href={`/products/${product.slug}`} className="flex flex-col h-full">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-light-gray">
          {primaryImage?.url && !imgError ? (
            <motion.div
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full w-full"
            >
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt || product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                onError={() => setImgError(true)}
              />
            </motion.div>
          ) : (
            <div className="flex h-full w-full items-center justify-center skeleton-shimmer">
              <span className="text-3xl font-bold text-lord-silver">L</span>
            </div>
          )}

          {/* Brand Badge */}
          {product.brand && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`absolute top-3 left-3 rounded px-2 py-0.5 text-[11px] font-semibold text-white ${brandBadgeColor}`}
            >
              {product.brand.name}
            </motion.span>
          )}

          {/* Feature Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-1">
            {product.isNewArrival && (
              <span className="rounded bg-success px-2 py-0.5 text-[11px] font-semibold text-white">
                New
              </span>
            )}
            {product.isBestseller && (
              <span className="rounded bg-error px-2 py-0.5 text-[11px] font-semibold text-white">
                Bestseller
              </span>
            )}
          </div>

          {/* Quick View Button */}
          <AnimatePresence>
            {isHovered && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Quick view modal would open here
                }}
                className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-lord-navy shadow-md hover:bg-white transition-colors"
                aria-label="Quick view"
              >
                <Eye className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Card Body */}
        <div className="flex flex-col flex-1 p-4">
          <h3 className="text-base font-semibold text-lord-navy line-clamp-2 mb-1">
            {product.name}
          </h3>
          <p className="text-xs text-medium-gray mb-2">
            {product.capacity} · {product.type}
          </p>

          <div className="mt-auto">
            <div className="mb-3">
              <PriceDisplay
                price={product.price}
                salePrice={product.salePrice}
                outOfStock={isOutOfStock}
              />
            </div>

            {/* Add to Cart Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full flex items-center justify-center gap-2 h-10 rounded-button text-sm font-medium transition-colors ${
                isOutOfStock
                  ? "bg-light-gray text-medium-gray cursor-not-allowed"
                  : addState === "success"
                    ? "bg-success text-white"
                    : "bg-lord-teal text-white hover:bg-lord-frost"
              }`}
            >
              <AnimatePresence mode="wait">
                {addState === "idle" && (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {isOutOfStock
                      ? t("products.outOfStock")
                      : t("products.addToCart")}
                  </motion.span>
                )}
                {addState === "loading" && (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </motion.span>
                )}
                {addState === "success" && (
                  <motion.span
                    key="success"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    {t("products.added")}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
