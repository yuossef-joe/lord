export type InquiryType =
  | "product"
  | "purchase"
  | "order-support"
  | "installation"
  | "maintenance"
  | "repair"
  | "delivery"
  | "general";
export type InquiryStatus =
  | "new"
  | "in_progress"
  | "contacted"
  | "resolved"
  | "closed";
export type ServiceRequestStatus =
  | "new"
  | "in_progress"
  | "scheduled"
  | "completed"
  | "cancelled";

export interface InquiryNote {
  id: string;
  note: string;
  createdBy: string;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  inquiryType: InquiryType;
  message: string;
  productId?: string;
  productName?: string;
  source: string;
  status: InquiryStatus;
  notes: InquiryNote[];
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRequest {
  id: string;
  name: string;
  phone: string;
  email?: string;
  serviceTypeId: string;
  serviceTypeName: string;
  unitBrand?: string;
  unitType?: string;
  urgency: "normal" | "urgent" | "emergency";
  installationAddress?: string;
  message?: string;
  status: ServiceRequestStatus;
  notes: InquiryNote[];
  createdAt: string;
  updatedAt: string;
}
