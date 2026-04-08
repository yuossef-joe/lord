"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import Button from "@/components/common/Button";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useLanguage } from "@/context/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();
  const [videoReady, setVideoReady] = useState(false);

  return (
    <section className="relative overflow-hidden min-h-[520px] md:min-h-[782] flex items-center">
      {/* Loading overlay — shown until video can play */}
      <AnimatePresence>
        {!videoReady && (
          <motion.div
            key="hero-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-lord-navy"
          >
            <LoadingSpinner size="lg" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        onCanPlay={() => setVideoReady(true)}
        className="absolute inset-0 h-full w-full object-cover object-center"
      >
        <source src="/assets/herovideo.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-lord-navy/80 via-lord-navy/60 to-lord-navy/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-lord-navy/40 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-container px-4 py-16 md:px-6 md:py-24">
        <div className="flex flex-col items-start text-left max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-[56px]"
          >
            {t("home.hero.headline")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
            className="mt-4 text-lg text-white/80 md:text-xl"
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
              <Button
                variant="secondary"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-lord-navy"
              >
                {t("home.hero.ourServices")}
              </Button>
            </Link>
          </motion.div>

          {/* Brand Logos */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", delay: 0.7, stiffness: 200 }}
            className="mt-10 flex items-center gap-4"
          >
            <div className="flex h-12 items-center rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm px-5 py-2">
              <span className="text-sm font-semibold text-white">Carrier</span>
              <span className="ml-2 text-xs text-white/70">Authorized</span>
            </div>
            <div className="flex h-12 items-center rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm px-5 py-2">
              <span className="text-sm font-semibold text-lord-teal">
                Midea
              </span>
              <span className="ml-2 text-xs text-white/70">Authorized</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
