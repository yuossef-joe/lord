import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { createColumnHelper } from "@tanstack/react-table";
import { Plus, Truck } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import DataTable from "@/components/common/DataTable";
import Badge from "@/components/common/Badge";

interface ShippingZone {
  id: string;
  name: string;
  governorates: string[];
  fee: number;
  freeShippingThreshold?: number;
  estimatedDelivery: string;
  isActive: boolean;
}

interface ShippingMethod {
  id: string;
  name: string;
  code: string;
  description: string;
  estimatedDelivery: string;
  isRecommended: boolean;
  isActive: boolean;
}

const zones: ShippingZone[] = [
  {
    id: "zone-cairo",
    name: "Greater Cairo",
    governorates: ["Cairo", "Giza", "Qalyubia"],
    fee: 150,
    freeShippingThreshold: 50000,
    estimatedDelivery: "2-5 business days",
    isActive: true,
  },
  {
    id: "zone-coastal",
    name: "Coastal Cities",
    governorates: ["Alexandria", "Port Said", "Suez"],
    fee: 250,
    freeShippingThreshold: 70000,
    estimatedDelivery: "3-6 business days",
    isActive: true,
  },
];

const methods: ShippingMethod[] = [
  {
    id: "delivery",
    name: "Home Delivery",
    code: "delivery",
    description: "Delivered to the customer's selected address",
    estimatedDelivery: "2-5 business days",
    isRecommended: true,
    isActive: true,
  },
  {
    id: "installation-bundle",
    name: "Delivery + Installation",
    code: "installation_bundle",
    description: "Recommended for AC units that need Lord installation",
    estimatedDelivery: "Scheduled with installation team",
    isRecommended: false,
    isActive: true,
  },
];

const zoneColumnHelper = createColumnHelper<ShippingZone>();
const methodColumnHelper = createColumnHelper<ShippingMethod>();

export default function ShippingPage() {
  const [activeTab, setActiveTab] = useState<"zones" | "methods">("zones");

  const zoneColumns = useMemo(
    () => [
      zoneColumnHelper.accessor("name", { header: "Zone" }),
      zoneColumnHelper.accessor("governorates", {
        header: "Governorates",
        cell: (info) => info.getValue().join(", "),
      }),
      zoneColumnHelper.accessor("fee", {
        header: "Fee",
        cell: (info) => `EGP ${info.getValue().toLocaleString()}`,
      }),
      zoneColumnHelper.accessor("freeShippingThreshold", {
        header: "Free From",
        cell: (info) =>
          info.getValue() ? `EGP ${info.getValue()!.toLocaleString()}` : "—",
      }),
      zoneColumnHelper.accessor("estimatedDelivery", { header: "Estimate" }),
      zoneColumnHelper.accessor("isActive", {
        header: "Status",
        cell: (info) =>
          info.getValue() ? (
            <Badge variant="success">Active</Badge>
          ) : (
            <Badge variant="warning">Disabled</Badge>
          ),
      }),
    ],
    [],
  );

  const methodColumns = useMemo(
    () => [
      methodColumnHelper.accessor("name", { header: "Method" }),
      methodColumnHelper.accessor("code", { header: "Code" }),
      methodColumnHelper.accessor("description", { header: "Description" }),
      methodColumnHelper.accessor("estimatedDelivery", { header: "Estimate" }),
      methodColumnHelper.accessor("isRecommended", {
        header: "Default",
        cell: (info) =>
          info.getValue() ? <Badge variant="info">Recommended</Badge> : "—",
      }),
      methodColumnHelper.accessor("isActive", {
        header: "Status",
        cell: (info) =>
          info.getValue() ? (
            <Badge variant="success">Active</Badge>
          ) : (
            <Badge variant="warning">Disabled</Badge>
          ),
      }),
    ],
    [],
  );

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <Breadcrumb
        items={[{ label: "Dashboard", href: "/" }, { label: "Shipping" }]}
      />

      <div className="mb-6 mt-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Shipping</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage customer-friendly delivery zones, rates, and methods.
          </p>
        </div>
        <Button leftIcon={<Plus size={16} />}>
          Add {activeTab === "zones" ? "Zone" : "Method"}
        </Button>
      </div>

      <Card className="mb-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 p-4">
            <Truck className="mb-2 h-5 w-5 text-teal" />
            <div className="text-2xl font-bold text-navy">{zones.length}</div>
            <div className="text-sm text-gray-500">Active zones</div>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <Truck className="mb-2 h-5 w-5 text-teal" />
            <div className="text-2xl font-bold text-navy">{methods.length}</div>
            <div className="text-sm text-gray-500">Shipping methods</div>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <Truck className="mb-2 h-5 w-5 text-teal" />
            <div className="text-2xl font-bold text-navy">2-6</div>
            <div className="text-sm text-gray-500">Estimated delivery days</div>
          </div>
        </div>
      </Card>

      <div className="mb-6 flex gap-2">
        {[
          ["zones", "Shipping Zones"],
          ["methods", "Shipping Methods"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as "zones" | "methods")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === key
                ? "bg-teal text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === "zones" ? (
        <DataTable columns={zoneColumns} data={zones} emptyMessage="No zones" />
      ) : (
        <DataTable
          columns={methodColumns}
          data={methods}
          emptyMessage="No shipping methods"
        />
      )}
    </motion.div>
  );
}
