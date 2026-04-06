export type OrderStatus =
  | "pending_payment"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface OrderItem {
  product: {
    _id: string;
    name: string;
    slug: string;
    images: { url: string; alt: string }[];
    brand: { name: string };
    modelNumber: string;
  };
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  note?: string;
  timestamp: string;
}

export interface Payment {
  method: "card" | "wallet" | "installments";
  paymobTransactionId?: string;
  paymobOrderId?: string;
  cardBrand?: string;
  cardLastFour?: string;
  paidAt?: string;
  amount: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    nationalId: string;
  };
  items: OrderItem[];
  shippingAddress: {
    recipientName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    governorate: string;
    postalCode?: string;
  };
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  coupon?: {
    code: string;
    discountType: string;
    discountValue: number;
  };
  status: OrderStatus;
  statusHistory: OrderStatusHistory[];
  payment: Payment;
  trackingNumber?: string;
  trackingCarrier?: string;
  estimatedDelivery?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
