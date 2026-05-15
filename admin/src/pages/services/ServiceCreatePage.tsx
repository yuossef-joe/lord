import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { ImagePlus, Plus, X } from "lucide-react";
import type { ServiceType } from "@/types";
import { createService, fetchServiceTypes } from "@/lib/api";
import Breadcrumb from "@/components/common/Breadcrumb";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import FormField from "@/components/common/FormField";

/* ── Schema ───────────────────────────────────────────── */

const serviceSchema = z.object({
  name: z.string().min(1, "Required"),
  nameAr: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  descriptionAr: z.string().min(1, "Required"),
  serviceTypeId: z.string().min(1, "Required"),
  price: z.number().min(0, "Must be 0 or more"),
  isActive: z.boolean(),
  scopeOfWork: z.string().optional(),
  applicableUnitTypes: z.array(z.object({ value: z.string() })).optional(),
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

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/* ── Component ────────────────────────────────────────── */

export default function ServiceCreatePage() {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      nameAr: "",
      description: "",
      descriptionAr: "",
      serviceTypeId: "",
      price: 0,
      isActive: true,
      scopeOfWork: "",
      applicableUnitTypes: [],
    },
  });

  const {
    fields: unitTypeFields,
    append: appendUnitType,
    remove: removeUnitType,
  } = useFieldArray({ control, name: "applicableUnitTypes" });

  useEffect(() => {
    void fetchServiceTypes().then((response) => setServiceTypes(response.data));
  }, []);

  const onSubmit = async (data: ServiceFormValues) => {
    const imageUrl = imageFile ? await readFileAsDataUrl(imageFile) : undefined;
    await createService({
      name: data.name,
      nameAr: data.nameAr,
      description: data.description,
      descriptionAr: data.descriptionAr,
      serviceTypeId: data.serviceTypeId,
      isActive: data.isActive,
      content: {
        bullets: data.scopeOfWork
          ?.split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
        applicableUnitTypes: data.applicableUnitTypes?.map((item) => item.value),
        price: data.price,
        imageUrl,
      },
    });
    navigate("/services");
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Services", href: "/services" },
            { label: "Create Service" },
          ]}
        />
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center mb-6 mt-4"
        >
          <h1 className="text-2xl font-bold text-navy">Create Service</h1>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Name (English)"
                    required
                    error={errors.name?.message}
                  >
                    <input
                      {...register("name")}
                      className={inputStyles}
                      placeholder="Service name"
                      dir="ltr"
                    />
                  </FormField>

                  <FormField
                    label="Name (Arabic)"
                    required
                    error={errors.nameAr?.message}
                  >
                    <input
                      {...register("nameAr")}
                      className={`${inputStyles} text-right`}
                      placeholder="اسم الخدمة"
                      dir="rtl"
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Description (English)"
                    required
                    error={errors.description?.message}
                  >
                    <textarea
                      {...register("description")}
                      className={`${inputStyles} h-32 resize-none py-2`}
                      placeholder="Service description..."
                      dir="ltr"
                    />
                  </FormField>

                  <FormField
                    label="Description (Arabic)"
                    required
                    error={errors.descriptionAr?.message}
                  >
                    <textarea
                      {...register("descriptionAr")}
                      className={`${inputStyles} h-32 resize-none py-2 text-right`}
                      placeholder="وصف الخدمة..."
                      dir="rtl"
                    />
                  </FormField>
                </div>

                <FormField label="Type" required error={errors.serviceTypeId?.message}>
                  <select {...register("serviceTypeId")} className={selectStyles}>
                    <option value="">Select type</option>
                    {serviceTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
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
              <FormField label="Upload Image">
                <label className="flex min-h-28 cursor-pointer items-center gap-4 rounded-lg border border-dashed border-gray-300 p-3 transition hover:border-teal hover:bg-teal/5">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt=""
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                  ) : (
                    <span className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                      <ImagePlus size={24} />
                    </span>
                  )}
                  <span className="text-sm text-gray-600">
                    {imageFile ? imageFile.name : "Choose image"}
                  </span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      setImageFile(file);
                      setImagePreview(file ? URL.createObjectURL(file) : "");
                    }}
                  />
                </label>
              </FormField>
            </Card>
          </div>
        </motion.div>
      </form>
    </motion.div>
  );
}
