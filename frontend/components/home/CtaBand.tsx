"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import ScrollReveal from "@/components/common/ScrollReveal";
import Button from "@/components/common/Button";
import { useLanguage } from "@/context/LanguageContext";

export default function CtaBand() {
  const { t } = useLanguage();

  return (
    <section className="bg-gradient-to-r from-lord-teal to-lord-frost py-12 md:py-16">
      <div className="mx-auto max-w-container px-4 md:px-6">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center gap-6">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold text-white md:text-3xl"
            >
              {t("home.cta.headline")}
            </motion.h2>
            <Link href="/contact">
              <Button
                variant="secondary"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-lord-teal"
              >
                {t("home.cta.button")}
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
