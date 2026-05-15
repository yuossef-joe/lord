import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Printer, ArrowLeft, Package } from "lucide-react";
import type { Order, OrderStatus, PaymentStatus } from "@/types";
import {
  fetchOrder,
  updateOrderPaymentStatus,
  updateOrderStatus,
} from "@/lib/api";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  getOrderStatusVariant,
} from "@/lib/utils";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import StatusBadge from "@/components/common/StatusBadge";
import Breadcrumb from "@/components/common/Breadcrumb";
import EmptyState from "@/components/common/EmptyState";
import Modal from "@/components/common/Modal";
import FormField from "@/components/common/FormField";
import { useLanguage } from "@/context/LanguageContext";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const STATUS_DOT_COLORS: Record<string, string> = {
  default: "bg-gray-400",
  success: "bg-green-500",
  warning: "bg-amber-500",
  error: "bg-red-500",
  info: "bg-blue-500",
  teal: "bg-teal",
  purple: "bg-purple-500",
};

const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  "pending_payment",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const PAYMENT_STATUS_OPTIONS: PaymentStatus[] = [
  "pending",
  "paid",
  "failed",
  "refunded",
];

const inputStyles =
  "w-full rounded-lg border border-gray-300 px-3 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default function OrderDetailPage() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [nextStatus, setNextStatus] = useState<OrderStatus | "">("");
  const [statusNote, setStatusNote] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [nextPaymentStatus, setNextPaymentStatus] =
    useState<PaymentStatus>("pending");
  const [isUpdatingPaymentStatus, setIsUpdatingPaymentStatus] = useState(false);
  const [paymentStatusError, setPaymentStatusError] = useState("");

  useEffect(() => {
    if (!id) return;
    void fetchOrder(id)
      .then((response) => setOrder(response.data))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return null;

  if (!order) {
    return (
      <div className="py-20">
        <EmptyState
          icon={<Package size={32} />}
          title={t("common.orderNotFound")}
          description={t("common.orderNotFoundDescription")}
          action={
            <Link to="/orders">
              <Button variant="primary" leftIcon={<ArrowLeft size={16} />}>
                {t("common.backToOrders")}
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  const reversedHistory = [...order.statusHistory].reverse();
  const orderStatusLabel = (status: string) =>
    ({
      pending_payment: t("common.pendingPayment"),
      confirmed: t("common.confirmed"),
      processing: t("common.processing"),
      shipped: t("common.shipped"),
      delivered: t("common.delivered"),
      cancelled: t("common.cancelled"),
      refunded: t("common.refunded"),
    })[status] ?? status;
  const paymentMethodLabel = (method: string) =>
    ({
      cash_on_delivery: t("common.cashOnDelivery"),
      credit_card: t("common.creditCard"),
      mobile_wallet: t("common.mobileWallet"),
      installment: t("common.installment"),
    })[method] ?? method.replace(/_/g, " ");
  const paymentStatusLabel = (status: PaymentStatus) =>
    ({
      pending: t("common.pending"),
      paid: t("common.paid"),
      failed: t("common.failed"),
      refunded: t("common.refunded"),
    })[status];

  const openStatusModal = () => {
    setNextStatus(order.status);
    setStatusNote("");
    setStatusError("");
    setIsStatusModalOpen(true);
  };

  const openPaymentModal = () => {
    setNextPaymentStatus(order.payment.status);
    setPaymentStatusError("");
    setIsPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    if (isUpdatingPaymentStatus) return;
    setIsPaymentModalOpen(false);
  };

  const closeStatusModal = () => {
    if (isUpdatingStatus) return;
    setIsStatusModalOpen(false);
  };

  const handlePaymentStatusUpdate = async () => {
    if (!id) return;

    setIsUpdatingPaymentStatus(true);
    setPaymentStatusError("");

    try {
      await updateOrderPaymentStatus(id, nextPaymentStatus);
      const response = await fetchOrder(id);
      setOrder(response.data);
      setIsPaymentModalOpen(false);
    } catch (error) {
      setPaymentStatusError(
        error instanceof Error
          ? error.message
          : "Unable to update payment status",
      );
    } finally {
      setIsUpdatingPaymentStatus(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!id || !nextStatus) return;

    setIsUpdatingStatus(true);
    setStatusError("");

    try {
      await updateOrderStatus(id, nextStatus, statusNote.trim() || undefined);
      const response = await fetchOrder(id);
      setOrder(response.data);
      setIsStatusModalOpen(false);
    } catch (error) {
      setStatusError(
        error instanceof Error ? error.message : "Unable to update status",
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) return;

    const itemRows = order.items
      .map(
        (item) => `
          <tr>
            <td>${escapeHtml(item.productName)}</td>
            <td>${escapeHtml(item.brand)} ${escapeHtml(item.modelNumber)}</td>
            <td>${item.quantity}</td>
            <td>${formatCurrency(item.unitPrice)}</td>
            <td>${formatCurrency(item.lineTotal)}</td>
          </tr>
        `,
      )
      .join("");

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Order ${escapeHtml(order.orderNumber)}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #172041; margin: 32px; }
            h1 { margin-bottom: 4px; }
            .meta { color: #555; margin-bottom: 24px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
            section { border: 1px solid #ddd; padding: 16px; border-radius: 8px; }
            h2 { font-size: 16px; margin: 0 0 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border-bottom: 1px solid #ddd; padding: 10px 8px; text-align: left; }
            th:nth-child(n+3), td:nth-child(n+3) { text-align: right; }
            .totals { margin-left: auto; width: 280px; margin-top: 18px; }
            .totals div { display: flex; justify-content: space-between; padding: 5px 0; }
            .grand-total { border-top: 1px solid #172041; font-weight: bold; margin-top: 6px; padding-top: 10px !important; }
          </style>
        </head>
        <body>
          <h1>Order ${escapeHtml(order.orderNumber)}</h1>
          <div class="meta">${escapeHtml(orderStatusLabel(order.status))} | ${escapeHtml(formatDateTime(order.createdAt))}</div>
          <div class="grid">
            <section>
              <h2>Customer</h2>
              <div>${escapeHtml(order.customer.name)}</div>
              <div>${escapeHtml(order.customer.email)}</div>
              <div>${escapeHtml(order.customer.phone)}</div>
            </section>
            <section>
              <h2>Shipping Address</h2>
              <div>${escapeHtml(order.shippingAddress.recipientName)}</div>
              <div>${escapeHtml(order.shippingAddress.addressLine1)}</div>
              <div>${escapeHtml(order.shippingAddress.city)}, ${escapeHtml(order.shippingAddress.governorate)}</div>
              <div>${escapeHtml(order.shippingAddress.phone)}</div>
            </section>
          </div>
          <table>
            <thead>
              <tr><th>Product</th><th>Details</th><th>Qty</th><th>Price</th><th>Total</th></tr>
            </thead>
            <tbody>${itemRows}</tbody>
          </table>
          <div class="totals">
            <div><span>Subtotal</span><span>${formatCurrency(order.subtotal)}</span></div>
            <div><span>Shipping</span><span>${formatCurrency(order.shippingFee)}</span></div>
            <div><span>Discount</span><span>-${formatCurrency(order.discount)}</span></div>
            <div class="grand-total"><span>Total</span><span>${formatCurrency(order.grandTotal)}</span></div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <Breadcrumb
          items={[
            { label: t("common.dashboard"), href: "/" },
            { label: t("common.orders"), href: "/orders" },
            { label: `${t("common.orderNumber")}${order.orderNumber}` },
          ]}
        />
      </motion.div>

      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex justify-between items-center mb-6 mt-4"
      >
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-navy">
            {t("common.orderNumber")}{order.orderNumber}
          </h1>
          <StatusBadge status={order.status} type="order" />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            leftIcon={<Printer size={16} />}
            onClick={handlePrint}
          >
            {t("common.print")}
          </Button>
          <Button
            variant="primary"
            onClick={openStatusModal}
          >
            {t("common.updateStatus")}
          </Button>
        </div>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <motion.div variants={itemVariants}>
            <Card padding="none">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-navy">
                  {t("common.orderItems")}
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("common.product")}
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("common.price")}
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("common.quantity")}
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("common.total")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                              {item.productImage ? (
                                <img
                                  src={item.productImage}
                                  alt={item.productName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package size={20} className="text-gray-400" />
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {item.productName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {item.brand} · {item.modelNumber}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 text-right">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 text-right">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                          {formatCurrency(item.lineTotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-gray-200 p-6 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{t("common.subtotal")}</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{t("common.shipping")}</span>
                  <span>
                    {order.shippingFee > 0
                      ? formatCurrency(order.shippingFee)
                      : t("common.free")}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>
                      {t("common.discount")}
                      {order.couponCode && (
                        <span className="ml-1 text-xs text-gray-400">
                          ({order.couponCode})
                        </span>
                      )}
                    </span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-semibold text-navy pt-2 border-t border-gray-100">
                  <span>{t("common.total")}</span>
                  <span>{formatCurrency(order.grandTotal)}</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Status Timeline */}
          <motion.div variants={itemVariants}>
            <Card>
              <h2 className="text-lg font-semibold text-navy mb-4">
                {t("common.statusTimeline")}
              </h2>
              <div className="relative">
                {reversedHistory.map((entry, index) => {
                  const variant = getOrderStatusVariant(entry.status);
                  const dotColor =
                    STATUS_DOT_COLORS[variant] ?? STATUS_DOT_COLORS.default;
                  const isLast = index === reversedHistory.length - 1;

                  return (
                    <div key={index} className="flex gap-4 relative">
                      {/* Vertical line + dot */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full shrink-0 mt-1.5 ${dotColor}`}
                        />
                        {!isLast && (
                          <div className="w-0.5 bg-gray-200 flex-1 min-h-[24px]" />
                        )}
                      </div>
                      {/* Content */}
                      <div className="pb-6">
                        <div className="font-medium text-gray-900">
                          {orderStatusLabel(entry.status)}
                        </div>
                        {entry.note && (
                          <p className="text-sm text-gray-500 mt-0.5">
                            {entry.note}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatDateTime(entry.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Customer Info */}
          <motion.div variants={itemVariants}>
            <Card>
              <h2 className="text-lg font-semibold text-navy mb-3">
                {t("common.customerInfo")}
              </h2>
              <div className="space-y-2 text-sm">
                <div>
                  <Link
                    to={`/customers/${order.customer.id}`}
                    className="font-medium text-teal hover:underline"
                  >
                    {order.customer.name}
                  </Link>
                </div>
                <div className="text-gray-600">{order.customer.email}</div>
                <div className="text-gray-600">{order.customer.phone}</div>
                {order.customer.nationalId && (
                  <div className="text-gray-600">
                    {t("common.nationalId")}:{" "}
                    <span className="font-mono">{order.customer.nationalId}</span>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Shipping Address */}
          <motion.div variants={itemVariants}>
            <Card>
              <h2 className="text-lg font-semibold text-navy mb-3">
                {t("common.shippingAddress")}
              </h2>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="font-medium text-gray-900">
                  {order.shippingAddress.recipientName}
                </div>
                <div>{order.shippingAddress.addressLine1}</div>
                {order.shippingAddress.addressLine2 && (
                  <div>{order.shippingAddress.addressLine2}</div>
                )}
                <div>
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.governorate}
                </div>
                {order.shippingAddress.postalCode && (
                  <div>{order.shippingAddress.postalCode}</div>
                )}
                <div>{order.shippingAddress.phone}</div>
              </div>
            </Card>
          </motion.div>

          {/* Payment Info */}
          <motion.div variants={itemVariants}>
            <Card>
              <h2 className="text-lg font-semibold text-navy mb-3">
                {t("common.paymentInfo")}
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">{t("common.method")}</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {paymentMethodLabel(order.payment.method)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">{t("common.status")}</span>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={order.payment.status} type="payment" />
                    <Button size="sm" variant="outline" onClick={openPaymentModal}>
                      {t("common.edit")}
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">{t("common.amount")}</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(order.payment.amount)}
                  </span>
                </div>
                {order.payment.transactionId && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">{t("common.reference")}</span>
                    <span className="text-gray-700 font-mono text-xs">
                      {order.payment.transactionId}
                    </span>
                  </div>
                )}
                {order.payment.paidAt && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">{t("common.paidAt")}</span>
                    <span className="text-gray-700">
                      {formatDate(order.payment.paidAt)}
                    </span>
                  </div>
                )}
                {order.payment.cardBrand && order.payment.cardLast4 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">{t("common.card")}</span>
                    <span className="text-gray-700">
                      {order.payment.cardBrand} ···· {order.payment.cardLast4}
                    </span>
                  </div>
                )}
              </div>

              {/* Refunds */}
              {order.refunds.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    {t("common.refunds")}
                  </h3>
                  <div className="space-y-2">
                    {order.refunds.map((refund) => (
                      <div
                        key={refund.id}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-gray-500">
                          {formatDate(refund.createdAt)}
                        </span>
                        <span className="text-red-600 font-medium">
                          -{formatCurrency(refund.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Order Notes */}
          <motion.div variants={itemVariants}>
            <Card>
              <h2 className="text-lg font-semibold text-navy mb-3">
                {t("common.orderNotes")}
              </h2>
              {order.notes.length > 0 ? (
                <ul className="space-y-2">
                  {order.notes.map((note, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3"
                    >
                      {note}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">{t("common.noNotes")}</p>
              )}
            </Card>
          </motion.div>
        </div>
      </div>

      <Modal
        isOpen={isStatusModalOpen}
        onClose={closeStatusModal}
        title={t("common.updateStatus")}
      >
        <div className="space-y-4">
          <FormField label={t("common.status")}>
            <select
              value={nextStatus}
              onChange={(event) =>
                setNextStatus(event.target.value as OrderStatus)
              }
              className={`${inputStyles} h-10`}
            >
              {ORDER_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {orderStatusLabel(status)}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Note">
            <textarea
              value={statusNote}
              onChange={(event) => setStatusNote(event.target.value)}
              className={`${inputStyles} min-h-24 py-2`}
              placeholder="Optional note"
            />
          </FormField>

          {statusError && <p className="text-sm text-red-600">{statusError}</p>}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={closeStatusModal}>
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleStatusUpdate}
              isLoading={isUpdatingStatus}
              disabled={!nextStatus}
            >
              {t("common.updateStatus")}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isPaymentModalOpen}
        onClose={closePaymentModal}
        title={t("common.updatePaymentStatus")}
      >
        <div className="space-y-4">
          <FormField label={t("common.status")}>
            <select
              value={nextPaymentStatus}
              onChange={(event) =>
                setNextPaymentStatus(event.target.value as PaymentStatus)
              }
              className={`${inputStyles} h-10`}
            >
              {PAYMENT_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {paymentStatusLabel(status)}
                </option>
              ))}
            </select>
          </FormField>

          {paymentStatusError && (
            <p className="text-sm text-red-600">{paymentStatusError}</p>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={closePaymentModal}>
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handlePaymentStatusUpdate}
              isLoading={isUpdatingPaymentStatus}
            >
              {t("common.updatePaymentStatus")}
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
