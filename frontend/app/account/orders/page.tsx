"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Package, Search } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";
import OrderStatusBadge from "@/components/common/OrderStatusBadge";
import { useLanguage } from "@/context/LanguageContext";
import { fetchCustomerOrders } from "@/lib/api";
import { Order } from "@/types/order";
import { formatPrice } from "@/lib/utils";

export default function OrdersPage() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    setIsLoading(true);
    const params = statusFilter ? `?status=${statusFilter}` : "";
    fetchCustomerOrders(params)
      .then((data) => {
        const d = data as { data: Order[] };
        setOrders(d.data || []);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [statusFilter]);

  const statuses = [
    "",
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-lord-navy">
        {t("account.orders")}
      </h1>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              statusFilter === status
                ? "bg-lord-teal text-white"
                : "bg-off-white text-dark-charcoal hover:bg-lord-teal/10"
            }`}
          >
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : "All"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-card skeleton-shimmer" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-card border border-[#E8EAED] bg-white p-12 text-center">
          <Package className="mx-auto mb-3 h-12 w-12 text-medium-gray" />
          <p className="text-medium-gray">{t("account.noOrders")}</p>
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {orders.map((order) => (
            <motion.div key={order._id} variants={staggerItem}>
              <Link
                href={`/account/orders/${order._id}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between rounded-card border border-[#E8EAED] bg-white p-4 gap-3 transition-shadow hover:shadow-sm"
              >
                <div>
                  <p className="text-sm font-semibold text-lord-navy">
                    #{order.orderNumber || order._id.slice(-8)}
                  </p>
                  <p className="text-xs text-medium-gray mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString("en-EG", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    · {order.items?.length || 0} {t("account.items")}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <OrderStatusBadge status={order.status} />
                  <span className="text-sm font-bold text-lord-navy">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
