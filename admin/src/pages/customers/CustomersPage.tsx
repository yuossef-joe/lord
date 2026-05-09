import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { createColumnHelper } from "@tanstack/react-table";
import { Eye, Pencil, Plus } from "lucide-react";
import type { Customer } from "@/types";
import { MOCK_CUSTOMERS } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import DataTable from "@/components/common/DataTable";
import Badge from "@/components/common/Badge";
import SearchInput from "@/components/common/SearchInput";
import Breadcrumb from "@/components/common/Breadcrumb";

const columnHelper = createColumnHelper<Customer>();

const columns = [
  columnHelper.accessor("name", {
    header: "Customer",
    cell: (info) => (
      <div>
        <Link
          to={`/customers/${info.row.original.id}`}
          className="font-medium text-gray-900 hover:text-teal transition"
        >
          {info.getValue()}
        </Link>
        <div className="text-xs text-gray-500">{info.row.original.email}</div>
      </div>
    ),
  }),
  columnHelper.accessor("phone", {
    header: "Phone",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("nationalId", {
    header: "National ID",
    cell: (info) => info.getValue() || "—",
  }),
  columnHelper.accessor("ordersCount", {
    header: "Orders",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("totalSpent", {
    header: "Total Spent",
    cell: (info) => (
      <span className="font-semibold">{formatCurrency(info.getValue())}</span>
    ),
  }),
  columnHelper.accessor("isActive", {
    header: "Status",
    cell: (info) =>
      info.getValue() ? (
        <Badge variant="success">Active</Badge>
      ) : (
        <Badge variant="danger">Inactive</Badge>
      ),
  }),
  columnHelper.accessor("emailVerified", {
    header: "Email Verified",
    cell: (info) =>
      info.getValue() ? (
        <Badge variant="success">Verified</Badge>
      ) : (
        <Badge variant="warning">Unverified</Badge>
      ),
  }),
  columnHelper.accessor("createdAt", {
    header: "Joined",
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
          aria-label="View customer"
        >
          <Eye size={16} />
        </Link>
        <Link
          to={`/customers/${info.row.original.id}/edit`}
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-teal hover:bg-gray-100 transition"
          aria-label="Edit customer"
        >
          <Pencil size={16} />
        </Link>
      </div>
    ),
  }),
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

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = useMemo(() => {
    if (!searchTerm.trim()) return MOCK_CUSTOMERS;

    const term = searchTerm.toLowerCase();
    return MOCK_CUSTOMERS.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.phone.toLowerCase().includes(term) ||
        c.nationalId?.toLowerCase().includes(term),
    );
  }, [searchTerm]);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <Breadcrumb
          items={[{ label: "Dashboard", href: "/" }, { label: "Customers" }]}
        />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex justify-between items-center mb-6 mt-4"
      >
        <h1 className="text-2xl font-bold text-navy">Customers</h1>
        <div className="flex items-center gap-3">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search customers…"
          />
          <Link
            to="/customers/create"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-teal px-4 text-sm font-medium text-white transition hover:bg-teal/90"
          >
            <Plus size={16} />
            Add Customer
          </Link>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable
          columns={columns}
          data={filteredCustomers}
          emptyMessage="No customers found"
        />
      </motion.div>
    </motion.div>
  );
}
