import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { createColumnHelper } from "@tanstack/react-table";
import { Eye, Pencil, Plus, Archive } from "lucide-react";
import type { Order, OrderStatus } from "@/types";
import { archiveOrder, fetchOrders } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import DataTable from "@/components/common/DataTable";
import StatusBadge from "@/components/common/StatusBadge";
import SearchInput from "@/components/common/SearchInput";
import Breadcrumb from "@/components/common/Breadcrumb";
import { useLanguage } from "@/context/LanguageContext";

const columnHelper = createColumnHelper<Order>();

type FilterTab = "all" | OrderStatus;

const FILTER_TABS: { labelKey: string; value: FilterTab }[] = [
  { labelKey: "common.all", value: "all" },
  { labelKey: "common.pending", value: "pending_payment" },
  { labelKey: "common.confirmed", value: "confirmed" },
  { labelKey: "common.processing", value: "processing" },
  { labelKey: "common.shipped", value: "shipped" },
  { labelKey: "common.delivered", value: "delivered" },
  { labelKey: "common.cancelled", value: "cancelled" },
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
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    void fetchOrders("").then((response) => setOrders(response.data));
  }, []);

  const columns = useMemo(
    () => [
      columnHelper.accessor("orderNumber", {
        header: t("common.orderNumber"),
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
        header: t("common.customer"),
        cell: (info) => {
          const customer = info.getValue();
          return (
            <div>
              <div className="font-medium text-gray-900">
                {customer?.name || "—"}
              </div>
              <div className="text-xs text-gray-500">
                {customer?.email || "—"}
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor("customer.nationalId", {
        header: t("common.nationalId"),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("items", {
        header: t("common.items"),
        cell: (info) => info.getValue().length,
      }),
      columnHelper.accessor("grandTotal", {
        header: t("common.total"),
        cell: (info) => (
          <span className="font-semibold">
            {formatCurrency(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor("status", {
        header: t("common.status"),
        cell: (info) => <StatusBadge status={info.getValue()} type="order" />,
      }),
      columnHelper.accessor("payment", {
        header: t("common.payment"),
        cell: (info) => (
          <StatusBadge status={info.getValue()?.status ?? "pending"} type="payment" />
        ),
      }),
      columnHelper.accessor("createdAt", {
        header: t("common.date"),
        cell: (info) => formatDate(info.getValue()),
      }),
      columnHelper.display({
        id: "actions",
        header: "",
        cell: (info) => (
          <div className="flex items-center gap-1">
            <Link
              to={`/orders/${info.row.original.id}`}
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-teal hover:bg-gray-100 transition"
              aria-label={t("common.viewOrder")}
            >
              <Eye size={16} />
            </Link>
            <Link
              to={`/orders/${info.row.original.id}/edit`}
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-teal hover:bg-gray-100 transition"
              aria-label={t("common.editOrder")}
            >
              <Pencil size={16} />
            </Link>
            <button
              type="button"
              onClick={() => {
                void archiveOrder(info.row.original.id).then(() =>
                  setOrders((current) =>
                    current.filter(
                      (order) => order.id !== info.row.original.id,
                    ),
                  ),
                );
              }}
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
              aria-label={t("common.archiveOrder")}
            >
              <Archive size={16} />
            </button>
          </div>
        ),
      }),
    ],
    [t],
  );

  const filteredOrders = useMemo(() => {
    let result: Order[] = orders;

    if (activeFilter !== "all") {
      result = result.filter((o) => o.status === activeFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(term) ||
          o.customer?.name?.toLowerCase().includes(term) ||
          o.customer?.email?.toLowerCase().includes(term),
      );
    }

    return result;
  }, [activeFilter, orders, searchTerm]);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <Breadcrumb
          items={[
            { label: t("common.dashboard"), href: "/" },
            { label: t("common.orders") },
          ]}
        />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex justify-between items-center mb-6 mt-4"
      >
        <h1 className="text-2xl font-bold text-navy">{t("common.orders")}</h1>
        <div className="flex items-center gap-3">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={t("common.searchOrders")}
          />
          <Link
            to="/orders/create"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-teal px-4 text-sm font-medium text-white transition hover:bg-teal/90"
          >
            <Plus size={16} />
            {t("common.createOrder")}
          </Link>
        </div>
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
            {t(tab.labelKey)}
          </button>
        ))}
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable
          columns={columns}
          data={filteredOrders}
          emptyMessage={t("common.noOrders")}
        />
      </motion.div>
    </motion.div>
  );
}
