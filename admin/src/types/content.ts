export interface ContentPage {
  id: string;
  pageKey: string;
  title?: string;
  titleAr?: string;
  content: Record<string, unknown>;
  seo?: {
    metaTitle?: string;
    metaTitleAr?: string;
    metaDescription?: string;
    metaDescriptionAr?: string;
    title?: string;
    titleAr?: string;
    description?: string;
    descriptionAr?: string;
  };
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
