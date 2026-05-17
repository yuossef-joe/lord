import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { createColumnHelper } from "@tanstack/react-table";
import { Plus, Truck } from "lucide-react";
import {
  createShippingMethod,
  createShippingZone,
  fetchShippingMethods,
  fetchShippingZones,
} from "@/lib/api";
import Breadcrumb from "@/components/common/Breadcrumb";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import DataTable from "@/components/common/DataTable";
import Badge from "@/components/common/Badge";
import Modal from "@/components/common/Modal";
import FormField from "@/components/common/FormField";
import { useLanguage } from "@/context/LanguageContext";

interface ShippingZone {
  id: string;
  name: string;
  governorates: string[];
  cities: string[];
  fee: number;
  freeShippingThreshold?: number;
  estimatedDaysMin?: number;
  estimatedDaysMax?: number;
  isActive: boolean;
}

interface ShippingMethod {
  id: string;
  name: string;
  code: string;
  description?: string;
  feeModifier: number;
  estimatedLabel?: string;
  isRecommended: boolean;
  isActive: boolean;
}

interface ZoneFormValues {
  name: string;
  governorates: string;
  cities: string;
  fee: number;
  freeShippingThreshold?: number;
  estimatedDaysMin?: number;
  estimatedDaysMax?: number;
  isActive: boolean;
}

interface MethodFormValues {
  name: string;
  code: string;
  description: string;
  feeModifier: number;
  estimatedLabel: string;
  isRecommended: boolean;
  isActive: boolean;
}

const inputStyles =
  "w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-teal focus:border-teal outline-none transition bg-white";
const zoneColumnHelper = createColumnHelper<ShippingZone>();
const methodColumnHelper = createColumnHelper<ShippingMethod>();

