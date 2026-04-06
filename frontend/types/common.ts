export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  metaDescription: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  address: string;
  workingHours: string;
  facebookUrl: string;
  instagramUrl: string;
  googleMapsUrl: string;
  googleMapsEmbedUrl: string;
  shippingFlatRate: number;
  freeShippingThreshold: number;
  estimatedDeliveryDays: string;
  currency: string;
}

export interface ContactSettings {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  workingHours: string;
  googleMapsUrl: string;
  googleMapsEmbedUrl: string;
  facebookUrl: string;
  instagramUrl: string;
}

export interface ShippingSettings {
  flatRate: number;
  freeShippingThreshold: number;
  estimatedDeliveryDays: string;
}
