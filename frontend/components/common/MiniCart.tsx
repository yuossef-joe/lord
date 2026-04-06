"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { formatPrice, truncate } from "@/lib/utils";
import Button from "./Button";

interface MiniCartProps {
  onClose: () => void;
}

export default function MiniCart({ onClose }: MiniCartProps) {
  const { items, subtotal, removeItem } = useCart();
  const { t } = useLanguage();

  const displayItems = items.slice(0, 4);

  return (
    <div className="w-[340px] md:w-[360px] bg-white border border-[#E8EAED] rounded-card shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8EAED]">
        <h3 className="text-sm font-semibold text-lord-navy">
          {t("cart.title")} ({items.length})
        </h3>
        <button
          onClick={onClose}
          className="p-1 text-medium-gray hover:text-lord-navy transition-colors"
          aria-label="Close cart"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {items.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-10 px-4">
          <ShoppingBag className="h-12 w-12 text-lord-silver mb-3" />
          <p className="text-sm text-medium-gray mb-4">{t("cart.empty")}</p>
          <Link href="/products" onClick={onClose}>
            <Button size="sm" variant="secondary">
              {t("cart.browseProducts")}
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Items List */}
          <div className="max-h-[280px] overflow-y-auto divide-y divide-[#E8EAED]">
            <AnimatePresence>
              {displayItems.map((item) => {
                const product = "product" in item ? item.product : null;
                const imgUrl = product?.images?.[0]?.url;
                return (
                  <motion.div
                    key={
                      "_id" in item
                        ? item._id
                        : "productId" in item
                          ? item.productId
                          : ""
                    }
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-light-gray overflow-hidden">
                      {imgUrl ? (
                        <Image
                          src={imgUrl}
                          alt={product?.name || ""}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full skeleton-shimmer" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-lord-navy truncate">
                        {product?.name || "Product"}
                      </p>
                      <p className="text-xs text-medium-gray">
                        Qty: {item.quantity} × {formatPrice(item.unitPrice)}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        removeItem(
                          "_id" in item
                            ? item._id
                            : "productId" in item
                              ? item.productId
                              : "",
                        )
                      }
                      className="p-1 text-medium-gray hover:text-error transition-colors"
                      aria-label="Remove item"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="border-t border-[#E8EAED] px-4 py-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-medium-gray">
                {t("cart.subtotal")}
              </span>
              <motion.span
                key={subtotal}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="text-base font-bold text-lord-navy"
              >
                {formatPrice(subtotal)}
              </motion.span>
            </div>
            <div className="flex gap-2">
              <Link href="/cart" onClick={onClose} className="flex-1">
                <Button variant="secondary" size="sm" className="w-full">
                  {t("cart.viewCart")}
                </Button>
              </Link>
              <Link href="/checkout" onClick={onClose} className="flex-1">
                <Button size="sm" className="w-full">
                  {t("cart.checkout")}
                </Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
