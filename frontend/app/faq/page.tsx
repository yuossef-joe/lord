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

const FALLBACK_FAQS: FAQ[] = [
  {
    _id: "1",
    question: "What brands do you sell?",
    answer:
      "Lord is an authorized dealer for Carrier and Midea air conditioning systems in Egypt. We carry the full range of split, window, cassette, and central AC units from both brands.",
    category: "General",
    sortOrder: 1,
    isActive: true,
  },
  {
    _id: "2",
    question: "Do you provide installation services?",
    answer:
      "Yes! We provide professional installation by certified technicians. Installation is available for all AC types and includes site assessment, optimal placement, and a warranty-backed setup.",
    category: "Services",
    sortOrder: 2,
    isActive: true,
  },
  {
    _id: "3",
    question: "What is the warranty on your products?",
    answer:
      "All products come with the manufacturer's official warranty. Carrier units typically include a 5-year compressor warranty and 2-year general warranty. Midea units include similar coverage. Exact terms vary by model.",
    category: "Products",
    sortOrder: 3,
    isActive: true,
  },
  {
    _id: "4",
    question: "Do you deliver across Egypt?",
    answer:
      "Yes, we offer free delivery across Egypt for all AC units. Delivery typically takes 2-5 business days depending on your location. You'll receive tracking updates via SMS.",
    category: "Delivery",
    sortOrder: 4,
    isActive: true,
  },
  {
    _id: "5",
    question: "What payment methods do you accept?",
    answer:
      "We accept online payments via Paymob (credit/debit cards, installments, mobile wallets). Cash on delivery is not available — all orders must be prepaid online for security.",
    category: "Payment",
    sortOrder: 5,
    isActive: true,
  },
  {
    _id: "6",
    question: "Can I return or exchange a product?",
    answer:
      "Products can be returned within 14 days if they are in their original packaging and unused. Installed units are not eligible for return but are covered under warranty for defects.",
    category: "Returns",
    sortOrder: 6,
    isActive: true,
  },
  {
    _id: "7",
    question: "How do I schedule a maintenance service?",
    answer:
      "You can schedule a maintenance service through our website by submitting a service request form, or by contacting us via WhatsApp. Our team will confirm the appointment within 24 hours.",
    category: "Services",
    sortOrder: 7,
    isActive: true,
  },
  {
    _id: "8",
    question: "Do you offer maintenance contracts?",
    answer:
      "Yes, we offer annual maintenance packages that include periodic inspections, filter cleaning, refrigerant checks, and priority support. Contact us for pricing and plans.",
    category: "Services",
    sortOrder: 8,
    isActive: true,
  },
];

export default function FaqPage() {
  const { t, isRTL } = useLanguage();
  const [faqs, setFaqs] = useState<FAQ[]>(FALLBACK_FAQS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetchFaqs()
      .then((data) => {
        const d = data as { data: FAQ[] };
        if (d.data && d.data.length > 0) setFaqs(d.data);
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
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
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
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
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
                        <span>{faq.question}</span>
                        <ChevronDown className="h-4 w-4 flex-shrink-0 text-medium-gray transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className="overflow-hidden data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
                      <div className="px-5 pb-4 text-sm text-dark-charcoal leading-relaxed">
                        {faq.answer}
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
