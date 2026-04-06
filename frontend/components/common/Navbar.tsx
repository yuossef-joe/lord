"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import {
  ShoppingCart,
  UserCircle,
  Menu,
  X,
  ChevronDown,
  Package,
  MapPin,
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import CartBadge from "./CartBadge";
import LanguageToggle from "./LanguageToggle";
import MiniCart from "./MiniCart";
import Button from "./Button";
import {
  slideDown,
  slideInRight,
  overlayFade,
  staggerContainer,
  staggerItem,
} from "@/lib/animations";

const navLinks = [
  { key: "nav.home", href: "/" },
  { key: "nav.products", href: "/products" },
  { key: "nav.services", href: "/services" },
  { key: "nav.about", href: "/about" },
  { key: "nav.contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { customer, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const boxShadow = useTransform(
    scrollY,
    [0, 50],
    ["0 0 0 rgba(0,0,0,0)", "0 2px 20px rgba(23,32,65,0.08)"],
  );
  const backdropBlur = useTransform(
    scrollY,
    [0, 50],
    ["blur(0px)", "blur(12px)"],
  );

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(e.target as Node)
      ) {
        setIsAccountOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
        setIsCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close dropdowns on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsCartOpen(false);
        setIsAccountOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCartOpen(false);
    setIsAccountOpen(false);
  }, [pathname]);

  return (
    <motion.header
      initial={{ y: -72 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 200 }}
      style={{ boxShadow, backdropFilter: backdropBlur }}
      className="sticky top-0 z-40 h-16 bg-white/95 md:h-[72px]"
    >
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <nav className="mx-auto flex h-full max-w-container items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-lord-navy"
        >
          <span className="text-2xl font-extrabold tracking-tight">
            L<span className="text-lord-teal">O</span>RD
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative py-1 text-sm font-medium transition-colors hover:text-lord-teal"
              >
                <span
                  className={isActive ? "text-lord-teal" : "text-lord-navy"}
                >
                  {t(link.key)}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="navIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-lord-teal"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <LanguageToggle />

          {/* Cart Icon */}
          <div ref={cartRef} className="relative">
            <button
              onClick={() => {
                setIsCartOpen(!isCartOpen);
                setIsAccountOpen(false);
              }}
              className="relative p-2 text-lord-navy hover:text-lord-teal transition-colors"
              aria-label={`Cart (${itemCount} items)`}
            >
              <ShoppingCart className="h-5 w-5" />
              <CartBadge count={itemCount} />
            </button>

            <AnimatePresence>
              {isCartOpen && (
                <motion.div
                  variants={slideDown}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 top-full mt-2 z-50"
                >
                  <MiniCart onClose={() => setIsCartOpen(false)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Account Menu */}
          <div ref={accountRef} className="relative hidden md:block">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    setIsAccountOpen(!isAccountOpen);
                    setIsCartOpen(false);
                  }}
                  className="flex items-center gap-1.5 p-2 text-lord-navy hover:text-lord-teal transition-colors"
                >
                  <UserCircle className="h-5 w-5" />
                  <span className="text-sm font-medium max-w-[100px] truncate">
                    {customer?.name?.split(" ")[0]}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>

                <AnimatePresence>
                  {isAccountOpen && (
                    <motion.div
                      variants={slideDown}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 top-full mt-2 w-52 bg-white border border-[#E8EAED] rounded-card shadow-lg overflow-hidden z-50"
                    >
                      <div className="p-3 border-b border-[#E8EAED]">
                        <p className="text-sm font-semibold text-lord-navy truncate">
                          {customer?.name}
                        </p>
                        <p className="text-xs text-medium-gray truncate">
                          {customer?.email}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/account/orders"
                          className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-lord-navy hover:bg-off-white transition-colors"
                        >
                          <Package className="h-4 w-4 text-medium-gray" />
                          {t("nav.myOrders")}
                        </Link>
                        <Link
                          href="/account/addresses"
                          className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-lord-navy hover:bg-off-white transition-colors"
                        >
                          <MapPin className="h-4 w-4 text-medium-gray" />
                          {t("nav.myAddresses")}
                        </Link>
                        <Link
                          href="/account/profile"
                          className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-lord-navy hover:bg-off-white transition-colors"
                        >
                          <User className="h-4 w-4 text-medium-gray" />
                          {t("nav.profile")}
                        </Link>
                      </div>
                      <div className="border-t border-[#E8EAED] py-1">
                        <button
                          onClick={logout}
                          className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-error hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          {t("nav.logout")}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 p-2 text-sm font-medium text-lord-navy hover:text-lord-teal transition-colors"
              >
                <UserCircle className="h-5 w-5" />
                {t("nav.login")}
              </Link>
            )}
          </div>

          {/* Request Service CTA (desktop) */}
          <div className="hidden lg:block">
            <Link href="/services">
              <Button size="sm">{t("nav.requestService")}</Button>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-lord-navy md:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              variants={overlayFade}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 top-16 z-30 bg-black/40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.nav
              variants={slideInRight}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed right-0 top-16 bottom-0 z-40 w-[280px] bg-white overflow-y-auto shadow-xl"
            >
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-col p-6 gap-1"
              >
                {navLinks.map((link) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);
                  return (
                    <motion.div key={link.href} variants={staggerItem}>
                      <Link
                        href={link.href}
                        className={`block py-3 text-base font-medium transition-colors ${
                          isActive
                            ? "text-lord-teal"
                            : "text-lord-navy hover:text-lord-teal"
                        }`}
                      >
                        {t(link.key)}
                      </Link>
                    </motion.div>
                  );
                })}

                <motion.div variants={staggerItem}>
                  <hr className="my-3 border-[#E8EAED]" />
                </motion.div>

                {isAuthenticated ? (
                  <>
                    <motion.div variants={staggerItem}>
                      <Link
                        href="/account/orders"
                        className="block py-3 text-base text-lord-navy hover:text-lord-teal"
                      >
                        {t("nav.myOrders")}
                      </Link>
                    </motion.div>
                    <motion.div variants={staggerItem}>
                      <Link
                        href="/account/addresses"
                        className="block py-3 text-base text-lord-navy hover:text-lord-teal"
                      >
                        {t("nav.myAddresses")}
                      </Link>
                    </motion.div>
                    <motion.div variants={staggerItem}>
                      <Link
                        href="/account/profile"
                        className="block py-3 text-base text-lord-navy hover:text-lord-teal"
                      >
                        {t("nav.profile")}
                      </Link>
                    </motion.div>
                    <motion.div variants={staggerItem}>
                      <button
                        onClick={logout}
                        className="block w-full text-left py-3 text-base text-error"
                      >
                        {t("nav.logout")}
                      </button>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div variants={staggerItem}>
                      <Link
                        href="/login"
                        className="block py-3 text-base text-lord-navy hover:text-lord-teal"
                      >
                        {t("nav.login")}
                      </Link>
                    </motion.div>
                    <motion.div variants={staggerItem}>
                      <Link
                        href="/register"
                        className="block py-3 text-base text-lord-navy hover:text-lord-teal"
                      >
                        {t("nav.register")}
                      </Link>
                    </motion.div>
                  </>
                )}

                <motion.div variants={staggerItem} className="mt-4">
                  <Link href="/services" className="block">
                    <Button className="w-full">
                      {t("nav.requestService")}
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
