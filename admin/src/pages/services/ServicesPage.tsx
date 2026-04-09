import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { createColumnHelper } from "@tanstack/react-table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Service } from "@/types";
import { MOCK_SERVICES } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import DataTable from "@/components/common/DataTable";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import SearchInput from "@/components/common/SearchInput";
import Breadcrumb from "@/components/common/Breadcrumb";
import ConfirmDialog from "@/components/common/ConfirmDialog";

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

const columns = [
  columnHelper.accessor("name", {
    header: "Service",
    cell: (info) => {
      const service = info.row.original;
      return (
        <div>
          <Link
            to={`/services/${service.id}/edit`}
            className="font-medium text-gray-900 hover:text-teal transition"
          >
            {service.name}
          </Link>
          <div className="mt-0.5">
            <Badge variant={getTypeVariant(service.type.name)}>
              {service.type.name}
            </Badge>
          </div>
        </div>
      );
    },
  }),
  columnHelper.accessor("description", {
    header: "Description",
    cell: (info) => (
      <span className="text-gray-500">
        {truncate(info.getValue() ?? "", 60)}
      </span>
    ),
  }),
  columnHelper.accessor("price", {
    header: "Price",
    cell: (info) => {
      const price = info.getValue();
      return price != null ? (
        <span className="font-semibold">EGP {price.toLocaleString()}</span>
      ) : (
        <span className="text-gray-400">—</span>
      );
    },
  }),
  columnHelper.accessor("isActive", {
    header: "Status",
    cell: (info) => (
      <Badge variant={info.getValue() ? "success" : "default"}>
        {info.getValue() ? "Active" : "Inactive"}
      </Badge>
    ),
  }),
  columnHelper.accessor("createdAt", {
    header: "Date",
    cell: (info) => formatDate(info.getValue()),
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
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
          >
            <Trash2 size={16} />
          </button>
        </div>
      );
    },
  }),
];

/* ── Filter Tabs ──────────────────────────────────────── */

type FilterTab =
  | "all"
  | "installation"
  | "maintenance"
  | "repair"
  | "consultation";

const FILTER_TABS: { label: string; value: FilterTab }[] = [
  { label: "All", value: "all" },
  { label: "Installation", value: "installation" },
  { label: "Maintenance", value: "maintenance" },
  { label: "Repair", value: "repair" },
  { label: "Consultation", value: "consultation" },
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
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [deletingService, setDeletingService] = useState<Service | null>(null);

  const filteredServices = useMemo(() => {
    let services: Service[] = MOCK_SERVICES;

    if (activeFilter !== "all") {
      services = services.filter(
        (s) => s.type.name.toLowerCase() === activeFilter,
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      services = services.filter((s) => s.name.toLowerCase().includes(term));
    }

    return services;
  }, [activeFilter, searchTerm]);

  const confirmDeleteService = () => {
    // Mock: delete service
    setDeletingService(null);
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <Breadcrumb
          items={[{ label: "Dashboard", href: "/" }, { label: "Services" }]}
        />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex justify-between items-center mb-6 mt-4"
      >
        <h1 className="text-2xl font-bold text-navy">Services</h1>
        <div className="flex items-center gap-3">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search services…"
          />
          <Link to="/services/create">
            <Button leftIcon={<Plus size={18} />}>Add Service</Button>
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
            {tab.label}
          </button>
        ))}
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable
          columns={columns}
          data={filteredServices}
          emptyMessage="No services found"
        />
      </motion.div>

      <ConfirmDialog
        isOpen={!!deletingService}
        onClose={() => setDeletingService(null)}
        onConfirm={confirmDeleteService}
        title="Delete Service"
        message={`Are you sure you want to delete "${deletingService?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </motion.div>
  );
}
