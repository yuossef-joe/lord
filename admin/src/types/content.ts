export interface ContentPage {
  id: string;
  pageKey: string;
  content: Record<string, unknown>;
  seo?: { metaTitle?: string; metaDescription?: string };
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  customerName: string;
  location?: string;
  rating: number;
  quote: string;
  status: "pending" | "approved" | "rejected";
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  questionAr?: string;
  answer: string;
  answerAr?: string;
  category: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
