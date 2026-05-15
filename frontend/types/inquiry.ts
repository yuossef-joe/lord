export type InquiryType =
  | "purchase"
  | "order_support"
  | "installation"
  | "maintenance"
  | "repair"
  | "delivery"
  | "general";

export interface Inquiry {
  name: string;
  email: string;
  phone: string;
  inquiryType: InquiryType;
  message: string;
  source: string;
  productId?: string;
  honeypot?: string;
}

export interface ServiceRequest {
  serviceTypeId: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  source: string;
  installationAddress?: string;
  unitBrand?: string;
  unitModel?: string;
  propertyType?: "residential" | "commercial";
  floorNumber?: number;
  preferredDate?: string;
  preferredTime?: string;
  unitAge?: string;
  lastServiceDate?: string;
  issueDescription?: string;
  urgency?: "standard" | "emergency";
  deliveryAddress?: string;
}

export interface Testimonial {
  _id: string;
  customerName: string;
  location?: string;
  locationAr?: string;
  rating: number;
  quote: string;
  quoteAr?: string;
  isApproved: boolean;
  isFeatured: boolean;
}

export interface FAQ {
  _id: string;
  question: string;
  questionAr?: string;
  answer: string;
  answerAr?: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ContentPage {
  _id: string;
  slug: string;
  title: string;
  content: Record<string, unknown>;
}
