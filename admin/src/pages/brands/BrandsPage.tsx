import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Brand, ProductCategory } from "@/types";
import {
  createBrand,
  createProductCategory,
  deleteBrand,
  deleteProductCategory,
  fetchBrands,
  fetchProductCategories,
  updateBrand,
  updateProductCategory,
} from "@/lib/api";
import Breadcrumb from "@/components/common/Breadcrumb";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import Modal from "@/components/common/Modal";
import FormField from "@/components/common/FormField";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useLanguage } from "@/context/LanguageContext";

/* ── Zod Schemas ────────────────────────────────────── */

const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  nameAr: z.string().min(1, "Arabic brand name is required"),
  logoUrl: z.string().optional(),
  isActive: z.boolean(),
});

type BrandFormValues = z.infer<typeof brandSchema>;

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  nameAr: z.string().min(1, "Arabic category name is required"),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
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

/* ── Component ───────────────────────────────────────── */

export default function BrandsPage() {
  const { localize } = useLanguage();
  /* brands state */
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [deletingBrand, setDeletingBrand] = useState<Brand | null>(null);

  /* categories state */
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<ProductCategory | null>(null);
  const [deletingCategory, setDeletingCategory] =
    useState<ProductCategory | null>(null);

  useEffect(() => {
    void Promise.all([fetchBrands(), fetchProductCategories()]).then(
      ([brandsResponse, categoriesResponse]) => {
        setBrands(brandsResponse.data);
        setCategories(categoriesResponse.data);
      },
    );
  }, []);

  /* ── Brand Form ─────────────────────────────────── */

  const brandForm = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: { name: "", nameAr: "", logoUrl: "", isActive: true },
  });

  const openBrandModal = (brand?: Brand) => {
    if (brand) {
      setEditingBrand(brand);
      brandForm.reset({
        name: brand.name,
        nameAr: brand.nameAr ?? "",
        logoUrl: brand.logoUrl ?? "",
        isActive: brand.isActive,
      });
    } else {
      setEditingBrand(null);
      brandForm.reset({ name: "", nameAr: "", logoUrl: "", isActive: true });
    }
    setBrandModalOpen(true);
  };

  const closeBrandModal = () => {
    setBrandModalOpen(false);
    setEditingBrand(null);
  };

  const onBrandSubmit = async (data: BrandFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("nameAr", data.nameAr);
    if (data.logoUrl) formData.append("logoUrl", data.logoUrl);
    formData.append("isActive", String(data.isActive));
    if (editingBrand) {
      await updateBrand(editingBrand.id, formData);
    } else {
      await createBrand(formData);
    }
    const response = await fetchBrands();
    setBrands(response.data);
    closeBrandModal();
  };

  const confirmDeleteBrand = async () => {
    if (!deletingBrand) return;
    await deleteBrand(deletingBrand.id);
    setBrands((current) => current.filter((brand) => brand.id !== deletingBrand.id));
    setDeletingBrand(null);
  };

  /* ── Category Form ──────────────────────────────── */

  const categoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      nameAr: "",
      description: "",
      descriptionAr: "",
      parentId: "",
      isActive: true,
    },
  });

  const openCategoryModal = (category?: ProductCategory) => {
    if (category) {
      setEditingCategory(category);
      categoryForm.reset({
        name: category.name,
        nameAr: category.nameAr ?? "",
        description: category.description ?? "",
        descriptionAr: category.descriptionAr ?? "",
        parentId: "",
        isActive: category.isActive,
      });
    } else {
      setEditingCategory(null);
      categoryForm.reset({
        name: "",
        nameAr: "",
        description: "",
        descriptionAr: "",
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

  const onCategorySubmit = async (data: CategoryFormValues) => {
    const payload = {
      name: data.name,
      nameAr: data.nameAr,
      description: data.description,
      descriptionAr: data.descriptionAr,
      isActive: data.isActive,
    };
    if (editingCategory) {
      await updateProductCategory(editingCategory.id, payload);
    } else {
      await createProductCategory(payload);
    }
    const response = await fetchProductCategories();
    setCategories(response.data);
    closeCategoryModal();
  };

  const confirmDeleteCategory = async () => {
    if (!deletingCategory) return;
    await deleteProductCategory(deletingCategory.id);
    setCategories((current) =>
      current.filter((category) => category.id !== deletingCategory.id),
    );
    setDeletingCategory(null);
  };

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
                    {localize(brand.name, brand.nameAr)}
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
                        {localize(category.name, category.nameAr)}
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
                        {localize(
                          category.description,
                          category.descriptionAr,
                        )}
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
            label="Name (English)"
            required
            error={brandForm.formState.errors.name?.message}
          >
            <input
              {...brandForm.register("name")}
              className={inputStyles}
              placeholder="Brand name"
              dir="ltr"
            />
          </FormField>

          <FormField
            label="Name (Arabic)"
            required
            error={brandForm.formState.errors.nameAr?.message}
          >
            <input
              {...brandForm.register("nameAr")}
              className={`${inputStyles} text-right`}
              placeholder="اسم العلامة التجارية"
              dir="rtl"
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
            label="Name (English)"
            required
            error={categoryForm.formState.errors.name?.message}
          >
            <input
              {...categoryForm.register("name")}
              className={inputStyles}
              placeholder="Category name"
              dir="ltr"
            />
          </FormField>

          <FormField
            label="Name (Arabic)"
            required
            error={categoryForm.formState.errors.nameAr?.message}
          >
            <input
              {...categoryForm.register("nameAr")}
              className={`${inputStyles} text-right`}
              placeholder="اسم التصنيف"
              dir="rtl"
            />
          </FormField>

          <FormField
            label="Description (English)"
            error={categoryForm.formState.errors.description?.message}
          >
            <textarea
              {...categoryForm.register("description")}
              className={`${inputStyles} h-24 resize-none py-2`}
              placeholder="Category description..."
              dir="ltr"
            />
          </FormField>

          <FormField
            label="Description (Arabic)"
            error={categoryForm.formState.errors.descriptionAr?.message}
          >
            <textarea
              {...categoryForm.register("descriptionAr")}
              className={`${inputStyles} h-24 resize-none py-2 text-right`}
              placeholder="وصف التصنيف..."
              dir="rtl"
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
                  {localize(cat.name, cat.nameAr)}
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