function numberOrUndefined(value: unknown) {
  if (value == null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function normalizeZone(zone: Record<string, unknown>): ShippingZone {
  return {
    id: String(zone.id ?? ""),
    name: String(zone.name ?? ""),
    governorates: Array.isArray(zone.governorates)
      ? zone.governorates.map(String)
      : [],
    cities: Array.isArray(zone.cities) ? zone.cities.map(String) : [],
    fee: Number(zone.fee ?? 0),
    freeShippingThreshold: numberOrUndefined(zone.freeShippingThreshold),
    estimatedDaysMin: numberOrUndefined(zone.estimatedDaysMin),
    estimatedDaysMax: numberOrUndefined(zone.estimatedDaysMax),
    isActive: Boolean(zone.isActive),
  };
}

function normalizeMethod(method: Record<string, unknown>): ShippingMethod {
  return {
    id: String(method.id ?? ""),
    name: String(method.name ?? ""),
    code: String(method.code ?? ""),
    description:
      method.description == null ? undefined : String(method.description),
    feeModifier: Number(method.feeModifier ?? 0),
    estimatedLabel:
      method.estimatedLabel == null ? undefined : String(method.estimatedLabel),
    isRecommended: Boolean(method.isRecommended),
    isActive: Boolean(method.isActive),
  };
}

export default function ShippingPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"zones" | "methods">("zones");
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [methods, setMethods] = useState<ShippingMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [zoneModalOpen, setZoneModalOpen] = useState(false);
  const [methodModalOpen, setMethodModalOpen] = useState(false);

  const zoneForm = useForm<ZoneFormValues>({
    defaultValues: {
      name: "",
      governorates: "",
      cities: "",
      fee: 0,
      freeShippingThreshold: undefined,
      estimatedDaysMin: undefined,
      estimatedDaysMax: undefined,
      isActive: true,
    },
  });
  const methodForm = useForm<MethodFormValues>({
    defaultValues: {
      name: "",
      code: "",
      description: "",
      feeModifier: 0,
      estimatedLabel: "",
      isRecommended: false,
      isActive: true,
    },
  });

  const loadShipping = async () => {
    setIsLoading(true);
    try {
      const [zonesResponse, methodsResponse] = await Promise.all([
        fetchShippingZones(),
        fetchShippingMethods(),
      ]);
      setZones(
        zonesResponse.data.map((zone) =>
          normalizeZone(zone as Record<string, unknown>),
        ),
      );
      setMethods(
        methodsResponse.data.map((method) =>
          normalizeMethod(method as Record<string, unknown>),
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadShipping();
  }, []);

  const formatZoneEstimate = (zone: ShippingZone) =>
    zone.estimatedDaysMin != null && zone.estimatedDaysMax != null
      ? `${zone.estimatedDaysMin}-${zone.estimatedDaysMax} ${t("shipping.businessDays")}`
      : "—";

  const zoneColumns = useMemo(
    () => [
      zoneColumnHelper.accessor("name", { header: t("shipping.zone") }),
      zoneColumnHelper.accessor("governorates", {
        header: t("shipping.governorates"),
        cell: (info) => info.getValue().join(", "),
      }),
      zoneColumnHelper.accessor("fee", {
        header: t("shipping.fee"),
        cell: (info) => `EGP ${info.getValue().toLocaleString()}`,
      }),
      zoneColumnHelper.accessor("freeShippingThreshold", {
        header: t("shipping.freeFrom"),
        cell: (info) =>
          info.getValue() ? `EGP ${info.getValue()!.toLocaleString()}` : "—",
      }),
      zoneColumnHelper.display({
        id: "estimate",
        header: t("shipping.estimate"),
        cell: (info) => formatZoneEstimate(info.row.original),
      }),
      zoneColumnHelper.accessor("isActive", {
        header: t("common.status"),
        cell: (info) =>
          info.getValue() ? (
            <Badge variant="success">{t("shipping.active")}</Badge>
          ) : (
            <Badge variant="warning">{t("shipping.disabled")}</Badge>
          ),
      }),
    ],
    [t],
  );

  const methodColumns = useMemo(
    () => [
      methodColumnHelper.accessor("name", { header: t("shipping.method") }),
      methodColumnHelper.accessor("code", { header: t("common.code") }),
      methodColumnHelper.accessor("description", {
        header: t("common.description"),
      }),
      methodColumnHelper.accessor("estimatedLabel", {
        header: t("shipping.estimate"),
        cell: (info) => info.getValue() || "—",
      }),
      methodColumnHelper.accessor("isRecommended", {
        header: t("shipping.default"),
        cell: (info) =>
          info.getValue() ? (
            <Badge variant="info">{t("shipping.recommended")}</Badge>
          ) : (
            "—"
          ),
      }),
      methodColumnHelper.accessor("isActive", {
        header: t("common.status"),
        cell: (info) =>
          info.getValue() ? (
            <Badge variant="success">{t("shipping.active")}</Badge>
          ) : (
            <Badge variant="warning">{t("shipping.disabled")}</Badge>
          ),
      }),
    ],
    [t],
  );

  const onZoneSubmit = zoneForm.handleSubmit(async (data) => {
    await createShippingZone({
      name: data.name,
      governorates: data.governorates
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      cities: data.cities
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      fee: data.fee,
      freeShippingThreshold: data.freeShippingThreshold || undefined,
      estimatedDaysMin: data.estimatedDaysMin || undefined,
      estimatedDaysMax: data.estimatedDaysMax || undefined,
      isActive: data.isActive,
    });
    zoneForm.reset();
    setZoneModalOpen(false);
    await loadShipping();
  });

  const onMethodSubmit = methodForm.handleSubmit(async (data) => {
    await createShippingMethod({
      name: data.name,
      code: data.code,
      description: data.description,
      feeModifier: data.feeModifier,
      estimatedLabel: data.estimatedLabel,
      isRecommended: data.isRecommended,
      isActive: data.isActive,
    });
    methodForm.reset();
    setMethodModalOpen(false);
    await loadShipping();
  });

  const activeZones = zones.filter((zone) => zone.isActive).length;
  const activeMethods = methods.filter((method) => method.isActive).length;
  const deliveryRanges = zones
    .filter(
      (zone) =>
        zone.estimatedDaysMin != null && zone.estimatedDaysMax != null,
    )
    .flatMap((zone) => [zone.estimatedDaysMin!, zone.estimatedDaysMax!]);
  const deliveryRange =
    deliveryRanges.length > 0
      ? `${Math.min(...deliveryRanges)}-${Math.max(...deliveryRanges)}`
      : "—";

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <Breadcrumb
        items={[
          { label: t("common.dashboard"), href: "/" },
          { label: t("common.shipping") },
        ]}
      />

      <div className="mb-6 mt-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">{t("common.shipping")}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {t("shipping.description")}
          </p>
        </div>
        <Button
          leftIcon={<Plus size={16} />}
          onClick={() =>
            activeTab === "zones"
              ? setZoneModalOpen(true)
              : setMethodModalOpen(true)
          }
        >
          {activeTab === "zones"
            ? t("shipping.addZone")
            : t("shipping.addMethod")}
        </Button>
      </div>

      <Card className="mb-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 p-4">
            <Truck className="mb-2 h-5 w-5 text-teal" />
            <div className="text-2xl font-bold text-navy">{activeZones}</div>
            <div className="text-sm text-gray-500">{t("shipping.activeZones")}</div>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <Truck className="mb-2 h-5 w-5 text-teal" />
            <div className="text-2xl font-bold text-navy">{activeMethods}</div>
            <div className="text-sm text-gray-500">{t("shipping.methods")}</div>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <Truck className="mb-2 h-5 w-5 text-teal" />
            <div className="text-2xl font-bold text-navy">{deliveryRange}</div>
            <div className="text-sm text-gray-500">
              {t("shipping.estimatedDeliveryDays")}
            </div>
          </div>
        </div>
      </Card>

      <div className="mb-6 flex gap-2">
        {[
          ["zones", t("shipping.zones")],
          ["methods", t("shipping.methods")],
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
        <DataTable
          columns={zoneColumns}
          data={zones}
          isLoading={isLoading}
          emptyMessage={t("shipping.noZones")}
        />
      ) : (
        <DataTable
          columns={methodColumns}
          data={methods}
          isLoading={isLoading}
          emptyMessage={t("shipping.noMethods")}
        />
      )}

      <Modal
        isOpen={zoneModalOpen}
        onClose={() => setZoneModalOpen(false)}
        title={t("shipping.addZone")}
      >
        <form onSubmit={onZoneSubmit} className="space-y-4">
          <FormField label={t("common.name")} required>
            <input {...zoneForm.register("name", { required: true })} className={inputStyles} />
          </FormField>
          <FormField label={t("shipping.governorates")} required>
            <input
              {...zoneForm.register("governorates", { required: true })}
              className={inputStyles}
              placeholder={t("shipping.commaSeparated")}
            />
          </FormField>
          <FormField label={t("shipping.cities")}>
            <input
              {...zoneForm.register("cities")}
              className={inputStyles}
              placeholder={t("shipping.commaSeparated")}
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label={t("shipping.fee")} required>
              <input type="number" {...zoneForm.register("fee", { valueAsNumber: true })} className={inputStyles} />
            </FormField>
            <FormField label={t("shipping.freeFrom")}>
              <input type="number" {...zoneForm.register("freeShippingThreshold", { valueAsNumber: true })} className={inputStyles} />
            </FormField>
            <FormField label={t("shipping.minDays")}>
              <input type="number" {...zoneForm.register("estimatedDaysMin", { valueAsNumber: true })} className={inputStyles} />
            </FormField>
            <FormField label={t("shipping.maxDays")}>
              <input type="number" {...zoneForm.register("estimatedDaysMax", { valueAsNumber: true })} className={inputStyles} />
            </FormField>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...zoneForm.register("isActive")} />
            {t("shipping.active")}
          </label>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setZoneModalOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit">{t("common.save")}</Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={methodModalOpen}
        onClose={() => setMethodModalOpen(false)}
        title={t("shipping.addMethod")}
      >
        <form onSubmit={onMethodSubmit} className="space-y-4">
          <FormField label={t("common.name")} required>
            <input {...methodForm.register("name", { required: true })} className={inputStyles} />
          </FormField>
          <FormField label={t("common.code")} required>
            <input {...methodForm.register("code", { required: true })} className={inputStyles} />
          </FormField>
          <FormField label={t("common.description")}>
            <input {...methodForm.register("description")} className={inputStyles} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label={t("shipping.feeModifier")}>
              <input type="number" {...methodForm.register("feeModifier", { valueAsNumber: true })} className={inputStyles} />
            </FormField>
            <FormField label={t("shipping.estimate")}>
              <input {...methodForm.register("estimatedLabel")} className={inputStyles} />
            </FormField>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...methodForm.register("isRecommended")} />
            {t("shipping.recommended")}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...methodForm.register("isActive")} />
            {t("shipping.active")}
          </label>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setMethodModalOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit">{t("common.save")}</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
