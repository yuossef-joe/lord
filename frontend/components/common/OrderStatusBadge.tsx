"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@/types/order";

const statusConfig: Record<
  OrderStatus,
  { label: string; bg: string; text: string }
> = {
  pending_payment: {
    label: "Pending Payment",
    bg: "bg-warning/15",
    text: "text-amber-700",
  },
  confirmed: {
    label: "Confirmed",
    bg: "bg-info/15",
    text: "text-info",
  },
  processing: {
    label: "Processing",
    bg: "bg-amber-100",
    text: "text-amber-700",
  },
  shipped: {
    label: "Shipped",
    bg: "bg-lord-teal/15",
    text: "text-lord-teal",
  },
  delivered: {
    label: "Delivered",
    bg: "bg-success/15",
    text: "text-success",
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-error/15",
    text: "text-error",
  },
  refunded: {
    label: "Refunded",
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
      {config.label}
    </span>
  );
}
