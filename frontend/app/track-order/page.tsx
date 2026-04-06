"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Search, Package, MapPin, Clock } from "lucide-react";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";
import PageTransition from "@/components/common/PageTransition";
import Breadcrumb from "@/components/common/Breadcrumb";
import Button from "@/components/common/Button";
import OrderStatusBadge from "@/components/common/OrderStatusBadge";
import SeoHead from "@/components/common/SeoHead";
import { useLanguage } from "@/context/LanguageContext";
import { trackOrder } from "@/lib/api";
import { Order, OrderStatus } from "@/types/order";
import { formatPrice } from "@/lib/utils";

const TIMELINE_STEPS: { status: OrderStatus; label: string }[] = [
  { status: "pending_payment", label: "Order Placed" },
  { status: "confirmed", label: "Confirmed" },
  { status: "processing", label: "Processing" },
  { status: "shipped", label: "Shipped" },
  { status: "delivered", label: "Delivered" },
];

function TrackContent() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const initialOrderId = searchParams.get("orderId") || "";
  const [orderId, setOrderId] = useState(initialOrderId);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    if (!orderId.trim()) return;
    setIsLoading(true);
    setError("");
    setOrder(null);
    try {
      const data = (await trackOrder(orderId.trim())) as { data: Order };
      setOrder(data.data);
    } catch {
      setError(t("order.notFound"));
    } finally {
      setIsLoading(false);
    }
  };

  const currentStepIndex = order
    ? TIMELINE_STEPS.findIndex((s) => s.status === order.status)
    : -1;

  return (
    <>
      {/* Search */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="mx-auto mt-8 max-w-lg"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder={t("order.enterOrderId")}
            className="flex-1 rounded-button border border-[#E8EAED] px-4 py-3 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
            onKeyDown={(e) => e.key === "Enter" && handleTrack()}
          />
          <Button onClick={handleTrack} isLoading={isLoading}>
            <Search className="mr-2 h-4 w-4" />
            {t("order.track")}
          </Button>
        </div>
      </motion.div>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-center text-red-500"
        >
          {error}
        </motion.p>
      )}

      {order && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mx-auto mt-8 max-w-2xl space-y-6"
        >
          {/* Order Header */}
          <motion.div
            variants={staggerItem}
            className="flex items-center justify-between rounded-card border border-[#E8EAED] bg-white p-4"
          >
            <div>
              <p className="text-sm font-bold text-lord-navy">
                #{order.orderNumber || order._id.slice(-8)}
              </p>
              <p className="text-xs text-medium-gray">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <OrderStatusBadge status={order.status} />
              <span className="font-bold text-lord-teal">
                {formatPrice(order.total)}
              </span>
            </div>
          </motion.div>

          {/* Timeline */}
          {order.status !== "cancelled" && (
            <motion.div
              variants={staggerItem}
              className="rounded-card border border-[#E8EAED] bg-white p-6"
            >
              <div className="flex items-center justify-between">
                {TIMELINE_STEPS.map((step, i) => (
                  <React.Fragment key={step.status}>
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
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

          {/* Shipping */}
          {order.shippingAddress && (
            <motion.div
              variants={staggerItem}
              className="rounded-card border border-[#E8EAED] bg-white p-4"
            >
              <div className="mb-2 flex items-center gap-2 text-lord-teal">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-semibold text-lord-navy">
                  Shipping Address
                </span>
              </div>
              <p className="text-sm text-dark-charcoal">
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 &&
                  `, ${order.shippingAddress.addressLine2}`}
                , {order.shippingAddress.city},{" "}
                {order.shippingAddress.governorate}
              </p>
            </motion.div>
          )}

          {/* History */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <motion.div
              variants={staggerItem}
              className="rounded-card border border-[#E8EAED] bg-white p-4"
            >
              <div className="mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-lord-teal" />
                <span className="text-sm font-semibold text-lord-navy">
                  Updates
                </span>
              </div>
              <div className="space-y-2">
                {order.statusHistory.map((entry, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="mt-1.5 h-2 w-2 rounded-full bg-lord-teal" />
                    <div>
                      <p className="text-sm font-medium capitalize text-lord-navy">
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
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </>
  );
}

export default function TrackOrderPage() {
  const { t } = useLanguage();

  return (
    <PageTransition>
      <SeoHead
        title={`${t("order.trackOrder")} | Lord`}
        description="Track your Lord order status"
      />

      <div className="mx-auto max-w-container px-4 py-6 md:px-6 md:py-8">
        <Breadcrumb
          items={[
            { label: t("nav.home"), href: "/" },
            { label: t("order.trackOrder") },
          ]}
        />

        <div className="mt-6 text-center">
          <Package className="mx-auto mb-3 h-10 w-10 text-lord-teal" />
          <h1 className="text-2xl font-bold text-lord-navy md:text-3xl">
            {t("order.trackOrder")}
          </h1>
          <p className="mt-1 text-medium-gray">{t("order.trackDesc")}</p>
        </div>

        <Suspense fallback={null}>
          <TrackContent />
        </Suspense>
      </div>
    </PageTransition>
  );
}
