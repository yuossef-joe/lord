"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Package, MapPin, User, ArrowRight } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import OrderStatusBadge from "@/components/common/OrderStatusBadge";
import { fetchCustomerOrders } from "@/lib/api";
import { Order } from "@/types/order";
import { formatPrice } from "@/lib/utils";

export default function AccountDashboard() {
  const { customer } = useAuth();
  const { t } = useLanguage();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchCustomerOrders("?limit=3&sort=newest")
      .then((data) => {
        const d = data as { data: Order[] };
        setRecentOrders(d.data || []);
      })
      .catch(() => {});
  }, []);

  const quickLinks = [
    {
      href: "/account/orders",
      icon: Package,
      label: t("account.orders"),
      desc: t("account.ordersDesc"),
    },
    {
      href: "/account/addresses",
      icon: MapPin,
      label: t("account.addresses"),
      desc: t("account.addressesDesc"),
    },
    {
      href: "/account/profile",
      icon: User,
      label: t("account.profile"),
      desc: t("account.profileDesc"),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-lord-navy">
          {t("account.welcome")}, {customer?.name}!
        </h1>
        <p className="mt-1 text-sm text-medium-gray">
          {t("account.dashboardDesc")}
        </p>
      </div>

      {/* Quick Links */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid gap-4 sm:grid-cols-3"
      >
        {quickLinks.map((link) => (
          <motion.div key={link.href} variants={staggerItem}>
            <Link
              href={link.href}
              className="group flex items-start gap-3 rounded-card border border-[#E8EAED] bg-white p-4 transition-shadow hover:shadow-md"
            >
              <div className="rounded-lg bg-lord-teal/10 p-2 text-lord-teal">
                <link.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-lord-navy group-hover:text-lord-teal transition-colors">
                  {link.label}
                </p>
                <p className="text-xs text-medium-gray">{link.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-medium-gray mt-1 group-hover:text-lord-teal transition-colors" />
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Orders */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-lord-navy">
            {t("account.recentOrders")}
          </h2>
          <Link
            href="/account/orders"
            className="text-sm text-lord-teal hover:underline"
          >
            {t("account.viewAll")}
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="rounded-card border border-[#E8EAED] bg-white p-8 text-center">
            <Package className="mx-auto mb-3 h-10 w-10 text-medium-gray" />
            <p className="text-sm text-medium-gray">{t("account.noOrders")}</p>
            <Link
              href="/products"
              className="mt-3 inline-block text-sm text-lord-teal hover:underline"
            >
              {t("cart.continueShopping")}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Link
                key={order._id}
                href={`/account/orders/${order._id}`}
                className="flex items-center justify-between rounded-card border border-[#E8EAED] bg-white p-4 transition-shadow hover:shadow-sm"
              >
                <div>
                  <p className="text-sm font-semibold text-lord-navy">
                    #{order.orderNumber || order._id.slice(-8)}
                  </p>
                  <p className="text-xs text-medium-gray">
                    {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                    {order.items?.length || 0} items
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <OrderStatusBadge status={order.status} />
                  <span className="text-sm font-semibold text-lord-navy">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
