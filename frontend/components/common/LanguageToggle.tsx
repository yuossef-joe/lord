"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === "en" ? "ar" : "en")}
      className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-lord-navy hover:text-lord-teal transition-colors rounded-button border border-[#E8EAED] hover:border-lord-teal"
      aria-label={language === "en" ? "Switch to Arabic" : "Switch to English"}
    >
      {language === "en" ? "AR" : "EN"}
    </button>
  );
}
