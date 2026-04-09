import Badge from "./Badge";
import type { BadgeVariant } from "./Badge";
import {
  getOrderStatusVariant,
  getOrderStatusLabel,
  getPaymentStatusVariant,
  getInquiryStatusVariant,
  getServiceRequestStatusVariant,
} from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  type?: "order" | "payment" | "inquiry" | "serviceRequest";
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toTitleCase(str: string): string {
  return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function StatusBadge({
  status,
  type = "order",
}: StatusBadgeProps) {
  let variant: BadgeVariant = "default";
  let label = status;

  switch (type) {
    case "order":
      variant = getOrderStatusVariant(
        status as Parameters<typeof getOrderStatusVariant>[0],
      ) as BadgeVariant;
      label = getOrderStatusLabel(
        status as Parameters<typeof getOrderStatusLabel>[0],
      );
      break;
    case "payment":
      variant = getPaymentStatusVariant(
        status as Parameters<typeof getPaymentStatusVariant>[0],
      ) as BadgeVariant;
      label = capitalize(status);
      break;
    case "inquiry":
      variant = getInquiryStatusVariant(
        status as Parameters<typeof getInquiryStatusVariant>[0],
      ) as BadgeVariant;
      label = toTitleCase(status);
      break;
    case "serviceRequest":
      variant = getServiceRequestStatusVariant(
        status as Parameters<typeof getServiceRequestStatusVariant>[0],
      ) as BadgeVariant;
      label = toTitleCase(status);
      break;
  }

  return <Badge variant={variant}>{label}</Badge>;
}
