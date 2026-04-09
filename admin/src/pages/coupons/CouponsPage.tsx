import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { createColumnHelper } from "@tanstack/react-table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Coupon } from "@/types";
import { MOCK_COUPONS } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import DataTable from "@/components/common/DataTable";
import Badge from "@/components/common/Badge";
import SearchInput from "@/components/common/SearchInput";
import Breadcrumb from "@/components/common/Breadcrumb";
import Button from "@/components/common/Button";
import ConfirmDialog from "@/components/common/ConfirmDialog";

/* ------------------------------------------------------------------ */
/*  Animation variants                                                */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function getCouponStatusBadge(coupon: Coupon) {
  const now = new Date();
  const end = new Date(coupon.endDate);

  if (!coupon.isActive) {
    return <Badge variant="default">Inactive</Badge>;
  }
  if (end < now) {
    return <Badge variant="error">Expired</Badge>;
  }
  return <Badge variant="success">Active</Badge>;
}

/* ------------------------------------------------------------------ */
/*  Columns                                                           */
/* ------------------------------------------------------------------ */

const columnHelper = createColumnHelper<Coupon>();

const buildColumns = (onDelete: (coupon: Coupon) => void) => [
  columnHelper.accessor("code", {
    header: "Code",
    cell: (info) => (
      <span className="font-mono font-medium text-teal">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("type", {
    header: "Type",
    cell: (info) => (
      <Badge variant={info.getValue() === "percentage" ? "teal" : "info"}>
        {info.getValue() === "percentage" ? "Percentage" : "Fixed Amount"}
      </Badge>
    ),
  }),
  columnHelper.accessor("value", {
    header: "Value",
    cell: (info) =>
      info.row.original.type === "percentage"
        ? `${info.getValue()}%`
        : formatCurrency(info.getValue()),
  }),
  columnHelper.display({
    id: "usage",
    header: "Usage",
    cell: (info) => {
      const c = info.row.original;
      return (
        <span className="text-sm">
          {c.usedCount}/{c.usageLimit ?? "∞"}
        </span>
      );
    },
  }),
  columnHelper.display({
    id: "validPeriod",
    header: "Valid Period",
    cell: (info) => {
      const c = info.row.original;
      return (
        <span className="text-sm text-gray-600">
          {formatDate(c.startDate)} – {formatDate(c.endDate)}
        </span>
      );
    },
  }),
  columnHelper.display({
    id: "status",
    header: "Status",
    cell: (info) => getCouponStatusBadge(info.row.original),
  }),
  columnHelper.display({
    id: "actions",
    header: "",
    cell: (info) => (
      <div className="flex items-center gap-1">
        <Link
          to={`/coupons/${info.row.original.id}/edit`}
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-teal hover:bg-gray-100 transition"
        >
          <Pencil size={16} />
        </Link>
        <button
          onClick={() => onDelete(info.row.original)}
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
        >
          <Trash2 size={16} />
        </button>
      </div>
    ),
  }),
];

/* ------------------------------------------------------------------ */
/*  Page component                                                    */
/* ------------------------------------------------------------------ */

export default function CouponsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);

  const filteredCoupons = useMemo(() => {
    if (!searchTerm.trim()) return MOCK_COUPONS;
    const term = searchTerm.toLowerCase();
    return MOCK_COUPONS.filter((c) => c.code.toLowerCase().includes(term));
  }, [searchTerm]);

  const handleDelete = () => {
    // Mock: In a real app, call API to delete coupon
    setDeleteTarget(null);
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Breadcrumb */}
      <motion.div variants={itemVariants}>
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Coupons & Promos" },
          ]}
        />
      </motion.div>

      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex justify-between items-center mb-6 mt-4"
      >
        <h1 className="text-2xl font-bold text-navy">Coupons &amp; Promos</h1>
        <div className="flex items-center gap-3">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by code…"
          />
          <Link to="/coupons/create">
            <Button leftIcon={<Plus size={18} />}>Create Coupon</Button>
          </Link>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants}>
        <DataTable
          columns={buildColumns(setDeleteTarget)}
          data={filteredCoupons}
          emptyMessage="No coupons found"
        />
      </motion.div>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Coupon"
        message={`Are you sure you want to delete the coupon "${deleteTarget?.code}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </motion.div>
  );
}
