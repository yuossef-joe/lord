"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown, Search } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";
import PageTransition from "@/components/common/PageTransition";
import Breadcrumb from "@/components/common/Breadcrumb";
import ScrollReveal from "@/components/common/ScrollReveal";
import SeoHead from "@/components/common/SeoHead";
import { useLanguage } from "@/context/LanguageContext";
import { fetchFaqs } from "@/lib/api";
import { FAQ } from "@/types/inquiry";

export default function FaqPage() {
  const { t, isRTL, localize } = useLanguage();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetchFaqs()
      .then((data) => {
        const d = data as { data: FAQ[] };
        setFaqs(d.data ?? []);
      })
      .catch(() => {});
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(faqs.map((f) => f.category).filter(Boolean))),
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      activeCategory === "All" || faq.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      localize(faq.question, faq.questionAr)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      localize(faq.answer, faq.answerAr)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageTransition>
      <SeoHead
        title={`${t("nav.faq")} | Lord`}
        description="Frequently asked questions about Lord AC products, services, delivery, payment, and warranty."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: localize(faq.question, faq.questionAr),
            acceptedAnswer: {
              "@type": "Answer",
              text: localize(faq.answer, faq.answerAr),
            },
          })),
        }}
      />

      <div className="mx-auto max-w-container px-4 py-6 md:px-6 md:py-8">
        <Breadcrumb
          items={[{ label: t("nav.home"), href: "/" }, { label: t("nav.faq") }]}
        />

        <ScrollReveal>
          <div className="mt-6 text-center">
            <h1 className="text-3xl font-bold text-lord-navy md:text-4xl">
              {t("faq.title")}
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-medium-gray">
              {t("faq.subtitle")}
            </p>
          </div>
        </ScrollReveal>

        {/* Search */}
        <div className="mx-auto mt-8 max-w-xl">
          <div className="relative">
            <Search
              className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-medium-gray ${isRTL ? "right-4" : "left-4"}`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("faq.searchPlaceholder")}
              className={`w-full rounded-button border border-[#E8EAED] py-3 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal ${isRTL ? "pr-12 pl-4" : "pl-12 pr-4"}`}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mx-auto mt-6 flex max-w-xl flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                activeCategory === cat
                  ? "bg-lord-teal text-white"
                  : "bg-off-white text-dark-charcoal hover:bg-lord-teal/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mx-auto mt-8 max-w-3xl"
        >
          {filteredFaqs.length === 0 ? (
            <p className="py-12 text-center text-medium-gray">
              {t("general.noResults")}
            </p>
          ) : (
            <Accordion.Root type="multiple" className="space-y-3">
              {filteredFaqs.map((faq) => (
                <motion.div key={faq._id} variants={staggerItem}>
                  <Accordion.Item
                    value={faq._id}
                    className="overflow-hidden rounded-card border border-[#E8EAED] bg-white"
                  >
                    <Accordion.Header>
                      <Accordion.Trigger className="group flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-lord-navy hover:text-lord-teal transition-colors">
                        <span>{localize(faq.question, faq.questionAr)}</span>
                        <ChevronDown className="h-4 w-4 flex-shrink-0 text-medium-gray transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className="overflow-hidden data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
                      <div className="px-5 pb-4 text-sm text-dark-charcoal leading-relaxed">
                        {localize(faq.answer, faq.answerAr)}
                      </div>
                    </Accordion.Content>
                  </Accordion.Item>
                </motion.div>
              ))}
            </Accordion.Root>
          )}
        </motion.div>

        {/* CTA */}
        <ScrollReveal>
          <div className="mt-16 rounded-card bg-off-white p-8 text-center">
            <h2 className="text-xl font-bold text-lord-navy">
              {t("faq.ctaTitle")}
            </h2>
            <p className="mt-2 text-medium-gray">{t("faq.ctaSubtitle")}</p>
            <a
              href="https://wa.me/201234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-button bg-lord-teal px-6 py-2.5 text-sm font-semibold text-white hover:bg-lord-teal/90 transition-colors"
            >
              {t("faq.chatWithUs")}
            </a>
          </div>
        </ScrollReveal>
      </div>
    </PageTransition>
  );
}
