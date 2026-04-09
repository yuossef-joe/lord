export type CouponType = "percentage" | "fixed";

export interface CouponUsage {
  orderId: string;
  orderNumber: string;
  customerName: string;
  discountAmount: number;
  usedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usageLimitPerCustomer?: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
