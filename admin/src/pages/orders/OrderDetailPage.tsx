import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Printer, ArrowLeft, Package } from "lucide-react";
import type { Order } from "@/types";
import { MOCK_ORDERS } from "@/lib/mock-data";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  getOrderStatusLabel,
  getOrderStatusVariant,
} from "@/lib/utils";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import StatusBadge from "@/components/common/StatusBadge";
import Breadcrumb from "@/components/common/Breadcrumb";
import EmptyState from "@/components/common/EmptyState";

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

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const order: Order | undefined = MOCK_ORDERS.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="py-20">
        <EmptyState
          icon={<Package size={32} />}
          title="Order not found"
          description="The order you're looking for doesn't exist or has been removed."
          action={
            <Link to="/orders">
              <Button variant="primary" leftIcon={<ArrowLeft size={16} />}>
                Back to Orders
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  const reversedHistory = [...order.statusHistory].reverse();

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Orders", href: "/orders" },
            { label: `Order #${order.orderNumber}` },
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
            Order #{order.orderNumber}
          </h1>
          <StatusBadge status={order.status} type="order" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" leftIcon={<Printer size={16} />}>
            Print
          </Button>
          <Button variant="primary">Update Status</Button>
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
                <h2 className="text-lg font-semibold text-navy">Order Items</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
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
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {order.shippingFee > 0
                      ? formatCurrency(order.shippingFee)
                      : "Free"}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>
                      Discount
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
                  <span>Total</span>
                  <span>{formatCurrency(order.grandTotal)}</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Status Timeline */}
          <motion.div variants={itemVariants}>
            <Card>
              <h2 className="text-lg font-semibold text-navy mb-4">
                Status Timeline
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
                          {getOrderStatusLabel(entry.status)}
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
                Customer Info
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
              </div>
            </Card>
          </motion.div>

          {/* Shipping Address */}
          <motion.div variants={itemVariants}>
            <Card>
              <h2 className="text-lg font-semibold text-navy mb-3">
                Shipping Address
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
                Payment Info
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Method</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {order.payment.method.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Status</span>
                  <StatusBadge status={order.payment.status} type="payment" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Amount</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(order.payment.amount)}
                  </span>
                </div>
                {order.payment.transactionId && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Reference</span>
                    <span className="text-gray-700 font-mono text-xs">
                      {order.payment.transactionId}
                    </span>
                  </div>
                )}
                {order.payment.paidAt && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Paid At</span>
                    <span className="text-gray-700">
                      {formatDate(order.payment.paidAt)}
                    </span>
                  </div>
                )}
                {order.payment.cardBrand && order.payment.cardLast4 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Card</span>
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
                    Refunds
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
                Order Notes
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
                <p className="text-sm text-gray-400">No notes</p>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
