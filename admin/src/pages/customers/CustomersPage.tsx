import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { createColumnHelper } from "@tanstack/react-table";
import { Eye, Pencil, Plus } from "lucide-react";
import type { Customer } from "@/types";
import { fetchCustomers } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import DataTable from "@/components/common/DataTable";
import Badge from "@/components/common/Badge";
import SearchInput from "@/components/common/SearchInput";
import Breadcrumb from "@/components/common/Breadcrumb";
import { useLanguage } from "@/context/LanguageContext";

const columnHelper = createColumnHelper<Customer>();

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

export default function CustomersPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: t("common.customer"),
        cell: (info) => (
          <div>
            <Link
              to={`/customers/${info.row.original.id}`}
              className="font-medium text-gray-900 hover:text-teal transition"
            >
              {info.getValue()}
            </Link>
            <div className="text-xs text-gray-500">
              {info.row.original.email}
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("phone", {
        header: t("common.phone"),
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("nationalId", {
        header: t("common.nationalId"),
        cell: (info) => info.getValue() || "—",
      }),
      columnHelper.accessor("ordersCount", {
        header: t("common.orders"),
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("totalSpent", {
        header: t("common.totalSpent"),
        cell: (info) => (
          <span className="font-semibold">
            {formatCurrency(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor("isActive", {
        header: t("common.status"),
        cell: (info) =>
          info.getValue() ? (
            <Badge variant="success">{t("common.active")}</Badge>
          ) : (
            <Badge variant="danger">{t("common.inactive")}</Badge>
          ),
      }),
      columnHelper.accessor("emailVerified", {
        header: t("common.emailVerified"),
        cell: (info) =>
          info.getValue() ? (
            <Badge variant="success">{t("common.verified")}</Badge>
          ) : (
            <Badge variant="warning">{t("common.unverified")}</Badge>
          ),
      }),
      columnHelper.accessor("createdAt", {
        header: t("common.joined"),
        cell: (info) => formatDate(info.getValue()),
      }),
      columnHelper.display({
        id: "actions",
        header: "",
        cell: (info) => (
          <div className="flex items-center gap-1">
            <Link
              to={`/customers/${info.row.original.id}`}
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-teal hover:bg-gray-100 transition"
              aria-label={t("common.viewCustomer")}
            >
              <Eye size={16} />
            </Link>
            <Link
              to={`/customers/${info.row.original.id}/edit`}
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-teal hover:bg-gray-100 transition"
              aria-label={t("common.editCustomer")}
            >
              <Pencil size={16} />
            </Link>
          </div>
        ),
      }),
    ],
    [t],
  );

  useEffect(() => {
    void fetchCustomers("").then((response) => setCustomers(response.data));
  }, []);

  const filteredCustomers = useMemo(() => {
    if (!searchTerm.trim()) return customers;

    const term = searchTerm.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.phone?.toLowerCase().includes(term) ||
        c.nationalId?.toLowerCase().includes(term),
    );
  }, [customers, searchTerm]);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <Breadcrumb
          items={[
            { label: t("common.dashboard"), href: "/" },
            { label: t("common.customers") },
          ]}
        />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex justify-between items-center mb-6 mt-4"
      >
        <h1 className="text-2xl font-bold text-navy">
          {t("common.customers")}
        </h1>
        <div className="flex items-center gap-3">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={t("common.searchCustomers")}
          />
          <Link
            to="/customers/create"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-teal px-4 text-sm font-medium text-white transition hover:bg-teal/90"
          >
            <Plus size={16} />
            {t("common.addCustomer")}
          </Link>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable
          columns={columns}
          data={filteredCustomers}
          emptyMessage={t("common.noCustomers")}
        />
      </motion.div>
    </motion.div>
  );
}
