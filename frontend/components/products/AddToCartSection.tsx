"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { ShoppingCart, Check, MessageCircle } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { Product } from "@/types/product";
import Button from "@/components/common/Button";
import QuantitySelector from "@/components/common/QuantitySelector";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";

interface AddToCartSectionProps {
  product: Product;
}

export default function AddToCartSection({ product }: AddToCartSectionProps) {
  const { addItem } = useCart();
  const { t } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [state, setState] = useState<"idle" | "loading" | "success">("idle");

  const isOutOfStock =
    product.stockQuantity !== undefined && product.stockQuantity <= 0;

  const handleAddToCart = async () => {
    setState("loading");
    try {
      await addItem(product, quantity);
      setState("success");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("idle");
    }
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi, I'm interested in ${product.name} (Model: ${product.modelNumber || "N/A"}).`,
    );
    window.open(`https://wa.me/201234567890?text=${message}`, "_blank");
  };

  return (
    <div className="space-y-4 border-t border-[#E8EAED] pt-4">
      {!isOutOfStock && (
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-lord-navy">
            {t("products.quantity")}:
          </span>
          <QuantitySelector
            value={quantity}
            onChange={setQuantity}
            min={1}
            max={product.stockQuantity || 99}
          />
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || state === "loading"}
          className={`relative flex h-12 flex-1 items-center justify-center gap-2 rounded-button font-semibold text-white transition-all overflow-hidden ${
            isOutOfStock
              ? "bg-medium-gray cursor-not-allowed"
              : state === "success"
                ? "bg-green-500"
                : "bg-lord-teal hover:bg-lord-teal/90"
          }`}
        >
          <AnimatePresence mode="wait">
            {state === "idle" && (
              <motion.span
                key="idle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                {isOutOfStock
                  ? t("products.outOfStock")
                  : t("products.addToCart")}
              </motion.span>
            )}
            {state === "loading" && (
              <motion.span
                key="loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2"
              >
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {t("general.loading")}
              </motion.span>
            )}
            {state === "success" && (
              <motion.span
                key="success"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2"
              >
                <Check className="h-5 w-5" />
                {t("products.addedToCart")}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <Button variant="secondary" onClick={handleWhatsApp} className="h-12">
          <MessageCircle className="mr-2 h-5 w-5" />
          {t("products.inquireWhatsApp")}
        </Button>
      </div>
    </div>
  );
}
