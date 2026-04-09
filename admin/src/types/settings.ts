export interface SiteSettings {
  siteName: string;
  siteNameAr?: string;
  tagline: string;
  taglineAr?: string;
  logoUrl?: string;
  faviconUrl?: string;
  defaultLanguage: "en" | "ar";
  currency: string;
  timezone: string;
}

export interface ContactSettings {
  address: string;
  addressAr?: string;
  phone: string;
  whatsapp: string;
  email: string;
  workingHours: string;
  googleMapsUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  whatsappUrl?: string;
}

export interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
}

export interface SeoSettings {
  defaultMetaTitle: string;
  defaultMetaTitleAr?: string;
  defaultMetaDescription: string;
  defaultMetaDescriptionAr?: string;
  ogImageUrl?: string;
  googleAnalyticsId?: string;
  googleSearchConsoleCode?: string;
  robotsTxt?: string;
}

export interface PaymobSettings {
  apiKey: string;
  secretKey: string;
  merchantId: string;
  cardIntegrationId: string;
  walletIntegrationId: string;
  installmentIntegrationId?: string;
  iframeId: string;
  hmacSecret: string;
  environment: "sandbox" | "production";
}

export interface ShippingSettings {
  flatRate: number;
  freeShippingThreshold: number;
  estimatedDeliveryTime: string;
  shippingNote?: string;
  availableGovernorates: string[];
}
