import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { Plus, Pencil, Trash2, Wand2 } from "lucide-react";
import type { Brand, ProductCategory } from "@/types";
import { MOCK_BRANDS, MOCK_CATEGORIES } from "@/lib/mock-data";
import Breadcrumb from "@/components/common/Breadcrumb";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import Modal from "@/components/common/Modal";
import FormField from "@/components/common/FormField";
import ConfirmDialog from "@/components/common/ConfirmDialog";

/* ── Zod Schemas ────────────────────────────────────── */

const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  logoUrl: z.string().optional(),
  isActive: z.boolean(),
});

type BrandFormValues = z.infer<typeof brandSchema>;

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  parentId: z.string().optional(),
  isActive: z.boolean(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

/* ── Animation Variants ─────────────────────────────── */

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

/* ── Styles ──────────────────────────────────────────── */

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

/* ── Component ───────────────────────────────────────── */

export default function BrandsPage() {
  /* brands state */
  const [brands] = useState<Brand[]>(MOCK_BRANDS);
  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [deletingBrand, setDeletingBrand] = useState<Brand | null>(null);

  /* categories state */
  const [categories] = useState<ProductCategory[]>(MOCK_CATEGORIES);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<ProductCategory | null>(null);
  const [deletingCategory, setDeletingCategory] =
    useState<ProductCategory | null>(null);

  /* ── Brand Form ─────────────────────────────────── */

  const brandForm = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: { name: "", logoUrl: "", isActive: true },
  });

  const openBrandModal = (brand?: Brand) => {
    if (brand) {
      setEditingBrand(brand);
      brandForm.reset({
        name: brand.name,
        logoUrl: brand.logoUrl ?? "",
        isActive: brand.isActive,
      });
    } else {
      setEditingBrand(null);
      brandForm.reset({ name: "", logoUrl: "", isActive: true });
    }
    setBrandModalOpen(true);
  };

  const closeBrandModal = () => {
    setBrandModalOpen(false);
    setEditingBrand(null);
  };

  const onBrandSubmit = (_data: BrandFormValues) => {
    // Mock: save brand
    closeBrandModal();
  };

  const confirmDeleteBrand = () => {
    // Mock: delete brand
    setDeletingBrand(null);
  };

  /* ── Category Form ──────────────────────────────── */

  const categoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      parentId: "",
      isActive: true,
    },
  });

  const openCategoryModal = (category?: ProductCategory) => {
    if (category) {
      setEditingCategory(category);
      categoryForm.reset({
        name: category.name,
        slug: category.slug,
        description: category.description ?? "",
        parentId: "",
        isActive: category.isActive,
      });
    } else {
      setEditingCategory(null);
      categoryForm.reset({
        name: "",
        slug: "",
        description: "",
        parentId: "",
        isActive: true,
      });
    }
    setCategoryModalOpen(true);
  };

  const closeCategoryModal = () => {
    setCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const onCategorySubmit = (_data: CategoryFormValues) => {
    // Mock: save category
    closeCategoryModal();
  };

  const confirmDeleteCategory = () => {
    // Mock: delete category
    setDeletingCategory(null);
  };

  const categoryNameValue = categoryForm.watch("name");

  /* ── Available parent categories (exclude self when editing) ── */
  const parentCategoryOptions = useMemo(
    () => categories.filter((c) => c.id !== editingCategory?.id),
    [categories, editingCategory],
  );

  /* ── Render ─────────────────────────────────────── */

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Brands & Categories" },
          ]}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6 mt-4">
        <h1 className="text-2xl font-bold text-navy">
          Brands &amp; Categories
        </h1>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* ───────── Brands Section ───────── */}
        <Card padding="none">
          <div className="flex items-center justify-between p-6 pb-0">
            <h2 className="text-lg font-semibold text-navy">Brands</h2>
            <Button
              size="sm"
              leftIcon={<Plus size={16} />}
              onClick={() => openBrandModal()}
            >
              Add Brand
            </Button>
          </div>

          <div className="mt-4">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="flex items-center justify-between px-6 py-4 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  {brand.logoUrl ? (
                    <img
                      src={brand.logoUrl}
                      alt={brand.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gray-200" />
                  )}
                  <span className="font-medium text-gray-900">
                    {brand.name}
                  </span>
                  <Badge variant={brand.isActive ? "success" : "default"}>
                    {brand.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openBrandModal(brand)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-teal hover:bg-gray-100 transition"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingBrand(brand)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ───────── Categories Section ───────── */}
        <Card padding="none">
          <div className="flex items-center justify-between p-6 pb-0">
            <h2 className="text-lg font-semibold text-navy">Categories</h2>
            <Button
              size="sm"
              leftIcon={<Plus size={16} />}
              onClick={() => openCategoryModal()}
            >
              Add Category
            </Button>
          </div>

          <div className="mt-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between px-6 py-4 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {category.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        /{category.slug}
                      </span>
                      <Badge
                        variant={category.isActive ? "success" : "default"}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    {category.description && (
                      <p className="text-xs text-gray-500 truncate max-w-xs mt-0.5">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openCategoryModal(category)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-teal hover:bg-gray-100 transition"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingCategory(category)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* ───────── Brand Modal ───────── */}
      <Modal
        isOpen={brandModalOpen}
        onClose={closeBrandModal}
        title={editingBrand ? "Edit Brand" : "Add Brand"}
      >
        <form
          onSubmit={brandForm.handleSubmit(onBrandSubmit)}
          className="space-y-4"
        >
          <FormField
            label="Name"
            required
            error={brandForm.formState.errors.name?.message}
          >
            <input
              {...brandForm.register("name")}
              className={inputStyles}
              placeholder="Brand name"
            />
          </FormField>

          <FormField
            label="Logo URL"
            error={brandForm.formState.errors.logoUrl?.message}
          >
            <input
              {...brandForm.register("logoUrl")}
              className={inputStyles}
              placeholder="https://example.com/logo.png"
            />
          </FormField>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium text-gray-700">Active</span>
            <div className="relative">
              <input
                type="checkbox"
                {...brandForm.register("isActive")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-teal transition" />
              <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition" />
            </div>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={closeBrandModal}>
              Cancel
            </Button>
            <Button type="submit">
              {editingBrand ? "Save Changes" : "Create Brand"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ───────── Category Modal ───────── */}
      <Modal
        isOpen={categoryModalOpen}
        onClose={closeCategoryModal}
        title={editingCategory ? "Edit Category" : "Add Category"}
        size="lg"
      >
        <form
          onSubmit={categoryForm.handleSubmit(onCategorySubmit)}
          className="space-y-4"
        >
          <FormField
            label="Name"
            required
            error={categoryForm.formState.errors.name?.message}
          >
            <input
              {...categoryForm.register("name")}
              className={inputStyles}
              placeholder="Category name"
            />
          </FormField>

          <FormField
            label="Slug"
            required
            error={categoryForm.formState.errors.slug?.message}
          >
            <div className="flex gap-2">
              <input
                {...categoryForm.register("slug")}
                className={inputStyles}
                placeholder="category-slug"
              />
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() =>
                  categoryForm.setValue("slug", slugify(categoryNameValue))
                }
                leftIcon={<Wand2 size={16} />}
              >
                Generate
              </Button>
            </div>
          </FormField>

          <FormField
            label="Description"
            error={categoryForm.formState.errors.description?.message}
          >
            <textarea
              {...categoryForm.register("description")}
              className={`${inputStyles} h-24 resize-none py-2`}
              placeholder="Category description…"
            />
          </FormField>

          <FormField
            label="Parent Category"
            error={categoryForm.formState.errors.parentId?.message}
          >
            <select
              {...categoryForm.register("parentId")}
              className={selectStyles}
            >
              <option value="">None (Top-level)</option>
              {parentCategoryOptions.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </FormField>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium text-gray-700">Active</span>
            <div className="relative">
              <input
                type="checkbox"
                {...categoryForm.register("isActive")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-teal transition" />
              <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition" />
            </div>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={closeCategoryModal}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingCategory ? "Save Changes" : "Create Category"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ───────── Confirm Dialogs ───────── */}
      <ConfirmDialog
        isOpen={!!deletingBrand}
        onClose={() => setDeletingBrand(null)}
        onConfirm={confirmDeleteBrand}
        title="Delete Brand"
        message={`Are you sure you want to delete "${deletingBrand?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />

      <ConfirmDialog
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={confirmDeleteCategory}
        title="Delete Category"
        message={`Are you sure you want to delete "${deletingCategory?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </motion.div>
  );
}
