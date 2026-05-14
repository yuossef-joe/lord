import { Languages } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSwitch() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 transition hover:border-teal hover:text-teal"
      aria-label={
        language === "en" ? "Switch admin to Arabic" : "Switch admin to English"
      }
      title={
        language === "en" ? "Switch admin to Arabic" : "Switch admin to English"
      }
    >
      <Languages className="h-4 w-4" />
      <span>{language === "en" ? "AR" : "EN"}</span>
    </button>
  );
}
