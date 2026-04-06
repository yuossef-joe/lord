"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowLeft, MapPin, CreditCard, Clock } from "lucide-react";
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/animations";
import OrderStatusBadge from "@/components/common/OrderStatusBadge";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useLanguage } from "@/context/LanguageContext";
import { fetchOrderDetail } from "@/lib/api";
import { Order, OrderStatus } from "@/types/order";
import { formatPrice } from "@/lib/utils";

const TIMELINE_STEPS: { status: OrderStatus; label: string }[] = [
  { status: "pending_payment", label: "Order Placed" },
  { status: "confirmed", label: "Confirmed" },
  { status: "processing", label: "Processing" },
  { status: "shipped", label: "Shipped" },
  { status: "delivered", label: "Delivered" },
];

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const { t } = useLanguage();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    fetchOrderDetail(orderId)
      .then((data) => {
        const d = data as { data: Order };
        setOrder(d.data);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-medium-gray">Order not found</p>
        <Link
          href="/account/orders"
          className="mt-2 text-sm text-lord-teal hover:underline"
        >
          Back to orders
        </Link>
      </div>
    );
  }

  const currentStepIndex = TIMELINE_STEPS.findIndex(
    (s) => s.status === order.status,
  );
  const isCancelled = order.status === "cancelled";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/account/orders"
          className="rounded-full p-2 hover:bg-off-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-lord-navy" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-lord-navy">
            Order #{order.orderNumber || order._id.slice(-8)}
          </h1>
          <p className="text-xs text-medium-gray">
            {new Date(order.createdAt).toLocaleDateString("en-EG", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="ml-auto">
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      {/* Timeline */}
      {!isCancelled && (
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="rounded-card border border-[#E8EAED] bg-white p-6"
        >
          <div className="flex items-center justify-between">
            {TIMELINE_STEPS.map((step, i) => (
              <React.Fragment key={step.status}>
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                      i <= currentStepIndex
                        ? "bg-lord-teal text-white"
                        : "bg-off-white text-medium-gray"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={`mt-1 text-[10px] hidden sm:block ${
                      i <= currentStepIndex
                        ? "font-medium text-lord-navy"
                        : "text-medium-gray"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {i < TIMELINE_STEPS.length - 1 && (
                  <div
                    className={`mx-1 h-0.5 flex-1 ${
                      i < currentStepIndex ? "bg-lord-teal" : "bg-[#E8EAED]"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      )}

      {/* Items */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="rounded-card border border-[#E8EAED] bg-white p-6"
      >
        <h2 className="mb-4 font-semibold text-lord-navy">
          {t("order.items")}
        </h2>
        <div className="space-y-3">
          {order.items?.map((item, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              className="flex items-center gap-4"
            >
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-off-white">
                <Image
                  src={item.product?.images?.[0]?.url || "/placeholder.png"}
                  alt={item.product?.name || ""}
                  fill
                  className="object-contain p-1"
                  sizes="56px"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-lord-navy">
                  {item.product?.name}
                </p>
                <p className="text-xs text-medium-gray">
                  Qty: {item.quantity} × {formatPrice(item.unitPrice)}
                </p>
              </div>
              <p className="text-sm font-semibold text-lord-navy">
                {formatPrice(item.lineTotal)}
              </p>
            </motion.div>
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
            <span className="text-lord-teal">{formatPrice(order.total)}</span>
          </div>
        </div>
      </motion.div>

      {/* Shipping & Payment */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-card border border-[#E8EAED] bg-white p-4">
          <div className="mb-2 flex items-center gap-2 text-lord-teal">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-semibold text-lord-navy">
              {t("checkout.shippingAddress")}
            </span>
          </div>
          {order.shippingAddress && (
            <p className="text-sm text-dark-charcoal">
              {order.shippingAddress.addressLine1}, {order.shippingAddress.city}
              , {order.shippingAddress.governorate}
            </p>
          )}
        </div>
        <div className="rounded-card border border-[#E8EAED] bg-white p-4">
          <div className="mb-2 flex items-center gap-2 text-lord-teal">
            <CreditCard className="h-4 w-4" />
            <span className="text-sm font-semibold text-lord-navy">
              {t("checkout.payment")}
            </span>
          </div>
          <p className="text-sm text-dark-charcoal">
            {order.payment?.method || "Paymob Accept"}
          </p>
          <p className="text-xs text-medium-gray mt-1">
            {order.payment?.paidAt ? `Paid on ${new Date(order.payment.paidAt).toLocaleDateString()}` : "Pending"}
          </p>
        </div>
      </div>

      {/* Status History */}
      {order.statusHistory && order.statusHistory.length > 0 && (
        <div className="rounded-card border border-[#E8EAED] bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-lord-teal" />
            <h2 className="font-semibold text-lord-navy">Status History</h2>
          </div>
          <div className="space-y-3">
            {order.statusHistory.map((entry, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-lord-teal" />
                <div>
                  <p className="text-sm font-medium text-lord-navy capitalize">
                    {entry.status}
                  </p>
                  <p className="text-xs text-medium-gray">
                    {new Date(entry.timestamp).toLocaleDateString("en-EG", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {entry.note && (
                    <p className="text-xs text-dark-charcoal mt-0.5">
                      {entry.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
