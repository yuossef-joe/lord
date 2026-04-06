"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ShoppingBag,
  ArrowRight,
  Trash2,
  Tag,
  X,
  ShoppingCart,
} from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import PageTransition from "@/components/common/PageTransition";
import Breadcrumb from "@/components/common/Breadcrumb";
import Button from "@/components/common/Button";
import QuantitySelector from "@/components/common/QuantitySelector";
import PriceDisplay from "@/components/common/PriceDisplay";
import SeoHead from "@/components/common/SeoHead";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    shipping,
    discount,
    total,
    couponCode,
    isLoading,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { t } = useLanguage();
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [animateParent] = useAutoAnimate();

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      await applyCoupon(couponInput.trim());
      setCouponInput("");
    } catch {
      // Toast handled in context
    } finally {
      setCouponLoading(false);
    }
  };

  if (items.length === 0 && !isLoading) {
    return (
      <PageTransition>
        <SeoHead
          title={`${t("cart.title")} | Lord`}
          description="Your shopping cart"
        />
        <div className="mx-auto max-w-container px-4 py-6 md:px-6 md:py-8">
          <Breadcrumb
            items={[
              { label: t("nav.home"), href: "/" },
              { label: t("cart.title") },
            ]}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-20 flex flex-col items-center text-center"
          >
            <div className="mb-6 rounded-full bg-off-white p-6">
              <ShoppingBag className="h-12 w-12 text-medium-gray" />
            </div>
            <h2 className="text-xl font-bold text-lord-navy">
              {t("cart.empty")}
            </h2>
            <p className="mt-2 text-medium-gray">{t("cart.emptyMessage")}</p>
            <Link href="/products" className="mt-6">
              <Button>
                {t("cart.continueShopping")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <SeoHead
        title={`${t("cart.title")} (${itemCount}) | Lord`}
        description="Your shopping cart"
      />
      <div className="mx-auto max-w-container px-4 py-6 md:px-6 md:py-8">
        <Breadcrumb
          items={[
            { label: t("nav.home"), href: "/" },
            { label: t("cart.title") },
          ]}
        />

        <div className="mt-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-lord-navy md:text-3xl">
            {t("cart.title")} ({itemCount})
          </h1>
          <button
            onClick={clearCart}
            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            {t("cart.clearAll")}
          </button>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div ref={animateParent} className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.product?._id || ("productId" in item ? item.productId : "")}
                  className="flex gap-4 rounded-card border border-[#E8EAED] bg-white p-4"
                >
                  {/* Image */}
                  <Link
                    href={`/products/${item.product?.slug || ""}`}
                    className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-off-white"
                  >
                    <Image
                      src={item.product?.images?.[0]?.url || "/placeholder.png"}
                      alt={item.product?.name || "Product"}
                      fill
                      className="object-contain p-2"
                      sizes="96px"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link
                          href={`/products/${item.product?.slug || ""}`}
                          className="text-sm font-semibold text-lord-navy hover:text-lord-teal transition-colors"
                        >
                          {item.product?.name || "Product"}
                        </Link>
                        {item.product?.brand && (
                          <p className="text-xs text-medium-gray mt-0.5">
                            {typeof item.product.brand === "object"
                              ? item.product.brand.name
                              : item.product.brand}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() =>
                          removeItem(item.product?._id || ("productId" in item ? item.productId : ""))
                        }
                        className="rounded-full p-1 text-medium-gray hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-end justify-between pt-2">
                      <QuantitySelector
                        value={item.quantity}
                        onChange={(qty) =>
                          updateQuantity(
                            item.product?._id || ("productId" in item ? item.productId : ""),
                            qty,
                          )
                        }
                        min={1}
                        max={item.product?.stockQuantity || 99}
                      />
                      <PriceDisplay
                        price={
                          (item.product?.salePrice ||
                            item.product?.price ||
                            0) * item.quantity
                        }
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 text-sm text-lord-teal hover:underline"
            >
              <ShoppingCart className="h-4 w-4" />
              {t("cart.continueShopping")}
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-card border border-[#E8EAED] bg-white p-6">
              <h2 className="text-lg font-bold text-lord-navy mb-4">
                {t("cart.orderSummary")}
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-dark-charcoal">
                    {t("cart.subtotal")}
                  </span>
                  <span className="font-medium text-lord-navy">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-charcoal">
                    {t("cart.shipping")}
                  </span>
                  <span className="font-medium text-green-600">
                    {shipping === 0
                      ? t("cart.freeShipping")
                      : formatPrice(shipping)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{t("cart.discount")}</span>
                    <span className="font-medium">
                      -{formatPrice(discount)}
                    </span>
                  </div>
                )}
                <hr className="border-[#E8EAED]" />
                <div className="flex justify-between text-base font-bold">
                  <span className="text-lord-navy">{t("cart.total")}</span>
                  <span className="text-lord-teal">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Coupon */}
              <div className="mt-6">
                {couponCode ? (
                  <div className="flex items-center justify-between rounded-button bg-green-50 px-3 py-2">
                    <span className="flex items-center gap-2 text-sm text-green-700">
                      <Tag className="h-4 w-4" />
                      {couponCode}
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-sm text-red-500 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder={t("cart.couponPlaceholder")}
                      className="flex-1 rounded-button border border-[#E8EAED] px-3 py-2 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleApplyCoupon()
                      }
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleApplyCoupon}
                      isLoading={couponLoading}
                    >
                      {t("cart.apply")}
                    </Button>
                  </div>
                )}
              </div>

              <Link href="/checkout" className="mt-6 block">
                <Button className="w-full">
                  {t("cart.checkout")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
