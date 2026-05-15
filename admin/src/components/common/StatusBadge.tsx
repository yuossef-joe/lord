import Badge from "./Badge";
import type { BadgeVariant } from "./Badge";
import {
  getOrderStatusVariant,
  getPaymentStatusVariant,
  getInquiryStatusVariant,
  getServiceRequestStatusVariant,
} from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

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
  const { t } = useLanguage();
  let variant: BadgeVariant = "default";
  let label = status;

  switch (type) {
    case "order":
      variant = getOrderStatusVariant(
        status as Parameters<typeof getOrderStatusVariant>[0],
      ) as BadgeVariant;
      label =
        {
          pending_payment: t("common.pendingPayment"),
          confirmed: t("common.confirmed"),
          processing: t("common.processing"),
          shipped: t("common.shipped"),
          delivered: t("common.delivered"),
          cancelled: t("common.cancelled"),
          refunded: t("common.refunded"),
        }[status] ?? toTitleCase(status);
      break;
    case "payment":
      variant = getPaymentStatusVariant(
        status as Parameters<typeof getPaymentStatusVariant>[0],
      ) as BadgeVariant;
      label =
        {
          pending: t("common.pending"),
          paid: t("common.paid"),
          failed: t("common.failed"),
          refunded: t("common.refunded"),
        }[status] ?? capitalize(status);
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
