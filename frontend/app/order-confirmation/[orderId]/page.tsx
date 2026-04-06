"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import {
  CheckCircle,
  Package,
  MapPin,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";
import PageTransition from "@/components/common/PageTransition";
import Button from "@/components/common/Button";
import OrderStatusBadge from "@/components/common/OrderStatusBadge";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import SeoHead from "@/components/common/SeoHead";
import { useLanguage } from "@/context/LanguageContext";
import { fetchOrderConfirmation } from "@/lib/api";
import { Order } from "@/types/order";
import { formatPrice } from "@/lib/utils";

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const { t } = useLanguage();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    fetchOrderConfirmation(orderId)
      .then((data) => {
        const d = data as { data: Order };
        setOrder(d.data);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <p className="text-lg font-semibold text-lord-navy">Order not found</p>
      </div>
    );
  }

  return (
    <PageTransition>
      <SeoHead
        title={`${t("orderConfirmation.title")} | Lord`}
        description="Order confirmation"
      />
      <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="mx-auto mb-4 inline-flex rounded-full bg-green-100 p-4"
          >
            <CheckCircle className="h-12 w-12 text-green-500" />
          </motion.div>
          <h1 className="text-2xl font-bold text-lord-navy md:text-3xl">
            {t("orderConfirmation.title")}
          </h1>
          <p className="mt-2 text-medium-gray">
            {t("orderConfirmation.subtitle")}
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mt-8 space-y-4"
        >
          {/* Order info */}
          <motion.div
            variants={staggerItem}
            className="rounded-card border border-[#E8EAED] bg-white p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-medium-gray">
                  {t("orderConfirmation.orderId")}
                </p>
                <p className="text-sm font-bold text-lord-navy">
                  #{order.orderNumber || order._id}
                </p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>

            {/* Items */}
            <div className="space-y-3">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-off-white">
                    <Image
                      src={item.product?.images?.[0]?.url || "/placeholder.png"}
                      alt={item.product?.name || "Product"}
                      fill
                      className="object-contain p-1"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-lord-navy">
                      {item.product?.name || "Product"}
                    </p>
                    <p className="text-xs text-medium-gray">
                      Qty: {item.quantity} × {formatPrice(item.unitPrice)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-lord-navy">
                    {formatPrice(item.lineTotal)}
                  </p>
                </div>
              ))}
            </div>

            <hr className="my-4 border-[#E8EAED]" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-dark-charcoal">{t("cart.subtotal")}</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-charcoal">{t("cart.shipping")}</span>
                <span className="text-green-600">
                  {order.shipping === 0
                    ? t("cart.freeShipping")
                    : formatPrice(order.shipping)}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>{t("cart.discount")}</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-2 border-t border-[#E8EAED]">
                <span className="text-lord-navy">{t("cart.total")}</span>
                <span className="text-lord-teal">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Shipping */}
          <motion.div
            variants={staggerItem}
            className="rounded-card border border-[#E8EAED] bg-white p-6"
          >
            <div className="mb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-lord-teal" />
              <h3 className="font-semibold text-lord-navy">
                {t("checkout.shippingAddress")}
              </h3>
            </div>
            {order.shippingAddress && (
              <p className="text-sm text-dark-charcoal">
                {order.shippingAddress.addressLine1},{" "}
                {order.shippingAddress.city},{" "}
                {order.shippingAddress.governorate}
              </p>
            )}
          </motion.div>

          {/* Payment */}
          <motion.div
            variants={staggerItem}
            className="rounded-card border border-[#E8EAED] bg-white p-6"
          >
            <div className="mb-3 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-lord-teal" />
              <h3 className="font-semibold text-lord-navy">
                {t("checkout.payment")}
              </h3>
            </div>
            <p className="text-sm text-dark-charcoal">Paymob Accept</p>
          </motion.div>
        </motion.div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/account/orders">
            <Button>
              <Package className="mr-2 h-4 w-4" />
              {t("orderConfirmation.viewOrders")}
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="secondary">
              {t("cart.continueShopping")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
