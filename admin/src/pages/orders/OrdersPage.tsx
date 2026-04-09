import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { createColumnHelper } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import type { Order, OrderStatus } from "@/types";
import { MOCK_ORDERS } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import DataTable from "@/components/common/DataTable";
import StatusBadge from "@/components/common/StatusBadge";
import SearchInput from "@/components/common/SearchInput";
import Breadcrumb from "@/components/common/Breadcrumb";

const columnHelper = createColumnHelper<Order>();

const columns = [
  columnHelper.accessor("orderNumber", {
    header: "Order #",
    cell: (info) => (
      <Link
        to={`/orders/${info.row.original.id}`}
        className="text-teal font-medium hover:underline"
      >
        {info.getValue()}
      </Link>
    ),
  }),
  columnHelper.accessor("customer", {
    header: "Customer",
    cell: (info) => {
      const customer = info.getValue();
      return (
        <div>
          <div className="font-medium text-gray-900">{customer.name}</div>
          <div className="text-xs text-gray-500">{customer.email}</div>
        </div>
      );
    },
  }),
  columnHelper.accessor("items", {
    header: "Items",
    cell: (info) => `${info.getValue().length} items`,
  }),
  columnHelper.accessor("grandTotal", {
    header: "Total",
    cell: (info) => (
      <span className="font-semibold">{formatCurrency(info.getValue())}</span>
    ),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => <StatusBadge status={info.getValue()} type="order" />,
  }),
  columnHelper.accessor("payment", {
    header: "Payment",
    cell: (info) => (
      <StatusBadge status={info.getValue().status} type="payment" />
    ),
  }),
  columnHelper.accessor("createdAt", {
    header: "Date",
    cell: (info) => formatDate(info.getValue()),
  }),
  columnHelper.display({
    id: "actions",
    header: "",
    cell: (info) => (
      <Link
        to={`/orders/${info.row.original.id}`}
        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-teal hover:bg-gray-100 transition"
      >
        <Eye size={16} />
      </Link>
    ),
  }),
];

type FilterTab = "all" | OrderStatus;

const FILTER_TABS: { label: string; value: FilterTab }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending_payment" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

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

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");

  const filteredOrders = useMemo(() => {
    let orders: Order[] = MOCK_ORDERS;

    if (activeFilter !== "all") {
      orders = orders.filter((o) => o.status === activeFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      orders = orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(term) ||
          o.customer.name.toLowerCase().includes(term),
      );
    }

    return orders;
  }, [activeFilter, searchTerm]);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <Breadcrumb
          items={[{ label: "Dashboard", href: "/" }, { label: "Orders" }]}
        />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex justify-between items-center mb-6 mt-4"
      >
        <h1 className="text-2xl font-bold text-navy">Orders</h1>
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search orders…"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="flex gap-2 mb-6">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              activeFilter === tab.value
                ? "bg-teal text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable
          columns={columns}
          data={filteredOrders}
          emptyMessage="No orders found"
        />
      </motion.div>
    </motion.div>
  );
}
