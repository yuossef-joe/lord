import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DashboardStats, RevenueDataPoint, Order, Inquiry } from "@/types";
import {
  fetchDashboardStats,
  fetchLatestInquiries,
  fetchRecentOrders,
  fetchRevenueChart,
} from "@/lib/api";
import { formatCurrency, formatDate, truncate } from "@/lib/utils";
import StatsCard from "@/components/common/StatsCard";
import Card from "@/components/common/Card";
import StatusBadge from "@/components/common/StatusBadge";
import Badge from "@/components/common/Badge";
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

function formatChartDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function DashboardPage() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats>({
    revenueToday: 0,
    revenueYesterday: 0,
    newOrdersToday: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    newInquiriesToday: 0,
    outOfStockCount: 0,
    carrierProducts: 0,
    mideaProducts: 0,
  });
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    void Promise.all([
      fetchDashboardStats(),
      fetchRevenueChart("30d"),
      fetchRecentOrders(5),
      fetchLatestInquiries(5),
    ]).then(([statsResponse, revenueResponse, ordersResponse, inquiriesResponse]) => {
      setStats(statsResponse.data);
      setRevenueData(revenueResponse.data);
      setOrders(ordersResponse.data);
      setInquiries(inquiriesResponse.data);
    });
  }, []);

  return (
    <motion.div
      className="space-y-0"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        variants={itemVariants}
      >
        <StatsCard
          title={t("common.revenueToday")}
          value={stats.revenueToday}
          icon={<DollarSign size={20} />}
          format="currency"
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatsCard
          title={t("common.newOrdersToday")}
          value={stats.newOrdersToday}
          icon={<ShoppingBag size={20} />}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatsCard
          title={t("common.totalCustomers")}
          value={stats.totalCustomers}
          icon={<Users size={20} />}
          trend={{ value: 4.1, isPositive: true }}
        />
        <StatsCard
          title={t("common.totalProducts")}
          value={stats.totalProducts}
          icon={<Package size={20} />}
        />
      </motion.div>

      {/* Charts Row */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        variants={itemVariants}
      >
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-navy mb-4">
            {t("common.revenueOverview")}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="date"
                tickFormatter={formatChartDate}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [
                  `EGP ${Number(value).toLocaleString()}`,
                  t("common.revenue"),
                ]}
                labelFormatter={(label) => formatChartDate(String(label))}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#0DBACA"
                fill="#0DBACA"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Quick Stats */}
        <Card>
          <h3 className="text-lg font-semibold text-navy mb-6">
            {t("common.quickOverview")}
          </h3>

          <div className="space-y-5">
            {/* Pending Orders */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <ShoppingBag size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy">
                  {stats.pendingOrders}
                </p>
                <p className="text-sm text-gray-500">
                  {t("common.pendingOrders")}
                </p>
              </div>
            </div>

            {/* Pending Inquiries */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <MessageSquare size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy">
                  {stats.newInquiriesToday}
                </p>
                <p className="text-sm text-gray-500">
                  {t("common.pendingInquiries")}
                </p>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Quick Links */}
            <div className="space-y-3">
              <Link
                to="/orders"
                className="flex items-center gap-1 text-teal hover:text-teal/80 text-sm font-medium transition-colors"
              >
                {t("common.goToOrders")} <ArrowRight size={14} />
              </Link>
              <Link
                to="/inquiries"
                className="flex items-center gap-1 text-teal hover:text-teal/80 text-sm font-medium transition-colors"
              >
                {t("common.goToInquiries")} <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Bottom Row */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={itemVariants}
      >
        {/* Recent Orders */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-navy">
              {t("common.recentOrders")}
            </h3>
            <Link
              to="/orders"
              className="text-sm font-medium text-teal hover:text-teal/80 transition-colors"
            >
              {t("common.viewAll")}
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                    {t("common.orderId")}
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                    {t("common.customer")}
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                    {t("common.total")}
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                    {t("common.status")}
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                    {t("common.date")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="py-3 text-sm text-teal font-medium">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 text-sm text-gray-700">
                      {order.customer?.name || "—"}
                    </td>
                    <td className="py-3 text-sm text-gray-700">
                      {formatCurrency(order.grandTotal)}
                    </td>
                    <td className="py-3">
                      <StatusBadge status={order.status} type="order" />
                    </td>
                    <td className="py-3 text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Latest Inquiries */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-navy">
              {t("common.latestInquiries")}
            </h3>
            <Link
              to="/inquiries"
              className="text-sm font-medium text-teal hover:text-teal/80 transition-colors"
            >
              {t("common.viewAll")}
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {inquiries.slice(0, 5).map((inquiry) => (
              <div
                key={inquiry.id}
                className="flex items-center justify-between py-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900">
                      {inquiry.name}
                    </p>
                    <Badge variant="teal">{inquiry.inquiryType}</Badge>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {truncate(inquiry.message, 50)}
                  </p>
                </div>
                <div className="ml-4 flex flex-col items-end gap-1 shrink-0">
                  <span className="text-xs text-gray-500">
                    {formatDate(inquiry.createdAt)}
                  </span>
                  <StatusBadge status={inquiry.status} type="inquiry" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
