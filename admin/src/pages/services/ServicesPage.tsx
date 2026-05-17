import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { createColumnHelper } from "@tanstack/react-table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Service } from "@/types";
import { deleteService, fetchServices } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import DataTable from "@/components/common/DataTable";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import SearchInput from "@/components/common/SearchInput";
import Breadcrumb from "@/components/common/Breadcrumb";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useLanguage } from "@/context/LanguageContext";
import { localizedSearchText, localizedValue } from "@/lib/localization";

/* ── Helpers ──────────────────────────────────────────── */

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + "…" : str;
}

function getTypeVariant(typeName: string) {
  const map: Record<string, "teal" | "info" | "warning" | "purple"> = {
    Installation: "teal",
    Maintenance: "info",
    Repair: "warning",
    Consultation: "purple",
  };
  return map[typeName] ?? ("default" as const);
}

/* ── Table Columns ────────────────────────────────────── */

const columnHelper = createColumnHelper<Service>();

/* ── Filter Tabs ──────────────────────────────────────── */

type FilterTab =
  | "all"
  | "installation"
  | "maintenance"
  | "repair"
  | "consultation";

const FILTER_TABS: { labelKey: string; value: FilterTab }[] = [
  { labelKey: "common.all", value: "all" },
  { labelKey: "common.installation", value: "installation" },
  { labelKey: "common.maintenance", value: "maintenance" },
  { labelKey: "common.repair", value: "repair" },
  { labelKey: "common.consultation", value: "consultation" },
];

/* ── Animation Variants ───────────────────────────────── */

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

/* ── Component ────────────────────────────────────────── */

export default function ServicesPage() {
  const { language, t, localize } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [deletingService, setDeletingService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    void fetchServices().then((response) => setServices(response.data));
  }, []);

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: t("common.service"),
        cell: (info) => {
          const service = info.row.original;
          return (
            <div>
              <Link
                to={`/services/${service.id}/edit`}
                className="font-medium text-gray-900 hover:text-teal transition"
              >
                {localizedValue(language, service.name, service.nameAr)}
              </Link>
              <div className="mt-0.5">
                <Badge variant={getTypeVariant(service.type.name)}>
                  {localize(service.type.name, service.type.nameAr)}
                </Badge>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor("description", {
        header: t("common.description"),
        cell: (info) => {
          const service = info.row.original;
          return (
            <span className="text-gray-500">
              {truncate(
                localizedValue(
                  language,
                  service.description,
                  service.descriptionAr,
                ),
                60,
              )}
            </span>
          );
        },
      }),
      columnHelper.accessor("price", {
        header: t("common.price"),
        cell: (info) => {
          const price = info.getValue();
          return price != null ? (
            <span className="font-semibold">EGP {price.toLocaleString()}</span>
          ) : (
            <span className="text-gray-400">-</span>
          );
        },
      }),
      columnHelper.accessor("isActive", {
        header: t("common.status"),
        cell: (info) => (
          <Badge variant={info.getValue() ? "success" : "default"}>
            {info.getValue() ? t("common.active") : t("common.inactive")}
          </Badge>
        ),
      }),
      columnHelper.accessor("createdAt", {
        header: t("common.date"),
        cell: (info) => formatDate(info.getValue() ?? ""),
      }),
      columnHelper.display({
        id: "actions",
        header: "",
        cell: (info) => {
          const service = info.row.original;
          return (
            <div className="flex items-center gap-1">
              <Link
                to={`/services/${service.id}/edit`}
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-teal hover:bg-gray-100 transition"
              >
                <Pencil size={16} />
              </Link>
              <button
                type="button"
                onClick={() => setDeletingService(service)}
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        },
      }),
    ],
    [language, localize, t],
  );

  const filteredServices = useMemo(() => {
    let result: Service[] = services;

    if (activeFilter !== "all") {
      result = result.filter(
        (s) => s.type.name.toLowerCase() === activeFilter,
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((s) =>
        localizedSearchText(
          s.name,
          s.nameAr,
          s.description,
          s.descriptionAr,
          s.type.name,
        ).includes(term),
      );
    }

    return result;
  }, [activeFilter, services, searchTerm]);

  const confirmDeleteService = async () => {
    if (!deletingService) return;
    await deleteService(deletingService.id);
    setServices((current) =>
      current.filter((service) => service.id !== deletingService.id),
    );
    setDeletingService(null);
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <Breadcrumb
          items={[
            { label: t("common.dashboard"), href: "/" },
            { label: t("common.services") },
          ]}
        />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex justify-between items-center mb-6 mt-4"
      >
        <h1 className="text-2xl font-bold text-navy">
          {t("common.services")}
        </h1>
        <div className="flex items-center gap-3">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={t("common.searchServices")}
          />
          <Link to="/services/create">
            <Button leftIcon={<Plus size={18} />}>
              {t("common.addService")}
            </Button>
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
          data={filteredServices}
          emptyMessage={t("common.noServices")}
        />
      </motion.div>

      <ConfirmDialog
        isOpen={!!deletingService}
        onClose={() => setDeletingService(null)}
        onConfirm={confirmDeleteService}
        title={t("common.deleteService")}
        message={t("common.deleteServiceConfirm")}
        confirmLabel={t("common.delete")}
        variant="danger"
      />
    </motion.div>
  );
}
