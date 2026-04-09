import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { useDropzone } from "react-dropzone";
import { Plus, X, CloudUpload, Wand2, Package } from "lucide-react";
import { MOCK_PRODUCTS, MOCK_BRANDS, MOCK_CATEGORIES } from "@/lib/mock-data";
import Breadcrumb from "@/components/common/Breadcrumb";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import FormField from "@/components/common/FormField";
import EmptyState from "@/components/common/EmptyState";

const productSchema = z.object({
  name: z.string().min(1, "Required"),
  slug: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  brandId: z.string().min(1, "Required"),
  categoryId: z.string().min(1, "Required"),
  price: z.number().min(0),
  salePrice: z.number().min(0).optional(),
  stock: z.number().min(0),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  features: z.array(z.string()),
  specifications: z.array(z.object({ key: z.string(), value: z.string() })),
});

type ProductFormValues = z.infer<typeof productSchema>;

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

export default function ProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const product = MOCK_PRODUCTS.find((p) => p.id === id);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          slug: product.slug,
          description: product.description ?? "",
          brandId: product.brand.id,
          categoryId: product.category.id,
          price: product.price,
          salePrice: product.originalPrice ?? undefined,
          stock: product.stockQuantity,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          seoTitle: product.seo?.metaTitle ?? "",
          seoDescription: product.seo?.metaDescription ?? "",
          features: product.features ?? [],
          specifications: product.specifications ?? [],
        }
      : undefined,
  });

  const {
    fields: featureFields,
    append: appendFeature,
    remove: removeFeature,
  } = useFieldArray({ control, name: "features" as never });

  const {
    fields: specFields,
    append: appendSpec,
    remove: removeSpec,
  } = useFieldArray({ control, name: "specifications" });

  const nameValue = watch("name");

  const onDrop = useCallback(() => {
    // Mock: In a real app, upload images here
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    multiple: true,
  });

  const onSubmit = (_data: ProductFormValues) => {
    // Mock: update product
    navigate("/products");
  };

  if (!product) {
    return (
      <EmptyState
        icon={<Package size={28} />}
        title="Product not found"
        description="The product you're looking for doesn't exist or has been removed."
        action={
          <Button variant="outline" onClick={() => navigate("/products")}>
            Back to Products
          </Button>
        }
      />
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Products", href: "/products" },
            { label: `Edit ${product.name}` },
          ]}
        />
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center mb-6 mt-4"
        >
          <h1 className="text-2xl font-bold text-navy">Edit Product</h1>
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
                    placeholder="Product name"
                  />
                </FormField>

                <FormField label="Slug" required error={errors.slug?.message}>
                  <div className="flex gap-2">
                    <input
                      {...register("slug")}
                      className={inputStyles}
                      placeholder="product-slug"
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
                    placeholder="Product description…"
                  />
                </FormField>
              </div>
            </Card>

            {/* Pricing & Inventory */}
            <Card>
              <h2 className="text-lg font-semibold text-navy mb-4">
                Pricing &amp; Inventory
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <FormField label="Price" required error={errors.price?.message}>
                  <input
                    type="number"
                    {...register("price", { valueAsNumber: true })}
                    className={inputStyles}
                    placeholder="0"
                  />
                </FormField>

                <FormField label="Sale Price" error={errors.salePrice?.message}>
                  <input
                    type="number"
                    {...register("salePrice", { valueAsNumber: true })}
                    className={inputStyles}
                    placeholder="0"
                  />
                </FormField>

                <FormField label="Stock" required error={errors.stock?.message}>
                  <input
                    type="number"
                    {...register("stock", { valueAsNumber: true })}
                    className={inputStyles}
                    placeholder="0"
                  />
                </FormField>
              </div>
            </Card>

            {/* Features */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-navy">Features</h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendFeature("" as never)}
                  leftIcon={<Plus size={16} />}
                >
                  Add Feature
                </Button>
              </div>
              <div className="space-y-3">
                {featureFields.length === 0 && (
                  <p className="text-sm text-gray-400">
                    No features added yet.
                  </p>
                )}
                {featureFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <input
                      {...register(`features.${index}` as const)}
                      className={`${inputStyles} flex-1`}
                      placeholder="e.g. Energy efficient"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Specifications */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-navy">
                  Specifications
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendSpec({ key: "", value: "" })}
                  leftIcon={<Plus size={16} />}
                >
                  Add Spec
                </Button>
              </div>
              <div className="space-y-3">
                {specFields.length === 0 && (
                  <p className="text-sm text-gray-400">
                    No specifications added yet.
                  </p>
                )}
                {specFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <input
                      {...register(`specifications.${index}.key`)}
                      className={`${inputStyles} flex-1`}
                      placeholder="Key"
                    />
                    <input
                      {...register(`specifications.${index}.value`)}
                      className={`${inputStyles} flex-1`}
                      placeholder="Value"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpec(index)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            {/* SEO */}
            <Card>
              <h2 className="text-lg font-semibold text-navy mb-4">SEO</h2>
              <div className="space-y-4">
                <FormField label="SEO Title" error={errors.seoTitle?.message}>
                  <input
                    {...register("seoTitle")}
                    className={inputStyles}
                    placeholder="SEO title"
                  />
                </FormField>

                <FormField
                  label="SEO Description"
                  error={errors.seoDescription?.message}
                >
                  <textarea
                    {...register("seoDescription")}
                    className={`${inputStyles} h-24 resize-none py-2`}
                    placeholder="SEO description…"
                  />
                </FormField>
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <h2 className="text-lg font-semibold text-navy mb-4">Status</h2>
              <div className="space-y-4">
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

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-medium text-gray-700">
                    Featured
                  </span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      {...register("isFeatured")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-teal transition" />
                    <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition" />
                  </div>
                </label>
              </div>
            </Card>

            {/* Organization */}
            <Card>
              <h2 className="text-lg font-semibold text-navy mb-4">
                Organization
              </h2>
              <div className="space-y-4">
                <FormField
                  label="Brand"
                  required
                  error={errors.brandId?.message}
                >
                  <select {...register("brandId")} className={selectStyles}>
                    <option value="">Select brand</option>
                    {MOCK_BRANDS.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField
                  label="Category"
                  required
                  error={errors.categoryId?.message}
                >
                  <select {...register("categoryId")} className={selectStyles}>
                    <option value="">Select category</option>
                    {MOCK_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>
            </Card>

            {/* Images */}
            <Card>
              <h2 className="text-lg font-semibold text-navy mb-4">Images</h2>

              {/* Existing images */}
              {product.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {product.images.map((img) => (
                    <img
                      key={img.id}
                      src={img.url}
                      alt={img.altText ?? "Product image"}
                      className="w-full aspect-square rounded-lg object-cover"
                    />
                  ))}
                </div>
              )}

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                  isDragActive
                    ? "border-teal bg-teal/5"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input {...getInputProps()} />
                <CloudUpload size={32} className="mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">Drag &amp; drop images</p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, WEBP up to 5MB
                </p>
              </div>
            </Card>
          </div>
        </motion.div>
      </form>
    </motion.div>
  );
}
