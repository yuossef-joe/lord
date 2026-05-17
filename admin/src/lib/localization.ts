import type { Language } from "@/context/LanguageContext";

export function localizedValue(
  language: Language,
  english?: string | null,
  arabic?: string | null,
) {
  if (language === "ar") return arabic?.trim() || english?.trim() || "";
  return english?.trim() || arabic?.trim() || "";
}

export function localizedSearchText(
  ...values: Array<string | null | undefined>
) {
  return values.filter(Boolean).join(" ").toLowerCase();
}
