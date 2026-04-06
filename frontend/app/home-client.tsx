"use client";

import React from "react";
import PageTransition from "@/components/common/PageTransition";
import HeroSection from "@/components/home/HeroSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import ServicesOverview from "@/components/home/ServicesOverview";
import WhyChooseLord from "@/components/home/WhyChooseLord";
import TestimonialsCarousel from "@/components/home/TestimonialsCarousel";
import CtaBand from "@/components/home/CtaBand";
import ContactStrip from "@/components/home/ContactStrip";
import SeoHead from "@/components/common/SeoHead";

export default function HomePageClient() {
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
        title="Lord AC — Authorized Carrier & Midea Dealer"
        description="Lord Air Conditioning — Authorized Carrier & Midea dealer in Egypt since 1986."
        jsonLd={jsonLd}
      />
      <HeroSection />
      <FeaturedProducts />
      <ServicesOverview />
      <WhyChooseLord />
      <TestimonialsCarousel />
      <CtaBand />
      <ContactStrip />
    </PageTransition>
  );
}
