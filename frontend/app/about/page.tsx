"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import {
  Award,
  ShieldCheck,
  Target,
  Eye,
  Users,
  Calendar,
  MapPin,
  Star,
} from "lucide-react";
import {
  staggerContainer,
  staggerItem,
  fadeInUp,
  fadeInLeft,
  fadeInRight,
} from "@/lib/animations";
import PageTransition from "@/components/common/PageTransition";
import Breadcrumb from "@/components/common/Breadcrumb";
import ScrollReveal from "@/components/common/ScrollReveal";
import SeoHead from "@/components/common/SeoHead";
import { useLanguage } from "@/context/LanguageContext";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { fetchAbout } from "@/lib/api";

interface AboutData {
  story?: string;
  mission?: string;
  vision?: string;
  values?: string[];
  team?: { name: string; role: string; image?: string }[];
}

function StatCard({
  value,
  suffix,
  label,
  icon: Icon,
}: {
  value: number;
  suffix: string;
  label: string;
  icon: React.ElementType;
}) {
  const { countRef, inViewRef } = useAnimatedCounter({
    end: value,
    duration: 2000,
  });

  return (
    <motion.div
      ref={inViewRef}
      variants={staggerItem}
      className="flex flex-col items-center rounded-card bg-white p-6 text-center shadow-sm"
    >
      <div className="mb-3 rounded-full bg-lord-teal/10 p-3 text-lord-teal">
        <Icon className="h-6 w-6" />
      </div>
      <span className="text-3xl font-bold text-lord-navy">
        <span ref={countRef}>0</span>
        {suffix}
      </span>
      <span className="mt-1 text-sm text-medium-gray">{label}</span>
    </motion.div>
  );
}

export default function AboutPage() {
  const { t } = useLanguage();
  const [about, setAbout] = useState<AboutData | null>(null);

  useEffect(() => {
    fetchAbout()
      .then((data) => {
        const d = data as { data: AboutData };
        if (d.data) setAbout(d.data);
      })
      .catch(() => {});
  }, []);

  return (
    <PageTransition>
      <SeoHead
        title={`${t("nav.about")} | Lord`}
        description="Lord is an authorized Carrier and Midea dealer in Egypt, providing premium AC solutions, professional installation, and after-sales support."
      />

      <div className="mx-auto max-w-container px-4 py-6 md:px-6 md:py-8">
        <Breadcrumb
          items={[
            { label: t("nav.home"), href: "/" },
            { label: t("nav.about") },
          ]}
        />

        {/* Hero */}
        <ScrollReveal>
          <div className="mt-6 text-center">
            <h1 className="text-3xl font-bold text-lord-navy md:text-4xl">
              {t("about.title")}
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-medium-gray">
              {t("about.subtitle")}
            </p>
          </div>
        </ScrollReveal>

        {/* Company Story */}
        <div className="mt-12 grid items-center gap-8 lg:grid-cols-2">
          <ScrollReveal direction="left">
            <motion.div variants={fadeInLeft}>
              <h2 className="mb-4 text-2xl font-bold text-lord-navy">
                {t("about.storyTitle")}
              </h2>
              <p className="text-dark-charcoal leading-relaxed">
                {about?.story ||
                  "Lord is Egypt's premier authorized dealer for Carrier and Midea air conditioning systems. With years of experience in the HVAC industry, we have built a reputation for providing top-quality products, expert installation services, and exceptional after-sales support. Our commitment to excellence has made us the go-to destination for residential and commercial cooling solutions across Egypt."}
              </p>
            </motion.div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <motion.div
              variants={fadeInRight}
              className="relative aspect-video overflow-hidden rounded-card bg-off-white"
            >
              <Image
                src="/about-store.jpg"
                alt="Lord Showroom"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-lord-navy/20 to-transparent" />
            </motion.div>
          </ScrollReveal>
        </div>

        {/* Stats */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          <StatCard
            value={10}
            suffix="+"
            label={t("about.yearsExperience")}
            icon={Calendar}
          />
          <StatCard
            value={5000}
            suffix="+"
            label={t("about.happyCustomers")}
            icon={Users}
          />
          <StatCard
            value={15}
            suffix="+"
            label={t("about.governorates")}
            icon={MapPin}
          />
          <StatCard
            value={4.9}
            suffix=""
            label={t("about.rating")}
            icon={Star}
          />
        </motion.div>

        {/* Mission & Vision */}
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <ScrollReveal direction="left">
            <div className="rounded-card border border-[#E8EAED] bg-white p-6">
              <div className="mb-4 inline-flex rounded-xl bg-lord-navy/10 p-3 text-lord-navy">
                <Target className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-lord-navy">
                {t("about.missionTitle")}
              </h3>
              <p className="text-dark-charcoal leading-relaxed">
                {about?.mission ||
                  "To provide Egypt with the highest quality air conditioning solutions through authorized Carrier and Midea products, professional installation, and unmatched customer service."}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="rounded-card border border-[#E8EAED] bg-white p-6">
              <div className="mb-4 inline-flex rounded-xl bg-lord-teal/10 p-3 text-lord-teal">
                <Eye className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-lord-navy">
                {t("about.visionTitle")}
              </h3>
              <p className="text-dark-charcoal leading-relaxed">
                {about?.vision ||
                  "To become the leading AC solutions provider in Egypt, known for our reliability, technical expertise, and commitment to customer satisfaction."}
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Authorized Dealer */}
        <ScrollReveal>
          <motion.div
            variants={fadeInUp}
            className="mt-16 rounded-card bg-gradient-to-r from-lord-navy to-lord-navy/90 p-8 text-center text-white md:p-12"
          >
            <div className="mb-4 flex items-center justify-center gap-4">
              <ShieldCheck className="h-10 w-10 text-lord-teal" />
              <Award className="h-10 w-10 text-frost" />
            </div>
            <h2 className="text-2xl font-bold md:text-3xl">
              {t("about.authorizedTitle")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-white/80">
              {t("about.authorizedDesc")}
            </p>
            <div className="mt-8 flex items-center justify-center gap-8">
              <div className="flex h-16 w-32 items-center justify-center rounded-lg bg-white/10 p-3">
                <span className="text-lg font-bold text-white">Carrier</span>
              </div>
              <div className="flex h-16 w-32 items-center justify-center rounded-lg bg-white/10 p-3">
                <span className="text-lg font-bold text-white">Midea</span>
              </div>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </PageTransition>
  );
}
