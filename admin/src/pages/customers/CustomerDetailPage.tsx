import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ShoppingBag, MapPin, User, BarChart3 } from "lucide-react";
import { MOCK_CUSTOMERS, MOCK_ORDERS } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import Breadcrumb from "@/components/common/Breadcrumb";
import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import StatusBadge from "@/components/common/StatusBadge";
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

function maskNationalId(id: string): string {
  if (id.length <= 4) return id;
  return "•".repeat(id.length - 4) + id.slice(-4);
}

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();

  const customer = useMemo(() => MOCK_CUSTOMERS.find((c) => c.id === id), [id]);

  const customerOrders = useMemo(() => {
    if (!customer) return [];
    return MOCK_ORDERS.filter((order) => order.customer.name === customer.name);
  }, [customer]);

  if (!customer) {
    return (
      <div className="py-20">
        <EmptyState
          icon={<User size={28} />}
          title="Customer not found"
          description="The customer you're looking for doesn't exist or has been removed."
          action={
            <Link
              to="/customers"
              className="text-teal font-medium hover:underline"
            >
              ← Back to Customers
            </Link>
          }
        />
      </div>
    );
  }

  const averageOrderValue =
    customer.ordersCount > 0 ? customer.totalSpent / customer.ordersCount : 0;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Customers", href: "/customers" },
            { label: customer.name },
          ]}
        />
      </motion.div>

      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-3 mb-6 mt-4"
      >
        <h1 className="text-2xl font-bold text-navy">{customer.name}</h1>
        {customer.isActive ? (
          <Badge variant="success">Active</Badge>
        ) : (
          <Badge variant="danger">Inactive</Badge>
        )}
        {customer.emailVerified ? (
          <Badge variant="success">Verified</Badge>
        ) : (
          <Badge variant="warning">Unverified</Badge>
        )}
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <motion.div variants={itemVariants}>
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <User size={18} className="text-teal" />
                <h2 className="text-lg font-semibold text-navy">
                  Customer Info
                </h2>
              </div>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {customer.name}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {customer.email}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {customer.phone}
                  </dd>
                </div>
                {customer.nationalId && (
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      National ID
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 font-mono">
                      {maskNationalId(customer.nationalId)}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(customer.createdAt)}
                  </dd>
                </div>
              </dl>
            </Card>
          </motion.div>

          {/* Order History */}
          <motion.div variants={itemVariants}>
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag size={18} className="text-teal" />
                <h2 className="text-lg font-semibold text-navy">
                  Order History
                </h2>
              </div>

              {customerOrders.length > 0 ? (
                <div className="overflow-x-auto -mx-6">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-y border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order #
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {customerOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="hover:bg-gray-50 transition"
                        >
                          <td className="px-6 py-4 text-sm">
                            <Link
                              to={`/orders/${order.id}`}
                              className="text-teal font-medium hover:underline"
                            >
                              {order.orderNumber}
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            {formatCurrency(order.grandTotal)}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <StatusBadge status={order.status} type="order" />
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState
                  icon={<ShoppingBag size={28} />}
                  title="No orders yet"
                  description="This customer hasn't placed any orders."
                />
              )}
            </Card>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Statistics */}
          <motion.div variants={itemVariants}>
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={18} className="text-teal" />
                <h2 className="text-lg font-semibold text-navy">Statistics</h2>
              </div>
              <dl className="space-y-4">
                <div className="flex justify-between items-center">
                  <dt className="text-sm text-gray-500">Total Orders</dt>
                  <dd className="text-sm font-semibold text-gray-900">
                    {customer.ordersCount}
                  </dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-sm text-gray-500">Total Spent</dt>
                  <dd className="text-sm font-semibold text-gray-900">
                    {formatCurrency(customer.totalSpent)}
                  </dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-sm text-gray-500">Avg. Order Value</dt>
                  <dd className="text-sm font-semibold text-gray-900">
                    {formatCurrency(averageOrderValue)}
                  </dd>
                </div>
              </dl>
            </Card>
          </motion.div>

          {/* Addresses */}
          <motion.div variants={itemVariants}>
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={18} className="text-teal" />
                <h2 className="text-lg font-semibold text-navy">Addresses</h2>
              </div>

              {customer.addresses.length > 0 ? (
                <div className="space-y-4">
                  {customer.addresses.map((address) => (
                    <div
                      key={address.id}
                      className="rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {address.recipientName}
                        </span>
                        {address.isDefault && (
                          <Badge variant="info">Default</Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 space-y-0.5">
                        <p>{address.addressLine1}</p>
                        {address.addressLine2 && <p>{address.addressLine2}</p>}
                        <p>
                          {address.city}, {address.governorate}
                          {address.postalCode && ` ${address.postalCode}`}
                        </p>
                        <p className="text-gray-500">{address.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No addresses on file.
                </p>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
