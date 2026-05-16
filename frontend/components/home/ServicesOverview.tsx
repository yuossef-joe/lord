"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Wrench, Settings, AlertTriangle, Package, Truck } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { useLanguage } from "@/context/LanguageContext";
import ScrollReveal from "@/components/common/ScrollReveal";
import Card from "@/components/common/Card";
import { fetchServices } from "@/lib/api";
import { Service } from "@/types/service";

const iconMap: Record<string, React.ReactNode> = {
  installation: <Wrench className="h-12 w-12" />,
  maintenance: <Settings className="h-12 w-12" />,
  repair: <AlertTriangle className="h-12 w-12" />,
  "spare-parts": <Package className="h-12 w-12" />,
  delivery: <Truck className="h-12 w-12" />,
};

interface ServicesOverviewProps {
  title?: string;
}

export default function ServicesOverview({ title }: ServicesOverviewProps) {
  const { t, localize } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetchServices()
      .then((data: unknown) => {
        const res = data as { data: Service[] };
        setServices(res.data ?? []);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-container px-4 md:px-6">
        <ScrollReveal>
          <h2 className="mb-10 text-center text-3xl font-bold text-lord-navy md:text-4xl">
            {title || t("home.services.title")}
          </h2>
        </ScrollReveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5"
        >
          {services.map((service) => {
            const serviceSlug = service.serviceType?.slug || service.slug;
            const serviceName = localize(service.name, service.nameAr);
            const serviceDescription = localize(
              service.shortDescription || service.description,
              service.shortDescriptionAr || service.descriptionAr,
            );

            return (
              <motion.div
                key={service.slug}
                variants={staggerItem}
                initial="hidden"
                animate="visible"
              >
                <Card className="flex flex-col items-center text-center h-full">
                  <motion.div
                    whileInView={{ rotate: [0, -10, 10, 0] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mb-4 text-lord-teal"
                  >
                    {iconMap[serviceSlug] || (
                      <Settings className="h-12 w-12" />
                    )}
                  </motion.div>
                  <h3 className="mb-2 text-lg font-semibold text-lord-navy">
                    {serviceName}
                  </h3>
                  <p className="mb-4 text-sm text-medium-gray line-clamp-2 flex-1">
                    {serviceDescription}
                  </p>
                  <Link
                    href={`/services`}
                    className="text-sm font-medium text-lord-teal hover:underline"
                  >
                    {t("home.services.learnMore")} →
                  </Link>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
