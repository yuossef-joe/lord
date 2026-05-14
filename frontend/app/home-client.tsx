"use client";

import React, { useEffect, useState } from "react";
import PageTransition from "@/components/common/PageTransition";
import HeroSection from "@/components/home/HeroSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import ServicesOverview from "@/components/home/ServicesOverview";
import WhyChooseLord from "@/components/home/WhyChooseLord";
import TestimonialsCarousel from "@/components/home/TestimonialsCarousel";
import CtaBand from "@/components/home/CtaBand";
import ContactStrip from "@/components/home/ContactStrip";
import SeoHead from "@/components/common/SeoHead";
import { useLanguage } from "@/context/LanguageContext";
import { fetchHomeContent } from "@/lib/api";

type HomeContent = {
  content?: Record<string, unknown>;
  seo?: Record<string, unknown>;
};

export default function HomePageClient() {
  const { t, localize } = useLanguage();
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);

  useEffect(() => {
    fetchHomeContent()
      .then((response) => {
        const data = response as { data?: HomeContent };
        setHomeContent(data.data ?? null);
      })
      .catch(() => setHomeContent(null));
  }, []);

  const content = homeContent?.content ?? {};
  const seo = homeContent?.seo ?? {};
  const fromContent = (englishKey: string, arabicKey: string) =>
    localize(content[englishKey] as string | undefined, content[arabicKey] as string | undefined);
  const fromSeo = (englishKey: string, arabicKey: string) =>
    localize(seo[englishKey] as string | undefined, seo[arabicKey] as string | undefined);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Lord Air Conditioning",
    description: "Authorized Carrier & Midea dealer in Egypt since 1986.",
    url: "https://www.lord-ac.com",
    telephone: "+201000000000",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Cairo",
      addressCountry: "EG",
    },
    openingHours: "Sa-Th 09:00-18:00",
  };

  return (
    <PageTransition>
      <SeoHead
        title={fromSeo("metaTitle", "metaTitleAr") || t("home.seoTitle")}
        description={
          fromSeo("metaDescription", "metaDescriptionAr") ||
          t("home.seoDescription")
        }
        jsonLd={jsonLd}
      />
      <HeroSection
        headline={fromContent("heroHeadline", "heroHeadlineAr")}
        tagline={fromContent("heroTagline", "heroTaglineAr")}
      />
      <FeaturedProducts
        title={fromContent("featuredTitle", "featuredTitleAr")}
      />
      <ServicesOverview title={fromContent("servicesTitle", "servicesTitleAr")} />
      <WhyChooseLord title={fromContent("whyTitle", "whyTitleAr")} />
      <TestimonialsCarousel
        title={fromContent("testimonialsTitle", "testimonialsTitleAr")}
      />
      <CtaBand headline={fromContent("ctaHeadline", "ctaHeadlineAr")} />
      <ContactStrip />
    </PageTransition>
  );
}
