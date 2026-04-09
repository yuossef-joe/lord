import { format, formatDistanceToNow } from "date-fns";
import type {
  OrderStatus,
  PaymentStatus,
  InquiryStatus,
  ServiceRequestStatus,
} from "@/types";

export function formatCurrency(amount: number): string {
  return `EGP ${amount.toLocaleString("en-EG", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), "MMM d, yyyy");
}

export function formatDateTime(dateStr: string): string {
  return format(new Date(dateStr), "MMM d, yyyy h:mm a");
}

export function formatRelativeTime(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, maxLen: number): string {
  return str.length > maxLen ? str.slice(0, maxLen) + "…" : str;
}

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "teal"
  | "purple";

export function getOrderStatusVariant(status: OrderStatus): BadgeVariant {
  const map: Record<OrderStatus, BadgeVariant> = {
    pending_payment: "default",
    confirmed: "info",
    processing: "warning",
    shipped: "teal",
    delivered: "success",
    cancelled: "error",
    refunded: "purple",
  };
  return map[status] ?? "default";
}

export function getOrderStatusLabel(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    pending_payment: "Pending Payment",
    confirmed: "Confirmed",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    refunded: "Refunded",
  };
  return map[status] ?? status;
}

export function getPaymentStatusVariant(status: PaymentStatus): BadgeVariant {
  const map: Record<PaymentStatus, BadgeVariant> = {
    pending: "default",
    paid: "success",
    failed: "error",
    refunded: "purple",
  };
  return map[status] ?? "default";
}

export function getInquiryStatusVariant(status: InquiryStatus): BadgeVariant {
  const map: Record<InquiryStatus, BadgeVariant> = {
    new: "error",
    in_progress: "warning",
    contacted: "info",
    resolved: "success",
    closed: "default",
  };
  return map[status] ?? "default";
}

export function getServiceRequestStatusVariant(
  status: ServiceRequestStatus,
): BadgeVariant {
  const map: Record<ServiceRequestStatus, BadgeVariant> = {
    new: "error",
    in_progress: "warning",
    scheduled: "info",
    completed: "success",
    cancelled: "default",
  };
  return map[status] ?? "default";
}

export function generateCouponCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "LORD";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export const EGYPTIAN_GOVERNORATES = [
  "Cairo",
  "Giza",
  "Alexandria",
  "Qalyubia",
  "Dakahlia",
  "Sharqia",
  "Gharbia",
  "Monufia",
  "Beheira",
  "Kafr El Sheikh",
  "Damietta",
  "Port Said",
  "Ismailia",
  "Suez",
  "North Sinai",
  "South Sinai",
  "Red Sea",
  "Fayoum",
  "Beni Suef",
  "Minya",
  "Assiut",
  "Sohag",
  "Qena",
  "Luxor",
  "Aswan",
  "Matrouh",
  "New Valley",
  "6th of October",
];
