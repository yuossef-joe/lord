"use client";

import React from "react";
import { motion } from "motion/react";
import CountUp from "react-countup";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { useLanguage } from "@/context/LanguageContext";
import ScrollReveal from "@/components/common/ScrollReveal";
import { Calendar, Wind, ShieldCheck, HeadphonesIcon } from "lucide-react";

const stats = [
  {
    icon: <Calendar className="h-7 w-7" />,
    value: 1986,
    labelKey: "home.why.since",
    noCount: true,
  },
  {
    icon: <Wind className="h-7 w-7" />,
    value: 50000,
    labelKey: "home.why.unitsInstalled",
    suffix: "+",
  },
  {
    icon: <ShieldCheck className="h-7 w-7" />,
    value: 2,
    labelKey: "home.why.authorizedDealer",
    prefix: "",
    suffixKey: "home.why.brandsSuffix",
  },
  {
    icon: <HeadphonesIcon className="h-7 w-7" />,
    value: 100,
    labelKey: "home.why.afterSalesSupport",
    suffix: "%",
  },
];

interface WhyChooseLordProps {
  title?: string;
}

export default function WhyChooseLord({ title }: WhyChooseLordProps) {
  const { t } = useLanguage();

  return (
    <section className="bg-off-white py-16 md:py-20">
      <div className="mx-auto max-w-container px-4 md:px-6">
        <ScrollReveal>
          <h2 className="mb-10 text-center text-3xl font-bold text-lord-navy md:text-4xl">
            {title || t("home.why.title")}
          </h2>
        </ScrollReveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 gap-6 lg:grid-cols-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              whileHover={{ scale: 1.03, y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex flex-col items-center rounded-card bg-white p-6 text-center shadow-sm border border-[#E8EAED]"
            >
              <motion.div
                whileInView={{ scale: [1, 1.1, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-lord-teal/10 text-lord-teal"
              >
                {stat.icon}
              </motion.div>
              <div className="text-3xl font-bold text-lord-teal md:text-4xl">
                {stat.noCount ? (
                  stat.value
                ) : (
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    enableScrollSpy
                    scrollSpyOnce
                    separator=","
                    prefix={stat.prefix || ""}
                    suffix={stat.suffixKey ? t(stat.suffixKey) : stat.suffix || ""}
                  />
                )}
              </div>
              <p className="mt-1.5 text-sm text-medium-gray">
                {t(stat.labelKey)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
