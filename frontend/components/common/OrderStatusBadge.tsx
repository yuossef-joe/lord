"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@/types/order";
import { useLanguage } from "@/context/LanguageContext";

const statusConfig: Record<
  OrderStatus,
  { labelKey: string; bg: string; text: string }
> = {
  pending_payment: {
    labelKey: "order.pendingPayment",
    bg: "bg-warning/15",
    text: "text-amber-700",
  },
  confirmed: {
    labelKey: "order.confirmed",
    bg: "bg-info/15",
    text: "text-info",
  },
  processing: {
    labelKey: "order.processing",
    bg: "bg-amber-100",
    text: "text-amber-700",
  },
  shipped: {
    labelKey: "order.shipped",
    bg: "bg-lord-teal/15",
    text: "text-lord-teal",
  },
  delivered: {
    labelKey: "order.delivered",
    bg: "bg-success/15",
    text: "text-success",
  },
  cancelled: {
    labelKey: "order.cancelled",
    bg: "bg-error/15",
    text: "text-error",
  },
  refunded: {
    labelKey: "order.refunded",
    bg: "bg-medium-gray/15",
    text: "text-medium-gray",
  },
};

export default function OrderStatusBadge({
  status,
  className,
}: {
  status: OrderStatus;
  className?: string;
}) {
  const { t } = useLanguage();
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        config.bg,
        config.text,
        className,
      )}
    >
      {t(config.labelKey)}
    </span>
  );
}
