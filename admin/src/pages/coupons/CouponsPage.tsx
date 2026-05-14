import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { createColumnHelper } from "@tanstack/react-table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Coupon } from "@/types";
import { deleteCoupon, fetchCoupons } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import DataTable from "@/components/common/DataTable";
import Badge from "@/components/common/Badge";
import SearchInput from "@/components/common/SearchInput";
import Breadcrumb from "@/components/common/Breadcrumb";
import Button from "@/components/common/Button";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useLanguage } from "@/context/LanguageContext";

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

function getCouponStatusBadge(coupon: Coupon, t: (key: string) => string) {
  const now = new Date();
  const end = new Date(coupon.endDate);

  if (!coupon.isActive) {
    return <Badge variant="default">{t("common.inactive")}</Badge>;
  }
  if (end < now) {
    return <Badge variant="error">{t("common.expired")}</Badge>;
  }
  return <Badge variant="success">{t("common.active")}</Badge>;
}

/* ------------------------------------------------------------------ */
/*  Columns                                                           */
/* ------------------------------------------------------------------ */

const columnHelper = createColumnHelper<Coupon>();

const buildColumns = (
  onDelete: (coupon: Coupon) => void,
  t: (key: string) => string,
) => [
  columnHelper.accessor("code", {
    header: t("common.code"),
    cell: (info) => (
      <span className="font-mono font-medium text-teal">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("type", {
    header: t("common.type"),
    cell: (info) => (
      <Badge variant={info.getValue() === "percentage" ? "teal" : "info"}>
        {info.getValue() === "percentage"
          ? t("common.percentage")
          : t("common.fixedAmount")}
      </Badge>
    ),
  }),
  columnHelper.accessor("value", {
    header: t("common.value"),
    cell: (info) =>
      info.row.original.type === "percentage"
        ? `${info.getValue()}%`
        : formatCurrency(info.getValue()),
  }),
  columnHelper.display({
    id: "usage",
    header: t("common.usage"),
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
    header: t("common.validPeriod"),
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
    header: t("common.status"),
    cell: (info) => getCouponStatusBadge(info.row.original, t),
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
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    void fetchCoupons().then((response) => setCoupons(response.data));
  }, []);

  const filteredCoupons = useMemo(() => {
    if (!searchTerm.trim()) return coupons;
    const term = searchTerm.toLowerCase();
    return coupons.filter((c) => c.code.toLowerCase().includes(term));
  }, [coupons, searchTerm]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteCoupon(deleteTarget.id);
    setCoupons((current) =>
      current.filter((coupon) => coupon.id !== deleteTarget.id),
    );
    setDeleteTarget(null);
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Breadcrumb */}
      <motion.div variants={itemVariants}>
        <Breadcrumb
          items={[
            { label: t("common.dashboard"), href: "/" },
            { label: t("common.couponsPromos") },
          ]}
        />
      </motion.div>

      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex justify-between items-center mb-6 mt-4"
      >
        <h1 className="text-2xl font-bold text-navy">
          {t("common.couponsPromos")}
        </h1>
        <div className="flex items-center gap-3">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={t("common.searchByCode")}
          />
          <Link to="/coupons/create">
            <Button leftIcon={<Plus size={18} />}>
              {t("common.createCoupon")}
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants}>
        <DataTable
          columns={buildColumns(setDeleteTarget, t)}
          data={filteredCoupons}
          emptyMessage={t("common.noCoupons")}
        />
      </motion.div>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={t("common.deleteCoupon")}
        message={t("common.deleteCouponConfirm")}
        confirmLabel={t("common.delete")}
        variant="danger"
      />
    </motion.div>
  );
}
