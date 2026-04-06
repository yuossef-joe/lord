"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Wrench, Settings, Truck, Shield, Cog, ArrowRight } from "lucide-react";
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/animations";
import PageTransition from "@/components/common/PageTransition";
import Breadcrumb from "@/components/common/Breadcrumb";
import ScrollReveal from "@/components/common/ScrollReveal";
import SeoHead from "@/components/common/SeoHead";
import Button from "@/components/common/Button";
import { useLanguage } from "@/context/LanguageContext";
import { fetchServices } from "@/lib/api";
import Link from "next/link";

interface ServiceItem {
  _id: string;
  title: string;
  description: string;
  icon?: string;
  features?: string[];
}

const ICON_MAP: Record<string, React.ReactNode> = {
  installation: <Settings className="h-8 w-8" />,
  maintenance: <Wrench className="h-8 w-8" />,
  repair: <Cog className="h-8 w-8" />,
  "spare-parts": <Shield className="h-8 w-8" />,
  delivery: <Truck className="h-8 w-8" />,
};

const FALLBACK_SERVICES: ServiceItem[] = [
  {
    _id: "1",
    title: "AC Installation",
    description:
      "Professional installation by certified technicians for all Carrier and Midea split, window, and central AC units. Includes site assessment and optimal placement.",
    icon: "installation",
    features: [
      "Certified technicians",
      "Site assessment",
      "Warranty-backed installation",
      "Same-day scheduling",
    ],
  },
  {
    _id: "2",
    title: "Preventive Maintenance",
    description:
      "Regular maintenance packages to keep your AC running efficiently. Includes filter cleaning, refrigerant check, and full system inspection.",
    icon: "maintenance",
    features: [
      "Annual maintenance plans",
      "Filter cleaning & replacement",
      "Refrigerant level check",
      "Performance optimization",
    ],
  },
  {
    _id: "3",
    title: "AC Repair",
    description:
      "Expert repair services for all AC brands and models. Fast diagnostics and genuine spare parts to get your AC back to peak performance.",
    icon: "repair",
    features: [
      "24/7 emergency repair",
      "Genuine spare parts",
      "Diagnostic report",
      "Repair warranty",
    ],
  },
  {
    _id: "4",
    title: "Genuine Spare Parts",
    description:
      "Original Carrier and Midea spare parts available for all models. Ensuring durability and optimal performance.",
    icon: "spare-parts",
    features: [
      "100% genuine parts",
      "Wide model coverage",
      "Competitive pricing",
      "Fast availability",
    ],
  },
  {
    _id: "5",
    title: "Free Delivery",
    description:
      "Fast and free delivery across Egypt for all AC units. Track your order and get notified in real time.",
    icon: "delivery",
    features: [
      "Free nationwide delivery",
      "Order tracking",
      "Careful handling",
      "Delivery scheduling",
    ],
  },
];

export default function ServicesPage() {
  const { t } = useLanguage();
  const [services, setServices] = useState<ServiceItem[]>(FALLBACK_SERVICES);

  useEffect(() => {
    fetchServices()
      .then((data) => {
        const d = data as { data: ServiceItem[] };
        if (d.data && d.data.length > 0) setServices(d.data);
      })
      .catch(() => {});
  }, []);

  return (
    <PageTransition>
      <SeoHead
        title={`${t("nav.services")} | Lord`}
        description="Professional AC installation, maintenance, repair, and spare parts services by Lord - Authorized Carrier & Midea dealer in Egypt."
      />

      <div className="mx-auto max-w-container px-4 py-6 md:px-6 md:py-8">
        <Breadcrumb
          items={[
            { label: t("nav.home"), href: "/" },
            { label: t("nav.services") },
          ]}
        />

        {/* Hero */}
        <ScrollReveal>
          <div className="mt-6 text-center">
            <h1 className="text-3xl font-bold text-lord-navy md:text-4xl">
              {t("services.title")}
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-medium-gray">
              {t("services.subtitle")}
            </p>
          </div>
        </ScrollReveal>

        {/* Services Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service) => (
            <motion.div
              key={service._id}
              variants={staggerItem}
              className="group rounded-card border border-[#E8EAED] bg-white p-6 transition-shadow hover:shadow-lg"
            >
              <div className="mb-4 inline-flex rounded-xl bg-lord-teal/10 p-3 text-lord-teal transition-colors group-hover:bg-lord-teal group-hover:text-white">
                {ICON_MAP[service.icon || ""] || <Wrench className="h-8 w-8" />}
              </div>
              <h3 className="mb-2 text-lg font-bold text-lord-navy">
                {service.title}
              </h3>
              <p className="mb-4 text-sm text-dark-charcoal leading-relaxed">
                {service.description}
              </p>
              {service.features && (
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-dark-charcoal"
                    >
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-lord-teal" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <ScrollReveal>
          <motion.div
            variants={fadeInUp}
            className="mt-16 rounded-card bg-gradient-to-r from-lord-navy to-lord-navy/90 p-8 text-center text-white md:p-12"
          >
            <h2 className="text-2xl font-bold md:text-3xl">
              {t("services.ctaTitle")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/80">
              {t("services.ctaSubtitle")}
            </p>
            <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/contact">
                <Button className="bg-lord-teal hover:bg-lord-teal/90">
                  {t("services.requestService")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a
                href="https://wa.me/201234567890"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="secondary"
                  className="border-white text-white hover:bg-white/10"
                >
                  {t("services.chatWhatsApp")}
                </Button>
              </a>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </PageTransition>
  );
}
