"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import Button from "@/components/common/Button";
import { useLanguage } from "@/context/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-white to-lord-frost/10">
      <div className="mx-auto max-w-container px-4 py-16 md:px-6 md:py-24">
        <div className="flex flex-col items-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="text-4xl font-extrabold leading-tight text-lord-navy md:text-5xl lg:text-[56px]"
          >
            {t("home.hero.headline")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
            className="mt-4 text-lg text-medium-gray md:text-xl"
          >
            {t("home.hero.tagline")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Link href="/products">
              <Button size="lg">{t("home.hero.shopNow")}</Button>
            </Link>
            <Link href="/services">
              <Button variant="secondary" size="lg">
                {t("home.hero.ourServices")}
              </Button>
            </Link>
          </motion.div>

          {/* Brand Logos */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", delay: 0.7, stiffness: 200 }}
            className="mt-10 flex items-center gap-8"
          >
            <div className="flex h-14 items-center rounded-lg border border-[#E8EAED] bg-white px-5 py-2 shadow-sm">
              <span className="text-sm font-semibold text-lord-navy">
                Carrier
              </span>
              <span className="ml-2 text-xs text-medium-gray">Authorized</span>
            </div>
            <div className="flex h-14 items-center rounded-lg border border-[#E8EAED] bg-white px-5 py-2 shadow-sm">
              <span className="text-sm font-semibold text-lord-teal">
                Midea
              </span>
              <span className="ml-2 text-xs text-medium-gray">Authorized</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative floating elements */}
      <motion.div
        animate={{
          y: [0, -15, 0],
          x: [0, 5, 0],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 right-10 h-3 w-3 rounded-full bg-lord-teal/20 hidden md:block"
      />
      <motion.div
        animate={{
          y: [0, -10, 0],
          x: [0, -5, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 left-16 h-2 w-2 rounded-full bg-lord-frost/30 hidden md:block"
      />
    </section>
  );
}
