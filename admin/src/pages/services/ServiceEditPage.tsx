import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { Plus, X, Wand2, Wrench } from "lucide-react";
import { MOCK_SERVICES } from "@/lib/mock-data";
import Breadcrumb from "@/components/common/Breadcrumb";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import FormField from "@/components/common/FormField";
import EmptyState from "@/components/common/EmptyState";

/* ── Schema ───────────────────────────────────────────── */

const serviceSchema = z.object({
  name: z.string().min(1, "Required"),
  slug: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  type: z.enum(["installation", "maintenance", "repair", "consultation"], {
    error: "Required",
  }),
  price: z.number().min(0, "Must be 0 or more"),
  isActive: z.boolean(),
  scopeOfWork: z.string().optional(),
  applicableUnitTypes: z.array(z.object({ value: z.string() })).optional(),
  imageUrl: z.string().optional(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

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

/* ── Styles ───────────────────────────────────────────── */

const inputStyles =
  "w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-teal focus:border-teal outline-none transition bg-white";
const selectStyles =
  "w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-teal focus:border-teal outline-none transition bg-white appearance-none";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

const SERVICE_TYPES = [
  { label: "Installation", value: "installation" },
  { label: "Maintenance", value: "maintenance" },
  { label: "Repair", value: "repair" },
  { label: "Consultation", value: "consultation" },
] as const;

/* ── Component ────────────────────────────────────────── */

export default function ServiceEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const service = MOCK_SERVICES.find((s) => s.id === id);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: service
      ? {
          name: service.name,
          slug: service.slug,
          description: service.description ?? "",
          type: service.type.name.toLowerCase() as ServiceFormValues["type"],
          price: service.price ?? 0,
          isActive: service.isActive,
          scopeOfWork: service.scopeOfWork?.join("\n") ?? "",
          applicableUnitTypes: (service.applicableUnitTypes ?? []).map((v) => ({
            value: v,
          })),
          imageUrl: "",
        }
      : {
          name: "",
          slug: "",
          description: "",
          type: undefined,
          price: 0,
          isActive: true,
          scopeOfWork: "",
          applicableUnitTypes: [],
          imageUrl: "",
        },
  });

  const {
    fields: unitTypeFields,
    append: appendUnitType,
    remove: removeUnitType,
  } = useFieldArray({ control, name: "applicableUnitTypes" });

  const nameValue = watch("name");

  const onSubmit = (_data: ServiceFormValues) => {
    // Mock: update service
    navigate("/services");
  };

  if (!service) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <EmptyState
          icon={<Wrench size={28} />}
          title="Service not found"
          description="The service you're looking for doesn't exist or has been removed."
          action={
            <Button variant="outline" onClick={() => navigate("/services")}>
              Back to Services
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Services", href: "/services" },
            { label: service.name },
          ]}
        />
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center mb-6 mt-4"
        >
          <h1 className="text-2xl font-bold text-navy">Edit Service</h1>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <h2 className="text-lg font-semibold text-navy mb-4">
                Basic Info
              </h2>
              <div className="space-y-4">
                <FormField label="Name" required error={errors.name?.message}>
                  <input
                    {...register("name")}
                    className={inputStyles}
                    placeholder="Service name"
                  />
                </FormField>

                <FormField label="Slug" required error={errors.slug?.message}>
                  <div className="flex gap-2">
                    <input
                      {...register("slug")}
                      className={inputStyles}
                      placeholder="service-slug"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      onClick={() => setValue("slug", slugify(nameValue))}
                      leftIcon={<Wand2 size={16} />}
                    >
                      Generate
                    </Button>
                  </div>
                </FormField>

                <FormField
                  label="Description"
                  required
                  error={errors.description?.message}
                >
                  <textarea
                    {...register("description")}
                    className={`${inputStyles} h-32 resize-none py-2`}
                    placeholder="Service description…"
                  />
                </FormField>

                <FormField label="Type" required error={errors.type?.message}>
                  <select {...register("type")} className={selectStyles}>
                    <option value="">Select type</option>
                    {SERVICE_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>
            </Card>

            {/* Pricing */}
            <Card>
              <h2 className="text-lg font-semibold text-navy mb-4">Pricing</h2>
              <FormField
                label="Price (EGP)"
                required
                error={errors.price?.message}
              >
                <input
                  type="number"
                  {...register("price", { valueAsNumber: true })}
                  className={inputStyles}
                  placeholder="0"
                />
              </FormField>
            </Card>

            {/* Scope of Work */}
            <Card>
              <h2 className="text-lg font-semibold text-navy mb-4">
                Scope of Work
              </h2>
              <FormField
                label="Scope of Work"
                error={errors.scopeOfWork?.message}
              >
                <textarea
                  {...register("scopeOfWork")}
                  className={`${inputStyles} h-32 resize-none py-2`}
                  placeholder="Describe the scope of work…"
                />
              </FormField>
            </Card>

            {/* Applicable Unit Types */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-navy">
                  Applicable Unit Types
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendUnitType({ value: "" })}
                  leftIcon={<Plus size={16} />}
                >
                  Add Type
                </Button>
              </div>
              <div className="space-y-3">
                {unitTypeFields.length === 0 && (
                  <p className="text-sm text-gray-400">
                    No unit types added yet.
                  </p>
                )}
                {unitTypeFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <input
                      {...register(`applicableUnitTypes.${index}.value`)}
                      className={`${inputStyles} flex-1`}
                      placeholder="e.g. Split, Cassette, Central"
                    />
                    <button
                      type="button"
                      onClick={() => removeUnitType(index)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <h2 className="text-lg font-semibold text-navy mb-4">Status</h2>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium text-gray-700">
                  Active
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    {...register("isActive")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-teal transition" />
                  <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition" />
                </div>
              </label>
            </Card>

            {/* Image */}
            <Card>
              <h2 className="text-lg font-semibold text-navy mb-4">Image</h2>
              <FormField label="Image URL" error={errors.imageUrl?.message}>
                <input
                  {...register("imageUrl")}
                  className={inputStyles}
                  placeholder="https://example.com/image.jpg"
                />
              </FormField>
            </Card>
          </div>
        </motion.div>
      </form>
    </motion.div>
  );
}
