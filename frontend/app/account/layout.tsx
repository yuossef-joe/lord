"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import {
  User,
  Package,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { fadeInUp } from "@/lib/animations";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

const MENU_ITEMS = [
  { href: "/account", icon: User, labelKey: "account.dashboard" },
  { href: "/account/orders", icon: Package, labelKey: "account.orders" },
  { href: "/account/addresses", icon: MapPin, labelKey: "account.addresses" },
  { href: "/account/profile", icon: Settings, labelKey: "account.profile" },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, customer, logout } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-lord-teal border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-container px-4 py-6 md:px-6 md:py-8">
      <div className="grid gap-8 lg:grid-cols-4">
        {/* Sidebar */}
        <motion.aside
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="lg:col-span-1"
        >
          {/* User card */}
          <div className="mb-4 rounded-card border border-[#E8EAED] bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lord-teal text-sm font-bold text-white">
                {customer?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-lord-navy">
                  {customer?.name}
                </p>
                <p className="text-xs text-medium-gray">{customer?.email}</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="rounded-card border border-[#E8EAED] bg-white overflow-hidden">
            {MENU_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 border-b border-[#E8EAED] px-4 py-3 text-sm transition-colors last:border-b-0 ${
                    isActive
                      ? "bg-lord-teal/5 font-medium text-lord-teal border-l-2 border-l-lord-teal"
                      : "text-dark-charcoal hover:bg-off-white"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {t(item.labelKey)}
                  <ChevronRight className="ml-auto h-4 w-4 text-medium-gray" />
                </Link>
              );
            })}
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              {t("account.logout")}
            </button>
          </nav>
        </motion.aside>

        {/* Main Content */}
        <div className="lg:col-span-3">{children}</div>
      </div>
    </div>
  );
}
