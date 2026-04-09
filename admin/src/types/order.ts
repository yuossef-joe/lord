export type OrderStatus =
  | "pending_payment"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type PaymentMethod =
  | "credit_card"
  | "mobile_wallet"
  | "installment"
  | "cash_on_delivery";

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  brand: string;
  modelNumber: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Payment {
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  cardBrand?: string;
  cardLast4?: string;
  paidAt?: string;
  amount: number;
}

export interface Refund {
  id: string;
  amount: number;
  reason: string;
  paymobRefundId?: string;
  createdAt: string;
}

export interface ShippingAddress {
  label?: string;
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  governorate: string;
  postalCode?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    nationalId?: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  couponCode?: string;
  grandTotal: number;
  currency: string;
  payment: Payment;
  status: OrderStatus;
  statusHistory: OrderStatusHistory[];
  shippingAddress: ShippingAddress;
  trackingNumber?: string;
  trackingCarrier?: string;
  refunds: Refund[];
  notes: string[];
  createdAt: string;
  updatedAt: string;
}
